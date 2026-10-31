import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Download, SlidersHorizontal, Calendar, FileText, CheckCircle2 } from 'lucide-react';

// Data for historical and projected temperature anomaly
const TEMP_TRAJECTORY_DATA = [
  { year: '1980', baseline: 28.5, actual: 28.4, ssp126: 28.4, ssp585: 28.4 },
  { year: '1990', baseline: 28.5, actual: 28.7, ssp126: 28.7, ssp585: 28.7 },
  { year: '2000', baseline: 28.5, actual: 29.1, ssp126: 29.1, ssp585: 29.1 },
  { year: '2010', baseline: 28.5, actual: 29.6, ssp126: 29.6, ssp585: 29.6 },
  { year: '2020', baseline: 28.5, actual: 30.4, ssp126: 30.4, ssp585: 30.4 },
  { year: '2024', baseline: 28.5, actual: 30.8, ssp126: 30.8, ssp585: 30.8 },
  { year: '2030', baseline: 28.5, actual: null, ssp126: 31.2, ssp585: 32.1 },
  { year: '2040', baseline: 28.5, actual: null, ssp126: 31.6, ssp585: 33.5 },
  { year: '2050', baseline: 28.5, actual: null, ssp126: 32.0, ssp585: 34.9 },
];

// Inundation and storm comparison data (hourly during peak deluge)
const STORM_COMPARISON_DATA = [
  { hour: '00h', deluge2015: 18, michaung2023: 12, liveRadar: 6 },
  { hour: '06h', deluge2015: 52, michaung2023: 38, liveRadar: 18 },
  { hour: '12h', deluge2015: 110, michaung2023: 84, liveRadar: 26 },
  { hour: '18h', deluge2015: 180, michaung2023: 142, liveRadar: 35 },
  { hour: '24h', deluge2015: 284, michaung2023: 215, liveRadar: 48 },
  { hour: '30h', deluge2015: 390, michaung2023: 310, liveRadar: 58 },
  { hour: '36h', deluge2015: 494, michaung2023: 390, liveRadar: 68 },
];

// Flood Inundation Probability by Ward
const WARD_PROBABILITY_DATA = [
  { ward: 'Velachery', prob: 94, depth: 1.8 },
  { ward: 'Pallikaranai', prob: 96, depth: 2.1 },
  { ward: 'Madipakkam', prob: 88, depth: 1.4 },
  { ward: 'Perumbakkam', prob: 89, depth: 1.5 },
  { ward: 'Adyar Estuary', prob: 84, depth: 1.2 },
  { ward: 'Ennore', prob: 92, depth: 1.6 },
  { ward: 'T. Nagar', prob: 62, depth: 0.8 },
  { ward: 'Mylapore', prob: 48, depth: 0.4 },
];

export const ScientificCharts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'temperature' | 'storms' | 'probability'>('temperature');
  const [compareMode, setCompareMode] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeTab === 'temperature') {
      csvContent += 'Year,Baseline,Actual,SSP1-2.6,SSP5-8.5\n';
      TEMP_TRAJECTORY_DATA.forEach((r) => {
        csvContent += `${r.year},${r.baseline},${r.actual ?? ''},${r.ssp126},${r.ssp585}\n`;
      });
    } else if (activeTab === 'storms') {
      csvContent += 'Hour,2015 Deluge,2023 Michaung,Live Telemetry\n';
      STORM_COMPARISON_DATA.forEach((r) => {
        csvContent += `${r.hour},${r.deluge2015},${r.michaung2023},${r.liveRadar}\n`;
      });
    } else {
      csvContent += 'Ward,Probability,Water Depth (m)\n';
      WARD_PROBABILITY_DATA.forEach((r) => {
        csvContent += `${r.ward},${r.prob},${r.depth}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ClimateTwinX_${activeTab}_scientific_telemetry.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 text-white shadow-2xl backdrop-blur-xl">
      {/* Top Header & Chart Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h3 className="font-heading font-bold text-base text-white tracking-wide flex items-center gap-2">
            <span>High-Resolution Analytical Visualizations</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              ECMWF / IPCC AR6
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Empirical reanalysis, multi-model ensemble spread, and compound disaster benchmarking.
          </p>
        </div>

        {/* Tab Buttons & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setActiveTab('temperature')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'temperature'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Thermal Anomaly (1980-2050)
            </button>
            <button
              onClick={() => setActiveTab('storms')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'storms'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Storm Deluge Cumulative
            </button>
            <button
              onClick={() => setActiveTab('probability')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'probability'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ward Inundation Probability
            </button>
          </div>

          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`p-2 rounded-lg text-xs font-mono border transition-all ${
              compareMode
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle Scenario Comparison Overlay"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all"
            title="Export CSV"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Exported</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-80 pt-4">
        {activeTab === 'temperature' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TEMP_TRAJECTORY_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="ssp585Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis domain={[27, 36]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} unit="°C" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090f1b',
                  borderColor: '#22d3ee40',
                  borderRadius: '10px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Legend
                wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '10px' }}
              />
              <Line type="monotone" dataKey="baseline" name="1991-2020 ERA5 Climatological Baseline" stroke="#64748b" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="actual" name="Historical Observed Mean Temp" stroke="#22d3ee" strokeWidth={2.5} fillOpacity={1} fill="url(#actualGrad)" />
              {compareMode && (
                <>
                  <Line type="monotone" dataKey="ssp126" name="SSP1-2.6 Paris Target Decarbonization" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="ssp585" name="SSP5-8.5 Unmitigated High Emissions" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#ssp585Grad)" />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'storms' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={STORM_COMPARISON_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} unit=" mm" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090f1b',
                  borderColor: '#3b82f640',
                  borderRadius: '10px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="deluge2015" name="2015 Historic Deluge (494mm)" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="michaung2023" name="2023 Cyclone Michaung (390mm)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="liveRadar" name="Current Radar 24h Accumulation (68mm)" stroke="#22d3ee" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'probability' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WARD_PROBABILITY_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="ward" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090f1b',
                  borderColor: '#22d3ee40',
                  borderRadius: '10px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="prob" name="Flood Inundation Probability (%)" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Telemetry Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Statistically downscaled using CMIP6 global climate ensemble & Hydro-LiDAR GIS.</span>
        </div>
        <div className="text-slate-500">
          Last computed: Today 18:30 UTC • Model Run #8429
        </div>
      </div>
    </div>
  );
};
