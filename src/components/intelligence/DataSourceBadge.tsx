import React from 'react';
import { X, Database, ShieldCheck, CheckCircle2, Globe, Cpu } from 'lucide-react';
import { DATA_PROVENANCE } from '../../data/climateScenarios';

interface DataSourceBadgeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in">
      <div className="w-full max-w-2xl glass-panel-elevated rounded-2xl border border-cyan-500/30 text-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Data Provenance & Scientific Telemetry Nodes
              </h3>
              <div className="font-mono text-xs text-slate-400">
                Peer-reviewed instrumentation & continuous ingestion pipelines
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

        {/* Sources Grid */}
        <div className="my-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {DATA_PROVENANCE.map((src, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <span className="font-heading font-semibold text-xs text-white">
                  {src.name}
                </span>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                  {src.status}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[10px] text-slate-400 mt-2">
                <div>
                  <span className="text-slate-500 block">Frequency:</span>
                  <span className="text-slate-300">{src.frequency}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Spatial Grid:</span>
                  <span className="text-slate-300">{src.resolution}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block">Operating Agency:</span>
                  <span className="text-cyan-300">{src.provider}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> ISO 14064-1 & WMO Compliant
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
