import React, { useState } from 'react';
import { X, Navigation, ShieldCheck, LifeBuoy, PhoneCall, Activity, CheckCircle2, AlertTriangle, ArrowRight, Home, Users, Fuel } from 'lucide-react';
import { CHENNAI_RELIEF_SHELTERS } from '../../data/chennaiGeoData';
import type { ReliefShelter } from '../../types/climate';
import { soundFx } from '../../utils/audioSynthesizer';

interface EvacuationRoutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShelter?: (shelter: ReliefShelter) => void;
}

export const EvacuationRoutesModal: React.FC<EvacuationRoutesModalProps> = ({
  isOpen,
  onClose,
  onSelectShelter,
}) => {
  const [selectedShelterId, setSelectedShelterId] = useState<string>(CHENNAI_RELIEF_SHELTERS[0].id);

  if (!isOpen) return null;

  const currentShelter = CHENNAI_RELIEF_SHELTERS.find((s) => s.id === selectedShelterId) || CHENNAI_RELIEF_SHELTERS[0];
  const totalCapacity = CHENNAI_RELIEF_SHELTERS.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupancy = CHENNAI_RELIEF_SHELTERS.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const aggregateOccupancyPct = Math.round((totalOccupancy / totalCapacity) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] glass-panel-elevated rounded-2xl border border-emerald-500/30 text-white flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header Bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-white">
                  Chennai Emergency Evacuation & Relief Shelter Command
                </h3>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                  NDRF & GCC 1913 ACTIVE
                </span>
              </div>
              <div className="font-mono text-xs text-slate-400">
                High-ground topographical refuges, emergency corridors & water rescue staging nodes
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

        {/* Global Summary Statistics Deck */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-900/40 border-b border-white/5 font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Total Refuge Capacity</span>
            <span className="text-lg font-bold text-white">{totalCapacity.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 block">5 Major Regional Hubs</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Current Sheltered</span>
            <span className="text-lg font-bold text-cyan-300">{totalOccupancy.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block">{aggregateOccupancyPct}% Aggregated Load</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">NDRF Boat Readiness</span>
            <span className="text-lg font-bold text-blue-400">56 Boats</span>
            <span className="text-[10px] text-emerald-400 block">100% Deployed / Standby</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Emergency Medical Teams</span>
            <span className="text-lg font-bold text-purple-300">169 Staff</span>
            <span className="text-[10px] text-purple-400 block">Trauma & Waterborne Care</span>
          </div>
        </div>

        {/* Modal Main Content: List on Left, Active Shelter Details on Right */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Column: Shelters Selector List */}
          <div className="w-full md:w-80 border-r border-white/10 overflow-y-auto p-3 space-y-2 bg-slate-950/40">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block px-1 mb-1 font-semibold">
              Designated Safe Havens
            </span>
            {CHENNAI_RELIEF_SHELTERS.map((shelter) => {
              const isSelected = shelter.id === selectedShelterId;
              const occupancyPct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);

              return (
                <button
                  key={shelter.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedShelterId(shelter.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-emerald-500/20 text-white border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'bg-slate-900/40 text-slate-300 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-semibold text-xs tracking-wide truncate max-w-[190px]">
                      {shelter.name}
                    </span>
                    <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-bold">
                      +{shelter.elevation}m MSL
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{shelter.currentOccupancy.toLocaleString()} / {shelter.capacity.toLocaleString()}</span>
                    <span className={occupancyPct > 80 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                      {occupancyPct}% Load
                    </span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occupancyPct > 80 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Hub Telemetry */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-900/30">
            {/* Header of Active Shelter */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-lg text-white">
                    {currentShelter.name}
                  </h4>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      currentShelter.status === 'Operational'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {currentShelter.status}
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-400 mt-0.5">
                  Category: <span className="text-emerald-400 font-semibold">{currentShelter.category}</span> • Coordinates: {currentShelter.lat.toFixed(4)}°N, {currentShelter.lng.toFixed(4)}°E
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block uppercase">Elevation Clearance</span>
                <span className="text-xl font-bold text-emerald-300">+{currentShelter.elevation}m MSL</span>
                <span className="text-[10px] text-slate-500 block">High Above Flood Inundation</span>
              </div>
            </div>

            {/* Occupancy Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-400" /> Refuge Capacity Utilization
                </span>
                <span className="font-bold text-white">
                  {currentShelter.currentOccupancy.toLocaleString()} of {currentShelter.capacity.toLocaleString()} beds occupied
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(currentShelter.currentOccupancy / currentShelter.capacity) * 100}%` }}
                />
              </div>
            </div>

            {/* Tactical Supplies & Resources Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 font-mono">
                <span className="text-[10px] text-slate-400 block">Potable Water Reserve</span>
                <span className="text-base font-bold text-cyan-300">{currentShelter.supplies.cleanWaterDays} Days</span>
                <span className="text-[9px] text-slate-500 block">Gravity filtration</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 font-mono">
                <span className="text-[10px] text-slate-400 block">Auxiliary Power</span>
                <span className="text-base font-bold text-emerald-400">
                  {currentShelter.supplies.powerGenerators ? 'Dual Diesel Gensets' : 'Grid Only'}
                </span>
                <span className="text-[9px] text-slate-500 block">48h continuous fuel</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 font-mono">
                <span className="text-[10px] text-slate-400 block">Medical Personnel</span>
                <span className="text-base font-bold text-purple-300">{currentShelter.supplies.medicalStaff} Specialists</span>
                <span className="text-[9px] text-slate-500 block">24/7 Triage unit</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 font-mono">
                <span className="text-[10px] text-slate-400 block">Rescue Boat Fleet</span>
                <span className="text-base font-bold text-blue-400">{currentShelter.supplies.rescueBoats} Inflatables</span>
                <span className="text-[9px] text-slate-500 block">Motorized outboard</span>
              </div>
            </div>

            {/* Connected Flood Sump Zones */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                Designated Evacuation Reception for Inundation Basins:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentShelter.connectedZones.map((zone, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    ✓ {zone}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency Hotline Dispatch Contact */}
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />
                <div>
                  <div className="font-mono text-xs font-bold text-white">Direct EOC Hotline:</div>
                  <div className="font-mono text-xs text-emerald-300">{currentShelter.contact}</div>
                </div>
              </div>

              {onSelectShelter && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onSelectShelter(currentShelter);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/50 text-xs font-mono font-bold transition-all shadow-md"
                >
                  <span>Locate on Digital Twin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
