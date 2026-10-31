import React from 'react';
import { Wind, ShieldCheck } from 'lucide-react';

interface EnvironmentalQualityProps {
  humidity: number;
}

export const EnvironmentalQuality: React.FC<EnvironmentalQualityProps> = ({ humidity }) => {
  return (
    <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 text-white shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <span className="font-heading font-semibold text-xs tracking-wide text-slate-100 uppercase">
              Atmospheric Telemetry
            </span>
            <div className="text-[10px] font-mono text-slate-400">Barometric, Humidity & Dispersion Index</div>
          </div>
        </div>
        <div className="flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3" />
          <span>Real-time AWS</span>
        </div>
      </div>

      {/* Grid of Indicators */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
          <span className="text-[10px] font-mono text-slate-400 block">Relative Humidity</span>
          <span className="font-mono text-base font-bold text-cyan-300">{humidity}%</span>
          <span className="text-[9px] font-mono text-slate-500 block">Dew Point: 26.8°C</span>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
          <span className="text-[10px] font-mono text-slate-400 block">Barometric Pressure</span>
          <span className="font-mono text-base font-bold text-white">1008.4</span>
          <span className="text-[9px] font-mono text-slate-500 block">hPa (Falling)</span>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
          <span className="text-[10px] font-mono text-slate-400 block">Surface Winds</span>
          <span className="font-mono text-base font-bold text-emerald-300">22.4</span>
          <span className="text-[9px] font-mono text-slate-500 block">km/h ENE (Gust 38)</span>
        </div>
      </div>

      {/* Air Quality AQI summary */}
      <div className="mt-2.5 p-2 rounded-lg bg-slate-900/40 border border-white/5 flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400">Air Quality Composite:</span>
        <span className="text-emerald-400 font-bold">AQI 74 (Moderate) • PM2.5: 24 µg/m³</span>
      </div>

      {/* Provenance Footer */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Source: CPCB & IMD Alipore Calibration</span>
        <span>Node: Chennai Port AWS</span>
      </div>
    </div>
  );
};
