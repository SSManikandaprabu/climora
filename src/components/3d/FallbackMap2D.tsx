import React from 'react';
import { CityData } from '../../types/climate';
import { GLOBAL_CITIES } from '../../data/citiesData';
import { Navigation } from 'lucide-react';

interface FallbackMap2DProps {
  selectedCity: CityData;
  onSelectCity: (city: CityData) => void;
  onTransitionToTwin: (city: CityData) => void;
}

export const FallbackMap2D: React.FC<FallbackMap2DProps> = ({
  selectedCity,
  onSelectCity,
  onTransitionToTwin,
}) => {
  return (
    <div className="relative w-full h-full bg-[#060c18] overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* World Map Vector Graphic Background */}
      <div className="relative w-full max-w-4xl aspect-[2/1] rounded-2xl border border-cyan-500/20 glass-panel p-4 overflow-hidden">
        {/* World Grid Lines */}
        <svg className="w-full h-full opacity-60" viewBox="0 0 1000 500" fill="none">
          <defs>
            <radialGradient id="gridGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#050811" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1000" height="500" fill="url(#gridGlow)" />

          {/* Latitude Lines */}
          {[100, 200, 250, 300, 400].map((y) => (
            <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(34, 211, 238, 0.15)" strokeDasharray="3 3" />
          ))}
          {/* Longitude Lines */}
          {[200, 400, 500, 600, 800].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="500" stroke="rgba(34, 211, 238, 0.15)" strokeDasharray="3 3" />
          ))}

          {/* Continental Outlines (stylized vector) */}
          <path
            d="M180,120 Q220,100 280,110 T320,160 T280,240 T220,220 Z"
            fill="#0f243d"
            stroke="#22d3ee"
            strokeWidth="1"
            opacity="0.8"
          />
          <path
            d="M260,260 Q300,280 320,340 T300,420 T260,340 Z"
            fill="#0f243d"
            stroke="#22d3ee"
            strokeWidth="1"
            opacity="0.8"
          />
          <path
            d="M450,140 Q550,110 650,140 T750,200 T650,260 T520,240 T460,200 Z"
            fill="#0f243d"
            stroke="#22d3ee"
            strokeWidth="1"
            opacity="0.8"
          />
          <path
            d="M480,220 Q540,240 560,320 T520,380 T460,300 Z"
            fill="#0f243d"
            stroke="#22d3ee"
            strokeWidth="1"
            opacity="0.8"
          />
          {/* India Peninsula */}
          <path
            d="M660,210 Q680,210 700,240 T680,310 T650,250 Z"
            fill="#153658"
            stroke="#38bdf8"
            strokeWidth="1.5"
            opacity="0.95"
          />
          {/* Australia */}
          <path
            d="M780,320 Q840,310 870,350 T840,410 T770,380 Z"
            fill="#0f243d"
            stroke="#22d3ee"
            strokeWidth="1"
            opacity="0.8"
          />
        </svg>

        {/* City Marker Overlay Elements */}
        {GLOBAL_CITIES.map((city) => {
          // Project lat/lng to 1000x500
          const x = ((city.lng + 180) / 360) * 100;
          const y = ((90 - city.lat) / 180) * 100;
          const isSelected = city.id === selectedCity.id;

          return (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform hover:scale-125 z-10`}
            >
              <div className="relative flex items-center justify-center">
                {isSelected && (
                  <span className="absolute w-6 h-6 rounded-full bg-cyan-400/30 animate-ping" />
                )}
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-cyan-400 border-white shadow-[0_0_12px_#22d3ee]'
                      : city.riskLevel === 'CRITICAL'
                      ? 'bg-red-500 border-red-300'
                      : 'bg-blue-600 border-blue-300'
                  }`}
                />
              </div>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-slate-200 group-hover:border-cyan-400 group-hover:text-cyan-300 transition-colors">
                {city.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={() => onTransitionToTwin(selectedCity)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-cyan-500/20"
        >
          <Navigation className="w-4 h-4" />
          <span>Open {selectedCity.name} Digital Twin Inundation Map</span>
        </button>
      </div>
    </div>
  );
};
