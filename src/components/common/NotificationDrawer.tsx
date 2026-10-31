import React from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BULLETINS = [
  {
    id: 'b-1',
    type: 'critical',
    title: 'RED ALERT: Acute Hydrological Surcharge in Velachery Basin',
    time: '4 mins ago',
    source: 'IMD & Greater Chennai Corporation Smart City',
    description: 'Soil saturation reached 94.2% following localized 68mm burst. Chembarambakkam reservoir outflow elevated to 18,400 cusecs. Immediate de-watering pumps deployed to Vijayanagar MRTS underpass.',
    zone: 'Velachery & Madipakkam'
  },
  {
    id: 'b-2',
    type: 'warning',
    title: 'ASTRONOMICAL TIDE ADVISORY: +0.84m High Tide Surge',
    time: '18 mins ago',
    source: 'INCOIS Hyderabad Coastal Buoy Node',
    description: 'Astronomical high tide peaking along Bay of Bengal shore, reducing gravitational discharge rate from Adyar and Cooum river mouths.',
    zone: 'Marina & Adyar Estuary'
  },
  {
    id: 'b-3',
    type: 'advisory',
    title: 'THERMAL ANOMALY: George Town +4.4°C Surface Heat Flux',
    time: '42 mins ago',
    source: 'Sentinel-3 SLSTR Thermal Pipeline',
    description: 'Microclimate albedo deficit exacerbating nocturnal thermal retention. Public cooling shelters operational in North Chennai.',
    zone: 'George Town Commercial Core'
  }
];

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm select-none animate-in fade-in">
      <div className="w-full max-w-md h-full glass-panel-elevated border-l border-cyan-500/30 text-white p-5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-heading font-bold text-sm text-white">
                Live Hazard & Early Warning Bulletins
              </h3>
              <div className="font-mono text-[10px] text-slate-400">
                Official Multi-Agency Telemetry Stream
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bulletins List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {BULLETINS.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-xl border transition-all ${
                b.type === 'critical'
                  ? 'bg-red-950/30 border-red-500/40'
                  : b.type === 'warning'
                  ? 'bg-amber-950/30 border-amber-500/40'
                  : 'bg-blue-950/30 border-blue-500/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    b.type === 'critical'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                      : b.type === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                  }`}
                >
                  {b.zone}
                </span>
                <span className="font-mono text-[10px] text-slate-500">{b.time}</span>
              </div>

              <h4 className="font-heading font-semibold text-xs text-white mt-1 leading-snug">
                {b.title}
              </h4>

              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {b.description}
              </p>

              <div className="font-mono text-[9px] text-slate-500 mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                <span>{b.source}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Broadcast Active
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-slate-400">
          <span>Incident Command System v4.8</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
