import React from 'react';
import type { NeighbourhoodData } from '../../types/climate';
import { X, Droplets, Flame, Mountain, Activity, AlertTriangle, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { soundFx } from '../../utils/audioSynthesizer';

interface NeighbourhoodModalProps {
  neighbourhood: NeighbourhoodData | null;
  onClose: () => void;
  onRunSimulation?: (neighbourhood: NeighbourhoodData) => void;
  onAskAI?: (query: string) => void;
}

export const NeighbourhoodModal: React.FC<NeighbourhoodModalProps> = ({
  neighbourhood,
  onClose,
  onRunSimulation,
  onAskAI,
}) => {
  if (!neighbourhood) return null;

  const isEmergency = neighbourhood.alertStatus === 'Emergency';
  const isWarning = neighbourhood.alertStatus === 'Warning';

  return (
    <div className="glass-panel-elevated p-4 rounded-2xl border border-cyan-500/30 text-white w-84 max-w-[88vw] max-h-[56vh] flex flex-col shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-white/10 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-base text-white tracking-wide">
              {neighbourhood.name}
            </h3>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                isEmergency
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                  : isWarning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
              }`}
            >
              {neighbourhood.alertStatus}
            </span>
          </div>
          <div className="font-mono text-[10px] text-slate-400 mt-0.5">
            {neighbourhood.lat.toFixed(3)}°N, {neighbourhood.lng.toFixed(3)}°E • Updated {neighbourhood.lastUpdated}
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Dismiss Intelligence Card"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Diagnostics Content */}
      <div className="flex-1 overflow-y-auto space-y-2.5 my-2.5 pr-1">
        {/* Grid of Key Scientific Telemetry Metrics */}
        <div className="grid grid-cols-2 gap-2">
          {/* Flood Risk */}
          <div className="p-2 rounded-xl bg-slate-900/60 border border-blue-500/20">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1 font-mono">
                <Droplets className="w-3 h-3 text-blue-400" /> Flood Risk
              </span>
              <span className="font-mono text-blue-400 font-bold">{neighbourhood.floodRisk}/100</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
                style={{ width: `${neighbourhood.floodRisk}%` }}
              />
            </div>
            <div className="text-[9px] font-mono text-slate-400 mt-1">
              Saturation: <strong className="text-white">{neighbourhood.soilSaturation}%</strong>
            </div>
          </div>

          {/* Heat Island Risk */}
          <div className="p-2 rounded-xl bg-slate-900/60 border border-amber-500/20">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1 font-mono">
                <Flame className="w-3 h-3 text-amber-400" /> Heat Index
              </span>
              <span className="font-mono text-amber-400 font-bold">{neighbourhood.heatRisk}/100</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full"
                style={{ width: `${neighbourhood.heatRisk}%` }}
              />
            </div>
            <div className="text-[9px] font-mono text-slate-400 mt-1">
              Canopy NDVI: <strong className="text-white">{neighbourhood.vegetationIndex}</strong>
            </div>
          </div>

          {/* Topographic Elevation */}
          <div className="p-2 rounded-xl bg-slate-900/60 border border-purple-500/20">
            <div className="flex items-center gap-1 text-slate-400 text-[10px]">
              <Mountain className="w-3 h-3 text-purple-400" /> Elevation MSL
            </div>
            <div className="text-sm font-mono font-bold text-white mt-0.5">
              {neighbourhood.elevation} <span className="text-[10px] text-slate-400 font-normal">m</span>
            </div>
            <div className="text-[9px] text-slate-400">
              {neighbourhood.elevation < 4 ? 'Low sump basin' : 'Natural slope'}
            </div>
          </div>

          {/* Drainage Capacity */}
          <div className="p-2 rounded-xl bg-slate-900/60 border border-cyan-500/20">
            <div className="flex items-center gap-1 text-slate-400 text-[10px]">
              <Activity className="w-3 h-3 text-cyan-400" /> Drainage
            </div>
            <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5 truncate">
              {neighbourhood.drainageCapacity}
            </div>
            <div className="text-[9px] text-slate-400">
              Outfall: Pallikaranai
            </div>
          </div>
        </div>

        {/* Exposed Population & Assets */}
        <div className="p-2 rounded-lg bg-slate-900/40 border border-white/5 text-xs">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
            <span>Exposed Demographics:</span>
            <span className="font-semibold text-slate-200">{neighbourhood.populationExposed}</span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/40 border border-white/5 text-xs">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
            Infrastructure at Risk:
          </span>
          <ul className="space-y-1">
            {neighbourhood.criticalAssets.slice(0, 3).map((asset, idx) => (
              <li key={idx} className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                <ShieldCheck className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{asset}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Historical Flood Deluges */}
        {neighbourhood.historicalFloods.length > 0 && (
          <div className="p-2 rounded-lg bg-red-950/20 border border-red-500/20">
            <span className="font-mono text-[9px] text-red-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Historical Inundation:
            </span>
            <p className="text-[10px] text-slate-300 mt-0.5">
              {neighbourhood.historicalFloods[0]}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-white/10 flex items-center gap-2 flex-shrink-0">
        {onRunSimulation && (
          <button
            onClick={() => onRunSimulation(neighbourhood)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-semibold transition-all"
          >
            <Cpu className="w-3 h-3" />
            <span>Simulate</span>
          </button>
        )}
        {onAskAI && (
          <button
            onClick={() => onAskAI(`Provide an executive flood and climate risk briefing for ${neighbourhood.name}, Chennai.`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 border border-blue-500/40 font-mono text-xs font-semibold transition-all"
          >
            <span>Ask AI</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
