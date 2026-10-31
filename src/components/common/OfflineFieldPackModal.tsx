import React, { useState } from 'react';
import { X, Download, ShieldCheck, WifiOff, FileCode, Check, Smartphone, Printer, ExternalLink, Radio, Droplets, Building, Users } from 'lucide-react';
import { soundFx } from '../../utils/audioSynthesizer';
import type { CityData } from '../../types/climate';

interface OfflineFieldPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityData;
}

export const OfflineFieldPackModal: React.FC<OfflineFieldPackModalProps> = ({
  isOpen,
  onClose,
  city,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownloadStandaloneHTML = () => {
    soundFx.playClick();

    const standaloneHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ClimateTwin X — Offline Emergency Field Pack // ${city.name}</title>
  <style>
    :root {
      --bg: #070b14;
      --card: #0d1526;
      --card-border: #1e293b;
      --cyan: #22d3ee;
      --emerald: #10b981;
      --red: #ef4444;
      --amber: #f59e0b;
      --text: #f8fafc;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 16px;
      line-height: 1.5;
    }
    .header {
      background: linear-gradient(135deg, #1e1b4b, #0f172a);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-family: monospace;
      font-weight: bold;
      text-transform: uppercase;
      background: rgba(34, 211, 238, 0.15);
      color: var(--cyan);
      border: 1px solid rgba(34, 211, 238, 0.4);
    }
    .badge-danger {
      background: rgba(239, 68, 68, 0.2);
      color: var(--red);
      border-color: rgba(239, 68, 68, 0.4);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 18px;
    }
    .card h2 {
      font-size: 15px;
      margin-bottom: 12px;
      color: var(--cyan);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 8px;
    }
    th, td {
      padding: 8px 10px;
      text-align: left;
      border-bottom: 1px solid #1e293b;
    }
    th {
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
      font-family: monospace;
    }
    .hotline-btn {
      display: inline-block;
      padding: 8px 14px;
      background: #1e293b;
      color: var(--text);
      text-decoration: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: bold;
      margin: 4px 4px 4px 0;
      border: 1px solid #334155;
    }
    .hotline-btn:hover { background: #334155; }
    textarea {
      width: 100%;
      height: 120px;
      background: #050811;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 10px;
      color: var(--text);
      font-family: monospace;
      font-size: 13px;
      margin-top: 8px;
      resize: vertical;
    }
    .print-btn {
      padding: 10px 18px;
      background: var(--cyan);
      color: #050811;
      font-weight: bold;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
    }
    @media print {
      body { background: white; color: black; padding: 0; }
      .header, .card { border: 1px solid #ccc; background: white; color: black; }
      textarea, .print-btn { display: none; }
      th, td { border-bottom: 1px solid #ccc; color: black; }
      .badge { border: 1px solid #333; color: black; background: #eee; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="badge badge-danger">LEVEL-4 OFFLINE EMERGENCY FIELD PACK</div>
      <h1 style="font-size: 22px; margin-top: 6px;">ClimateTwin X // Field Operational Response</h1>
      <p style="font-size: 12px; color: var(--muted);">Target Basin: ${city.name}, ${city.country} • Zero-Connectivity Standalone Mode</p>
    </div>
    <div>
      <button class="print-btn" onclick="window.print()">Print Field Manifest</button>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h2>🚨 Emergency Communication Frequencies</h2>
      <p style="font-size: 13px; color: var(--muted); margin-bottom: 12px;">Immediate voice contact for GCC, NDRF, and Regional Fire Rescue:</p>
      <div>
        <a href="tel:1913" class="hotline-btn">📞 GCC Helpline: 1913</a>
        <a href="tel:1070" class="hotline-btn">📞 TN State Disaster: 1070</a>
        <a href="tel:1077" class="hotline-btn">📞 District Collector: 1077</a>
        <a href="tel:112" class="hotline-btn">📞 Police / Ambulance: 112</a>
        <a href="tel:01124363260" class="hotline-btn">📞 NDRF HQ: 011-24363260</a>
      </div>
      <p style="font-size: 11px; font-family: monospace; color: var(--muted); margin-top: 10px;">
        VHF Emergency Frequency: <strong>156.800 MHz (Channel 16)</strong><br />
        HF Command Net: <strong>5.205 MHz USB</strong>
      </p>
    </div>

    <div class="card">
      <h2>🌊 Inundation Triage Action Thresholds</h2>
      <table>
        <thead>
          <tr>
            <th>Water Depth</th>
            <th>Field Status</th>
            <th>Action Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="color: var(--amber); font-weight: bold;">0.3m (Ankle)</td>
            <td>Roadway Warning</td>
            <td>Small vehicles rerouted. Clear drainage gratings.</td>
          </tr>
          <tr>
            <td style="color: var(--amber); font-weight: bold;">0.8m (Knee)</td>
            <td>Substation Trip</td>
            <td>Transformer isolation. Inundated underpasses sealed.</td>
          </tr>
          <tr>
            <td style="color: var(--red); font-weight: bold;">1.5m (Chest)</td>
            <td>Mandatory Evacuation</td>
            <td>Deploy NDRF motorized boats. Cut domestic power.</td>
          </tr>
          <tr>
            <td style="color: var(--red); font-weight: bold;">2.0m+ (Roof)</td>
            <td>Aviation Lifeline</td>
            <td>Helicopter winch rescue. High-ground relocation.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="card" style="margin-bottom: 20px;">
    <h2>🏢 Municipal Relief Shelters & Life Support Directory</h2>
    <table>
      <thead>
        <tr>
          <th>Shelter Facility</th>
          <th>Capacity / Safe MSL</th>
          <th>Potable Water</th>
          <th>Generator Fuel</th>
          <th>Boat Staging</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Anna University CEG Campus</strong><br /><small>Guindy, Sardar Patel Road</small></td>
          <td>4,500 evacuees (12.0m MSL)</td>
          <td>5 Days Reserve</td>
          <td>48h Generator Runtime</td>
          <td>4 Zodiac Boats</td>
        </tr>
        <tr>
          <td><strong>Jawaharlal Nehru Stadium</strong><br /><small>Sydenhams Road, Periamet</small></td>
          <td>8,000 evacuees (8.5m MSL)</td>
          <td>6 Days Reserve</td>
          <td>72h Generator Runtime</td>
          <td>8 Medical Doctors</td>
        </tr>
        <tr>
          <td><strong>Loyola College Campus</strong><br /><small>Sterling Road, Nungambakkam</small></td>
          <td>3,500 evacuees (9.2m MSL)</td>
          <td>4 Days Reserve</td>
          <td>36h Generator Runtime</td>
          <td>Triage Ward Active</td>
        </tr>
        <tr>
          <td><strong>Tambaram Air Force Base</strong><br /><small>Velachery Main Road, East Tambaram</small></td>
          <td>5,000 evacuees (28.0m MSL)</td>
          <td>12 Days Reserve</td>
          <td>120h Generator Runtime</td>
          <td>Helipad Evacuation</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <h2>📝 Field Incident Notes (Offline Auto-Saved)</h2>
    <p style="font-size: 12px; color: var(--muted);">Notes typed here are saved to this device's localStorage and persist without cellular or Wi-Fi connection:</p>
    <textarea id="fieldNotes" placeholder="Log incident timestamps, rescued citizen counts, damaged culverts, water levels..."></textarea>
  </div>

  <script>
    const notesArea = document.getElementById('fieldNotes');
    const storageKey = 'climora_field_notes_${city.id}';
    notesArea.value = localStorage.getItem(storageKey) || '';
    notesArea.addEventListener('input', (e) => {
      localStorage.setItem(storageKey, e.target.value);
    });
  </script>
</body>
</html>`;

    const blob = new Blob([standaloneHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ClimateTwinX_FieldPack_${city.name.toUpperCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* TOP BAR */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <WifiOff className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-space text-white flex items-center gap-2">
                Offline Emergency Field Pack
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">100% OFFLINE</span>
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Zero-Connectivity Disaster Response Bundle for {city.name}
              </p>
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

        {/* CONTENTS OVERVIEW */}
        <div className="space-y-4 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono font-bold text-white">Standalone Mobile & Desktop Document</div>
              <p className="text-xs text-slate-300 mt-0.5">
                Exports a single, fully-contained HTML file. Field rescue teams can transfer it via AirDrop, Bluetooth, or USB drive and open it in any mobile browser with zero cellular data.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <span className="text-cyan-400 font-bold block mb-1">✓ Relief Shelter Manifest</span>
              <span className="text-slate-400">Anna Univ, JN Stadium, Loyola, Tambaram capacities & direct telephone hotlines.</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <span className="text-emerald-400 font-bold block mb-1">✓ Inundation Triage Guide</span>
              <span className="text-slate-400">Action protocols for 0.3m vehicle stall, 0.8m grid trips, and 1.5m evacuation.</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <span className="text-purple-400 font-bold block mb-1">✓ Radio Comms Frequencies</span>
              <span className="text-slate-400">VHF Marine Channel 16 (156.800 MHz) & National Disaster Management nets.</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <span className="text-amber-400 font-bold block mb-1">✓ Offline LocalStorage Notepad</span>
              <span className="text-slate-400">Responders can record survivor headcounts and logs directly without losing data.</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-500">
            File Size: ~18 KB (Zero dependencies)
          </div>

          <button
            onClick={handleDownloadStandaloneHTML}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-600/30"
          >
            {downloaded ? <Check className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
            <span>{downloaded ? 'Downloaded Successfully' : 'Download Offline Field Pack (.html)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
