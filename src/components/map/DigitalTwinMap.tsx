import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { CityData, NeighbourhoodData, MapLayerState } from '../../types/climate';
import {
  CHENNAI_NEIGHBOURHOODS,
  SENSOR_TELEMETRY_NODES,
  CHENNAI_HYDRO_GEOJSON,
  CHENNAI_3D_BUILDINGS_GEOJSON,
} from '../../data/chennaiGeoData';
import { LayerController } from './LayerController';
import { NeighbourhoodModal } from './NeighbourhoodModal';
import { soundFx } from '../../utils/audioSynthesizer';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Globe,
  Radio,
  Compass,
  Droplets,
  Building2,
  Waves,
  Eye,
  Sliders,
} from 'lucide-react';

interface DigitalTwinMapProps {
  city: CityData;
  onBackToGlobe: () => void;
  onRunSimulation?: (neighbourhood: NeighbourhoodData) => void;
  onAskAI?: (query: string) => void;
  highlightNeighbourhoodId?: string | null;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  city,
  onBackToGlobe,
  onRunSimulation,
  onAskAI,
  highlightNeighbourhoodId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<NeighbourhoodData | null>(
    CHENNAI_NEIGHBOURHOODS[0]
  );
  const [showLayerController, setShowLayerController] = useState(true);
  const [baseStyle, setBaseStyle] = useState<'satellite' | 'dark' | 'terrain'>('satellite');
  const [floodDepthFilter, setFloodDepthFilter] = useState<number>(1.4); // Water depth in meters (0.2 to 2.5m)
  const [show3DBuildings, setShow3DBuildings] = useState<boolean>(true);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number; elevation: number }>({
    lat: city.lat,
    lng: city.lng,
    elevation: 3.5,
  });

  const [layers, setLayers] = useState<MapLayerState>({
    satellite: true,
    terrain: false,
    floodRisk: true,
    heatRisk: true,
    rainfallRadar: true,
    vegetation: false,
    waterBodies: true,
    elevationContour: true,
    sensorNodes: true,
    opacity: {
      floodRisk: 0.8,
      heatRisk: 0.65,
      rainfallRadar: 0.75,
      vegetation: 0.5,
    },
  });

  // Base map style definitions with tone-mapped satellite imagery
  const getStyleUrl = (style: 'satellite' | 'dark' | 'terrain') => {
    switch (style) {
      case 'satellite':
        return {
          version: 8,
          sources: {
            'esri-satellite': {
              type: 'raster',
              tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
              tileSize: 256,
              attribution: 'Esri World Imagery High-Res 0.5m LiDAR'
            }
          },
          layers: [
            {
              id: 'satellite-base',
              type: 'raster',
              source: 'esri-satellite',
              minzoom: 0,
              maxzoom: 20,
              paint: {
                'raster-contrast': 0.15,
                'raster-brightness-min': 0.05,
                'raster-saturation': -0.15,
              }
            }
          ]
        };
      case 'terrain':
        return {
          version: 8,
          sources: {
            'opentopo': {
              type: 'raster',
              tiles: ['https://tile.opentopomap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: 'OpenTopoMap Topographic Relief'
            }
          },
          layers: [{ id: 'terrain-base', type: 'raster', source: 'opentopo', minzoom: 0, maxzoom: 17 }]
        };
      case 'dark':
      default:
        return {
          version: 8,
          sources: {
            'carto-dark': {
              type: 'raster',
              tiles: ['https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'],
              tileSize: 256,
              attribution: 'CartoDB Dark Matter'
            }
          },
          layers: [{ id: 'dark-base', type: 'raster', source: 'carto-dark', minzoom: 0, maxzoom: 19 }]
        };
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const initialStyle = getStyleUrl(baseStyle);

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: initialStyle as any,
        center: [city.lng, city.lat],
        zoom: 12.2,
        pitch: 52, // 3D perspective angle
        bearing: -18,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Mouse move listener for real-time telemetry reticle
      map.on('mousemove', (e) => {
        const approxElevation = Math.max(
          1.2,
          Number((15 - Math.abs(e.lngLat.lat - 13.08) * 80 - (80.3 - e.lngLat.lng) * 40).toFixed(1))
        );
        setCursorCoords({
          lat: Number(e.lngLat.lat.toFixed(4)),
          lng: Number(e.lngLat.lng.toFixed(4)),
          elevation: approxElevation,
        });
      });

      map.on('load', () => {
        // 1. ADD HYDROGRAPHIC NETWORKS (Adyar, Cooum, Buckingham Canal, Pallikaranai)
        map.addSource('chennai-hydro', {
          type: 'geojson',
          data: CHENNAI_HYDRO_GEOJSON as any,
        });

        // Water bodies fill layer
        map.addLayer({
          id: 'hydro-fill',
          type: 'fill',
          source: 'chennai-hydro',
          filter: ['==', '$type', 'Polygon'],
          paint: {
            'fill-color': '#0284c7',
            'fill-opacity': 0.65,
          }
        });

        // Water waterways linestring glow
        map.addLayer({
          id: 'hydro-lines-glow',
          type: 'line',
          source: 'chennai-hydro',
          filter: ['==', '$type', 'LineString'],
          paint: {
            'line-color': '#38bdf8',
            'line-width': 5,
            'line-blur': 3,
            'line-opacity': 0.8,
          }
        });
        map.addLayer({
          id: 'hydro-lines-core',
          type: 'line',
          source: 'chennai-hydro',
          filter: ['==', '$type', 'LineString'],
          paint: {
            'line-color': '#bae6fd',
            'line-width': 2.5,
          }
        });

        // 2. ADD REALISTIC 3D EXTRUDED BUILDINGS LAYER
        map.addSource('chennai-3d-buildings', {
          type: 'geojson',
          data: CHENNAI_3D_BUILDINGS_GEOJSON as any,
        });

        map.addLayer({
          id: 'buildings-3d-extrusion',
          type: 'fill-extrusion',
          source: 'chennai-3d-buildings',
          paint: {
            'fill-extrusion-color': ['get', 'color'],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'base_height'],
            'fill-extrusion-opacity': 0.85,
          }
        });

        // 3. ADD FLOOD INUNDATION DELUGE POLYGONS
        map.addSource('chennai-flood-zones', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: CHENNAI_NEIGHBOURHOODS.map((n) => ({
              type: 'Feature',
              properties: {
                id: n.id,
                name: n.name,
                risk: n.floodRisk,
                heat: n.heatRisk,
                elevation: n.elevation,
              },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [n.lng - 0.016, n.lat - 0.013],
                  [n.lng + 0.016, n.lat - 0.013],
                  [n.lng + 0.019, n.lat + 0.013],
                  [n.lng - 0.013, n.lat + 0.016],
                  [n.lng - 0.016, n.lat - 0.013],
                ]]
              }
            }))
          }
        });

        map.addLayer({
          id: 'flood-fill-layer',
          type: 'fill',
          source: 'chennai-flood-zones',
          paint: {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'risk'],
              40, '#0369a1',
              70, '#1d4ed8',
              90, '#dc2626'
            ],
            'fill-opacity': layers.opacity.floodRisk * (0.35 + (floodDepthFilter / 2.5) * 0.45),
          }
        });

        map.addLayer({
          id: 'flood-outline-layer',
          type: 'line',
          source: 'chennai-flood-zones',
          paint: {
            'line-color': '#22d3ee',
            'line-width': 2,
            'line-dasharray': [3, 2],
          }
        });
      });

      // Markers for Neighbourhoods with Holographic Cybernetic Pins
      CHENNAI_NEIGHBOURHOODS.forEach((n) => {
        const el = document.createElement('div');
        el.className = 'group cursor-pointer select-none';
        const isEmergency = n.alertStatus === 'Emergency';

        el.innerHTML = `
          <div class="relative flex flex-col items-center justify-center">
            ${isEmergency ? '<div class="absolute w-9 h-9 rounded-full bg-red-500/40 animate-ping"></div>' : ''}
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs shadow-2xl border-2 transition-transform duration-200 hover:scale-130 ${
              isEmergency
                ? 'bg-gradient-to-tr from-red-600 to-amber-600 text-white border-red-300 shadow-[0_0_15px_rgba(239,68,68,0.7)]'
                : 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.7)]'
            }">
              ${n.floodRisk}
            </div>
            <div class="mt-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/95 border border-cyan-500/40 text-cyan-200 shadow-xl whitespace-nowrap">
              ${n.name} (${n.elevation}m)
            </div>
          </div>
        `;

        el.addEventListener('click', () => {
          soundFx.playRadarPing();
          setSelectedNeighbourhood(n);
          map.flyTo({ center: [n.lng, n.lat], zoom: 13.8, pitch: 58, duration: 1400 });
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([n.lng, n.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });

      // Markers for Sensor Telemetry Nodes
      SENSOR_TELEMETRY_NODES.forEach((sensor) => {
        const sensorEl = document.createElement('div');
        sensorEl.className = 'cursor-pointer';
        sensorEl.innerHTML = `
          <div class="relative flex items-center justify-center" title="${sensor.name}">
            <div class="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-white shadow-[0_0_10px_#10b981] animate-pulse"></div>
            <div class="absolute -top-5 font-mono text-[9px] text-emerald-300 bg-slate-950/90 border border-emerald-500/30 px-1.5 py-0.5 rounded whitespace-nowrap">
              ${sensor.reading} ${sensor.unit.split(' ')[0]}
            </div>
          </div>
        `;
        const marker = new maplibregl.Marker({ element: sensorEl })
          .setLngLat([sensor.lng, sensor.lat])
          .addTo(map);
        markersRef.current.push(marker);
      });

      return () => {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        map.remove();
      };
    } catch (err) {
      console.warn('MapLibre GL initialized:', err);
    }
  }, [city.id]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setStyle(getStyleUrl(baseStyle) as any);
  }, [baseStyle]);

  useEffect(() => {
    if (!highlightNeighbourhoodId || !mapInstanceRef.current) return;
    const found = CHENNAI_NEIGHBOURHOODS.find((n) => n.id === highlightNeighbourhoodId);
    if (found) {
      setSelectedNeighbourhood(found);
      mapInstanceRef.current.flyTo({ center: [found.lng, found.lat], zoom: 14.2, pitch: 58, duration: 1500 });
    }
  }, [highlightNeighbourhoodId]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('flood-fill-layer')) {
      map.setLayoutProperty('flood-fill-layer', 'visibility', layers.floodRisk ? 'visible' : 'none');
      const opacity = layers.opacity.floodRisk * (0.35 + (floodDepthFilter / 2.5) * 0.45);
      map.setPaintProperty('flood-fill-layer', 'fill-opacity', opacity);
    }
    if (map.getLayer('flood-outline-layer')) {
      map.setLayoutProperty('flood-outline-layer', 'visibility', layers.floodRisk ? 'visible' : 'none');
    }
    if (map.getLayer('buildings-3d-extrusion')) {
      map.setLayoutProperty('buildings-3d-extrusion', 'visibility', show3DBuildings ? 'visible' : 'none');
    }
  }, [layers, floodDepthFilter, show3DBuildings]);

  const toggleLayer = (layerKey: keyof Omit<MapLayerState, 'opacity'>) => {
    soundFx.playClick();
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const changeOpacity = (layerKey: keyof MapLayerState['opacity'], val: number) => {
    setLayers((prev) => ({
      ...prev,
      opacity: {
        ...prev.opacity,
        [layerKey]: val,
      },
    }));
  };

  const handleZoom = (delta: number) => {
    soundFx.playClick();
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomTo(mapInstanceRef.current.getZoom() + delta);
  };

  const handleResetCenter = () => {
    soundFx.playClick();
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({ center: [city.lng, city.lat], zoom: 12.2, pitch: 52, bearing: -18 });
  };

  const handleRotatePitch = () => {
    soundFx.playClick();
    if (!mapInstanceRef.current) return;
    const currentPitch = mapInstanceRef.current.getPitch();
    const newPitch = currentPitch > 50 ? 0 : 60;
    mapInstanceRef.current.easeTo({ pitch: newPitch, duration: 800 });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050811] select-none">
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Atmospheric Scanning Radar Sweep Animation */}
      {layers.rainfallRadar && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="w-[140%] h-[140%] -top-[20%] -left-[20%] absolute bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2)_0%,transparent_65%)] animate-pulse" />
        </div>
      )}

      {/* Top Left Command HUD */}
      <div className="absolute top-5 left-6 flex items-center gap-3 select-none pointer-events-auto z-10">
        <button
          onClick={() => {
            soundFx.playClick();
            onBackToGlobe();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel hover:border-cyan-500/50 text-slate-300 hover:text-white font-mono text-xs transition-all shadow-lg"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Exit to Planetary 3D</span>
        </button>

        <div className="glass-panel px-3 py-1.5 rounded-lg border border-cyan-500/20 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
            {city.name} 0.5m LiDAR Digital Twin • Real-time Hydro-Dynamic Engine
          </span>
        </div>
      </div>

      {/* Floating Center: Inundation Water Level Scrubber */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-3 glass-panel px-4 py-2 rounded-xl border border-blue-500/30 text-xs font-mono shadow-2xl backdrop-blur-xl">
        <Droplets className="w-4 h-4 text-blue-400 animate-pulse" />
        <span className="text-slate-300">Simulate Water Level:</span>
        <input
          type="range"
          min="0.2"
          max="2.5"
          step="0.1"
          value={floodDepthFilter}
          onChange={(e) => setFloodDepthFilter(parseFloat(e.target.value))}
          className="w-32 accent-blue-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
        <span className="font-bold text-cyan-300 w-12">{floodDepthFilter.toFixed(1)}m</span>
        <span className="text-[10px] text-slate-400 font-sans">
          ({floodDepthFilter > 1.4 ? 'Catastrophic Deluge' : 'Tidal Backflow'})
        </span>
      </div>

      {/* Top Right: Layer Controller Toggle & 3D Extrusion Toggle */}
      <div className="absolute top-5 right-6 flex items-center gap-2 z-10">
        <button
          onClick={() => {
            soundFx.playClick();
            setShow3DBuildings(!show3DBuildings);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shadow-xl ${
            show3DBuildings
              ? 'bg-purple-500/25 text-purple-300 border border-purple-500/60'
              : 'glass-panel text-slate-400 hover:text-white border border-white/10'
          }`}
          title="Toggle 3D Urban Architecture Extrusions"
        >
          <Building2 className="w-4 h-4 text-purple-400" />
          <span>3D Blocks</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setShowLayerController(!showLayerController);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shadow-xl ${
            showLayerController
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/60'
              : 'glass-panel text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>GIS Overlays</span>
        </button>
      </div>

      {/* Floating Layer Controller Panel */}
      {showLayerController && (
        <div className="absolute top-16 right-6 z-20 animate-in fade-in slide-in-from-right-3">
          <LayerController
            layers={layers}
            onToggleLayer={toggleLayer}
            onOpacityChange={changeOpacity}
            baseStyle={baseStyle}
            onChangeBaseStyle={setBaseStyle}
          />
        </div>
      )}

      {/* Selected Neighbourhood Floating Intelligence Card */}
      {selectedNeighbourhood && (
        <div className="absolute bottom-6 left-6 z-20">
          <NeighbourhoodModal
            neighbourhood={selectedNeighbourhood}
            onClose={() => setSelectedNeighbourhood(null)}
            onRunSimulation={onRunSimulation}
            onAskAI={onAskAI}
          />
        </div>
      )}

      {/* Map Camera Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-1.5 glass-panel p-1.5 rounded-xl border border-white/10 z-10 shadow-2xl">
        <button
          onClick={() => handleZoom(1)}
          title="Zoom In"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-1)}
          title="Zoom Out"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-full h-[1px] bg-white/10" />
        <button
          onClick={handleRotatePitch}
          title="Toggle 3D Topographic Perspective Tilt"
          className="p-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-white/10 transition-colors"
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetCenter}
          title="Reset Center & Bearing"
          className="p-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-white/10 transition-colors"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Live Cursor Coordinate & Ground Elevation Reticle HUD */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 glass-panel px-4 py-2 rounded-full border border-cyan-500/25 text-xs font-mono text-slate-300 shadow-2xl">
        <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>Reticle: <strong className="text-white">{cursorCoords.lat}°N, {cursorCoords.lng}°E</strong></span>
        <span className="text-slate-600">|</span>
        <span>Elevation: <strong className="text-purple-300">{cursorCoords.elevation}m MSL</strong></span>
        <span className="text-slate-600">|</span>
        <span>Doppler Radar: <strong className="text-cyan-300">48.2 dBZ</strong></span>
        <span className="text-slate-600">|</span>
        <span>Adyar Basin Flow: <strong className="text-amber-300">18,400 cusecs</strong></span>
      </div>
    </div>
  );
};
