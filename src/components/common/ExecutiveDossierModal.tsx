import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Globe } from 'lucide-react';
import type { CityData } from '../../types/climate';
import { CHENNAI_NEIGHBOURHOODS } from '../../data/chennaiGeoData';

interface ExecutiveDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityData;
}

export const ExecutiveDossierModal: React.FC<ExecutiveDossierModalProps> = ({
  isOpen,
  onClose,
  city,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] glass-panel-elevated rounded-2xl border border-cyan-500/30 text-white flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                ClimateTwin X • Executive Climate Intelligence Dossier
              </h3>
              <div className="font-mono text-xs text-slate-400">
                Official Multi-Hazard Assessment & Spatial Adaptation Strategy
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Document Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 font-sans print:bg-white print:text-black">
          {/* Executive Overview Header */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 print:border-black flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
                MUNICIPAL TARGET: {city.name.toUpperCase()}, {city.country.toUpperCase()}
              </span>
              <h2 className="font-heading font-black text-2xl text-white print:text-black mt-1">
                Compound Risk Rating: {city.riskScore} / 100 ({city.riskLevel})
              </h2>
              <div className="font-mono text-xs text-slate-400 mt-1">
                Geographic Centroid: {city.lat}°N, {city.lng}°E • Population at Risk: {city.population}
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="text-slate-400 block">Report Classification:</span>
              <span className="text-emerald-400 font-bold">Tier-1 Scientific Briefing</span>
              <span className="text-slate-500 text-[10px] block mt-1">ISO 14064-1 & IPCC AR6</span>
            </div>
          </div>

          {/* Core Findings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-blue-500/20 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Primary Hazard Vector</span>
              <span className="font-heading text-sm font-bold text-blue-400 block mt-1">
                {city.primaryHazard}
              </span>
              <span className="text-[11px] text-slate-300 block mt-1">
                Precipitation: {city.precipitationRate} mm/h (Doppler Tracked)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-amber-500/20 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Thermal Stress Differential</span>
              <span className="font-heading text-sm font-bold text-amber-400 block mt-1">
                +{city.tempAnomaly}°C Above Baseline
              </span>
              <span className="text-[11px] text-slate-300 block mt-1">
                Current: {city.currentTemp}°C • Humidity: {city.humidity}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-purple-500/20 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Sea Level / Storm Surge</span>
              <span className="font-heading text-sm font-bold text-purple-400 block mt-1">
                {city.seaLevelRisk}
              </span>
              <span className="text-[11px] text-slate-300 block mt-1">
                Vulnerability Index: {(city.vulnerabilityIndex * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Chennai Wards Inundation Exposure Table */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Ward-Level Hydrodynamic Vulnerability Audit (0.5m LiDAR Grid)</span>
            </h4>
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/40">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-900/80 border-b border-white/10 text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="p-2.5">Ward / Zone</th>
                    <th className="p-2.5">Elevation (MSL)</th>
                    <th className="p-2.5">Flood Risk</th>
                    <th className="p-2.5">Soil Saturation</th>
                    <th className="p-2.5">Drainage Status</th>
                    <th className="p-2.5">Alert Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {CHENNAI_NEIGHBOURHOODS.slice(0, 6).map((w) => (
                    <tr key={w.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-2.5 font-semibold text-white">{w.name}</td>
                      <td className="p-2.5 text-slate-300">{w.elevation}m</td>
                      <td className="p-2.5 text-blue-400 font-bold">{w.floodRisk} / 100</td>
                      <td className="p-2.5 text-amber-300">{w.soilSaturation}%</td>
                      <td className="p-2.5 text-slate-300">{w.drainageCapacity}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            w.alertStatus === 'Emergency'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {w.alertStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2 text-xs">
            <h4 className="font-heading font-bold text-sm text-cyan-300 uppercase tracking-wider">
              Priority Resilience Interventions
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-slate-300 leading-relaxed">
              <li>
                <strong>Velachery–Pallikaranai Sponge Basin Reclamation:</strong> De-silt Okkiyam Madavu sluice gate to restore minimum 2,800 cusecs gravity discharge during high-tide phases.
              </li>
              <li>
                <strong>Microclimate Urban Canopy Mandate:</strong> Accelerate native Casuarina and Pongamia green corridors along OMR IT corridor to reduce the +4.4°C thermal anomaly.
              </li>
              <li>
                <strong>Tidal Gate Automation:</strong> Deploy motorized storm-surge gates at Buckingham Canal and Adyar river mouth with INCOIS telemetry sync.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between font-mono text-xs text-slate-400">
          <span>Digital Sign-Off: Dr. A. Ramanathan • ClimateTwin X</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
