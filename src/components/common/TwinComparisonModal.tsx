import React, { useState } from 'react';
import { X, GitCompare, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Droplets, Flame, Waves } from 'lucide-react';
import type { CityData } from '../../types/climate';
import { GLOBAL_CITIES } from '../../data/citiesData';
import { soundFx } from '../../utils/audioSynthesizer';

interface TwinComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseCity: CityData;
}

export const TwinComparisonModal: React.FC<TwinComparisonModalProps> = ({
  isOpen,
  onClose,
  baseCity,
}) => {
  const [compareCityId, setCompareCityId] = useState<string>('rotterdam');

  if (!isOpen) return null;

  const compareCity = GLOBAL_CITIES.find((c) => c.id === compareCityId) || GLOBAL_CITIES[3];

  const COMPARISON_METRICS = [
    {
      label: 'Composite Climate Risk Score',
      unit: '/100',
      baseVal: baseCity.riskScore,
      compareVal: compareCity.riskScore,
      better: 'lower',
      note: 'Based on hazard frequency, elevation vulnerability, and asset density',
    },
    {
      label: 'Mean Air Temperature',
      unit: '°C',
      baseVal: baseCity.currentTemp,
      compareVal: compareCity.currentTemp,
      better: 'neutral',
      note: 'Surface temperature under real-time telemetry calibration',
    },
    {
      label: 'Thermal Climatological Anomaly',
      unit: '°C',
      baseVal: baseCity.tempAnomaly,
      compareVal: compareCity.tempAnomaly,
      better: 'lower',
      note: 'Deviation against 1991-2020 ERA5 long-term baseline',
    },
    {
      label: 'Precipitation Intensity',
      unit: 'mm/h',
      baseVal: baseCity.precipitationRate,
      compareVal: compareCity.precipitationRate,
      better: 'lower',
      note: 'Radar telemetry tracking monsoon and convective cloudbursts',
    },
    {
      label: 'Vulnerability Index (IPCC AR6)',
      unit: '%',
      baseVal: Math.round(baseCity.vulnerabilityIndex * 100),
      compareVal: Math.round(compareCity.vulnerabilityIndex * 100),
      better: 'lower',
      note: 'Compound social, infrastructural, and economic exposure',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] glass-panel-elevated rounded-2xl border border-cyan-500/30 text-white flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Twin-to-Twin Climate Resilience Benchmark
              </h3>
              <div className="font-mono text-xs text-slate-400">
                Comparative urban adaptation diagnostics across global delta megacities
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header City Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Base City Card */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30">
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">
                PRIMARY DIGITAL TWIN
              </span>
              <h3 className="font-heading font-black text-2xl text-white mt-1">
                {baseCity.name}, {baseCity.country}
              </h3>
              <div className="font-mono text-xs text-slate-400 mt-1">
                Primary Hazard: <span className="text-cyan-300 font-semibold">{baseCity.primaryHazard}</span>
              </div>
              <div className="font-mono text-xs text-slate-400 mt-0.5">
                Population: {baseCity.population} • Sea Level 2050: {baseCity.seaLevelRisk}
              </div>
            </div>

            {/* Benchmark Target Selector Card */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30">
              <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest block font-bold">
                BENCHMARK COMPARISON TARGET
              </span>
              <div className="mt-1 flex items-center justify-between">
                <select
                  value={compareCityId}
                  onChange={(e) => {
                    soundFx.playClick();
                    setCompareCityId(e.target.value);
                  }}
                  className="bg-slate-950 border border-white/20 text-white font-heading font-bold text-lg rounded-lg px-3 py-1 focus:outline-none cursor-pointer"
                >
                  {GLOBAL_CITIES.filter((c) => c.id !== baseCity.id).map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900">
                      {c.name}, {c.country}
                    </option>
                  ))}
                </select>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    compareCity.riskLevel === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {compareCity.riskLevel}
                </span>
              </div>
              <div className="font-mono text-xs text-slate-400 mt-1.5">
                Primary Hazard: <span className="text-purple-300 font-semibold">{compareCity.primaryHazard}</span>
              </div>
              <div className="font-mono text-xs text-slate-400 mt-0.5">
                Population: {compareCity.population} • Sea Level 2050: {compareCity.seaLevelRisk}
              </div>
            </div>
          </div>

          {/* Metrics Delta Grid */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Comparative Telemetry & Exposure Metrics
            </h4>
            <div className="space-y-2">
              {COMPARISON_METRICS.map((m, idx) => {
                const diff = m.baseVal - m.compareVal;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/20 transition-all font-mono text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                      <span className="font-semibold text-slate-200">{m.label}</span>
                      <span className="text-[10px] text-slate-500">{m.note}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center pt-1 border-t border-white/5">
                      {/* Base Value */}
                      <div className="text-left">
                        <span className="text-[10px] text-cyan-400 block">{baseCity.name}</span>
                        <span className="text-base font-bold text-white">
                          {m.baseVal} {m.unit}
                        </span>
                      </div>

                      {/* Differential */}
                      <div className="text-center">
                        <span className="text-[10px] text-slate-500 block">Variance</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded inline-block ${
                            diff > 0
                              ? 'bg-amber-500/20 text-amber-300'
                              : diff < 0
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} {m.unit}
                        </span>
                      </div>

                      {/* Compare Value */}
                      <div className="text-right">
                        <span className="text-[10px] text-purple-400 block">{compareCity.name}</span>
                        <span className="text-base font-bold text-white">
                          {m.compareVal} {m.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Adaptation Infrastructure Insight */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2 text-xs">
            <h4 className="font-heading font-bold text-sm text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Comparative Defense Infrastructure Architecture</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-[11px] leading-relaxed pt-1">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                <strong className="text-cyan-300 block mb-1">{baseCity.name} Adaptation Model:</strong>
                <p>
                  Relies primarily on natural retention wetlands (Pallikaranai sump, Chembarambakkam reservoir, Adyar river floodplain). Gravity discharge constrained by Bay of Bengal tidal surge (+0.84m). Requires de-watering pump electrification and Okkiyam Madavu sluice dredging.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                <strong className="text-purple-300 block mb-1">{compareCity.name} Adaptation Model:</strong>
                <p>{compareCity.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between font-mono text-xs text-slate-400">
          <span>Global Climate Intelligence Engine • Multi-City Comparative Analysis</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors uppercase tracking-wider"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
};
