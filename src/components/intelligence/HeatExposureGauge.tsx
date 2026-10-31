import React from 'react';
import { Flame, AlertCircle } from 'lucide-react';

interface HeatExposureGaugeProps {
  city?: string;
}

export const HeatExposureGauge: React.FC<HeatExposureGaugeProps> = () => {
  return (
    <div className="glass-panel p-4 rounded-xl border border-amber-500/20 text-white shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <span className="font-heading font-semibold text-xs tracking-wide text-slate-100 uppercase">
              Urban Heat Island (UHI)
            </span>
            <div className="text-[10px] font-mono text-slate-400">Sentinel-3 Thermal Infrared & Albedo</div>
          </div>
        </div>
        <div className="flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
          <AlertCircle className="w-3 h-3" />
          <span>Elevated Heat Stress</span>
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-extrabold text-amber-300 tracking-tight">
              +3.6
            </span>
            <span className="font-heading text-lg font-medium text-amber-400">°C</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 ml-2">
              Thermal Microclimate
            </span>
          </div>
          <div className="text-[11px] font-mono mt-1 text-slate-300">
            Core Urban vs Rural Baseline Differential
          </div>
        </div>

        {/* Canopy Cover */}
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Canopy Cover</span>
          <span className="font-mono text-sm font-bold text-emerald-400">11.8%</span>
          <span className="text-[9px] font-mono text-slate-500 block">Target: &gt;30%</span>
        </div>
      </div>

      {/* Hotspots Breakdown */}
      <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono">
        <div className="p-1.5 rounded bg-slate-900/60 border border-white/5">
          <span className="text-slate-400 block">Peak Ward:</span>
          <span className="text-amber-300 font-bold">George Town (+4.4°C)</span>
        </div>
        <div className="p-1.5 rounded bg-slate-900/60 border border-white/5">
          <span className="text-slate-400 block">Cooling Refuge:</span>
          <span className="text-emerald-400 font-bold">Guindy Forest (-2.1°C)</span>
        </div>
      </div>

      {/* Provenance Footer */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Source: ESA Sentinel-3 SLSTR</span>
        <span>Resolution: 1 km Thermal</span>
      </div>
    </div>
  );
};
