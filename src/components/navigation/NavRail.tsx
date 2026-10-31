import React, { useState } from 'react';
import type { ViewMode } from '../../types/climate';
import { Globe, Map, BarChart3, Cpu, Sparkles, Database } from 'lucide-react';

interface NavRailProps {
  currentMode: ViewMode;
  onChangeMode: (mode: ViewMode) => void;
  onOpenDataSources: () => void;
}

export const NavRail: React.FC<NavRailProps> = ({
  currentMode,
  onChangeMode,
  onOpenDataSources,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const NAV_ITEMS: { id: ViewMode; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
    {
      id: 'globe',
      label: 'Planetary 3D',
      icon: Globe,
      description: 'Global 3D Earth & city orbital telemetry'
    },
    {
      id: 'twin',
      label: 'Digital Twin GIS',
      icon: Map,
      description: '0.5m LiDAR local inundation & thermal twin'
    },
    {
      id: 'analytics',
      label: 'Climate Intelligence',
      icon: BarChart3,
      description: 'Specialized scientific instruments & curves'
    },
    {
      id: 'simulator',
      label: 'Scenario Simulator',
      icon: Cpu,
      description: 'Hypothetical climate sandbox & impact models'
    },
    {
      id: 'ai',
      label: 'AI Analyst Engine',
      icon: Sparkles,
      description: 'Scientific dialogue with evidence citations'
    }
  ];

  return (
    <nav
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed left-4 top-24 z-30 transition-all duration-300 select-none glass-panel rounded-2xl border border-cyan-500/20 shadow-2xl p-2 flex flex-col justify-between backdrop-blur-2xl ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      style={{ height: 'calc(100vh - 180px)' }}
    >
      {/* Primary Navigation Item Stack */}
      <div className="space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentMode === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeMode(item.id)}
              className={`w-full flex items-center gap-3.5 p-3 rounded-xl transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r shadow-[0_0_8px_#22d3ee]" />
              )}

              <div className="flex-shrink-0">
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                />
              </div>

              {isExpanded && (
                <div className="text-left overflow-hidden whitespace-nowrap animate-in fade-in duration-200">
                  <div
                    className={`font-heading text-xs font-semibold tracking-wide ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="font-mono text-[9px] text-slate-500 truncate">
                    {item.description}
                  </div>
                </div>
              )}

              {/* Tooltip on collapsed hover */}
              {!isExpanded && (
                <div className="absolute left-16 px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-white font-mono text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Navigation items */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <button
          onClick={onOpenDataSources}
          className="w-full flex items-center gap-3.5 p-3 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-all group relative"
          title="Telemetry Data Sources & Provenance"
        >
          <Database className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
          {isExpanded && (
            <div className="text-left overflow-hidden whitespace-nowrap animate-in fade-in duration-200 font-mono text-xs">
              <span className="text-slate-300 block">Data Sources</span>
              <span className="text-[9px] text-slate-500">ERA5, GPM, Sentinel</span>
            </div>
          )}
        </button>
      </div>
    </nav>
  );
};
