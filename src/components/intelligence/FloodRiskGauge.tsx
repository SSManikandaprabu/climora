import React from 'react';
import { Droplets, AlertTriangle } from 'lucide-react';

interface FloodRiskGaugeProps {
  riskScore: number;
  riskLevel: string;
}

export const FloodRiskGauge: React.FC<FloodRiskGaugeProps> = ({
  riskScore,
  riskLevel,
}) => {
  const isCritical = riskScore >= 75;

  return (
    <div className="glass-panel p-4 rounded-xl border border-red-500/20 text-white shadow-xl relative overflow-hidden group hover:border-red-500/40 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="font-heading font-semibold text-xs tracking-wide text-slate-100 uppercase">
              Hydrological Inundation Risk
            </span>
            <div className="text-[10px] font-mono text-slate-400">0.5m LiDAR & Hydro-Dynamic Runoff</div>
          </div>
        </div>
        <div className="flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
          <AlertTriangle className="w-3 h-3" />
          <span>Surge Active</span>
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-extrabold text-white tracking-tight">
              {riskScore}
            </span>
            <span className="font-heading text-lg font-medium text-red-400">/100</span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ml-2 ${
                isCritical
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {riskLevel} Risk
            </span>
          </div>
          <div className="text-[11px] font-mono mt-1 text-slate-300">
            Soil Saturation: <strong className="text-white">91.4%</strong> (Critical Absorption Deficit)
          </div>
        </div>

        {/* Tide surge */}
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Bay Surge</span>
          <span className="font-mono text-sm font-bold text-cyan-300">+0.84m</span>
          <span className="text-[9px] font-mono text-slate-500 block">Outfall Blocked</span>
        </div>
      </div>

      {/* Progress Bar Gauge */}
      <div className="mt-3">
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-amber-500 to-red-500 rounded-full"
            style={{ width: `${riskScore}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
          <span>0 (Resilient)</span>
          <span>50 (Moderate)</span>
          <span>100 (Extreme Inundation)</span>
        </div>
      </div>

      {/* Provenance Footer */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Source: Chennai Hydro Twin & INCOIS</span>
        <span>Resolution: 0.5m LiDAR</span>
      </div>
    </div>
  );
};
