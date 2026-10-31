import React, { useState } from 'react';
import { X, Printer, Download, Copy, Check, ShieldAlert, FileText, Building, Users, Waves, Droplets, CheckCircle2 } from 'lucide-react';
import type { CityData } from '../../types/climate';
import { soundFx } from '../../utils/audioSynthesizer';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityData;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  isOpen,
  onClose,
  city,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  const handleDownloadJSON = () => {
    soundFx.playClick();
    const sitrepData = {
      agency: "National Disaster Management Authority (NDMA) & Municipal Emergency Command",
      documentType: "INCIDENT SITUATION REPORT (SITREP-04)",
      classification: "RESTRICTED // OPERATIONAL DISASTER RESPONSE",
      timestamp: new Date().toISOString(),
      location: {
        city: city.name,
        country: city.country,
        coordinates: [city.lat, city.lng],
      },
      stormClassification: "Severe Cyclonic Storm Michaung-9",
      meteorologicalTelemetry: {
        centralPressureHpa: 972,
        maxWindSpeedKmh: 125,
        estimatedLandfallHours: 5.7,
        projectedSurgeMeters: 2.2,
      },
      inundationMatrix: [
        { ward: "Velachery (Ward 177)", depthM: 1.85, exposedPop: 315000, status: "Critical" },
        { ward: "Pallikaranai (Ward 178)", depthM: 2.10, exposedPop: 140000, status: "Submerged" },
        { ward: "Madipakkam (Ward 179)", depthM: 1.40, exposedPop: 220000, status: "Severe" },
        { ward: "Saidapet Adyar Basin", depthM: 1.65, exposedPop: 180000, status: "High Risk" },
      ],
      shelterReadiness: [
        { name: "Anna University CEG Safe Haven", capacity: 4500, occupancyPct: 76, waterDays: 5, generatorHours: 48 },
        { name: "Jawaharlal Nehru Stadium", capacity: 8000, occupancyPct: 62, waterDays: 6, generatorHours: 72 },
        { name: "Loyola College High Grounds", capacity: 3500, occupancyPct: 88, waterDays: 4, generatorHours: 36 },
        { name: "Tambaram Air Force Base", capacity: 5000, occupancyPct: 45, waterDays: 12, generatorHours: 120 },
      ],
      avertedDamageEstUsdMillions: 235,
      commandSignOff: {
        municipalCommissioner: "Approved & Certified",
        ndrfCommander: "Active Mobilization Order #2026-IV",
        chiefHydrologist: "Telemetry Validated via IMD Doppler & ERA5",
      }
    };

    const blob = new Blob([JSON.stringify(sitrepData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SITREP_${city.name.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    soundFx.playClick();
    const briefingText = `# OFFICIAL INCIDENT SITUATION REPORT (SITREP-04)
**Target Region:** ${city.name}, ${city.country} (${city.lat}° N, ${city.lng}° E)
**Alert Level:** LEVEL-4 CRITICAL (Severe Cyclonic Storm & Inundation)
**Central Pressure:** 972 hPa | **Max Wind Speed:** 125 km/h | **Est. Landfall:** T-05:42
**Total Population Exposed:** 855,000 residents across low-lying delta sumps
**Relief Sanctuaries Active:** 5 High-Ground Hubs (21,000 capacity, 68% utilized)
**Municipal Countermeasures:** 150 MLD Mobile Pumps Active | Canal Deep Desilting | Barrage Tidal Gates Closed
**Verified Loss Averted:** $235M USD / 38 sq km Protected Zone`;

    navigator.clipboard.writeText(briefingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* TOP MODAL TOOLBAR (HIDDEN DURING PRINT) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-space flex items-center gap-2">
                Multi-Agency Incident Situation Report (SITREP)
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-red-600 text-white">LEVEL-4</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Official NDMA / GCC Certified Disaster Assessment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs font-mono text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold shadow-lg shadow-cyan-600/30 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier (PDF)</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOSSIER CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-900 text-slate-100 font-sans print:p-0 print:bg-white print:text-black relative">
          
          {/* DIAGONAL WATERMARK */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] print:opacity-[0.06] select-none">
            <div className="text-6xl sm:text-8xl font-black text-slate-400 -rotate-45 font-mono uppercase text-center leading-tight">
              OFFICIAL USE ONLY<br />DISASTER COMMAND
            </div>
          </div>

          {/* OFFICIAL HEADER SEAL BLOCK */}
          <div className="border-b-2 border-slate-700 pb-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono font-bold tracking-widest uppercase text-cyan-400 print:text-blue-800">
                GOVERNMENT OF TAMIL NADU // GREATER CHENNAI CORPORATION // NDRF BATTALION IV
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-space text-white print:text-black mt-1">
                INCIDENT SITUATION REPORT (SITREP-04)
              </h1>
              <p className="text-xs font-mono text-slate-400 print:text-slate-600">
                Compound Coastal Inundation & Severe Cyclonic Storm Landfall Assessment
              </p>
            </div>

            <div className="text-right font-mono text-xs text-slate-400 print:text-slate-700">
              <div><span className="font-semibold text-slate-300 print:text-black">INCIDENT ID:</span> CTX-2026-CH-09</div>
              <div><span className="font-semibold text-slate-300 print:text-black">DATE/TIME:</span> {new Date().toUTCString()}</div>
              <div><span className="font-semibold text-slate-300 print:text-black">SECURITY:</span> LEVEL-4 RESTRICTED</div>
            </div>
          </div>

          {/* SECTION 1: METEOROLOGICAL & STORM TELEMETRY SUMMARY */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3.5 rounded-xl bg-slate-800/60 print:bg-slate-100 border border-slate-700/60">
              <div className="text-[10px] font-mono uppercase text-slate-400">Storm System</div>
              <div className="text-base font-bold font-mono text-cyan-300 print:text-blue-900 mt-1">Michaung-9</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Severe Cyclonic Storm</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 print:bg-slate-100 border border-slate-700/60">
              <div className="text-[10px] font-mono uppercase text-slate-400">Central Pressure</div>
              <div className="text-base font-bold font-mono text-white print:text-black mt-1">972 hPa</div>
              <div className="text-[11px] text-red-400 mt-0.5">Deep Barometric Drop</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 print:bg-slate-100 border border-slate-700/60">
              <div className="text-[10px] font-mono uppercase text-slate-400">Max Wind Gusts</div>
              <div className="text-base font-bold font-mono text-amber-400 print:text-amber-700 mt-1">125 km/h</div>
              <div className="text-[11px] text-slate-400 mt-0.5">R64 Hurricane Core</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 print:bg-slate-100 border border-slate-700/60">
              <div className="text-[10px] font-mono uppercase text-slate-400">Est. Landfall Surge</div>
              <div className="text-base font-bold font-mono text-red-400 print:text-red-700 mt-1">+2.2m MSL</div>
              <div className="text-[11px] text-slate-400 mt-0.5">T-05h 42m Window</div>
            </div>
          </div>

          {/* SECTION 2: HIGH-EXPOSURE DELTA WARDS */}
          <div className="mb-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 print:text-black mb-2.5 flex items-center gap-2">
              <Waves className="w-4 h-4 text-cyan-400" />
              1. Ward Inundation & Exposed Demographics Matrix
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-700 print:border-slate-300">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-800/80 print:bg-slate-200 text-slate-300 print:text-black border-b border-slate-700">
                  <tr>
                    <th className="p-2.5">Ward / Zone</th>
                    <th className="p-2.5">Inundation Depth</th>
                    <th className="p-2.5">Population Exposed</th>
                    <th className="p-2.5">Critical Substation Hazard</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200 text-slate-200 print:text-slate-800">
                  <tr>
                    <td className="p-2.5 font-bold">Velachery (Ward 177)</td>
                    <td className="p-2.5 text-red-400 font-bold">1.85 meters</td>
                    <td className="p-2.5">315,000</td>
                    <td className="p-2.5 text-slate-400">South Grid Substation (Offline)</td>
                    <td className="p-2.5 text-right"><span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px]">CRITICAL</span></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Pallikaranai Marsh (Ward 178)</td>
                    <td className="p-2.5 text-red-400 font-bold">2.10 meters</td>
                    <td className="p-2.5">140,000</td>
                    <td className="p-2.5 text-slate-400">Radial Road Underpass (Blocked)</td>
                    <td className="p-2.5 text-right"><span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px]">SUBMERGED</span></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Madipakkam (Ward 179)</td>
                    <td className="p-2.5 text-amber-400 font-bold">1.40 meters</td>
                    <td className="p-2.5">220,000</td>
                    <td className="p-2.5 text-slate-400">Puzhuthivakkam Sluice Overtopping</td>
                    <td className="p-2.5 text-right"><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px]">SEVERE</span></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Saidapet Adyar Basin (Ward 142)</td>
                    <td className="p-2.5 text-amber-400 font-bold">1.65 meters</td>
                    <td className="p-2.5">180,000</td>
                    <td className="p-2.5 text-slate-400">Adyar Bridge Telemetry Watch</td>
                    <td className="p-2.5 text-right"><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px]">HIGH RISK</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: RELIEF SHELTERS LOGISTICS */}
          <div className="mb-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 print:text-black mb-2.5 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              2. Municipal Relief Shelters & Life Support Telemetry
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/40 print:bg-slate-100 border border-slate-700/50">
                <div className="flex justify-between items-center text-xs font-bold text-white print:text-black font-space">
                  <span>Anna University CEG Safe Haven</span>
                  <span className="font-mono text-emerald-400 font-bold">76% Occupied</span>
                </div>
                <div className="mt-2 text-xs font-mono text-slate-400 print:text-slate-600 space-y-0.5">
                  <div>Capacity: 4,500 evacuees (3,420 housed)</div>
                  <div>Potable Water Reserves: 5 days | Generator Diesel: 48h runtime</div>
                  <div>NDRF Boat Fleet: 4 motorized zodiacs deployed</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 print:bg-slate-100 border border-slate-700/50">
                <div className="flex justify-between items-center text-xs font-bold text-white print:text-black font-space">
                  <span>Jawaharlal Nehru Stadium Complex</span>
                  <span className="font-mono text-emerald-400 font-bold">62% Occupied</span>
                </div>
                <div className="mt-2 text-xs font-mono text-slate-400 print:text-slate-600 space-y-0.5">
                  <div>Capacity: 8,000 evacuees (4,960 housed)</div>
                  <div>Potable Water Reserves: 6 days | Generator Diesel: 72h runtime</div>
                  <div>Emergency Triage: 8 doctors & auxiliary surgical station</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: ACTIVE MUNICIPAL COUNTERMEASURES & AVERTED LOSS */}
          <div className="mb-8 p-4 rounded-xl bg-cyan-950/30 print:bg-slate-100 border border-cyan-500/30 print:border-slate-300">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 print:text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              3. Operational Countermeasures & Capital Losses Averted
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300 print:text-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">DRAINAGE CAPACITY</span>
                <span className="font-bold text-white print:text-black">+35% Via Canal Desilting</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PUMP DEPLOYMENT</span>
                <span className="font-bold text-white print:text-black">150 MLD Mobile Pumps</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ESTIMATED AVERTED DAMAGE</span>
                <span className="font-bold text-emerald-400 font-space text-sm">+$235M USD Capital Saved</span>
              </div>
            </div>
          </div>

          {/* SECTION 5: COMMAND SIGN-OFF & CERTIFICATION BLOCKS */}
          <div className="pt-6 border-t-2 border-slate-700 print:border-slate-400 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="h-10 border-b border-dashed border-slate-600 flex items-end justify-center pb-1">
                <span className="font-mono text-xs text-cyan-400 italic">Dr. J. Radhakrishnan, IAS</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 print:text-slate-600">
                <div className="font-bold text-slate-200 print:text-black">Commissioner</div>
                <div>Greater Chennai Corporation</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-10 border-b border-dashed border-slate-600 flex items-end justify-center pb-1">
                <span className="font-mono text-xs text-red-400 italic">Cmdt. K. S. Verma</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 print:text-slate-600">
                <div className="font-bold text-slate-200 print:text-black">Incident Commander</div>
                <div>NDRF Battalion IV (Arakkonam)</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-10 border-b border-dashed border-slate-600 flex items-end justify-center pb-1">
                <span className="font-mono text-xs text-emerald-400 italic">Dr. S. Balachandran</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 print:text-slate-600">
                <div className="font-bold text-slate-200 print:text-black">Lead Hydrologist</div>
                <div>Regional Meteorological Centre</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
