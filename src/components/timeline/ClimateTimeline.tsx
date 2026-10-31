import React, { useState, useEffect } from 'react';
import type { TimelinePoint } from '../../types/climate';
import { TIMELINE_POINTS } from '../../data/climateScenarios';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface ClimateTimelineProps {
  currentPoint: TimelinePoint;
  onSelectPoint: (point: TimelinePoint) => void;
}

export const ClimateTimeline: React.FC<ClimateTimelineProps> = ({
  currentPoint,
  onSelectPoint,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const currentIndex = TIMELINE_POINTS.findIndex((p) => p.id === currentPoint.id);
      const nextIndex = (currentIndex + 1) % TIMELINE_POINTS.length;
      onSelectPoint(TIMELINE_POINTS[nextIndex]);
    }, 3200);

    return () => clearInterval(interval);
  }, [isPlaying, currentPoint, onSelectPoint]);

  const handleStep = (direction: 'prev' | 'next') => {
    const currentIndex = TIMELINE_POINTS.findIndex((p) => p.id === currentPoint.id);
    if (direction === 'prev') {
      const prevIndex = (currentIndex - 1 + TIMELINE_POINTS.length) % TIMELINE_POINTS.length;
      onSelectPoint(TIMELINE_POINTS[prevIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % TIMELINE_POINTS.length;
      onSelectPoint(TIMELINE_POINTS[nextIndex]);
    }
  };

  return (
    <div className="glass-panel px-4 py-3 rounded-2xl border border-cyan-500/20 text-white shadow-2xl backdrop-blur-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Playback Controls & Selected Label */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/10">
            <button
              onClick={() => handleStep('prev')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Previous Time Slice"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1.5 rounded-lg transition-colors ${
                isPlaying ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title={isPlaying ? 'Pause Playback' : 'Play Timeline'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => handleStep('next')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Next Time Slice"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-xs text-white">
                {currentPoint.label}
              </span>
              <span
                className={`font-mono text-[9px] px-1.5 py-0.2 rounded uppercase font-bold tracking-wider ${
                  currentPoint.type === 'live'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                    : currentPoint.type === 'historical'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                }`}
              >
                {currentPoint.type}
              </span>
            </div>
            <div className="font-mono text-[10px] text-slate-400">{currentPoint.date}</div>
          </div>
        </div>

        {/* Timeline Scrubbing Nodes Bar */}
        <div className="flex-1 max-w-xl mx-2 flex items-center justify-between relative px-2">
          {/* Connecting track line */}
          <div className="absolute left-4 right-4 h-0.5 bg-slate-800 top-1/2 -translate-y-1/2 -z-0" />

          {TIMELINE_POINTS.map((pt) => {
            const isSelected = pt.id === currentPoint.id;
            return (
              <button
                key={pt.id}
                onClick={() => {
                  setIsPlaying(false);
                  onSelectPoint(pt);
                }}
                className="relative z-10 flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                    isSelected
                      ? 'bg-cyan-400 border-white scale-125 shadow-[0_0_10px_#22d3ee]'
                      : pt.type === 'live'
                      ? 'bg-cyan-600 border-cyan-400'
                      : 'bg-slate-900 border-slate-700 group-hover:border-slate-400'
                  }`}
                />
                <span
                  className={`text-[9px] font-mono mt-1 whitespace-nowrap hidden sm:block ${
                    isSelected ? 'text-cyan-300 font-bold' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  {pt.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Narrative & Metrics Pill */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono pl-3 border-l border-white/10 max-w-sm">
          <p className="text-slate-300 text-[10px] line-clamp-2 leading-tight">
            {currentPoint.narrative}
          </p>
          <div className="text-right flex-shrink-0">
            <span className="text-cyan-300 font-bold block">{currentPoint.temp}°C</span>
            <span className="text-slate-400 text-[10px]">{currentPoint.rainfall} mm</span>
          </div>
        </div>
      </div>
    </div>
  );
};
