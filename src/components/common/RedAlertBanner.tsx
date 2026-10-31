import React, { useEffect, useState } from 'react';
import { AlertOctagon, Volume2, ShieldAlert, Radio, Compass, X, Play, BellRing } from 'lucide-react';
import { soundFx } from '../../utils/audioSynthesizer';

interface RedAlertBannerProps {
  isActive: boolean;
  onDeactivate: () => void;
  onOpenEvacuation: () => void;
  onOpenCyclone: () => void;
  cityName?: string;
}

export const RedAlertBanner: React.FC<RedAlertBannerProps> = ({
  isActive,
  onDeactivate,
  onOpenEvacuation,
  onOpenCyclone,
  cityName = 'Chennai',
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20539); // ~5h 42m

  useEffect(() => {
    if (!isActive) return;

    // Trigger siren tone on activation
    soundFx.playEmergencySiren();
    soundFx.speakEmergencyWarning(
      `Red Alert Protocol Active. Severe storm landfall warning for ${cityName}. Evacuation corridors are open.`
    );

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, cityName]);

  if (!isActive) return null;

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  const countdownFormatted = `T-${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <>
      {/* FULL-SCREEN STROBE RED VIGNETTE (NON-BLOCKING) */}
      <div 
        className="fixed inset-0 pointer-events-none z-[80] animate-pulse transition-opacity duration-500"
        style={{
          boxShadow: 'inset 0 0 100px 30px rgba(239, 68, 68, 0.4)',
        }}
      />

      {/* TOP EMERGENCY MARQUEE BANNER */}
      <div className="relative z-[90] w-full bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border-b-2 border-red-500 text-white shadow-2xl px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Critical Badge & Countdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-red-600 font-mono text-xs font-black tracking-wider uppercase animate-bounce">
            <AlertOctagon className="w-4 h-4" />
            RED ALERT LEVEL-4
          </div>

          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold text-red-200 bg-red-950/80 px-2.5 py-1 rounded border border-red-500/40">
            <span className="text-red-400">EST. LANDFALL:</span>
            <span className="text-red-100 font-black tracking-widest">{countdownFormatted}</span>
          </div>
        </div>

        {/* Center: Live Marquee Alert Broadcast */}
        <div className="hidden md:flex flex-1 mx-4 overflow-hidden py-0.5">
          <div className="whitespace-nowrap animate-marquee font-mono text-xs text-red-100 font-semibold tracking-wide flex items-center gap-6">
            <span className="flex items-center gap-1 text-red-300 font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" /> GCC COMMAND DIRECTIVE:
            </span>
            <span>SEVERE CYCLONIC STORM MICHAUNG ADVANCING AT 18 KM/H // SUSTAINED GALE WINDS 125 KM/H // ALL LOW-LYING BASINS (VELACHERY, PALLIKARANAI, MADIPAKKAM) UNDER MANDATORY EVACUATION PROTOCOL // 5 EMERGENCY HIGH-GROUND SANCTUARIES ACTIVE // PUMPING STATIONS AT MAXIMUM 150 MLD DISCHARGE</span>
          </div>
        </div>

        {/* Right: Tactical Action Controls */}
        <div className="flex items-center gap-2">
          {/* Siren Replay */}
          <button
            onClick={() => {
              soundFx.playEmergencySiren();
            }}
            title="Sound Emergency Siren"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-800/80 hover:bg-red-700 text-red-100 border border-red-500/50 text-xs font-mono transition-colors"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Siren</span>
          </button>

          {/* Voice Broadcast */}
          <button
            onClick={() => {
              soundFx.speakEmergencyWarning(
                `Attention. Severe cyclonic storm approaching ${cityName}. Inundation warning active. Evacuate low-lying areas immediately.`
              );
            }}
            title="Broadcast Voice Advisory"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-800/80 hover:bg-red-700 text-red-100 border border-red-500/50 text-xs font-mono transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice</span>
          </button>

          {/* Open Shelters */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenEvacuation();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold transition-colors shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Shelters (E)
          </button>

          {/* Open Cyclone Radar */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenCyclone();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-mono text-xs font-bold transition-colors shadow-sm"
          >
            <Compass className="w-3.5 h-3.5" />
            Radar (C)
          </button>

          {/* Stand Down */}
          <button
            onClick={() => {
              soundFx.playClick();
              onDeactivate();
            }}
            title="Stand Down Red Alert (R)"
            className="p-1.5 rounded-lg bg-red-950 hover:bg-red-800 text-red-300 hover:text-white border border-red-500/40 transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};
