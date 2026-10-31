import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { CityData, NeighbourhoodData, MapLayerState, ReliefShelter } from '../../types/climate';
import {
  CHENNAI_NEIGHBOURHOODS,
  SENSOR_TELEMETRY_NODES,
  CHENNAI_HYDRO_GEOJSON,
  CHENNAI_3D_BUILDINGS_GEOJSON,
  CHENNAI_RELIEF_SHELTERS,
  CHENNAI_EVACUATION_ROUTES_GEOJSON,
} from '../../data/chennaiGeoData';
import { getCityGeoBundle } from '../../data/multiCityGeoData';
import { LayerController, MapBaseStyle } from './LayerController';
import { NeighbourhoodModal } from './NeighbourhoodModal';
import { EvacuationRoutesModal } from '../common/EvacuationRoutesModal';
import { CinematicDroneTour, TourWaypoint } from './CinematicDroneTour';
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
  ExternalLink,
  Navigation,
  Radar,
  Video,
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

  const geoBundle = getCityGeoBundle(city.id);
  const neighbourhoods = geoBundle.neighbourhoods;

  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<NeighbourhoodData | null>(
    highlightNeighbourhoodId
      ? neighbourhoods.find((n) => n.id === highlightNeighbourhoodId) || null
      : null
  );
  const [showLayerController, setShowLayerController] = useState<boolean>(false);
  const [baseStyle, setBaseStyle] = useState<MapBaseStyle>('google-hybrid');
  const [floodDepthFilter, setFloodDepthFilter] = useState<number>(1.4); // Water depth in meters (0.2 to 2.5m)
  const [show3DBuildings, setShow3DBuildings] = useState<boolean>(true);
  const [showDopplerRadar, setShowDopplerRadar] = useState<boolean>(true);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
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
    evacuationRoutes: true,
    reliefShelters: true,
    opacity: {
      floodRisk: 0.8,
      heatRisk: 0.65,
      rainfallRadar: 0.75,
      vegetation: 0.5,
    },
  });

  // Google Maps and fallback base style definitions
  const getStyleUrl = (style: MapBaseStyle) => {
    switch (style) {
      case 'google-hybrid':
        return {
          version: 8,
          sources: {
            'google-hybrid-tiles': {
              type: 'raster',
              tiles: [
                'https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                'https://mt2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                'https://mt3.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
              ],
              tileSize: 256,
              attribution: '© Google Maps'
            }
          },
          layers: [
            {
              id: 'google-hybrid-layer',
              type: 'raster',
              source: 'google-hybrid-tiles',
              minzoom: 0,
              maxzoom: 22,
            }
          ]
        };
      case 'google-satellite':
        return {
          version: 8,
          sources: {
            'google-sat-tiles': {
              type: 'raster',
              tiles: [
                'https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
                'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
                'https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
                'https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
              ],
              tileSize: 256,
              attribution: '© Google Satellite'
            }
          },
          layers: [
            {
              id: 'google-sat-layer',
              type: 'raster',
              source: 'google-sat-tiles',
              minzoom: 0,
              maxzoom: 22,
            }
          ]
        };
      case 'google-roadmap':
        return {
          version: 8,
          sources: {
            'google-road-tiles': {
              type: 'raster',
              tiles: [
                'https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                'https://mt2.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                'https://mt3.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
              ],
              tileSize: 256,
              attribution: '© Google Maps'
            }
          },
          layers: [
            {
              id: 'google-road-layer',
              type: 'raster',
              source: 'google-road-tiles',
              minzoom: 0,
              maxzoom: 22,
            }
          ]
        };
      case 'google-terrain':
        return {
          version: 8,
          sources: {
            'google-terrain-tiles': {
              type: 'raster',
              tiles: [
                'https://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
                'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
                'https://mt2.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
                'https://mt3.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
              ],
              tileSize: 256,
              attribution: '© Google Terrain'
            }
          },
          layers: [
            {
              id: 'google-terrain-layer',
              type: 'raster',
              source: 'google-terrain-tiles',
              minzoom: 0,
              maxzoom: 20,
            }
          ]
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

  const setupMapLayers = (map: maplibregl.Map) => {
    // 1. ADD HYDROGRAPHIC NETWORKS
    if (!map.getSource('city-hydro')) {
      map.addSource('city-hydro', {
        type: 'geojson',
        data: geoBundle.hydroGeoJSON as any,
      });

      map.addLayer({
        id: 'hydro-fill',
        type: 'fill',
        source: 'city-hydro',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': '#0284c7',
          'fill-opacity': 0.65,
        }
      });

      map.addLayer({
        id: 'hydro-lines-glow',
        type: 'line',
        source: 'city-hydro',
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
        source: 'city-hydro',
        filter: ['==', '$type', 'LineString'],
        paint: {
          'line-color': '#bae6fd',
          'line-width': 2.5,
        }
      });
    }

    // 2. ADD REALISTIC 3D EXTRUDED BUILDINGS (rising directly from Google Maps coordinates)
    if (!map.getSource('city-3d-buildings')) {
      map.addSource('city-3d-buildings', {
        type: 'geojson',
        data: geoBundle.landmarks3D as any,
      });

      map.addLayer({
        id: 'buildings-3d-extrusion',
        type: 'fill-extrusion',
        source: 'city-3d-buildings',
        paint: {
          'fill-extrusion-color': ['get', 'color'],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'base_height'],
          'fill-extrusion-opacity': 0.88,
        }
      });
    }

    // 3. ADD FLOOD INUNDATION DELUGE POLYGONS
    if (!map.getSource('city-flood-zones')) {
      map.addSource('city-flood-zones', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: neighbourhoods.map((n) => ({
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
        source: 'city-flood-zones',
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
        source: 'city-flood-zones',
        paint: {
          'line-color': '#22d3ee',
          'line-width': 2,
          'line-dasharray': [3, 2],
        }
      });
    }

    // 4. ADD DOPPLER RADAR RANGE RINGS & CONVECTIVE RAIN CELLS
    if (!map.getSource('city-doppler-radar')) {
      const radarCenterLng = city.lng;
      const radarCenterLat = city.lat;

      // Range rings at 15km, 30km, 45km, 60km
      const ringFeatures = [0.06, 0.12, 0.20, 0.30].map((radiusDeg, idx) => {
        const coords: [number, number][] = [];
        for (let a = 0; a <= 360; a += 10) {
          const rad = (a * Math.PI) / 180;
          coords.push([
            radarCenterLng + radiusDeg * Math.cos(rad) * 1.15,
            radarCenterLat + radiusDeg * Math.sin(rad),
          ]);
        }
        return {
          type: 'Feature',
          properties: { ring: (idx + 1) * 15, label: `${(idx + 1) * 15} km` },
          geometry: { type: 'LineString', coordinates: coords },
        };
      });

      // Convective storm rain bands approaching coastal delta
      const rainCells = [
        {
          name: 'Heavy Convective Band',
          dbz: 55,
          color: '#ef4444',
          coords: [
            [radarCenterLng + 0.02, radarCenterLat - 0.04],
            [radarCenterLng + 0.08, radarCenterLat + 0.01],
            [radarCenterLng + 0.06, radarCenterLat + 0.09],
            [radarCenterLng - 0.01, radarCenterLat + 0.05],
            [radarCenterLng + 0.02, radarCenterLat - 0.04]
          ]
        },
        {
          name: 'Moderate Monsoon Influx',
          dbz: 42,
          color: '#10b981',
          coords: [
            [radarCenterLng - 0.06, radarCenterLat - 0.08],
            [radarCenterLng + 0.01, radarCenterLat - 0.05],
            [radarCenterLng - 0.02, radarCenterLat + 0.03],
            [radarCenterLng - 0.09, radarCenterLat - 0.02],
            [radarCenterLng - 0.06, radarCenterLat - 0.08]
          ]
        },
        {
          name: 'Intense Cyclonic Core Band',
          dbz: 62,
          color: '#d946ef',
          coords: [
            [radarCenterLng + 0.04, radarCenterLat + 0.02],
            [radarCenterLng + 0.07, radarCenterLat + 0.04],
            [radarCenterLng + 0.05, radarCenterLat + 0.08],
            [radarCenterLng + 0.02, radarCenterLat + 0.06],
            [radarCenterLng + 0.04, radarCenterLat + 0.02]
          ]
        }
      ].map((cell) => ({
        type: 'Feature',
        properties: { name: cell.name, dbz: cell.dbz, color: cell.color },
        geometry: { type: 'Polygon', coordinates: [cell.coords] },
      }));

      map.addSource('city-doppler-radar', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [...ringFeatures, ...rainCells] as any,
        },
      });

      map.addLayer({
        id: 'doppler-rain-cells',
        type: 'fill',
        source: 'city-doppler-radar',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': showDopplerRadar ? 0.62 : 0,
        },
      });

      map.addLayer({
        id: 'doppler-range-rings',
        type: 'line',
        source: 'city-doppler-radar',
        filter: ['==', '$type', 'LineString'],
        paint: {
          'line-color': '#22d3ee',
          'line-width': 1.5,
          'line-dasharray': [4, 4],
          'line-opacity': showDopplerRadar ? 0.55 : 0,
        },
      });
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
        zoom: 12.4,
        pitch: 52,
        bearing: -18,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

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
        setupMapLayers(map);
      });

      // Markers for Neighbourhoods
      neighbourhoods.forEach((n) => {
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
          map.flyTo({ center: [n.lng, n.lat], zoom: 14.0, pitch: 58, duration: 1400 });
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([n.lng, n.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });

      // Markers for Sensor Telemetry Nodes (Chennai array)
      if (city.id === 'chennai') {
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
      }

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
    mapInstanceRef.current.once('style.load', () => {
      if (mapInstanceRef.current) {
        setupMapLayers(mapInstanceRef.current);
      }
    });
  }, [baseStyle]);

  useEffect(() => {
    if (!highlightNeighbourhoodId || !mapInstanceRef.current) return;
    const found = neighbourhoods.find((n) => n.id === highlightNeighbourhoodId);
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
    if (map.getLayer('doppler-rain-cells')) {
      map.setPaintProperty('doppler-rain-cells', 'fill-opacity', showDopplerRadar ? 0.62 : 0);
    }
    if (map.getLayer('doppler-range-rings')) {
      map.setPaintProperty('doppler-range-rings', 'line-opacity', showDopplerRadar ? 0.55 : 0);
    }
  }, [layers, floodDepthFilter, show3DBuildings, showDopplerRadar]);

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
    mapInstanceRef.current.flyTo({ center: [city.lng, city.lat], zoom: 12.4, pitch: 52, bearing: -18 });
  };

  const handleRotatePitch = () => {
    soundFx.playClick();
    if (!mapInstanceRef.current) return;
    const currentPitch = mapInstanceRef.current.getPitch();
    const newPitch = currentPitch > 50 ? 0 : 60;
    mapInstanceRef.current.easeTo({ pitch: newPitch, duration: 800 });
  };

  const handleOpenGoogleMaps = () => {
    soundFx.playClick();
    const target = selectedNeighbourhood || city;
    const url = `https://www.google.com/maps/@${target.lat},${target.lng},16z/data=!3m1!1e3`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050811] select-none">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Atmospheric Scanning Radar Sweep Animation */}
      {layers.rainfallRadar && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="w-[140%] h-[140%] -top-[20%] -left-[20%] absolute bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2)_0%,transparent_65%)] animate-pulse" />
        </div>
      )}

      {/* Top Floating Command Bar (Single Responsive Non-Colliding Flex Deck) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none gap-2">
        {/* Left: Exit to 3D Orbit + Title */}
        <div className="flex items-center gap-2 pointer-events-auto flex-shrink-0">
          <button
            onClick={() => {
              soundFx.playClick();
              onBackToGlobe();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel hover:border-cyan-500/50 text-slate-300 hover:text-white font-mono text-xs transition-all shadow-lg"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">3D Earth</span>
          </button>

          <div className="glass-panel px-3 py-1.5 rounded-xl border border-cyan-500/20 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              {city.name} <span className="text-cyan-400 font-normal">Digital Twin</span>
            </span>
          </div>
        </div>

        {/* Center: Water Level Inundation Scrubber */}
        <div className="hidden lg:flex items-center gap-2.5 glass-panel px-3.5 py-1.5 rounded-xl border border-blue-500/30 text-xs font-mono shadow-xl pointer-events-auto backdrop-blur-xl">
          <Droplets className="w-3.5 h-3.5 text-blue-400 animate-pulse flex-shrink-0" />
          <span className="text-slate-300 text-[11px] whitespace-nowrap">Water Level:</span>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={floodDepthFilter}
            onChange={(e) => setFloodDepthFilter(parseFloat(e.target.value))}
            className="w-24 accent-blue-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="font-bold text-cyan-300 font-mono text-xs w-10">{floodDepthFilter.toFixed(1)}m</span>
        </div>

        {/* Right: Doppler Radar, Drone Tour, 3D Blocks, GIS Layers, Google Maps 3D */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto flex-shrink-0">
          {/* Live Doppler Radar Toggle */}
          <button
            onClick={() => {
              soundFx.playRadarPing();
              setShowDopplerRadar(!showDopplerRadar);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all shadow-lg ${
              showDopplerRadar
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'glass-panel text-slate-400 hover:text-white border border-white/10'
            }`}
            title="Toggle Live Doppler Weather Radar (dBZ Reflectivity & Range Rings)"
          >
            <Radar className={`w-3.5 h-3.5 ${showDopplerRadar ? 'text-emerald-400 animate-spin' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Doppler</span>
            <span className="text-[10px] opacity-80">{showDopplerRadar ? '55 dBZ' : 'Off'}</span>
          </button>

          {/* Cinematic Aerial Drone Tour */}
          <button
            onClick={() => {
              soundFx.playRadarPing();
              setIsTourActive(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/45 text-cyan-300 border border-cyan-500/50 text-xs font-mono font-bold transition-all shadow-lg"
            title="Launch Autonomous 3D Aerial Drone Patrol Tour"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Drone Tour</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setShow3DBuildings(!show3DBuildings);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all shadow-lg ${
              show3DBuildings
                ? 'bg-purple-500/25 text-purple-300 border border-purple-500/60'
                : 'glass-panel text-slate-400 hover:text-white border border-white/10'
            }`}
            title="Toggle 3D Urban Architecture Extrusions"
          >
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">3D Blocks</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setShowLayerController(!showLayerController);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all shadow-lg ${
              showLayerController
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/60 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                : 'glass-panel text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>GIS Layers</span>
          </button>

          <button
            onClick={handleOpenGoogleMaps}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold transition-all shadow-lg"
            title="Open Current Coordinates in Google Maps 3D Satellite"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Google Maps 3D</span>
          </button>
        </div>
      </div>

      {/* Floating Layer Controller Panel (Slide-in Over Panel) */}
      {showLayerController && (
        <div className="absolute top-16 right-4 z-30 animate-in fade-in slide-in-from-right-3">
          <LayerController
            layers={layers}
            onToggleLayer={toggleLayer}
            onOpacityChange={changeOpacity}
            baseStyle={baseStyle}
            onChangeBaseStyle={setBaseStyle}
            onClose={() => setShowLayerController(false)}
          />
        </div>
      )}

      {/* Selected Neighbourhood Floating Intelligence Card (Non-intrusive bottom dock) */}
      {selectedNeighbourhood && (
        <div className="absolute bottom-5 left-4 z-20">
          <NeighbourhoodModal
            neighbourhood={selectedNeighbourhood}
            onClose={() => setSelectedNeighbourhood(null)}
            onRunSimulation={onRunSimulation}
            onAskAI={onAskAI}
          />
        </div>
      )}

      {/* Map Camera Controls */}
      <div className="absolute bottom-5 right-4 flex flex-col gap-1 glass-panel p-1.5 rounded-xl border border-white/10 z-10 shadow-2xl">
        <button
          onClick={() => handleZoom(1)}
          title="Zoom In"
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-1)}
          title="Zoom Out"
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-full h-[1px] bg-white/10 my-0.5" />
        <button
          onClick={handleRotatePitch}
          title="Toggle 3D Topographic Perspective Tilt"
          className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-white/10 transition-colors"
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetCenter}
          title="Reset Center & Bearing"
          className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-white/10 transition-colors"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Live Cursor Coordinate & Ground Elevation Reticle HUD */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden xl:flex items-center gap-2.5 glass-panel px-3.5 py-1.5 rounded-full border border-cyan-500/20 text-[11px] font-mono text-slate-300 shadow-xl z-10 pointer-events-none">
        <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
        <span>Target: <strong className="text-white">{cursorCoords.lat.toFixed(4)}°N, {cursorCoords.lng.toFixed(4)}°E</strong></span>
        <span className="text-slate-600">|</span>
        <span>Elevation: <strong className="text-purple-300">{cursorCoords.elevation}m MSL</strong></span>
        <span className="text-slate-600">|</span>
        <span className="text-emerald-400 font-semibold">Google Hybrid Active</span>
      </div>

      {/* AUTONOMOUS 3D AERIAL DRONE PATROL TOUR OVERLAY */}
      <CinematicDroneTour
        isActive={isTourActive}
        onClose={() => setIsTourActive(false)}
        city={city}
        onFlyTo={(wp: TourWaypoint) => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo({
              center: [wp.lng, wp.lat],
              zoom: wp.zoom,
              pitch: wp.pitch,
              bearing: wp.bearing,
              duration: 3500,
              essential: true,
            });
          }
        }}
      />
    </div>
  );
};
