import React, { useEffect, useState } from 'react';
import { FastForward, Radio, ShieldCheck } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Stage progression
    const timer1 = setTimeout(() => setStage(1), 400); // Logo reveal
    const timer2 = setTimeout(() => setStage(2), 1200); // Rings & Scanline
    const timer3 = setTimeout(() => setStage(3), 2000); // Mission text reveal
    const timer4 = setTimeout(() => setStage(4), 3200); // Transition out
    const timer5 = setTimeout(() => {
      localStorage.setItem('climora_intro_completed', 'true');
      onComplete();
    }, 4000);

    // Progress counter
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 90);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  const handleSkip = () => {
    localStorage.setItem('climora_intro_completed', 'true');
    onComplete();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050811] text-white transition-opacity duration-1000 select-none ${
        stage === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Subtle Grid & Radial Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Atmospheric Scanning Laser Beam */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanline opacity-60" />
      </div>

      {/* Center Cinematic Container */}
      <div className="relative flex flex-col items-center text-center z-10 max-w-xl px-6">
        {/* Animated Concentric Atmospheric Rings & Globe Emblem */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          {/* Ring 1 - Outer Atmospheric Ring */}
          <div
            className={`absolute inset-0 rounded-full border border-cyan-400/20 transition-all duration-1000 ${
              stage >= 2 ? 'scale-100 opacity-100 animate-[spin_18s_linear_infinite]' : 'scale-50 opacity-0'
            }`}
          >
            {/* Satellite Beacon Dot */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </div>

          {/* Ring 2 - Middle Orbital Ring */}
          <div
            className={`absolute inset-3 rounded-full border border-dashed border-purple-400/30 transition-all duration-1000 delay-150 ${
              stage >= 2 ? 'scale-100 opacity-100 animate-[spin_12s_linear_infinite_reverse]' : 'scale-75 opacity-0'
            }`}
          >
            {/* Satellite Marker */}
            <div className="absolute bottom-2 right-4 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#8b5cf6]" />
          </div>

          {/* Ring 3 - Inner Horizon Glow */}
          <div
            className={`absolute inset-7 rounded-full border border-cyan-400/40 bg-gradient-to-b from-cyan-500/10 to-transparent transition-all duration-1000 ${
              stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
          />

          {/* Central ClimateTwin X Emblem */}
          <div
            className={`relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#09152a] to-[#0d2242] border border-cyan-400/50 flex items-center justify-center shadow-[0_0_35px_rgba(34,211,238,0.35)] transition-all duration-1000 ${
              stage >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <span className="font-heading font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-400 tracking-tighter">
              CTX
            </span>
          </div>
        </div>

        {/* Brand & Mission Text Reveal */}
        <div
          className={`space-y-3 transition-all duration-700 ${
            stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
              ClimateTwin <span className="text-cyan-400">X</span>
            </h1>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
              Global Intelligence
            </span>
          </div>

          <p
            className={`text-slate-300 font-sans text-sm sm:text-base font-light tracking-wide transition-all duration-700 delay-200 ${
              stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            Understanding our planet. Predicting our future.
          </p>

          <div
            className={`flex items-center justify-center gap-2 text-xs font-mono text-cyan-400/90 pt-1 transition-all duration-700 delay-300 ${
              stage >= 2 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>CONNECTING LIVE ORBITAL TELEMETRY [ERA5 • GPM • SENTINEL-2]</span>
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-64 h-1 bg-slate-900 rounded-full mt-8 overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="font-mono text-[10px] text-slate-500 mt-2">
          Initializing Digital Twin Command Core... {Math.round(progress)}%
        </div>
      </div>

      {/* Skip Intro Button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 flex items-center gap-1.5 px-4 py-2 rounded-xl glass-panel hover:border-cyan-500/50 text-slate-400 hover:text-white font-mono text-xs transition-all tracking-wider uppercase z-20 group"
      >
        <span>Skip Sequence</span>
        <FastForward className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
