import React, { useState, useRef, useEffect } from 'react';
import type { AIMessage } from '../../types/climate';
import { Sparkles, Send, MapPin, BookOpen, ArrowRight, Download } from 'lucide-react';

interface AIAnalystPanelProps {
  onHighlightNeighbourhood?: (neighbourhoodId: string) => void;
  onSwitchToMap?: () => void;
}

const INITIAL_MESSAGES: AIMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    timestamp: '18:42 UTC',
    content: `**ClimateTwin X Scientific Intelligence Engine initialized.**

I am your scientific intelligence analyst connected to the Copernicus ERA5 reanalysis pipeline, IMD S-band radar telemetry, and Chennai LiDAR hydrodynamic digital twin models.

You can interrogate hyper-local flood vulnerability, simulate compound cyclone storm surges, or evaluate 2030–2050 IPCC AR6 climate trajectories.`,
    citations: [
      { source: 'ECMWF Copernicus', dataset: 'ERA5 Land Reanalysis 0.1°', confidence: '99.4%' },
      { source: 'Chennai Smart City GIS', dataset: '0.5m LiDAR Inundation Grid', confidence: '98.1%' }
    ]
  },
  {
    id: 'msg-2',
    sender: 'user',
    timestamp: '18:43 UTC',
    content: 'Which Chennai neighbourhoods have the highest flood vulnerability right now?'
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    timestamp: '18:43 UTC',
    content: `Based on current soil moisture saturation (>91%) and 0.5m LiDAR topography, **Velachery** and **Pallikaranai Marshland** exhibit the highest acute compound flood vulnerability.

### Key Vulnerability Drivers:
1. **Pallikaranai Wetland Contraction:** The historic sponge basin contracted from 50 sq km to under 4.3 sq km due to urban sprawl, inducing backflow along Radial Road.
2. **Topographic Depression:** Velachery averages only 3.2m above Mean Sea Level (MSL) with severe stormwater discharge choke points at the Buckingham Canal confluence.
3. **Soil Sump Saturation:** Recent 68.4mm rainfall has elevated basin saturation to 94%, leaving almost zero infiltration buffer.`,
    citations: [
      { source: 'IMD Meenambakkam', dataset: 'Doppler Radar Reflectivity (48.2 dBZ)', confidence: '98.7%' },
      { source: 'CMDA Hydrology', dataset: 'South Chennai Drainage Masterplan 2024', confidence: '96.5%' },
      { source: 'IPCC AR6 WGII', dataset: 'Chapter 10: Coastal Megacities & Deltas', confidence: 'High Agreement' }
    ],
    metrics: [
      { label: 'Velachery Risk Index', value: '92 / 100', trend: 'up', color: 'text-red-400' },
      { label: 'Soil Saturation', value: '94.2%', trend: 'up', color: 'text-amber-400' },
      { label: 'Exposed Population', value: '315,000', trend: 'stable', color: 'text-cyan-300' }
    ],
    suggestedAction: {
      label: 'Highlight Velachery & Pallikaranai on Digital Twin Map',
      type: 'highlight_zone',
      targetId: 'velachery'
    }
  }
];

const SUGGESTED_QUESTIONS = [
  'Assess Pallikaranai marshland retention deficit',
  'What happens if precipitation reaches 150mm/24h?',
  'Evaluate Urban Heat Island intensity in North Chennai',
  'Compare 2015 Historic Deluge vs 2023 Michaung'
];

export const AIAnalystPanel: React.FC<AIAnalystPanelProps> = ({
  onHighlightNeighbourhood,
  onSwitchToMap,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputText;
    if (!q.trim()) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
      content: q.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let replyContent = '';
      let replyCitations: AIMessage['citations'] = [];
      let replyMetrics: AIMessage['metrics'] = [];
      let suggestedAction: AIMessage['suggestedAction'] = undefined;

      const lowerQ = q.toLowerCase();

      if (lowerQ.includes('pallikaranai') || lowerQ.includes('marsh') || lowerQ.includes('retention')) {
        replyContent = `### Pallikaranai Hydrological Retention Assessment:
The Pallikaranai marshland is currently at **98% hydrological saturation capacity**. 

- **Remaining Retention Volume:** Less than 1.2 million cubic meters before unconstrained surface overflow.
- **Runoff Velocity:** Inundation front propagating toward Okkiyam Madavu at 1.4 m/s.
- **Critical Risk:** Tidal backing at Okkiyam Madavu sluice gate limits outflow during high tide (+0.84m surge).`;
        replyCitations = [
          { source: 'Tamil Nadu Wetland Authority', dataset: 'Pallikaranai Eco-Hydrology 2024', confidence: '98.2%' },
          { source: 'INCOIS Tidal Gauge', dataset: 'Bay of Bengal Astronomical Tide', confidence: '99.0%' }
        ];
        replyMetrics = [
          { label: 'Sump Saturation', value: '98.0%', trend: 'up', color: 'text-red-400' },
          { label: 'Inundation Buffer', value: '1.2M m³', trend: 'down', color: 'text-amber-400' }
        ];
        suggestedAction = {
          label: 'Inspect Pallikaranai on Digital Twin Map',
          type: 'highlight_zone',
          targetId: 'pallikaranai'
        };
      } else if (lowerQ.includes('heat') || lowerQ.includes('urban heat') || lowerQ.includes('north chennai')) {
        replyContent = `### North Chennai Urban Heat Island (UHI) Synthesis:
High surface albedo deficiency and heavy industrial density produce a **+4.4°C thermal anomaly** in George Town and Manali relative to coastal baselines.

- **Wet Bulb Temperature:** Measured at 29.2°C; dangerous heat stress threshold approaches at 31.0°C.
- **Canopy Cover Deficit:** Core commercial wards maintain <9% vegetation canopy, impairing nocturnal radiative cooling.`;
        replyCitations = [
          { source: 'ESA Sentinel-3 SLSTR', dataset: 'Thermal Land Surface Temperature 1km', confidence: '97.4%' },
          { source: 'Lancet Planetary Health', dataset: 'Urban Heat Island Vulnerability Index', confidence: 'Peer Reviewed' }
        ];
        replyMetrics = [
          { label: 'Peak Anomaly', value: '+4.4°C', trend: 'up', color: 'text-amber-400' },
          { label: 'George Town Heat Risk', value: '93 / 100', trend: 'up', color: 'text-red-400' }
        ];
        suggestedAction = {
          label: 'Highlight T. Nagar & Commercial Thermal Zones',
          type: 'highlight_zone',
          targetId: 'tnagar'
        };
      } else if (lowerQ.includes('150') || lowerQ.includes('simulate') || lowerQ.includes('happen')) {
        replyContent = `### Model Projection for 150mm / 24h Precipitation Deluge:
Simulating a 150mm event on top of existing 91% soil saturation triggers widespread Category-3 inundation across south-central Chennai.

- **Projected Inundated Extent:** ~64.5 sq km.
- **Population Isolated:** ~850,000 residents across Velachery, Madipakkam, Perumbakkam, and Mudichur.
- **Estimated Asset Exposure:** $2.8 Billion in IT infrastructure and transport corridors.`;
        replyCitations = [
          { source: 'ClimateTwin X Hydro-LiDAR Engine', dataset: 'Coupled 1D-2D Hydrodynamic Solver', confidence: '94.8%' },
          { source: 'National Institute of Hydrology', dataset: 'Chennai Flood Vulnerability Atlas', confidence: 'Validated' }
        ];
        replyMetrics = [
          { label: 'Flooded Surface', value: '64.5 km²', trend: 'up', color: 'text-red-400' },
          { label: 'Population at Risk', value: '850,000', trend: 'up', color: 'text-amber-400' }
        ];
      } else {
        replyContent = `### Climate Intelligence Synthesis:
Interrogating the composite ERA5 Reanalysis and Chennai Digital Twin model for **${q}**:

- **Precipitation Regime:** The northeast monsoon trough is active, delivering localized convection bursts of 15–35 mm/h.
- **Hydrological Dynamics:** Drainage gradient remains constrained (<0.05% slope) in low-lying delta catchments.
- **Risk Mitigation Recommendation:** Mobilize emergency de-watering stations along Velachery Vijayanagar corridor and Kotturpuram Adyar outfalls.`;
        replyCitations = [
          { source: 'Copernicus Climate Service', dataset: 'ERA5 Atmospheric Telemetry', confidence: '99.1%' },
          { source: 'IMD Regional Meteorological Centre', dataset: 'Chennai Doppler Radar Stream', confidence: '98.5%' }
        ];
      }

      const botMsg: AIMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
        content: replyContent,
        citations: replyCitations,
        metrics: replyMetrics,
        suggestedAction: suggestedAction
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleActionClick = (action: AIMessage['suggestedAction']) => {
    if (!action) return;
    if (action.targetId && onHighlightNeighbourhood) {
      onHighlightNeighbourhood(action.targetId);
    }
    if (onSwitchToMap) {
      onSwitchToMap();
    }
  };

  const handleExportBriefing = () => {
    const text = messages
      .map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.content}\n`)
      .join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ClimateTwinX_Intelligence_Briefing_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="glass-panel rounded-2xl border border-cyan-500/20 text-white shadow-2xl flex flex-col h-full max-h-[820px] overflow-hidden backdrop-blur-2xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white tracking-wide flex items-center gap-2">
              <span>Aether-9 Scientific Climate Analyst</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                ACTIVE
              </span>
            </h3>
            <p className="font-mono text-[10px] text-slate-400">
              Evidence-Grounded • IPCC AR6 & ERA5 Reanalysis Integrated
            </p>
          </div>
        </div>

        <button
          onClick={handleExportBriefing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all"
          title="Export Executive Briefing"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Briefing</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="font-mono text-[10px] text-slate-400">
                  {isUser ? 'Lead Intelligence Analyst' : 'Aether-9 Engine'}
                </span>
                <span className="font-mono text-[10px] text-slate-500">• {m.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white rounded-tr-none shadow-md'
                    : 'glass-panel-elevated border border-cyan-500/20 text-slate-200 rounded-tl-none shadow-xl'
                }`}
              >
                <div className="space-y-2 whitespace-pre-line">
                  {m.content}
                </div>

                {/* Inline Climate Metric Cards */}
                {m.metrics && m.metrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10">
                    {m.metrics.map((met, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-white/5 font-mono">
                        <span className="text-[10px] text-slate-400 block">{met.label}</span>
                        <span className={`text-sm font-bold ${met.color}`}>{met.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Scientific Evidence Citations */}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Empirical Evidence Citations:
                    </span>
                    <div className="space-y-0.5">
                      {m.citations.map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-slate-300">• {c.source}: {c.dataset}</span>
                          <span className="text-cyan-400/90 font-medium">{c.confidence}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Map Action Trigger */}
                {m.suggestedAction && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleActionClick(m.suggestedAction)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-semibold transition-all hover:scale-[1.01]"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{m.suggestedAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex flex-col items-start animate-in fade-in">
            <span className="font-mono text-[10px] text-slate-400 mb-1 px-1">Aether-9 Engine</span>
            <div className="glass-panel-elevated p-3 rounded-2xl rounded-tl-none border border-cyan-500/20 flex items-center gap-2 text-xs text-cyan-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Querying Sentinel-2 & Hydrodynamic LiDAR Solver...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Pills */}
      <div className="px-4 py-2 border-t border-white/5 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono no-scrollbar">
        <span className="text-slate-500 text-[10px] uppercase tracking-wider flex-shrink-0">
          Suggested Queries:
        </span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-white/10 bg-slate-900/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Interrogate Chennai climate risk, flood wards, or scenario projections..."
            className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-sans transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
