import React, { useState, useRef } from 'react';
import { X, History, ArrowLeftRight, Layers, Trees, Building, Droplets, AlertTriangle } from 'lucide-react';
import { soundFx } from '../../utils/audioSynthesizer';

interface SatelliteTimeLapseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LocationPreset {
  id: string;
  name: string;
  wetland2000: string;
  wetland2026: string;
  pervious2000: string;
  pervious2026: string;
  impervious2000: string;
  impervious2026: string;
  description: string;
}

const PRESETS: LocationPreset[] = [
  {
    id: 'pallikaranai',
    name: 'Pallikaranai Wetland & OMR IT Corridor',
    wetland2000: '50.0 km²',
    wetland2026: '4.3 km² (-91.4%)',
    pervious2000: '74% soil sponge',
    pervious2026: '16% remaining sponge',
    impervious2000: '26% built-up',
    impervious2026: '84% concrete & glass',
    description: 'Chennai’s primary natural flood basin was encroached by IT expressways, SEZ complexes, and landfill zones, cutting stormwater buffering by over 90%.',
  },
  {
    id: 'velachery',
    name: 'Velachery Lake & MRTS Catchment',
    wetland2000: '265 acres water spread',
    wetland2026: '55 acres (-79.2%)',
    pervious2000: '68% open ground',
    pervious2026: '12% open ground',
    impervious2000: '32% built-up',
    impervious2026: '88% high-density urban',
    description: 'Natural drainage channels connecting Velachery Lake to the marsh were paved over for transit corridors and low-lying residential developments.',
  },
  {
    id: 'omr',
    name: 'Sholinganallur & Perumbakkam IT SEZ',
    wetland2000: 'Abundant agricultural sumps',
    wetland2026: 'Dense concrete IT towers',
    pervious2000: '82% agricultural/wet',
    pervious2026: '19% open soil',
    impervious2000: '18% paved',
    impervious2026: '81% paved & arterial roads',
    description: 'Massive tech park boom over former flood basins transformed low-lying agricultural sinks into critical high-exposure economic zones.',
  },
];

export const SatelliteTimeLapseModal: React.FC<SatelliteTimeLapseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100
  const [activePresetId, setActivePresetId] = useState<string>('pallikaranai');
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  if (!isOpen) return null;

  const currentPreset = PRESETS.find((p) => p.id === activePresetId) || PRESETS[0];

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    setSliderPos((x / rect.width) * 100);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      onPointerUp={handlePointerUp}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in"
    >
      <div className="w-full max-w-4xl max-h-[92vh] glass-panel-elevated rounded-2xl border border-cyan-500/30 text-white flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-white">
                  Historical Satellite Time-Lapse Lens (2000 vs 2026)
                </h3>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold uppercase tracking-wider">
                  25-YEAR DELTA
                </span>
              </div>
              <div className="font-mono text-xs text-slate-400">
                Quantifying urban concrete sprawl, pervious soil loss & wetland catchment shrinkage
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

        {/* Preset Locations Bar */}
        <div className="flex items-center gap-2 p-3 bg-slate-900/50 border-b border-white/5 overflow-x-auto">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex-shrink-0 font-semibold px-2">
            Zone Presets:
          </span>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                soundFx.playClick();
                setActivePresetId(preset.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex-shrink-0 whitespace-nowrap border ${
                preset.id === activePresetId
                  ? 'bg-cyan-500/25 border-cyan-500/60 text-cyan-200 font-bold shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Interactive Split-Screen Lens Container */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl cursor-ew-resize select-none"
          >
            {/* 2026 Layer (Underneath / Full Width) */}
            <div className="absolute inset-0 bg-[#091522] flex flex-col justify-between p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(239,68,68,0.2)_0%,rgba(15,23,42,0.95)_75%)]" />
              {/* Grid lines representing dense urban concrete */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* 2026 Urban Overlay Visual Elements */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-red-950/80 text-red-300 border border-red-500/40 font-bold">
                  2026: Dense Urban Concrete Digital Twin
                </span>
                <span className="font-mono text-xs text-red-400 font-bold">
                  82% Impervious Asphalt & Glass
                </span>
              </div>

              <div className="relative z-10 flex items-center justify-end">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-red-500/30 font-mono text-right text-xs max-w-xs">
                  <div className="text-red-400 font-bold">Severe Basin Inundation Risk</div>
                  <div className="text-slate-300 text-[11px] mt-0.5">
                    Rainfall runoff velocity: <strong className="text-white">3.4 m/s (Instant Sump Backflow)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2000 Layer (Clipped by slider position) */}
            <div
              className="absolute inset-0 overflow-hidden bg-[#0a2318]"
              style={{ width: `${sliderPos}%` }}
            >
              <div
                className="absolute top-0 bottom-0 left-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.35)_0%,rgba(6,78,59,0.95)_75%)] flex flex-col justify-between p-6"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
              >
                {/* Organic contour lines representing wetlands */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(#22c55e 1.5px, transparent 1.5px)`,
                    backgroundSize: '24px 24px',
                  }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
                    2000: Natural Wetland & Floodplain Buffer
                  </span>
                </div>

                <div className="relative z-10">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 font-mono text-xs max-w-xs">
                    <div className="text-emerald-400 font-bold">Pristine Ecological Sponge</div>
                    <div className="text-slate-300 text-[11px] mt-0.5">
                      Natural retention capacity: <strong className="text-white">50 sq km water holding zone</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Draggable Divider Handle Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_12px_#22d3ee] pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-xl">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Quantitative Comparison Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            {/* Wetland Surface */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                Wetland Sponge Area
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-emerald-400 font-bold">{currentPreset.wetland2000}</span>
                <span className="text-slate-500">→</span>
                <span className="text-red-400 font-bold">{currentPreset.wetland2026}</span>
              </div>
            </div>

            {/* Pervious Soil */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Trees className="w-3.5 h-3.5 text-emerald-400" />
                Natural Soil Infiltration
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-emerald-400 font-bold">{currentPreset.pervious2000}</span>
                <span className="text-slate-500">→</span>
                <span className="text-amber-400 font-bold">{currentPreset.pervious2026}</span>
              </div>
            </div>

            {/* Impervious Concrete */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-purple-400" />
                Impervious Paved Footprint
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-emerald-400 font-bold">{currentPreset.impervious2000}</span>
                <span className="text-slate-500">→</span>
                <span className="text-red-400 font-bold">{currentPreset.impervious2026}</span>
              </div>
            </div>
          </div>

          {/* Narrative Insight */}
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong>Geospatial Root Cause Analysis:</strong> {currentPreset.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
