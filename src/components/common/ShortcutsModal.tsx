import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const SHORTCUTS = [
    { key: 'Ctrl + K', desc: 'Open Global Spatial Search (Wards, Cities, Telemetry)' },
    { key: '1', desc: 'Switch to Planetary 3D Earth Orbit' },
    { key: '2', desc: 'Switch to Google Maps Digital Twin GIS' },
    { key: '3', desc: 'Switch to Climate Intelligence & Instruments' },
    { key: '4', desc: 'Switch to Coupled Scenario Simulator' },
    { key: '5', desc: 'Switch to Aether-9 AI Scientific Analyst' },
    { key: 'C', desc: 'Open Bay of Bengal Cyclone Trajectory & Wind Cone Radar' },
    { key: 'T', desc: 'Open Historical Satellite Time-Lapse Split Slider (2000 vs 2026)' },
    { key: 'I', desc: 'Open IoT River Gauge & Sluice Gate Telemetry Array' },
    { key: 'S', desc: 'Open First-Person 3D Street-Level Inundation Camera' },
    { key: 'E', desc: 'Open Municipal Evacuation Corridors & Relief Shelters' },
    { key: 'R', desc: 'Toggle Level-4 Multi-Agency Red Alert Protocol' },
    { key: 'P', desc: 'Open Printable Multi-Agency Incident Situation Report (SITREP)' },
    { key: 'O', desc: 'Open Offline Disaster Field Pack (Zero-Cellular Mode)' },
    { key: 'D', desc: 'Open Executive Climate Intelligence Dossier' },
    { key: '?', desc: 'Toggle this Shortcuts Palette' },
    { key: 'Esc', desc: 'Close any active modal or drawer' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in">
      <div className="w-full max-w-lg glass-panel-elevated rounded-2xl border border-cyan-500/30 text-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Command Centre Keyboard Shortcuts
              </h3>
              <div className="font-mono text-xs text-slate-400">
                Rapid spatial navigation and instrument toggles
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

        <div className="my-4 space-y-2">
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5 font-mono text-xs"
            >
              <span className="text-slate-300">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 font-bold shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs text-slate-500">
          <span>Press ESC or click anywhere outside to close</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
