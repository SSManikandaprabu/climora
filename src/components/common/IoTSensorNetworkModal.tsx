import React, { useState, useEffect } from 'react';
import { X, Activity, Radio, AlertTriangle, CheckCircle2, ShieldAlert, Waves, Send, ArrowRight, RefreshCw } from 'lucide-react';
import { soundFx } from '../../utils/audioSynthesizer';

interface IoTSensorNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFocusSensorOnMap?: (coords: [number, number]) => void;
}

export interface IoTSensorNode {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  waterLevelMeters: number;
  warningLevelMeters: number;
  dangerLevelMeters: number;
  dischargeCusecs: number;
  status: 'Normal' | 'Watch' | 'Critical Danger';
  batteryPct: number;
  latencyMs: number;
  lastTransmission: string;
}

const INITIAL_SENSORS: IoTSensorNode[] = [
  {
    id: 'saidapet_bridge',
    name: 'Saidapet Causeway Ultrasonic Gauge',
    location: 'Adyar River (Chainage 14.2 km)',
    lat: 13.0102,
    lng: 80.2150,
    waterLevelMeters: 4.85,
    warningLevelMeters: 4.5,
    dangerLevelMeters: 6.0,
    dischargeCusecs: 14200,
    status: 'Watch',
    batteryPct: 94,
    latencyMs: 14,
    lastTransmission: '2s ago',
  },
  {
    id: 'kotturpuram_sluice',
    name: 'Kotturpuram Automated Sluice Regulator',
    location: 'Adyar River Outfall',
    lat: 13.0180,
    lng: 80.2420,
    waterLevelMeters: 5.4,
    warningLevelMeters: 4.8,
    dangerLevelMeters: 5.8,
    dischargeCusecs: 18500,
    status: 'Watch',
    batteryPct: 88,
    latencyMs: 22,
    lastTransmission: '1s ago',
  },
  {
    id: 'velachery_weir',
    name: 'Velachery Lake North Inflow Weir',
    location: 'Velachery Basin Outflow',
    lat: 12.9815,
    lng: 80.2180,
    waterLevelMeters: 3.42,
    warningLevelMeters: 2.8,
    dangerLevelMeters: 3.2,
    dischargeCusecs: 4800,
    status: 'Critical Danger',
    batteryPct: 91,
    latencyMs: 18,
    lastTransmission: 'Just now',
  },
  {
    id: 'chembarambakkam_dam',
    name: 'Chembarambakkam Reservoir Sluice Gate 4',
    location: 'Upstream Primary Reservoir',
    lat: 13.0080,
    lng: 80.0520,
    waterLevelMeters: 22.4,
    warningLevelMeters: 21.5,
    dangerLevelMeters: 24.0,
    dischargeCusecs: 8500,
    status: 'Watch',
    batteryPct: 99,
    latencyMs: 31,
    lastTransmission: '4s ago',
  },
  {
    id: 'buckingham_ennore',
    name: 'Buckingham Canal Ennore Tidal Surcharge Pole',
    location: 'Northern Tidal Channel',
    lat: 13.2050,
    lng: 80.3120,
    waterLevelMeters: 2.15,
    warningLevelMeters: 2.5,
    dangerLevelMeters: 3.5,
    dischargeCusecs: 3200,
    status: 'Normal',
    batteryPct: 96,
    latencyMs: 16,
    lastTransmission: '3s ago',
  },
];

export const IoTSensorNetworkModal: React.FC<IoTSensorNetworkModalProps> = ({
  isOpen,
  onClose,
  onFocusSensorOnMap,
}) => {
  const [sensors, setSensors] = useState<IoTSensorNode[]>(INITIAL_SENSORS);
  const [selectedSensorId, setSelectedSensorId] = useState<string>('velachery_weir');
  const [alertDispatched, setAlertDispatched] = useState<boolean>(false);

  // Simulate real-time sensor pulse jitter
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((s) => {
          const jitter = (Math.random() - 0.48) * 0.04;
          const nextLevel = Number((s.waterLevelMeters + jitter).toFixed(2));
          let nextStatus: IoTSensorNode['status'] = s.status;
          if (nextLevel >= s.dangerLevelMeters) nextStatus = 'Critical Danger';
          else if (nextLevel >= s.warningLevelMeters) nextStatus = 'Watch';
          else nextStatus = 'Normal';

          return {
            ...s,
            waterLevelMeters: nextLevel,
            status: nextStatus,
            lastTransmission: 'Just now',
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSensor = sensors.find((s) => s.id === selectedSensorId) || sensors[0];
  const levelRatio = Math.min(100, Math.round((currentSensor.waterLevelMeters / currentSensor.dangerLevelMeters) * 100));

  const handleDispatchEmergencyAlert = () => {
    soundFx.playRadarPing();
    setAlertDispatched(true);
    setTimeout(() => setAlertDispatched(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] glass-panel-elevated rounded-2xl border border-cyan-500/30 text-white flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-white">
                  IoT River Gauge & Automated Sluice Telemetry Network
                </h3>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                  5/5 AWS NODES LIVE
                </span>
              </div>
              <div className="font-mono text-xs text-slate-400">
                Ultrasonic stage gauges, automated discharge weirs & reservoir spillway telemetry
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

        {/* Master Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Column: Sensor Grid List */}
          <div className="w-full md:w-80 border-r border-white/10 overflow-y-auto p-3 space-y-2 bg-slate-950/40">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block px-1 mb-1 font-semibold">
              Live Sensor Poles:
            </span>

            {sensors.map((sensor) => {
              const isSelected = sensor.id === selectedSensorId;
              const isCritical = sensor.status === 'Critical Danger';
              const isWatch = sensor.status === 'Watch';

              return (
                <button
                  key={sensor.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedSensorId(sensor.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-white border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                      : 'bg-slate-900/40 text-slate-300 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-semibold text-xs tracking-wide truncate max-w-[190px]">
                      {sensor.name}
                    </span>
                    <span
                      className={`font-mono text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        isCritical
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                          : isWatch
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {sensor.status}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Stage: <strong className="text-white">{sensor.waterLevelMeters}m</strong></span>
                    <span>Q: {sensor.dischargeCusecs.toLocaleString()} cfs</span>
                  </div>

                  {/* Level gauge progress bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCritical ? 'bg-red-500' : isWatch ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, (sensor.waterLevelMeters / sensor.dangerLevelMeters) * 100)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Sensor Telemetry & Automated Emergency Trigger */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-900/30 font-mono">
            {/* Header of Active Sensor */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-lg text-white">
                    {currentSensor.name}
                  </h4>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Location: <span className="text-cyan-300">{currentSensor.location}</span> • {currentSensor.lat.toFixed(4)}°N, {currentSensor.lng.toFixed(4)}°E
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-slate-400 block">Transmission Health</span>
                <span className="text-emerald-400 font-bold">Latency: {currentSensor.latencyMs}ms</span>
                <span className="text-[10px] text-slate-500 block">Battery: {currentSensor.batteryPct}% (Solar AWS)</span>
              </div>
            </div>

            {/* Level Instrument Card */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Current Water Stage (Meters MSL)</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-4xl font-extrabold ${currentSensor.status === 'Critical Danger' ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                      {currentSensor.waterLevelMeters}
                    </span>
                    <span className="text-slate-400 text-sm">meters</span>
                    <span className="text-xs text-slate-500 ml-2">
                      Danger Threshold: <strong className="text-red-400">{currentSensor.dangerLevelMeters}m</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Discharge Rate</span>
                  <span className="text-2xl font-extrabold text-cyan-300">
                    {currentSensor.dischargeCusecs.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-xs ml-1">cusecs</span>
                </div>
              </div>

              {/* Hydrograph Visual Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Normal (0.0m)</span>
                  <span>Warning ({currentSensor.warningLevelMeters}m)</span>
                  <span>Extreme Overtopping ({currentSensor.dangerLevelMeters}m)</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      currentSensor.status === 'Critical Danger'
                        ? 'bg-gradient-to-r from-amber-500 to-red-500'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                    }`}
                    style={{ width: `${levelRatio}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Automated Dispatch Trigger Action */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Automated Flood Early Warning & Sluice Actuation:
              </span>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-300">
                  {currentSensor.status === 'Critical Danger' ? (
                    <span className="text-red-400 font-bold block flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                      Automatic Trigger Threshold Exceeded! Downstream low sumps at risk.
                    </span>
                  ) : (
                    <span className="text-slate-400 block">
                      Discharge channels operating within hydraulic gravity clearance.
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500">
                    Simulates dispatching SMS and radio broadcast to GCC Ward engineers.
                  </span>
                </div>

                <button
                  onClick={handleDispatchEmergencyAlert}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all shadow-lg flex items-center gap-2 whitespace-nowrap ${
                    alertDispatched
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-red-500 to-amber-600 hover:from-red-400 hover:to-amber-500 text-white shadow-red-500/20'
                  }`}
                >
                  {alertDispatched ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Alert Dispatched to GCC 1913</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Dispatch Ward Siren Alert</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Focus on Digital Twin Map Button */}
            {onFocusSensorOnMap && (
              <div className="flex justify-end pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onFocusSensorOnMap([currentSensor.lng, currentSensor.lat]);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white transition-colors"
                >
                  <span>Focus sensor pole on Digital Twin Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
