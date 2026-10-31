import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { CHENNAI_NEIGHBOURHOODS } from '../../data/chennaiGeoData';
import { GLOBAL_CITIES } from '../../data/citiesData';
import type { CityData, NeighbourhoodData } from '../../types/climate';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: CityData) => void;
  onSelectNeighbourhood: (neighbourhood: NeighbourhoodData) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  onSelectNeighbourhood,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredNeighbourhoods = CHENNAI_NEIGHBOURHOODS.filter(
    (n) =>
      n.name.toLowerCase().includes(query.toLowerCase()) ||
      n.criticalAssets.some((a) => a.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredCities = GLOBAL_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-xl glass-panel-elevated rounded-2xl border border-cyan-500/30 text-white shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-slate-900/90">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Chennai wards (Velachery, Pallikaranai...), sensors, or global cities..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Chennai Wards */}
          {filteredNeighbourhoods.length > 0 && (
            <div>
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider block px-2 mb-1.5 font-semibold">
                Chennai Digital Twin Wards ({filteredNeighbourhoods.length})
              </span>
              <div className="space-y-1">
                {filteredNeighbourhoods.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      onSelectNeighbourhood(n);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-cyan-500/20 text-left transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-semibold text-xs text-white group-hover:text-cyan-300">
                          {n.name}
                        </span>
                        <span
                          className={`font-mono text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            n.alertStatus === 'Emergency'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {n.alertStatus}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                        Elevation: {n.elevation}m • Flood Risk: {n.floodRisk}/100 • Saturation: {n.soilSaturation}%
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Global Cities */}
          {filteredCities.length > 0 && (
            <div>
              <span className="font-mono text-[10px] text-purple-400 uppercase tracking-wider block px-2 mb-1.5 font-semibold">
                Global Planetary Cities ({filteredCities.length})
              </span>
              <div className="space-y-1">
                {filteredCities.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCity(c);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-purple-500/20 text-left transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-semibold text-xs text-white group-hover:text-purple-300">
                          {c.name}, {c.country}
                        </span>
                        <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {c.primaryHazard}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                        Risk Score: {c.riskScore}/100 • Temp: {c.currentTemp}°C
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNeighbourhoods.length === 0 && filteredCities.length === 0 && (
            <div className="py-8 text-center text-slate-500 font-mono text-xs">
              No matching climate wards or telemetry nodes found for "{query}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
