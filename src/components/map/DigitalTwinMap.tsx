import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { CityData, NeighbourhoodData, MapLayerState } from '../../types/climate';
import { CHENNAI_NEIGHBOURHOODS, SENSOR_TELEMETRY_NODES } from '../../data/chennaiGeoData';
import { LayerController } from './LayerController';
import { NeighbourhoodModal } from './NeighbourhoodModal';
import { soundFx } from '../../utils/audioSynthesizer';
import { Layers, ZoomIn, ZoomOut, Crosshair, Globe, Radio, Compass, Droplets, Sliders } from 'lucide-react';

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
  const [baseStyle, setBaseStyle] = useState<'satellite' | 'dark' | 'terrain'>('dark');
  const [floodDepthFilter, setFloodDepthFilter] = useState<number>(1.2); // Water depth in meters (0 to 2.5m)

  const [layers, setLayers] = useState<MapLayerState>({
    satellite: false,
    terrain: false,
    floodRisk: true,
    heatRisk: true,
    rainfallRadar: true,
    vegetation: false,
    waterBodies: true,
    elevationContour: true,
    sensorNodes: true,
    opacity: {
      floodRisk: 0.75,
      heatRisk: 0.65,
      rainfallRadar: 0.8,
      vegetation: 0.5,
    },
  });

  const getStyleUrl = (style: 'satellite' | 'dark' | 'terrain') => {
    switch (style) {
      case 'satellite':
        return {
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
              tileSize: 256,
              attribution: 'Esri World Imagery'
            }
          },
          layers: [{ id: 'raster-tiles', type: 'raster', source: 'raster-tiles', minzoom: 0, maxzoom: 19 }]
        };
      case 'terrain':
        return {
          version: 8,
          sources: {
            'terrain-tiles': {
              type: 'raster',
              tiles: ['https://tile.opentopomap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: 'OpenTopoMap'
            }
          },
          layers: [{ id: 'terrain-tiles', type: 'raster', source: 'terrain-tiles', minzoom: 0, maxzoom: 17 }]
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
              attribution: '© CartoDB'
            }
          },
          layers: [{ id: 'carto-dark', type: 'raster', source: 'carto-dark', minzoom: 0, maxzoom: 19 }]
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
        zoom: 11.8,
        pitch: 45,
        bearing: -15,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      map.on('load', () => {
        // Add Chennai GeoJSON flood inundation risk polygons
        map.addSource('flood-zones', {
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
                  [n.lng - 0.015, n.lat - 0.012],
                  [n.lng + 0.015, n.lat - 0.012],
                  [n.lng + 0.018, n.lat + 0.012],
                  [n.lng - 0.012, n.lat + 0.015],
                  [n.lng - 0.015, n.lat - 0.012],
                ]]
              }
            }))
          }
        });

        // Fill layer for flood inundation
        map.addLayer({
          id: 'flood-fill-layer',
          type: 'fill',
          source: 'flood-zones',
          paint: {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'risk'],
              40, '#0284c7',
              70, '#2563eb',
              90, '#dc2626'
            ],
            'fill-opacity': layers.opacity.floodRisk * 0.45,
          }
        });

        // Outline for flood inundation
        map.addLayer({
          id: 'flood-outline-layer',
          type: 'line',
          source: 'flood-zones',
          paint: {
            'line-color': '#38bdf8',
            'line-width': 2,
            'line-dasharray': [2, 2],
          }
        });
      });

      // Markers for Neighbourhoods
      CHENNAI_NEIGHBOURHOODS.forEach((n) => {
        const el = document.createElement('div');
        el.className = 'group cursor-pointer select-none';
        const isEmergency = n.alertStatus === 'Emergency';

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            ${isEmergency ? '<div class="absolute w-8 h-8 rounded-full bg-red-500/30 animate-ping"></div>' : ''}
            <div class="w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[11px] shadow-lg border-2 transition-transform duration-200 hover:scale-125 ${
              isEmergency
                ? 'bg-red-600/90 text-white border-red-300 shadow-red-500/50'
                : 'bg-cyan-600/90 text-white border-cyan-300 shadow-cyan-500/50'
            }">
              ${n.floodRisk}
            </div>
            <div class="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-900/95 border border-slate-700 text-slate-200">
              ${n.name}
            </div>
          </div>
        `;

        el.addEventListener('click', () => {
          soundFx.playRadarPing();
          setSelectedNeighbourhood(n);
          map.flyTo({ center: [n.lng, n.lat], zoom: 13.5, duration: 1200 });
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([n.lng, n.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });

      // Markers for Sensor Nodes
      SENSOR_TELEMETRY_NODES.forEach((sensor) => {
        const sensorEl = document.createElement('div');
        sensorEl.className = 'cursor-pointer';
        sensorEl.innerHTML = `
          <div class="relative flex items-center justify-center" title="${sensor.name}">
            <div class="w-3.5 h-3.5 rounded-full bg-cyan-400 border border-white shadow-[0_0_8px_#22d3ee]"></div>
            <div class="absolute -top-4 font-mono text-[9px] text-cyan-300 bg-slate-900/80 px-1 rounded whitespace-nowrap">
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
      mapInstanceRef.current.flyTo({ center: [found.lng, found.lat], zoom: 14, duration: 1500 });
    }
  }, [highlightNeighbourhoodId]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('flood-fill-layer')) {
      map.setLayoutProperty('flood-fill-layer', 'visibility', layers.floodRisk ? 'visible' : 'none');
      // Scale fill opacity with floodDepthFilter
      const opacity = layers.opacity.floodRisk * (0.3 + (floodDepthFilter / 2.5) * 0.4);
      map.setPaintProperty('flood-fill-layer', 'fill-opacity', opacity);
    }
    if (map.getLayer('flood-outline-layer')) {
      map.setLayoutProperty('flood-outline-layer', 'visibility', layers.floodRisk ? 'visible' : 'none');
    }
  }, [layers, floodDepthFilter]);

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
    mapInstanceRef.current.flyTo({ center: [city.lng, city.lat], zoom: 11.8, pitch: 45, bearing: -15 });
  };

  const handleRotatePitch = () => {
    soundFx.playClick();
    if (!mapInstanceRef.current) return;
    const currentPitch = mapInstanceRef.current.getPitch();
    const newPitch = currentPitch > 50 ? 0 : 60;
    mapInstanceRef.current.easeTo({ pitch: newPitch, duration: 800 });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050811]">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Atmospheric Scanning Sweep */}
      {layers.rainfallRadar && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
          <div className="w-[120%] h-[120%] -top-[10%] -left-[10%] absolute bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15)_0%,transparent_70%)] animate-pulse" />
        </div>
      )}

      {/* Top Map HUD Bar */}
      <div className="absolute top-5 left-6 flex items-center gap-3 select-none pointer-events-auto">
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
            {city.name} Digital Twin GIS • 0.5m LiDAR Grid
          </span>
        </div>
      </div>

      {/* Interactive Water Depth Scrubber Floating Control */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-3 glass-panel px-4 py-2 rounded-xl border border-blue-500/30 text-xs font-mono shadow-2xl backdrop-blur-xl">
        <Droplets className="w-4 h-4 text-blue-400 animate-pulse" />
        <span className="text-slate-300">Inundation Water Level:</span>
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
        <span className="text-[10px] text-slate-500">
          ({floodDepthFilter > 1.4 ? 'Catastrophic Surcharge' : 'Localized Ponding'})
        </span>
      </div>

      {/* Floating Layer Controller Toggle */}
      <div className="absolute top-5 right-6 flex items-center gap-2">
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
          <span>Layers & Overlays</span>
        </button>
      </div>

      {/* Layer Controller Panel */}
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

      {/* Floating Neighbourhood Card */}
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

      {/* Map Control Buttons */}
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
          title="Toggle 3D Topographic Tilt"
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

      {/* Doppler Telemetry Footer Strip */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 glass-panel px-4 py-2 rounded-full border border-cyan-500/20 text-xs font-mono text-slate-300">
        <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>IMD Doppler Meenambakkam: <strong className="text-cyan-300">48.2 dBZ</strong></span>
        <span className="text-slate-600">|</span>
        <span>Adyar Basin Flow: <strong className="text-amber-300">18,400 cusecs</strong></span>
        <span className="text-slate-600">|</span>
        <span>Bay Astronomical Surge: <strong className="text-blue-300">+0.84m</strong></span>
      </div>
    </div>
  );
};
