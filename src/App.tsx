import React, { useState, useEffect } from 'react';
import type { ViewMode, CityData, TimelinePoint } from './types/climate';
import { GLOBAL_CITIES } from './data/citiesData';
import { TIMELINE_POINTS } from './data/climateScenarios';
import { soundFx } from './utils/audioSynthesizer';

// Components
import { Header } from './components/navigation/Header';
import { NavRail } from './components/navigation/NavRail';
import { GlobalSearchModal } from './components/navigation/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { ExecutiveDossierModal } from './components/common/ExecutiveDossierModal';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import { TwinComparisonModal } from './components/common/TwinComparisonModal';
import { CycloneTrackerModal } from './components/common/CycloneTrackerModal';
import { SatelliteTimeLapseModal } from './components/common/SatelliteTimeLapseModal';
import { IoTSensorNetworkModal } from './components/common/IoTSensorNetworkModal';
import { StreetInundationViewer } from './components/common/StreetInundationViewer';
import { EvacuationRoutesModal } from './components/common/EvacuationRoutesModal';
import { RedAlertBanner } from './components/common/RedAlertBanner';
import { IncidentReportModal } from './components/common/IncidentReportModal';
import { OfflineFieldPackModal } from './components/common/OfflineFieldPackModal';
import { CinematicIntro } from './components/intro/CinematicIntro';
import { EarthGlobe } from './components/3d/EarthGlobe';
import { FallbackMap2D } from './components/3d/FallbackMap2D';
import { DigitalTwinMap } from './components/map/DigitalTwinMap';
import { TemperatureGauge } from './components/intelligence/TemperatureGauge';
import { RainfallIntensity } from './components/intelligence/RainfallIntensity';
import { FloodRiskGauge } from './components/intelligence/FloodRiskGauge';
import { HeatExposureGauge } from './components/intelligence/HeatExposureGauge';
import { EnvironmentalQuality } from './components/intelligence/EnvironmentalQuality';
import { ScientificCharts } from './components/charts/ScientificCharts';
import { ScenarioSimulator } from './components/simulator/ScenarioSimulator';
import { AIAnalystPanel } from './components/ai/AIAnalystPanel';
import { ClimateTimeline } from './components/timeline/ClimateTimeline';
import { DataSourceBadge } from './components/intelligence/DataSourceBadge';
import { fetchLiveCityWeather, type LiveWeatherData } from './utils/weatherApi';

import { ArrowRight, HelpCircle } from 'lucide-react';

export const App: React.FC = () => {
  // App state
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return localStorage.getItem('climora_intro_completed') !== 'true';
  });

  const [viewMode, setViewMode] = useState<ViewMode>('globe');
  const [selectedCity, setSelectedCity] = useState<CityData>(GLOBAL_CITIES[0]); // Chennai
  const [selectedTimelinePoint, setSelectedTimelinePoint] = useState<TimelinePoint>(TIMELINE_POINTS[3]); // Live now
  const [is2DFallback, setIs2DFallback] = useState<boolean>(false);
  const [highlightNeighbourhoodId, setHighlightNeighbourhoodId] = useState<string | null>(null);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isCycloneOpen, setIsCycloneOpen] = useState(false);
  const [isTimeLapseOpen, setIsTimeLapseOpen] = useState(false);
  const [isIoTOpen, setIsIoTOpen] = useState(false);
  const [isStreetViewOpen, setIsStreetViewOpen] = useState(false);
  const [isEvacuationOpen, setIsEvacuationOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isRedAlert, setIsRedAlert] = useState(false);
  const [isIncidentReportOpen, setIsIncidentReportOpen] = useState(false);
  const [isFieldPackOpen, setIsFieldPackOpen] = useState(false);

  // Live telemetry stream state (Open-Meteo)
  const [liveWeather, setLiveWeather] = useState<LiveWeatherData | null>(null);
  const [isLiveLoading, setIsLiveLoading] = useState(false);

  const loadLiveWeather = async (city: CityData) => {
    setIsLiveLoading(true);
    const data = await fetchLiveCityWeather(city.lat, city.lng);
    if (data) {
      setLiveWeather(data);
    }
    setIsLiveLoading(false);
  };

  useEffect(() => {
    loadLiveWeather(selectedCity);
  }, [selectedCity]);

  // Keyboard shortcut listeners (Cmd/Ctrl+K, 1-5, D, ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundFx.playClick();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === '1') {
        soundFx.playClick();
        setViewMode('globe');
      } else if (e.key === '2') {
        soundFx.playClick();
        setViewMode('twin');
      } else if (e.key === '3') {
        soundFx.playClick();
        setViewMode('analytics');
      } else if (e.key === '4') {
        soundFx.playClick();
        setViewMode('simulator');
      } else if (e.key === '5') {
        soundFx.playClick();
        setViewMode('ai');
      } else if (e.key.toLowerCase() === 'd') {
        soundFx.playClick();
        setIsDossierOpen(true);
      } else if (e.key.toLowerCase() === 'c') {
        soundFx.playRadarPing();
        setIsCycloneOpen(true);
      } else if (e.key.toLowerCase() === 't') {
        soundFx.playClick();
        setIsTimeLapseOpen(true);
      } else if (e.key.toLowerCase() === 'i') {
        soundFx.playClick();
        setIsIoTOpen(true);
      } else if (e.key.toLowerCase() === 's') {
        soundFx.playClick();
        setIsStreetViewOpen(true);
      } else if (e.key.toLowerCase() === 'e') {
        soundFx.playClick();
        setIsEvacuationOpen(true);
      } else if (e.key.toLowerCase() === 'r') {
        soundFx.playClick();
        setIsRedAlert((prev) => !prev);
      } else if (e.key.toLowerCase() === 'p') {
        soundFx.playClick();
        setIsIncidentReportOpen(true);
      } else if (e.key.toLowerCase() === 'o') {
        soundFx.playClick();
        setIsFieldPackOpen(true);
      } else if (e.key === '?') {
        soundFx.playClick();
        setIsShortcutsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTransitionToTwin = (city: CityData) => {
    soundFx.playRadarPing();
    setSelectedCity(city);
    setViewMode('twin');
  };

  const handleHighlightFromAI = (neighbourhoodId: string) => {
    soundFx.playRadarPing();
    setHighlightNeighbourhoodId(neighbourhoodId);
    setViewMode('twin');
  };

  const handleModeChange = (mode: ViewMode) => {
    soundFx.playClick();
    setViewMode(mode);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050811] text-[#F8FAFC] flex flex-col font-sans select-none">
      {/* Cinematic Intro Reveal Sequence */}
      {showIntro && (
        <CinematicIntro onComplete={() => setShowIntro(false)} />
      )}

      {/* MULTI-AGENCY LEVEL-4 RED ALERT BANNER & STROBE */}
      <RedAlertBanner
        isActive={isRedAlert}
        onDeactivate={() => setIsRedAlert(false)}
        onOpenEvacuation={() => setIsEvacuationOpen(true)}
        onOpenCyclone={() => setIsCycloneOpen(true)}
        cityName={selectedCity.name}
      />

      {/* Top Global Command Centre Header */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        viewMode={viewMode}
        onChangeViewMode={handleModeChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleNotifications={() => setIsNotificationsOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onOpenCyclone={() => setIsCycloneOpen(true)}
        isRedAlert={isRedAlert}
        onToggleRedAlert={() => setIsRedAlert((prev) => !prev)}
        onOpenIncidentReport={() => setIsIncidentReportOpen(true)}
        liveWeather={liveWeather}
        isLiveLoading={isLiveLoading}
        onRefreshWeather={() => loadLiveWeather(selectedCity)}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* Floating Left Navigation Rail */}
      <NavRail
        currentMode={viewMode}
        onChangeMode={handleModeChange}
        onOpenDataSources={() => setIsDataSourcesOpen(true)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onOpenCyclone={() => setIsCycloneOpen(true)}
        onOpenTimeLapse={() => setIsTimeLapseOpen(true)}
        onOpenIoT={() => setIsIoTOpen(true)}
        onOpenStreetView={() => setIsStreetViewOpen(true)}
        onOpenEvacuation={() => setIsEvacuationOpen(true)}
        isRedAlert={isRedAlert}
        onToggleRedAlert={() => setIsRedAlert((prev) => !prev)}
        onOpenIncidentReport={() => setIsIncidentReportOpen(true)}
        onOpenFieldPack={() => setIsFieldPackOpen(true)}
      />

      {/* Main Spatial Command Centre Workspace */}
      <main className="flex-1 relative overflow-hidden pl-16 sm:pl-20 pr-4 py-3 flex flex-col">
        {/* CENTER VIEWPORT CONDITIONAL RENDER */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border border-cyan-500/15 glass-panel shadow-2xl">
          {/* MODE 1: 3D PLANETARY ORBIT GLOBE */}
          {viewMode === 'globe' && (
            <div className="relative w-full h-full">
              {!is2DFallback ? (
                <EarthGlobe
                  selectedCity={selectedCity}
                  onSelectCity={setSelectedCity}
                  onTransitionToTwin={handleTransitionToTwin}
                />
              ) : (
                <FallbackMap2D
                  selectedCity={selectedCity}
                  onSelectCity={setSelectedCity}
                  onTransitionToTwin={handleTransitionToTwin}
                />
              )}

              {/* 2D Fallback / 3D Toggle Pill */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center p-1 rounded-xl glass-panel border border-white/10 text-xs font-mono">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setIs2DFallback(false);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    !is2DFallback ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400'
                  }`}
                >
                  Three.js 3D Earth
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setIs2DFallback(true);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    is2DFallback ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400'
                  }`}
                >
                  2D Low-Power Map
                </button>
              </div>

              {/* Right Side Quick Telemetry Panel Overlay on Globe */}
              <div className="absolute top-6 right-6 hidden lg:flex flex-col gap-3 w-80 pointer-events-none z-10">
                <div className="pointer-events-auto">
                  <TemperatureGauge
                    currentTemp={liveWeather ? liveWeather.temperature : selectedCity.currentTemp}
                    tempAnomaly={selectedCity.tempAnomaly}
                    city={selectedCity.name}
                  />
                </div>
                <div className="pointer-events-auto">
                  <FloodRiskGauge
                    riskScore={selectedCity.riskScore}
                    riskLevel={selectedCity.riskLevel}
                  />
                </div>
                <div className="pointer-events-auto">
                  <RainfallIntensity
                    precipitationRate={liveWeather && liveWeather.precipitation > 0 ? liveWeather.precipitation : selectedCity.precipitationRate}
                    city={selectedCity.name}
                  />
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: DIGITAL TWIN GIS LOCAL MAP */}
          {viewMode === 'twin' && (
            <DigitalTwinMap
              city={selectedCity}
              onBackToGlobe={() => handleModeChange('globe')}
              onAskAI={() => {
                handleModeChange('ai');
              }}
              onRunSimulation={() => {
                handleModeChange('simulator');
              }}
              highlightNeighbourhoodId={highlightNeighbourhoodId}
            />
          )}

          {/* MODE 3: CLIMATE INTELLIGENCE INSTRUMENTS & CHARTS */}
          {viewMode === 'analytics' && (
            <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#060c18]/90">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <TemperatureGauge
                  currentTemp={liveWeather ? liveWeather.temperature : selectedCity.currentTemp}
                  tempAnomaly={selectedCity.tempAnomaly}
                  city={selectedCity.name}
                />
                <RainfallIntensity
                  precipitationRate={liveWeather && liveWeather.precipitation > 0 ? liveWeather.precipitation : selectedCity.precipitationRate}
                  city={selectedCity.name}
                />
                <FloodRiskGauge
                  riskScore={selectedCity.riskScore}
                  riskLevel={selectedCity.riskLevel}
                />
                <HeatExposureGauge city={selectedCity.name} />
                <EnvironmentalQuality
                  humidity={liveWeather ? liveWeather.humidity : selectedCity.humidity}
                  pressure={liveWeather ? liveWeather.surfacePressure : 1008.4}
                  windSpeed={liveWeather ? liveWeather.windSpeed : 22.4}
                  liveUpdated={!!liveWeather}
                  source={liveWeather ? liveWeather.source : 'CPCB & IMD Port AWS'}
                />
                <div className="glass-panel p-4 rounded-xl border border-purple-500/20 flex flex-col justify-between">
                  <div>
                    <span className="font-heading font-semibold text-xs tracking-wide text-slate-100 uppercase block mb-1">
                      Compound Hazard Summary
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {selectedCity.name} exhibits compound vulnerability: high soil saturation coupled with coastal tidal resistance reduces gravitational outflow velocity by 42%.
                    </p>
                  </div>
                  <button
                    onClick={() => handleModeChange('simulator')}
                    className="mt-4 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-all"
                  >
                    <span>Launch Scenario Simulation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scientific Visualizations (Recharts) */}
              <ScientificCharts />
            </div>
          )}

          {/* MODE 4: SCENARIO SIMULATOR */}
          {viewMode === 'simulator' && (
            <div className="w-full h-full overflow-y-auto p-4 sm:p-6 bg-[#060c18]/90">
              <ScenarioSimulator />
            </div>
          )}

          {/* MODE 5: AI CLIMATE INTELLIGENCE ANALYST */}
          {viewMode === 'ai' && (
            <div className="w-full h-full p-4 sm:p-6 bg-[#060c18]/90">
              <AIAnalystPanel
                onHighlightNeighbourhood={handleHighlightFromAI}
                onSwitchToMap={() => handleModeChange('twin')}
              />
            </div>
          )}
        </div>

        {/* BOTTOM: INTERACTIVE CLIMATE TIMELINE */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1">
            <ClimateTimeline
              currentPoint={selectedTimelinePoint}
              onSelectPoint={setSelectedTimelinePoint}
            />
          </div>
          {/* Quick Shortcuts Trigger */}
          <button
            onClick={() => {
              soundFx.playClick();
              setIsShortcutsOpen(true);
            }}
            title="Keyboard Shortcuts (?)"
            className="hidden sm:flex p-3 rounded-2xl glass-panel text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* GLOBAL SEARCH MODAL (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCity={(c) => {
          setSelectedCity(c);
          handleModeChange('globe');
        }}
        onSelectNeighbourhood={(n) => {
          setHighlightNeighbourhoodId(n.id);
          handleModeChange('twin');
        }}
      />

      {/* NOTIFICATIONS DRAWER */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* DATA SOURCES & PROVENANCE MODAL */}
      <DataSourceBadge
        isOpen={isDataSourcesOpen}
        onClose={() => setIsDataSourcesOpen(false)}
      />

      {/* EXECUTIVE CLIMATE DOSSIER MODAL */}
      <ExecutiveDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        city={selectedCity}
      />

      {/* TWIN-TO-TWIN RESILIENCE COMPARISON BENCHMARK MODAL */}
      <TwinComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        baseCity={selectedCity}
      />

      {/* KEYBOARD SHORTCUTS PALETTE */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* FEATURE 1: BAY OF BENGAL CYCLONE TRAJECTORY & RADAR */}
      <CycloneTrackerModal
        isOpen={isCycloneOpen}
        onClose={() => setIsCycloneOpen(false)}
        onTrackOnMap={(coords) => {
          setSelectedCity({ ...selectedCity, lng: coords[0], lat: coords[1] });
          setViewMode('twin');
        }}
      />

      {/* FEATURE 2: HISTORICAL SATELLITE TIME-LAPSE COMPARISON */}
      <SatelliteTimeLapseModal
        isOpen={isTimeLapseOpen}
        onClose={() => setIsTimeLapseOpen(false)}
      />

      {/* FEATURE 3: IOT RIVER GAUGE & SLUICE GATE TELEMETRY NETWORK */}
      <IoTSensorNetworkModal
        isOpen={isIoTOpen}
        onClose={() => setIsIoTOpen(false)}
        onFocusSensorOnMap={(coords) => {
          setSelectedCity({ ...selectedCity, lng: coords[0], lat: coords[1] });
          setViewMode('twin');
        }}
      />

      {/* FEATURE 5: FIRST-PERSON 3D STREET-LEVEL INUNDATION CAMERA */}
      <StreetInundationViewer
        isOpen={isStreetViewOpen}
        onClose={() => setIsStreetViewOpen(false)}
      />

      {/* EMERGENCY EVACUATION & RELIEF SHELTERS COMMAND */}
      <EvacuationRoutesModal
        isOpen={isEvacuationOpen}
        onClose={() => setIsEvacuationOpen(false)}
        onSelectShelter={(shelter) => {
          setSelectedCity({ ...selectedCity, lng: shelter.lng, lat: shelter.lat });
          setViewMode('twin');
        }}
      />

      {/* OFFICIAL INCIDENT SITUATION REPORT (SITREP) */}
      <IncidentReportModal
        isOpen={isIncidentReportOpen}
        onClose={() => setIsIncidentReportOpen(false)}
        city={selectedCity}
      />

      {/* OFFLINE EMERGENCY FIELD PACK */}
      <OfflineFieldPackModal
        isOpen={isFieldPackOpen}
        onClose={() => setIsFieldPackOpen(false)}
        city={selectedCity}
      />
    </div>
  );
};

export default App;
