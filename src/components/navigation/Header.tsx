import React, { useState, useEffect } from 'react';
import type { CityData, ViewMode } from '../../types/climate';
import { GLOBAL_CITIES } from '../../data/citiesData';
import { soundFx } from '../../utils/audioSynthesizer';
import { Search, Bell, Radio, MapPin, RefreshCw, Volume2, VolumeX, FileText } from 'lucide-react';

interface HeaderProps {
  selectedCity: CityData;
  onSelectCity: (city: CityData) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onOpenSearch: () => void;
  onToggleNotifications: () => void;
  onOpenDossier: () => void;
  unreadCount?: number;
  onReplayIntro: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  viewMode,
  onChangeViewMode,
  onOpenSearch,
  onToggleNotifications,
  onOpenDossier,
  unreadCount = 2,
  onReplayIntro,
}) => {
  const [currentTimeUTC, setCurrentTimeUTC] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeUTC(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (!next) {
      soundFx.playRadarPing();
      soundFx.startAmbientHum();
    }
  };

  return (
    <header className="h-16 px-4 md:px-6 border-b border-cyan-500/15 glass-panel flex items-center justify-between select-none z-30">
      {/* Brand & Edition */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            soundFx.playClick();
            onChangeViewMode('globe');
          }}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-[#09152a] to-[#0d2242] border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.25)] group-hover:scale-105 transition-transform">
            <span className="font-heading font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 tracking-tighter">
              CTX
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                ClimateTwin <span className="text-cyan-400">X</span>
              </span>
              <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest hidden sm:inline">
                Global Intelligence
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[10px] text-slate-400 font-mono hidden md:block">
                See the Future of Your City
              </div>
              <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest hidden xl:inline">
                MODE: {viewMode.toUpperCase()}
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Center: City Selector & Search Button */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* City Dropdown Selector */}
        <div className="relative flex items-center glass-panel px-3 py-1.5 rounded-xl border border-white/10 hover:border-cyan-500/40 transition-colors">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-2 flex-shrink-0" />
          <select
            value={selectedCity.id}
            onChange={(e) => {
              soundFx.playClick();
              const city = GLOBAL_CITIES.find((c) => c.id === e.target.value);
              if (city) onSelectCity(city);
            }}
            className="bg-transparent text-xs font-mono text-white focus:outline-none cursor-pointer pr-4 font-semibold"
          >
            {GLOBAL_CITIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                {c.name}, {c.country} ({c.riskScore}/100)
              </option>
            ))}
          </select>
        </div>

        {/* Global Search Trigger (Cmd + K) */}
        <button
          onClick={() => {
            soundFx.playClick();
            onOpenSearch();
          }}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-slate-400 hover:text-white hover:border-cyan-500/40 text-xs font-mono transition-all"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px]">Search zones, sensors, data...</span>
          <kbd className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Audio, Dossier, Telemetry Health, Notifications, User */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Telemetry Audio Synth Toggle */}
        <button
          onClick={handleToggleSound}
          title={isMuted ? 'Enable Scientific Audio Telemetry' : 'Mute Audio Telemetry'}
          className={`p-2 rounded-xl transition-colors ${
            !isMuted
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
              : 'glass-panel text-slate-400 hover:text-white border border-white/10'
          }`}
        >
          {!isMuted ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Executive Dossier Generator Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onOpenDossier();
          }}
          title="Open Executive Climate Dossier"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-semibold transition-all shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span>Executive Dossier</span>
        </button>

        {/* Connection Health Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-white/5 font-mono text-[11px] text-slate-400">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Tele-sync: <strong className="text-white">99.98%</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-300">{currentTimeUTC}</span>
        </div>

        {/* Replay Intro Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onReplayIntro();
          }}
          title="Replay Cinematic Intro"
          className="p-2 rounded-xl glass-panel text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors hidden sm:flex items-center justify-center"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notifications Trigger with Count */}
        <button
          onClick={() => {
            soundFx.playClick();
            onToggleNotifications();
          }}
          className="relative p-2 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
          title="Active Hazard Bulletins"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-mono text-[9px] flex items-center justify-center font-bold animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 border border-cyan-400/50 flex items-center justify-center font-bold text-xs text-white">
            AR
          </div>
          <div className="hidden xl:block text-left font-mono">
            <div className="text-xs font-semibold text-white leading-tight">Dr. A. Ramanathan</div>
            <div className="text-[10px] text-slate-400">Senior Climate Strategist</div>
          </div>
        </div>
      </div>
    </header>
  );
};
