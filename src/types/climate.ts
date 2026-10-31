export type ViewMode = 'globe' | 'twin' | 'analytics' | 'simulator' | 'ai';

export interface CityData {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  primaryHazard: 'Flash Flood & Inundation' | 'Extreme Heat & Drought' | 'Coastal Storm Surge' | 'Sea Level Rise';
  currentTemp: number;
  tempAnomaly: number; // vs baseline
  humidity: number;
  precipitationRate: number; // mm/h
  seaLevelRisk: string;
  population: string;
  vulnerabilityIndex: number;
  description: string;
}

export interface NeighbourhoodData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  elevation: number; // meters MSL
  floodRisk: number; // 0 - 100
  heatRisk: number; // 0 - 100
  vegetationIndex: number; // 0 - 1 (NDVI)
  soilSaturation: number; // %
  populationExposed: string;
  criticalAssets: string[];
  drainageCapacity: 'Critical Deficit' | 'Sub-optimal' | 'Adequate' | 'Reinforced';
  alertStatus: 'Normal' | 'Advisory' | 'Warning' | 'Emergency';
  lastUpdated: string;
  historicalFloods: string[];
}

export interface ClimateScenario {
  id: string;
  name: string;
  year: number;
  code: string;
  tempIncrease: number; // °C
  precipitationChange: number; // %
  seaLevelRise: number; // cm
  floodExtentSqKm: number;
  heatWaveDaysPerYear: number;
  economicRiskUSD: string;
  populationAtRisk: string;
  description: string;
}

export interface TimelinePoint {
  id: string;
  label: string;
  date: string;
  type: 'historical' | 'live' | 'forecast' | 'scenario';
  temp: number;
  rainfall: number;
  floodIndex: number;
  narrative: string;
}

export interface MapLayerState {
  satellite: boolean;
  terrain: boolean;
  floodRisk: boolean;
  heatRisk: boolean;
  rainfallRadar: boolean;
  vegetation: boolean;
  waterBodies: boolean;
  elevationContour: boolean;
  sensorNodes: boolean;
  evacuationRoutes: boolean;
  reliefShelters: boolean;
  opacity: {
    floodRisk: number;
    heatRisk: number;
    rainfallRadar: number;
    vegetation: number;
  };
}

export interface ReliefShelter {
  id: string;
  name: string;
  category: 'Major High-Ground Shelter' | 'NDRF Boat Staging Depot' | 'Medical Emergency Center' | 'Air Rescue Base';
  lat: number;
  lng: number;
  elevation: number;
  capacity: number;
  currentOccupancy: number;
  status: 'Operational' | 'Standby' | 'Near Capacity';
  contact: string;
  supplies: {
    cleanWaterDays: number;
    powerGenerators: boolean;
    medicalStaff: number;
    rescueBoats: number;
  };
  connectedZones: string[];
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  citations?: {
    source: string;
    dataset: string;
    confidence: string;
  }[];
  metrics?: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    color: string;
  }[];
  suggestedAction?: {
    label: string;
    type: 'highlight_zone' | 'switch_layer' | 'run_simulation';
    targetId?: string;
  };
}
