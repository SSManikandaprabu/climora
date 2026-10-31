import React, { useState } from 'react';
import { X, AlertTriangle, Compass, Wind, Radio, ShieldAlert, Waves, ArrowRight, Eye, Play, Pause } from 'lucide-react';
import { soundFx } from '../../utils/audioSynthesizer';

interface CycloneTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOnMap?: (coords: [number, number]) => void;
}

export interface CycloneWaypoint {
  timeOffset: string;
  timestamp: string;
  lat: number;
  lng: number;
  intensity: string;
  centralPressure: number; // hPa
  maxWindSpeed: number; // km/h
  status: 'Observed' | 'Projected Landfall' | 'Post-Landfall Depression';
}

export const CYCLONE_TRAJECTORY_DATA: CycloneWaypoint[] = [
  {
    timeOffset: '-12h',
    timestamp: '00:00 UTC',
    lat: 11.2,
    lng: 82.8,
    intensity: 'Cyclonic Storm',
    centralPressure: 988,
    maxWindSpeed: 85,
    status: 'Observed',
  },
  {
    timeOffset: '-6h',
    timestamp: '06:00 UTC',
    lat: 12.1,
    lng: 82.2,
    intensity: 'Severe Cyclonic Storm',
    centralPressure: 980,
    maxWindSpeed: 105,
    status: 'Observed',
  },
  {
    timeOffset: 'LIVE NOW',
    timestamp: '12:00 UTC',
    lat: 12.85,
    lng: 81.65,
    intensity: 'Very Severe Cyclonic Storm',
    centralPressure: 972,
    maxWindSpeed: 125,
    status: 'Observed',
  },
  {
    timeOffset: '+6h',
    timestamp: '18:00 UTC',
    lat: 13.25,
    lng: 81.1,
    intensity: 'Peak Intensity at Coastal Boundary',
    centralPressure: 968,
    maxWindSpeed: 135,
    status: 'Projected Landfall',
  },
  {
    timeOffset: '+12h',
    timestamp: '00:00 UTC (+1d)',
    lat: 13.65,
    lng: 80.5,
    intensity: 'Landfall Corridor (South Andhra/Chennai Coast)',
    centralPressure: 974,
    maxWindSpeed: 115,
    status: 'Projected Landfall',
  },
  {
    timeOffset: '+24h',
    timestamp: '12:00 UTC (+1d)',
    lat: 14.2,
    lng: 79.8,
    intensity: 'Deep Inland Depression',
    centralPressure: 990,
    maxWindSpeed: 65,
    status: 'Post-Landfall Depression',
  },
];

export const CycloneTrackerModal: React.FC<CycloneTrackerModalProps> = ({
  isOpen,
  onClose,
  onTrackOnMap,
}) => {
  const [activeStep, setActiveStep] = useState<number>(2); // Default to LIVE NOW
  const currentWaypoint = CYCLONE_TRAJECTORY_DATA[activeStep];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] glass-panel-elevated rounded-2xl border border-red-500/40 text-white flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-red-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-white">
                  Bay of Bengal Cyclone Trajectory & Wind Radii Radar
                </h3>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold uppercase tracking-wider animate-pulse">
                  IMD BULLETIN #07 • RED WARNING
                </span>
              </div>
              <div className="font-mono text-xs text-slate-300">
                Severe Cyclonic Storm "Michaung-9" • Eye ~95km ESE of Chennai Coast
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Cyclone Core Telemetry Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-900/60 border-b border-white/5 font-mono">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-red-500/20">
            <span className="text-[10px] text-slate-400 uppercase block">Central Barometric Pressure</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-white">{currentWaypoint.centralPressure}</span>
              <span className="text-xs text-red-400">hPa</span>
            </div>
            <span className="text-[10px] text-red-400 block mt-0.5">Rapid Deepening</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/20">
            <span className="text-[10px] text-slate-400 uppercase block">Max Sustained Winds</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-amber-300">{currentWaypoint.maxWindSpeed}</span>
              <span className="text-xs text-slate-400">km/h</span>
            </div>
            <span className="text-[10px] text-amber-400 block mt-0.5">Gusts to {currentWaypoint.maxWindSpeed + 25} km/h</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/20">
            <span className="text-[10px] text-slate-400 uppercase block">Storm Surge Potential</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-cyan-300">+1.8</span>
              <span className="text-xs text-slate-400">meters</span>
            </div>
            <span className="text-[10px] text-cyan-400 block mt-0.5">Above Astronomical Tide</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/20">
            <span className="text-[10px] text-slate-400 uppercase block">Movement Vector</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-purple-300">14</span>
              <span className="text-xs text-slate-400">km/h</span>
            </div>
            <span className="text-[10px] text-purple-400 block mt-0.5">Heading 335° NNW</span>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Timeline Track Stepper */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-300 uppercase tracking-wider font-semibold">
                Landfall Trajectory Waypoint Stepper:
              </span>
              <span className="text-red-400 font-bold">
                Selected: {currentWaypoint.timeOffset} ({currentWaypoint.timestamp})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {CYCLONE_TRAJECTORY_DATA.map((wp, idx) => {
                const isSelected = idx === activeStep;
                const isLive = wp.timeOffset === 'LIVE NOW';

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      soundFx.playClick();
                      setActiveStep(idx);
                    }}
                    className={`p-2.5 rounded-xl text-left font-mono transition-all border ${
                      isSelected
                        ? 'bg-red-500/25 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                        : isLive
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                        : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold">{wp.timeOffset}</span>
                      {isLive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                    </div>
                    <div className="text-xs font-bold mt-1 text-white truncate">
                      {wp.maxWindSpeed} km/h
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">
                      {wp.lat.toFixed(1)}°N, {wp.lng.toFixed(1)}°E
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wind Radii & Hazard Rings */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-3 font-mono">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Quadrant Wind Radii & Critical Impact Zones (R34, R50, R64):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 space-y-1">
                <span className="text-red-400 font-bold block">R64 Hurricane Force (64+ kts)</span>
                <span className="text-white text-base font-extrabold">Radius: 55 km</span>
                <p className="text-[10px] text-slate-400 font-sans">
                  Total structural damage to temporary roofs, uprooted trees, power line collapse.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 space-y-1">
                <span className="text-amber-400 font-bold block">R50 Storm Force (50+ kts)</span>
                <span className="text-white text-base font-extrabold">Radius: 110 km</span>
                <p className="text-[10px] text-slate-400 font-sans">
                  Extensive coastal road inundation, tidal backflow into Buckingham Canal.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/30 space-y-1">
                <span className="text-blue-400 font-bold block">R34 Gale Force (34+ kts)</span>
                <span className="text-white text-base font-extrabold">Radius: 185 km</span>
                <p className="text-[10px] text-slate-400 font-sans">
                  Widespread convective cloudburst bands across Chennai, Tiruvallur, and Kanchipuram.
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>IMD Doppler Radar Chennai (Karaikal & Sriharikota Synchronized)</span>
            </div>

            {onTrackOnMap && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onTrackOnMap([currentWaypoint.lng, currentWaypoint.lat]);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-600 hover:from-red-400 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-500/20 font-mono"
              >
                <span>Focus Eye on Digital Twin Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
