import { ClimateScenario, TimelinePoint } from '../types/climate';

export const CLIMATE_SCENARIOS: ClimateScenario[] = [
  {
    id: 'ssp1_26',
    name: 'SSP1-2.6: Paris Goal Aligned (Low Emissions)',
    year: 2050,
    code: 'SSP1-2.6',
    tempIncrease: 1.5,
    precipitationChange: 8,
    seaLevelRise: 28,
    floodExtentSqKm: 42.5,
    heatWaveDaysPerYear: 28,
    economicRiskUSD: '$4.2B',
    populationAtRisk: '420,000 residents',
    description: 'Rapid global decarbonization with aggressive urban green corridors, wetland restoration, and early sponge-city retrofit.'
  },
  {
    id: 'ssp2_45',
    name: 'SSP2-4.5: Middle-of-the-Road (Current Trajectory)',
    year: 2050,
    code: 'SSP2-4.5',
    tempIncrease: 2.4,
    precipitationChange: 18,
    seaLevelRise: 48,
    floodExtentSqKm: 78.4,
    heatWaveDaysPerYear: 64,
    economicRiskUSD: '$12.8B',
    populationAtRisk: '1,150,000 residents',
    description: 'Current policy commitments fulfilled without deeper decarbonization. Recurrent 100-year rainfall deluges become 1-in-15 year occurrences.'
  },
  {
    id: 'ssp5_85',
    name: 'SSP5-8.5: High Emissions (Fossil-Fueled Development)',
    year: 2050,
    code: 'SSP5-8.5',
    tempIncrease: 4.1,
    precipitationChange: 34,
    seaLevelRise: 74,
    floodExtentSqKm: 136.2,
    heatWaveDaysPerYear: 112,
    economicRiskUSD: '$29.4B',
    populationAtRisk: '2,600,000 residents',
    description: 'Unmitigated carbon trajectory causing catastrophic monsoon intensification, persistent wet-bulb temperature breaches (>31°C), and irreversible coastal lowlands inundation.'
  }
];

export const TIMELINE_POINTS: TimelinePoint[] = [
  {
    id: 'hist-2015',
    label: '2015 Deluge',
    date: 'Dec 01, 2015',
    type: 'historical',
    temp: 27.2,
    rainfall: 494, // mm in 24h
    floodIndex: 98,
    narrative: 'Record 494 mm rainfall in 24h deluged 80% of Chennai. Chembarambakkam outflow reached 33,000 cusecs; airport runway submerged.'
  },
  {
    id: 'hist-2019',
    label: '2019 Day Zero',
    date: 'Jun 19, 2019',
    type: 'historical',
    temp: 42.8,
    rainfall: 0,
    floodIndex: 12,
    narrative: 'Severe prolonged drought dried all four major reservoirs feeding Chennai. City relied on emergency water trains and deep borehole extraction.'
  },
  {
    id: 'hist-2023',
    label: '2023 Michaung',
    date: 'Dec 04, 2023',
    type: 'historical',
    temp: 26.5,
    rainfall: 390,
    floodIndex: 91,
    narrative: 'Cyclone Michaung stalled 100km offshore, unleashing 450mm precipitation across 36 hours. Velachery, Perumbakkam, and Manali isolated.'
  },
  {
    id: 'live-now',
    label: 'LIVE SATELLITE',
    date: 'Real-time Telemetry',
    type: 'live',
    temp: 32.4,
    rainfall: 14.2,
    floodIndex: 84,
    narrative: 'Real-time composite telemetry stream from Copernicus Sentinel-2, ERA5 Reanalysis, and IMD Doppler Radar nodes.'
  },
  {
    id: 'forecast-24h',
    label: '+24h Forecast',
    date: 'Tomorrow 18:00 UTC',
    type: 'forecast',
    temp: 33.1,
    rainfall: 38.0,
    floodIndex: 87,
    narrative: 'Monsoon trough intensification predicted to dump 35-50mm localized bursts over south Chennai coastal catchment.'
  },
  {
    id: 'forecast-7d',
    label: '+7d Trend',
    date: '7-Day Outlook',
    type: 'forecast',
    temp: 31.5,
    rainfall: 120.0,
    floodIndex: 79,
    narrative: 'Low-pressure system over Bay of Bengal maintaining elevated soil saturation (>85%) across marshlands.'
  },
  {
    id: 'proj-2030',
    label: '2030 Horizon',
    date: 'IPCC AR6 Mid-Term',
    type: 'scenario',
    temp: 33.8,
    rainfall: 65.0,
    floodIndex: 89,
    narrative: 'Estimated +1.2°C mean temperature increase with 15% surge in extreme 3-hour precipitation episodes.'
  },
  {
    id: 'proj-2050',
    label: '2050 Climate Twin',
    date: 'SSP2-4.5 Projection',
    type: 'scenario',
    temp: 35.2,
    rainfall: 95.0,
    floodIndex: 94,
    narrative: 'Compound hazard: +0.48m sea level rise coupled with 20% higher peak stormwater discharge.'
  }
];

export const DATA_PROVENANCE = [
  {
    name: 'Copernicus Climate Change Service (ERA5)',
    frequency: 'Hourly Reanalysis',
    resolution: '0.1° (~11 km)',
    status: 'ACTIVE • 99.98% Latency 38s',
    provider: 'ECMWF / European Union'
  },
  {
    name: 'NASA Global Precipitation Measurement (GPM IMERG)',
    frequency: '30-minute updates',
    resolution: '0.1° grid',
    status: 'ACTIVE • Calibrated Radar/Microwave',
    provider: 'NASA Goddard / JAXA'
  },
  {
    name: 'India Meteorological Department (IMD) Radar Network',
    frequency: '10-minute sweep',
    resolution: '500m Doppler Velocity',
    status: 'ACTIVE • Meenambakkam S-Band Station',
    provider: 'Ministry of Earth Sciences, Govt. of India'
  },
  {
    name: 'INCOIS Coastal Storm Surge & Wave Telemetry',
    frequency: '15-minute coastal sensors',
    resolution: 'Tide gauge network',
    status: 'ACTIVE • Bay of Bengal Real-time Buoys',
    provider: 'INCOIS Hyderabad'
  }
];
