import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, X, Compass, Radio, ShieldAlert, Eye, Volume2, FastForward } from 'lucide-react';
import { soundFx } from '../../utils/audioSynthesizer';
import type { CityData } from '../../types/climate';

export interface TourWaypoint {
  id: string;
  name: string;
  zone: string;
  lng: number;
  lat: number;
  zoom: number;
  pitch: number;
  bearing: number;
  elevationM: number;
  riskScore: number;
  telemetry: string;
  narrative: string;
  countermeasure: string;
}

const CHENNAI_TOUR_WAYPOINTS: TourWaypoint[] = [
  {
    id: 'central-cooum',
    name: 'Ripon Civic HQ & Chennai Central',
    zone: 'Zone 05 (Royapuram)',
    lng: 80.2750,
    lat: 13.0827,
    zoom: 15.2,
    pitch: 62,
    bearing: 35,
    elevationM: 4.8,
    riskScore: 68,
    telemetry: 'Water Table: -1.2m | Drainage Sluice: Active',
    narrative: 'Primary municipal civic command centre and metropolitan transit artery. North Buckingham canal outfall confluence.',
    countermeasure: 'Automatic flood barrier gates along Buckingham canal crossing.'
  },
  {
    id: 'napier-estuary',
    name: 'Napier Bridge & Cooum River Mouth',
    zone: 'Zone 09 (Teynampet)',
    lng: 80.2858,
    lat: 13.0694,
    zoom: 15.6,
    pitch: 66,
    bearing: 115,
    elevationM: 1.5,
    riskScore: 85,
    telemetry: 'Tidal Fluctuation: +1.4m MSL | Sandbar Depth: 0.8m',
    narrative: 'High-vulnerability delta mouth where the Cooum River meets the Bay of Bengal. Tidal backflow during cyclone storm surges.',
    countermeasure: 'Active sandbar dredging and automated sea-surge tidal gates.'
  },
  {
    id: 'saidapet-adyar',
    name: 'Saidapet Bridge & Adyar River Corridor',
    zone: 'Zone 10 (Kodambakkam)',
    lng: 80.2225,
    lat: 13.0180,
    zoom: 14.8,
    pitch: 60,
    bearing: 215,
    elevationM: 5.2,
    riskScore: 88,
    telemetry: 'Gauge Height: 3.4m | Discharge: 22,000 cusecs',
    narrative: 'Major river corridor carrying surplus releases from Chembarambakkam Reservoir. Historical choke point during 2015 deluge.',
    countermeasure: 'Ultrasonic IoT river gauge array and embankment widening.'
  },
  {
    id: 'velachery-sump',
    name: 'Velachery MRTS & Vijayanagar Sump',
    zone: 'Zone 13 (Adyar South)',
    lng: 80.2180,
    lat: 12.9815,
    zoom: 15.8,
    pitch: 65,
    bearing: 175,
    elevationM: 3.2,
    riskScore: 94,
    telemetry: 'Inundation Hazard: Critical | Basin Outfall: Constricted',
    narrative: 'Depression basin receiving runoff from higher southern plateaus. Dense urban development over historical lake fringe.',
    countermeasure: '150 MLD strategic mobile heavy pumping and stormwater canal desilting.'
  },
  {
    id: 'pallikaranai-marsh',
    name: 'Pallikaranai Wetland & OMR Corridor',
    zone: 'Zone 14 (Perungudi)',
    lng: 80.2137,
    lat: 12.9349,
    zoom: 14.4,
    pitch: 56,
    bearing: 198,
    elevationM: 1.8,
    riskScore: 96,
    telemetry: 'Marsh Retention: 4.2M m³ | Buffer Deficit: -78%',
    narrative: 'The vital natural sponge wetland of South Chennai buffering a 250 sq km catchment basin. Critical ecological lifeline.',
    countermeasure: '1,200 Hectare ecological wetland sponge revival and radial road culverts.'
  }
];

const ROTTERDAM_TOUR_WAYPOINTS: TourWaypoint[] = [
  {
    id: 'kop-van-zuid',
    name: 'Kop van Zuid & De Rotterdam Tower',
    zone: 'Rotterdam Port Core',
    lng: 4.4925,
    lat: 51.9054,
    zoom: 15.4,
    pitch: 64,
    bearing: 40,
    elevationM: -0.5,
    riskScore: 68,
    telemetry: 'North Sea Surge: +1.2m NAP | Dike Elevation: +4.5m',
    narrative: 'Ultra-modern riverfront district built on reclaimed port quays. Dike-protected outer polder.',
    countermeasure: 'Erasmus bridge storm retaining wall.'
  },
  {
    id: 'maeslant-barrier',
    name: 'Maeslantkering Storm Surge Barrier',
    zone: 'Nieuwe Waterweg',
    lng: 4.1648,
    lat: 51.9542,
    zoom: 14.8,
    pitch: 58,
    bearing: 280,
    elevationM: 5.5,
    riskScore: 50,
    telemetry: 'Barrier Status: Armed | Trigger Threshold: +3.0m NAP',
    narrative: 'World largest automated movable flood barrier protecting Rotterdam and 2 million residents.',
    countermeasure: 'Twin 210m floating hollow steel sector gates.'
  }
];

interface CinematicDroneTourProps {
  isActive: boolean;
  onClose: () => void;
  onFlyTo: (wp: TourWaypoint) => void;
  city: CityData;
}

export const CinematicDroneTour: React.FC<CinematicDroneTourProps> = ({
  isActive,
  onClose,
  onFlyTo,
  city,
}) => {
  const waypoints = city.id === 'rotterdam' ? ROTTERDAM_TOUR_WAYPOINTS : CHENNAI_TOUR_WAYPOINTS;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeWaypoint = waypoints[currentIndex];

  // Fly to initial waypoint on mount
  useEffect(() => {
    if (!isActive) return;
    setCurrentIndex(0);
    setIsPlaying(true);
    onFlyTo(waypoints[0]);
    soundFx.speakEmergencyWarning(`Initiating autonomous aerial drone patrol for ${city.name}.`);
  }, [isActive, city.id]);

  // Automated progression timer
  useEffect(() => {
    if (!isActive || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalTime = Math.max(4000, 9000 / speedMultiplier);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % waypoints.length;
        onFlyTo(waypoints[next]);
        soundFx.playRadarPing();
        return next;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPlaying, currentIndex, speedMultiplier, waypoints]);

  if (!isActive) return null;

  const handleNext = () => {
    soundFx.playClick();
    const next = (currentIndex + 1) % waypoints.length;
    setCurrentIndex(next);
    onFlyTo(waypoints[next]);
  };

  const handlePrev = () => {
    soundFx.playClick();
    const prev = (currentIndex - 1 + waypoints.length) % waypoints.length;
    setCurrentIndex(prev);
    onFlyTo(waypoints[prev]);
  };

  const handleTogglePlay = () => {
    soundFx.playClick();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6 select-none">
      
      {/* CINEMATIC WIDESCREEN TOP MATTE */}
      <div className="w-full pointer-events-auto flex items-center justify-between bg-slate-950/85 backdrop-blur-md px-4 sm:px-6 py-2.5 rounded-2xl border border-cyan-500/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 font-mono text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            AUTONOMOUS PATROL DRONE
          </div>
          <span className="hidden sm:inline font-mono text-xs text-slate-300">
            Waypoint <strong className="text-white font-bold">{currentIndex + 1}</strong> of {waypoints.length}
          </span>
        </div>

        {/* Stepper Dots */}
        <div className="flex items-center gap-1.5">
          {waypoints.map((wp, i) => (
            <button
              key={wp.id}
              onClick={() => {
                soundFx.playClick();
                setCurrentIndex(i);
                onFlyTo(waypoints[i]);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-6 bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={wp.name}
            />
          ))}
        </div>

        {/* Exit Tour */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors border border-white/10"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Tour</span>
        </button>
      </div>

      {/* CENTER FLOATING RETICLE HUD */}
      <div className="self-center hidden md:flex items-center justify-center opacity-40 pointer-events-none">
        <div className="w-36 h-36 border border-cyan-400/40 rounded-full flex items-center justify-center relative">
          <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
          <div className="w-full h-[1px] bg-cyan-400/30" />
          <div className="h-full w-[1px] bg-cyan-400/30 absolute" />
        </div>
      </div>

      {/* BOTTOM TELEMETRY CARD & CONTROLS */}
      <div className="w-full max-w-2xl self-center pointer-events-auto bg-slate-950/90 backdrop-blur-md rounded-2xl border border-cyan-500/40 p-4 sm:p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3 mb-3">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{activeWaypoint.zone}</div>
            <h3 className="text-base sm:text-lg font-bold font-space text-white">{activeWaypoint.name}</h3>
            <div className="text-xs font-mono text-slate-400 mt-0.5">{activeWaypoint.telemetry}</div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Elevation</div>
              <div className="text-sm font-mono font-bold text-purple-300">{activeWaypoint.elevationM}m MSL</div>
            </div>
            <div className="h-7 w-[1px] bg-slate-800" />
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Risk Index</div>
              <div className="text-sm font-mono font-bold text-red-400">{activeWaypoint.riskScore}/100</div>
            </div>
          </div>
        </div>

        {/* Narrative & Countermeasure */}
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          {activeWaypoint.narrative}
        </p>

        <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-xs font-mono text-cyan-200 mb-4 flex items-center gap-2">
          <span className="font-bold text-cyan-400 flex-shrink-0">Countermeasure:</span>
          <span className="truncate">{activeWaypoint.countermeasure}</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              title="Previous Waypoint"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-white/5"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-600/30"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={handleNext}
              title="Next Waypoint"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-white/5"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Toggle */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSpeedMultiplier(speedMultiplier === 1 ? 2 : 1);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-white/10"
          >
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>{speedMultiplier}x Speed</span>
          </button>
        </div>
      </div>

    </div>
  );
};
