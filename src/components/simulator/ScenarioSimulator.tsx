import React, { useState, useMemo } from 'react';
import { Cpu, Save, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck, Wrench, Droplets, Waves, Trees } from 'lucide-react';
import { CLIMATE_SCENARIOS } from '../../data/climateScenarios';
import { soundFx } from '../../utils/audioSynthesizer';

export const ScenarioSimulator: React.FC = () => {
  const [rainfallRate, setRainfallRate] = useState<number>(35); // mm/h
  const [durationHours, setDurationHours] = useState<number>(18); // hours
  const [tempIncrease, setTempIncrease] = useState<number>(2.0); // °C
  const [canopyChange, setCanopyChange] = useState<number>(0); // % change (-30 to +30)
  const [seaLevelSurge, setSeaLevelSurge] = useState<number>(0.6); // meters

  // Active Municipal Engineering Interventions
  const [interventions, setInterventions] = useState({
    canalDesilting: false,       // -18% flood extent
    emergencyPumping: false,     // -12% flood extent
    wetlandRestoration: false,   // -15% flood extent, -0.4°C UHI
    tidalSurgeGates: false,      // -22% storm surge backflow
  });

  const [simulationMode, setSimulationMode] = useState<'side_by_side' | 'scenario' | 'baseline'>('side_by_side');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const calculatedImpacts = useMemo(() => {
    const totalRainfall = rainfallRate * durationHours;
    const baselineInundationSqKm = 32.0;
    const baselineEconLossMillions = 420;

    const excessRainfall = Math.max(0, totalRainfall - 100);
    const vegetationBuffer = 1 - (canopyChange * 0.008);
    const surgeMultiplier = 1 + (seaLevelSurge * 0.45);

    // Calculate raw unmitigated inundation
    const rawInundationArea = Math.min(
      180,
      baselineInundationSqKm + (excessRainfall * 0.28 * vegetationBuffer * surgeMultiplier)
    );

    // Calculate mitigation efficiency from active interventions
    let mitigationRatio = 0;
    let directAvertedEconLoss = 0;

    if (interventions.canalDesilting) {
      mitigationRatio += 0.18;
      directAvertedEconLoss += 95;
    }
    if (interventions.emergencyPumping) {
      mitigationRatio += 0.12;
      directAvertedEconLoss += 65;
    }
    if (interventions.wetlandRestoration) {
      mitigationRatio += 0.15;
      directAvertedEconLoss += 110;
    }
    if (interventions.tidalSurgeGates) {
      mitigationRatio += 0.22;
      directAvertedEconLoss += 140;
    }

    const effectiveInundationArea = Math.max(
      baselineInundationSqKm * 0.6,
      rawInundationArea * (1 - Math.min(0.55, mitigationRatio))
    );

    const populationExposed = Math.round(effectiveInundationArea * 8800);

    const unmitigatedEconLoss = Math.round(
      baselineEconLossMillions + (rawInundationArea * 24.5) + (tempIncrease * 180)
    );

    const economicLoss = Math.max(
      baselineEconLossMillions,
      unmitigatedEconLoss - directAvertedEconLoss
    );

    const avertedEconomicLoss = unmitigatedEconLoss - economicLoss;
    const avertedInundatedArea = Number((rawInundationArea - effectiveInundationArea).toFixed(1));

    const peakUHI = 3.6 + (tempIncrease * 0.8) - (canopyChange * 0.04) - (interventions.wetlandRestoration ? 0.4 : 0);

    return {
      totalRainfall,
      inundationArea: Number(effectiveInundationArea.toFixed(1)),
      rawInundationArea: Number(rawInundationArea.toFixed(1)),
      avertedInundatedArea,
      populationExposed,
      economicLoss,
      avertedEconomicLoss,
      peakUHI: Number(peakUHI.toFixed(1)),
      criticalAssetsCount: Math.min(42, Math.round(effectiveInundationArea * 0.35)),
    };
  }, [rainfallRate, durationHours, tempIncrease, canopyChange, seaLevelSurge, interventions]);

  const handleApplyPreset = (scenarioId: string) => {
    const sc = CLIMATE_SCENARIOS.find((s) => s.id === scenarioId);
    if (!sc) return;
    setTempIncrease(sc.tempIncrease);
    setRainfallRate(sc.tempIncrease * 15 + 20);
    setDurationHours(24);
    setSeaLevelSurge(sc.seaLevelRise / 100);
  };

  const handleSaveScenario = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleReset = () => {
    setRainfallRate(35);
    setDurationHours(18);
    setTempIncrease(2.0);
    setCanopyChange(0);
    setSeaLevelSurge(0.6);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 text-white shadow-2xl backdrop-blur-2xl">
      {/* Simulator Master Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-white tracking-wide">
                Predictive Scenario Simulator
              </h2>
              <div className="font-mono text-xs text-slate-400">
                Coupled Hydro-Meteorological & Urban Thermodynamic Sandbox
              </div>
            </div>
          </div>
        </div>

        {/* Presets & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-slate-400">IPCC Benchmarks:</span>
          {CLIMATE_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleApplyPreset(sc.id)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
            >
              {sc.code}
            </button>
          ))}
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset to Baseline"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulator Body Grid: Left Controls, Right Impacts & Difference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-4 rounded-xl border border-white/10">
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-wider block mb-3 font-semibold">
              Simulation Control Parameters
            </span>

            {/* Rainfall Rate */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Rainfall Intensity</span>
                <span className="text-cyan-400 font-bold">{rainfallRate} mm/h</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={rainfallRate}
                onChange={(e) => setRainfallRate(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>10 mm/h (Moderate)</span>
                <span>120 mm/h (Cloudburst)</span>
              </div>
            </div>

            {/* Storm Duration */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Storm Duration</span>
                <span className="text-cyan-400 font-bold">{durationHours} hours</span>
              </div>
              <input
                type="range"
                min="3"
                max="48"
                step="3"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>3h (Flash Storm)</span>
                <span>48h (Stalled Cyclone)</span>
              </div>
            </div>

            {/* Temperature Anomaly */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Mean Temperature Increase</span>
                <span className="text-amber-400 font-bold">+{tempIncrease.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="4.5"
                step="0.1"
                value={tempIncrease}
                onChange={(e) => setTempIncrease(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>+0.0°C (Current)</span>
                <span>+4.5°C (SSP5-8.5 2100)</span>
              </div>
            </div>

            {/* Sea Level / Storm Surge */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Astronomical Tide / Surge</span>
                <span className="text-blue-400 font-bold">+{seaLevelSurge.toFixed(2)}m</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.05"
                value={seaLevelSurge}
                onChange={(e) => setSeaLevelSurge(Number(e.target.value))}
                className="w-full accent-blue-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>+0.0m (Neap)</span>
                <span>+2.0m (Severe Surge)</span>
              </div>
            </div>

            {/* Urban Vegetation Canopy */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Urban Canopy Cover Change</span>
                <span className={`font-bold ${canopyChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {canopyChange > 0 ? `+${canopyChange}%` : `${canopyChange}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={canopyChange}
                onChange={(e) => setCanopyChange(Number(e.target.value))}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>-30% (Deforestation)</span>
                <span>+30% (Sponge Corridors)</span>
              </div>
            </div>

            {/* Active Municipal Engineering Interventions */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/25 space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase">
                  <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                  Engineering Interventions
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  GCC Sandbox
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-white/5 cursor-pointer hover:border-emerald-500/30 transition-colors">
                  <span className="flex items-center gap-2 text-slate-200 text-[11px]">
                    <input
                      type="checkbox"
                      checked={interventions.canalDesilting}
                      onChange={() => {
                        soundFx.playClick();
                        setInterventions((prev) => ({ ...prev, canalDesilting: !prev.canalDesilting }));
                      }}
                      className="rounded border-slate-700 text-emerald-400 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
                    />
                    Canal Deep Desilting (+35% drain)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">-18% Risk</span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-white/5 cursor-pointer hover:border-blue-500/30 transition-colors">
                  <span className="flex items-center gap-2 text-slate-200 text-[11px]">
                    <input
                      type="checkbox"
                      checked={interventions.emergencyPumping}
                      onChange={() => {
                        soundFx.playClick();
                        setInterventions((prev) => ({ ...prev, emergencyPumping: !prev.emergencyPumping }));
                      }}
                      className="rounded border-slate-700 text-blue-400 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
                    />
                    Heavy Sump Pumps (150 MLD)
                  </span>
                  <span className="text-[10px] text-blue-400 font-bold">-12% Risk</span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-white/5 cursor-pointer hover:border-emerald-500/30 transition-colors">
                  <span className="flex items-center gap-2 text-slate-200 text-[11px]">
                    <input
                      type="checkbox"
                      checked={interventions.wetlandRestoration}
                      onChange={() => {
                        soundFx.playClick();
                        setInterventions((prev) => ({ ...prev, wetlandRestoration: !prev.wetlandRestoration }));
                      }}
                      className="rounded border-slate-700 text-emerald-400 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
                    />
                    Pallikaranai Sponge Basin Buffer
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">-15% Risk</span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-white/5 cursor-pointer hover:border-purple-500/30 transition-colors">
                  <span className="flex items-center gap-2 text-slate-200 text-[11px]">
                    <input
                      type="checkbox"
                      checked={interventions.tidalSurgeGates}
                      onChange={() => {
                        soundFx.playClick();
                        setInterventions((prev) => ({ ...prev, tidalSurgeGates: !prev.tidalSurgeGates }));
                      }}
                      className="rounded border-slate-700 text-purple-400 focus:ring-0 w-3.5 h-3.5 bg-slate-800"
                    />
                    Estuary Tidal Backflow Gates
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold">-22% Surge</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveScenario}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20"
            >
              {savedFeedback ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Scenario Saved to Dossier</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Simulation Scenario</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Impact Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* View Mode Switcher */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
              Simulation Comparison Mode
            </span>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
              <button
                onClick={() => setSimulationMode('baseline')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  simulationMode === 'baseline' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                Baseline
              </button>
              <button
                onClick={() => setSimulationMode('scenario')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  simulationMode === 'scenario' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                Simulated
              </button>
              <button
                onClick={() => setSimulationMode('side_by_side')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  simulationMode === 'side_by_side' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                Side-by-Side Delta
              </button>
            </div>
          </div>

          {/* Grid of Calculated Impacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Inundated Area */}
            <div className="glass-panel p-4 rounded-xl border border-blue-500/20">
              <span className="font-mono text-[10px] text-slate-400 uppercase block">
                Projected Inundated Land
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-mono text-3xl font-extrabold text-blue-400">
                  {simulationMode === 'baseline' ? '32.0' : calculatedImpacts.inundationArea}
                </span>
                <span className="font-mono text-xs text-slate-400">sq km</span>
                {simulationMode === 'side_by_side' && (
                  <span className="text-xs font-mono text-red-400 ml-auto font-bold">
                    +{(calculatedImpacts.inundationArea - 32.0).toFixed(1)} km²
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                Equivalent to ~{Math.round(calculatedImpacts.inundationArea * 185)} football fields
              </div>
            </div>

            {/* Population Exposed */}
            <div className="glass-panel p-4 rounded-xl border border-amber-500/20">
              <span className="font-mono text-[10px] text-slate-400 uppercase block">
                Vulnerable Population Exposed
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-mono text-3xl font-extrabold text-amber-400">
                  {simulationMode === 'baseline' ? '310,000' : calculatedImpacts.populationExposed.toLocaleString()}
                </span>
                {simulationMode === 'side_by_side' && (
                  <span className="text-xs font-mono text-red-400 ml-auto font-bold">
                    +{(calculatedImpacts.populationExposed - 310000).toLocaleString()}
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                Acute risk in Velachery, Perumbakkam & Madipakkam
              </div>
            </div>

            {/* Economic Asset Value at Risk */}
            <div className="glass-panel p-4 rounded-xl border border-purple-500/20">
              <span className="font-mono text-[10px] text-slate-400 uppercase block">
                Direct Economic Asset Risk
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-mono text-3xl font-extrabold text-purple-400">
                  ${simulationMode === 'baseline' ? '420' : calculatedImpacts.economicLoss}
                </span>
                <span className="font-mono text-xs text-slate-400">Million USD</span>
                {simulationMode === 'side_by_side' && (
                  <span className="text-xs font-mono text-red-400 ml-auto font-bold">
                    +${calculatedImpacts.economicLoss - 420}M
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                IT corridors, transport substations & residential stock
              </div>
            </div>

            {/* Critical Assets Vulnerable */}
            <div className="glass-panel p-4 rounded-xl border border-red-500/20">
              <span className="font-mono text-[10px] text-slate-400 uppercase block">
                Critical Infrastructure at Risk
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-mono text-3xl font-extrabold text-red-400">
                  {simulationMode === 'baseline' ? '11' : calculatedImpacts.criticalAssetsCount}
                </span>
                <span className="font-mono text-xs text-slate-400">Facilities</span>
                {simulationMode === 'side_by_side' && (
                  <span className="text-xs font-mono text-red-400 ml-auto font-bold">
                    +{calculatedImpacts.criticalAssetsCount - 11}
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                Hospitals, primary substations & MRTS stations
              </div>
            </div>
          </div>

          {/* Active Engineering Interventions ROI & Averted Loss Banner */}
          {calculatedImpacts.avertedEconomicLoss > 0 && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/50 via-slate-900/60 to-cyan-950/50 border border-emerald-500/40 flex items-center justify-between text-xs font-mono shadow-xl animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className="font-bold text-white block">Intervention Countermeasures Active</span>
                  <span className="text-[11px] text-emerald-300">
                    Mitigating -{calculatedImpacts.avertedInundatedArea} km² of floodwaters across vulnerable basins
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Estimated Loss Averted</span>
                <span className="text-base font-bold text-emerald-300">
                  +${calculatedImpacts.avertedEconomicLoss}M USD
                </span>
              </div>
            </div>
          )}

          {/* Scientific Disclaimer Badge */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-mono font-bold text-amber-300 block mb-0.5">
                HYPOTHETICAL SCIENTIFIC SIMULATION MODEL
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Hydrodynamic response is modeled via numerical 2D Manning’s overland roughness equation coupled with high-resolution 0.5m LiDAR topography. Results indicate vulnerability thresholds and guide sponge infrastructure investments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
