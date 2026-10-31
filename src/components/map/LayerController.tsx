import React from 'react';
import { MapLayerState } from '../../types/climate';
import { Layers, Droplets, Flame, CloudRain, Trees, Waves, Mountain, Radio, Sliders } from 'lucide-react';

interface LayerControllerProps {
  layers: MapLayerState;
  onToggleLayer: (layerKey: keyof Omit<MapLayerState, 'opacity'>) => void;
  onOpacityChange: (layerKey: keyof MapLayerState['opacity'], value: number) => void;
  baseStyle: 'satellite' | 'dark' | 'terrain';
  onChangeBaseStyle: (style: 'satellite' | 'dark' | 'terrain') => void;
}

export const LayerController: React.FC<LayerControllerProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
  baseStyle,
  onChangeBaseStyle,
}) => {
  return (
    <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 text-xs w-72 max-h-[85vh] overflow-y-auto select-none shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-heading font-semibold text-white tracking-wide">GIS Intelligence Layers</span>
        </div>
        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          v4.2 Active
        </span>
      </div>

      {/* Base Map Style Selector */}
      <div className="mt-3">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
          Base Cartography
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onChangeBaseStyle('dark')}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-mono transition-all ${
              baseStyle === 'dark'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Dark Vector
          </button>
          <button
            onClick={() => onChangeBaseStyle('satellite')}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-mono transition-all ${
              baseStyle === 'satellite'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Sentinel Sat
          </button>
          <button
            onClick={() => onChangeBaseStyle('terrain')}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-mono transition-all ${
              baseStyle === 'terrain'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Topographic
          </button>
        </div>
      </div>

      {/* Environmental & Climate Overlays */}
      <div className="mt-4 space-y-3">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
          Environmental Overlays
        </span>

        {/* Flood Risk Inundation */}
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-white/5 hover:border-cyan-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.floodRisk}
                onChange={() => onToggleLayer('floodRisk')}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
              />
              <span className="flex items-center gap-1.5 font-medium text-slate-200">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                Flood Inundation (0-2m)
              </span>
            </label>
            <span className="text-[10px] font-mono text-blue-400 font-semibold">HYDRO-MODEL</span>
          </div>
          {layers.floodRisk && (
            <div className="mt-2 pl-6 pr-1 flex items-center gap-2">
              <Sliders className="w-3 h-3 text-slate-500" />
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={layers.opacity.floodRisk}
                onChange={(e) => onOpacityChange('floodRisk', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-[10px] text-slate-400 w-7 text-right">
                {Math.round(layers.opacity.floodRisk * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Urban Heat Island */}
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-white/5 hover:border-amber-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.heatRisk}
                onChange={() => onToggleLayer('heatRisk')}
                className="rounded border-slate-700 text-amber-500 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
              />
              <span className="flex items-center gap-1.5 font-medium text-slate-200">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Urban Heat Island (+4.5°C)
              </span>
            </label>
            <span className="text-[10px] font-mono text-amber-400 font-semibold">THERMAL</span>
          </div>
          {layers.heatRisk && (
            <div className="mt-2 pl-6 pr-1 flex items-center gap-2">
              <Sliders className="w-3 h-3 text-slate-500" />
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={layers.opacity.heatRisk}
                onChange={(e) => onOpacityChange('heatRisk', parseFloat(e.target.value))}
                className="w-full accent-amber-400 h-1 bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-[10px] text-slate-400 w-7 text-right">
                {Math.round(layers.opacity.heatRisk * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Precipitation Doppler Radar */}
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-white/5 hover:border-cyan-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.rainfallRadar}
                onChange={() => onToggleLayer('rainfallRadar')}
                className="rounded border-slate-700 text-cyan-400 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
              />
              <span className="flex items-center gap-1.5 font-medium text-slate-200">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                Doppler Rain Reflectivity
              </span>
            </label>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold">48 dBZ</span>
          </div>
          {layers.rainfallRadar && (
            <div className="mt-2 pl-6 pr-1 flex items-center gap-2">
              <Sliders className="w-3 h-3 text-slate-500" />
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={layers.opacity.rainfallRadar}
                onChange={(e) => onOpacityChange('rainfallRadar', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-[10px] text-slate-400 w-7 text-right">
                {Math.round(layers.opacity.rainfallRadar * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Vegetation Canopy Cover */}
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-white/5 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.vegetation}
                onChange={() => onToggleLayer('vegetation')}
                className="rounded border-slate-700 text-emerald-400 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
              />
              <span className="flex items-center gap-1.5 font-medium text-slate-200">
                <Trees className="w-3.5 h-3.5 text-emerald-400" />
                Vegetation Canopy (NDVI)
              </span>
            </label>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">SENTINEL</span>
          </div>
        </div>

        {/* Water Bodies & Natural Wet Channels */}
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-colors">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2 font-medium text-slate-200">
              <input
                type="checkbox"
                checked={layers.waterBodies}
                onChange={() => onToggleLayer('waterBodies')}
                className="rounded border-slate-700 text-blue-400 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
              />
              <Waves className="w-3.5 h-3.5 text-blue-400" />
              Waterways & Marsh Basins
            </span>
            <span className="text-[10px] font-mono text-blue-400">ADYAR / COOUM</span>
          </label>
        </div>

        {/* Elevation Contours */}
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-white/5 hover:border-purple-500/30 transition-colors">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2 font-medium text-slate-200">
              <input
                type="checkbox"
                checked={layers.elevationContour}
                onChange={() => onToggleLayer('elevationContour')}
                className="rounded border-slate-700 text-purple-400 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
              />
              <Mountain className="w-3.5 h-3.5 text-purple-400" />
              Elevation Topo Contours
            </span>
            <span className="text-[10px] font-mono text-purple-400">0 - 45m MSL</span>
          </label>
        </div>

        {/* Live Sensor Nodes */}
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-white/5 hover:border-cyan-500/30 transition-colors">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2 font-medium text-slate-200">
              <input
                type="checkbox"
                checked={layers.sensorNodes}
                onChange={() => onToggleLayer('sensorNodes')}
                className="rounded border-slate-700 text-cyan-400 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
              />
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              Live Telemetry Buoys & Radars
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
