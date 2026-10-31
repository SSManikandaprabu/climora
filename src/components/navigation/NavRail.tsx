import React, { useState } from 'react';
import type { ViewMode } from '../../types/climate';
import {
  Globe,
  Map,
  BarChart3,
  Cpu,
  Sparkles,
  Database,
  GitCompare,
  ShieldAlert,
  History,
  Radio,
  Eye,
  Navigation,
} from 'lucide-react';
import { soundFx } from '../../utils/audioSynthesizer';

interface NavRailProps {
  currentMode: ViewMode;
  onChangeMode: (mode: ViewMode) => void;
  onOpenDataSources: () => void;
  onOpenComparison?: () => void;
  onOpenCyclone?: () => void;
  onOpenTimeLapse?: () => void;
  onOpenIoT?: () => void;
  onOpenStreetView?: () => void;
  onOpenEvacuation?: () => void;
}

export const NavRail: React.FC<NavRailProps> = ({
  currentMode,
  onChangeMode,
  onOpenDataSources,
  onOpenComparison,
  onOpenCyclone,
  onOpenTimeLapse,
  onOpenIoT,
  onOpenStreetView,
  onOpenEvacuation,
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

      {/* Footer Tactical Tools & Navigation items */}
      <div className="pt-2 border-t border-white/10 space-y-1.5 overflow-y-auto max-h-56">
        {onOpenCyclone && (
          <button
            onClick={() => {
              soundFx.playRadarPing();
              onOpenCyclone();
            }}
            className="w-full flex items-center gap-3.5 p-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-all group relative border border-red-500/20"
            title="Bay of Bengal Cyclone Trajectory & Wind Radii"
          >
            <ShieldAlert className="w-5 h-5 flex-shrink-0 animate-pulse text-red-400" />
            {isExpanded && (
              <div className="text-left overflow-hidden whitespace-nowrap font-mono text-xs">
                <span className="text-red-300 block font-bold">Cyclone Radar</span>
                <span className="text-[9px] text-red-400/80">Bay of Bengal Trajectory</span>
              </div>
            )}
          </button>
        )}

        {onOpenTimeLapse && (
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenTimeLapse();
            }}
            className="w-full flex items-center gap-3.5 p-2.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-all group relative"
            title="2000 vs 2026 Satellite Time-Lapse Lens"
          >
            <History className="w-5 h-5 flex-shrink-0 text-cyan-400" />
            {isExpanded && (
              <div className="text-left overflow-hidden whitespace-nowrap font-mono text-xs">
                <span className="text-white block font-medium">Time-Lapse Lens</span>
                <span className="text-[9px] text-cyan-400/80">2000 vs 2026 Sprawl</span>
              </div>
            )}
          </button>
        )}

        {onOpenIoT && (
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenIoT();
            }}
            className="w-full flex items-center gap-3.5 p-2.5 rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60 transition-all group relative"
            title="IoT River Stage Gauges & Sluice Regulators"
          >
            <Radio className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            {isExpanded && (
              <div className="text-left overflow-hidden whitespace-nowrap font-mono text-xs">
                <span className="text-white block font-medium">IoT River Gauges</span>
                <span className="text-[9px] text-emerald-400/80">Ultrasonic Stages</span>
              </div>
            )}
          </button>
        )}

        {onOpenStreetView && (
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenStreetView();
            }}
            className="w-full flex items-center gap-3.5 p-2.5 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-slate-800/60 transition-all group relative"
            title="First-Person 3D Street Inundation Camera"
          >
            <Eye className="w-5 h-5 flex-shrink-0 text-purple-400" />
            {isExpanded && (
              <div className="text-left overflow-hidden whitespace-nowrap font-mono text-xs">
                <span className="text-white block font-medium">3D Street Cam</span>
                <span className="text-[9px] text-purple-400/80">Ground Water Stage</span>
              </div>
            )}
          </button>
        )}

        {onOpenEvacuation && (
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenEvacuation();
            }}
            className="w-full flex items-center gap-3.5 p-2.5 rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60 transition-all group relative"
            title="Emergency Evacuation Corridors & Relief Shelters"
          >
            <Navigation className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            {isExpanded && (
              <div className="text-left overflow-hidden whitespace-nowrap font-mono text-xs">
                <span className="text-white block font-medium">Relief Shelters</span>
                <span className="text-[9px] text-emerald-400/80">GCC 1913 Safe Havens</span>
              </div>
            )}
          </button>
        )}

        {onOpenComparison && (
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenComparison();
            }}
            className="w-full flex items-center gap-3.5 p-2.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-all group relative"
            title="Twin-to-Twin Global Benchmark"
          >
            <GitCompare className="w-5 h-5 flex-shrink-0 text-cyan-400" />
            {isExpanded && (
              <div className="text-left overflow-hidden whitespace-nowrap font-mono text-xs">
                <span className="text-white block font-medium">Twin Benchmark</span>
                <span className="text-[9px] text-cyan-400/80">Compare Port Megacities</span>
              </div>
            )}
          </button>
        )}

        <button
          onClick={onOpenDataSources}
          className="w-full flex items-center gap-3.5 p-2.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-all group relative"
          title="Telemetry Data Sources & Provenance"
        >
          <Database className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
          {isExpanded && (
            <div className="text-left overflow-hidden whitespace-nowrap font-mono text-xs">
              <span className="text-slate-300 block">Data Sources</span>
              <span className="text-[9px] text-slate-500">ERA5, GPM, Sentinel</span>
            </div>
          )}
        </button>
      </div>
    </nav>
  );
};
