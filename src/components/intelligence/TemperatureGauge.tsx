import React from 'react';
import { Thermometer, TrendingUp, ShieldCheck } from 'lucide-react';

interface TemperatureGaugeProps {
  currentTemp: number;
  tempAnomaly: number;
  city?: string;
}

export const TemperatureGauge: React.FC<TemperatureGaugeProps> = ({
  currentTemp,
  tempAnomaly,
}) => {
  const hourlyData = [
    { hour: '00:00', temp: 28.1 },
    { hour: '04:00', temp: 27.4 },
    { hour: '08:00', temp: 29.8 },
    { hour: '12:00', temp: 33.6 },
    { hour: '16:00', temp: 32.4 },
    { hour: '20:00', temp: 29.9 },
  ];

  return (
    <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 text-white shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
      {/* Instrument Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <span className="font-heading font-semibold text-xs tracking-wide text-slate-100 uppercase">
              Thermal Instrument
            </span>
            <div className="text-[10px] font-mono text-slate-400">Surface Air & Skin Temperature</div>
          </div>
        </div>
        <div className="flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3" />
          <span>Tier-1 Validated</span>
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-extrabold text-white tracking-tight">
              {currentTemp.toFixed(1)}
            </span>
            <span className="font-heading text-lg font-medium text-cyan-300">°C</span>
            <span className="text-xs text-slate-400 font-mono ml-2">
              ({((currentTemp * 9) / 5 + 32).toFixed(1)}°F)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono mt-1 text-amber-300">
            <TrendingUp className="w-3 h-3 text-amber-400" />
            <span>+{tempAnomaly.toFixed(1)}°C anomaly vs 1991-2020 ERA5 baseline</span>
          </div>
        </div>

        {/* Wet Bulb Gauge */}
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Wet Bulb Temp</span>
          <span className="font-mono text-sm font-bold text-amber-400">29.2°C</span>
          <span className="text-[9px] font-mono text-slate-500 block">Threshold: 31°C</span>
        </div>
      </div>

      {/* Mini Diurnal Sparkline Visualization */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span>Diurnal Cycle (24h)</span>
          <span className="text-slate-300">Range: 27.4°C — 33.6°C</span>
        </div>
        <div className="flex items-end gap-1.5 h-8 w-full pt-1">
          {hourlyData.map((d, i) => {
            const heightPct = ((d.temp - 26) / 8) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group/bar">
                <div
                  className="w-full bg-gradient-to-t from-cyan-600/40 to-cyan-400 rounded-t-sm group-hover/bar:to-cyan-300 transition-all"
                  style={{ height: `${Math.max(15, heightPct)}%` }}
                  title={`${d.hour}: ${d.temp}°C`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Provenance Footer */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Source: Copernicus ERA5 & IMD AWS</span>
        <span>Latency: 38s</span>
      </div>
    </div>
  );
};
