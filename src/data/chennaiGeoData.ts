import type { NeighbourhoodData } from '../types/climate';

export const CHENNAI_NEIGHBOURHOODS: NeighbourhoodData[] = [
  {
    id: 'velachery',
    name: 'Velachery',
    lat: 12.9815,
    lng: 80.2180,
    elevation: 3.2,
    floodRisk: 92,
    heatRisk: 74,
    vegetationIndex: 0.18,
    soilSaturation: 91,
    populationExposed: '315,000 residents',
    criticalAssets: ['Velachery MRTS Station', 'Vijayanagar Junction Underpass', 'Grand Square Drainage Basin', 'South Grid Substation'],
    drainageCapacity: 'Critical Deficit',
    alertStatus: 'Emergency',
    lastUpdated: '12 seconds ago',
    historicalFloods: ['2015 Historic Deluge (1.9m standing water)', '2023 Cyclone Michaung (1.4m standing water)']
  },
  {
    id: 'pallikaranai',
    name: 'Pallikaranai Marshland',
    lat: 12.9349,
    lng: 80.2137,
    elevation: 1.8,
    floodRisk: 96,
    heatRisk: 42,
    vegetationIndex: 0.62,
    soilSaturation: 98,
    populationExposed: '140,000 surrounding residents',
    criticalAssets: ['Ecological Wetland Sump', 'Radial Road Flyover', 'Pallikaranai Wind Hydrology Gauge', 'Okkiyam Madavu Outfall'],
    drainageCapacity: 'Critical Deficit',
    alertStatus: 'Emergency',
    lastUpdated: '18 seconds ago',
    historicalFloods: ['Natural wetland shrunk from 50 sq km to under 4.3 sq km. Severe basin backflow during monsoon.']
  },
  {
    id: 'madipakkam',
    name: 'Madipakkam',
    lat: 12.9623,
    lng: 80.1986,
    elevation: 4.1,
    floodRisk: 88,
    heatRisk: 68,
    vegetationIndex: 0.22,
    soilSaturation: 86,
    populationExposed: '220,000 residents',
    criticalAssets: ['Madipakkam Lake Periphery', 'Koot Road Power Subgrid', 'Puzhuthivakkam Sluice'],
    drainageCapacity: 'Sub-optimal',
    alertStatus: 'Warning',
    lastUpdated: '34 seconds ago',
    historicalFloods: ['Severe lake overflow during 2021 and 2023 monsoon cycles']
  },
  {
    id: 'adyar_basin',
    name: 'Adyar River Estuary',
    lat: 13.0067,
    lng: 80.2575,
    elevation: 2.1,
    floodRisk: 84,
    heatRisk: 48,
    vegetationIndex: 0.45,
    soilSaturation: 89,
    populationExposed: '185,000 riparian population',
    criticalAssets: ['Adyar Tholkappia Poonga Eco Park', 'Elphinstone Bridge', 'Kotturpuram Sluice Gates', 'Saidapet Causeway'],
    drainageCapacity: 'Sub-optimal',
    alertStatus: 'Warning',
    lastUpdated: '22 seconds ago',
    historicalFloods: ['Discharge from Chembarambakkam reservoir reached 33,000 cusecs in 2015 deluging Kotturpuram']
  },
  {
    id: 'tnagar',
    name: 'T. Nagar (Commercial Core)',
    lat: 13.0418,
    lng: 80.2341,
    elevation: 8.5,
    floodRisk: 62,
    heatRisk: 93,
    vegetationIndex: 0.09,
    soilSaturation: 74,
    populationExposed: '280,000 residents & shoppers',
    criticalAssets: ['Panagal Park Substation', 'Ranganathan Street Commercial Strip', 'Mambalam Canal Outfall'],
    drainageCapacity: 'Sub-optimal',
    alertStatus: 'Advisory',
    lastUpdated: '45 seconds ago',
    historicalFloods: ['Severe urban heat island +4.2°C anomaly, canal choking induces street-level inundation']
  },
  {
    id: 'perumbakkam',
    name: 'Perumbakkam & Sholinganallur',
    lat: 12.8988,
    lng: 80.2084,
    elevation: 2.9,
    floodRisk: 89,
    heatRisk: 61,
    vegetationIndex: 0.31,
    soilSaturation: 94,
    populationExposed: '260,000 residents',
    criticalAssets: ['OMR Tech Corridor Towers', 'Perumbakkam Wetland Complex', 'ELCOT IT SEZ Park'],
    drainageCapacity: 'Critical Deficit',
    alertStatus: 'Emergency',
    lastUpdated: '15 seconds ago',
    historicalFloods: ['Repeated isolation during high-intensity rainfall with access roads submerged under 1.2m']
  },
  {
    id: 'mylapore',
    name: 'Mylapore Heritage Core',
    lat: 13.0339,
    lng: 80.2678,
    elevation: 6.8,
    floodRisk: 48,
    heatRisk: 82,
    vegetationIndex: 0.16,
    soilSaturation: 65,
    populationExposed: '175,000 residents',
    criticalAssets: ['Kapaleeshwarar Heritage Tank', 'Kutchery Road Commercial Grid', 'Luz Corner Drainage Line'],
    drainageCapacity: 'Adequate',
    alertStatus: 'Normal',
    lastUpdated: '50 seconds ago',
    historicalFloods: ['Moderate localized ponding, historic temple tanks act as retention buffers']
  },
  {
    id: 'guindy',
    name: 'Guindy & Saidapet',
    lat: 13.0102,
    lng: 80.2150,
    elevation: 11.2,
    floodRisk: 55,
    heatRisk: 88,
    vegetationIndex: 0.35,
    soilSaturation: 71,
    populationExposed: '210,000 residents',
    criticalAssets: ['Guindy National Park Canopy', 'Saidapet Adyar Crossing', 'Industrial Estate Substations'],
    drainageCapacity: 'Adequate',
    alertStatus: 'Normal',
    lastUpdated: '1 minute ago',
    historicalFloods: ['Saidapet causeway submergence during upstream dam discharges']
  },
  {
    id: 'ennore',
    name: 'Ennore & Manali Industrial Basin',
    lat: 13.2144,
    lng: 80.3236,
    elevation: 1.5,
    floodRisk: 94,
    heatRisk: 79,
    vegetationIndex: 0.14,
    soilSaturation: 95,
    populationExposed: '160,000 coastal industrial workers',
    criticalAssets: ['Kamarajar Port Facilities', 'North Chennai Thermal Power Station', 'Ennore Creek Flyash Basins'],
    drainageCapacity: 'Critical Deficit',
    alertStatus: 'Emergency',
    lastUpdated: '10 seconds ago',
    historicalFloods: ['Storm surge, industrial chemical runoff, and creek siltation compound catastrophic risk']
  }
];

export interface SensorTelemetry {
  id: string;
  name: string;
  type: 'radar' | 'water_level' | 'thermal' | 'soil_moisture' | 'tide';
  lat: number;
  lng: number;
  reading: string;
  unit: string;
  status: 'OPTIMAL' | 'ELEVATED' | 'CRITICAL';
  lastPing: string;
}

export const SENSOR_TELEMETRY_NODES: SensorTelemetry[] = [
  {
    id: 'radar-meenambakkam',
    name: 'IMD Meenambakkam S-Band Doppler Radar',
    type: 'radar',
    lat: 12.9856,
    lng: 80.1636,
    reading: '48.2',
    unit: 'dBZ Reflectivity',
    status: 'CRITICAL',
    lastPing: '8s ago'
  },
  {
    id: 'water-chembarambakkam',
    name: 'Chembarambakkam Reservoir Outflow Gauge',
    type: 'water_level',
    lat: 13.0117,
    lng: 80.0573,
    reading: '82.4',
    unit: '% Capacity (18,400 cusecs)',
    status: 'ELEVATED',
    lastPing: '14s ago'
  },
  {
    id: 'gauge-adyar-kotturpuram',
    name: 'Adyar River Kotturpuram Telemetry Node',
    type: 'water_level',
    lat: 13.0235,
    lng: 80.2432,
    reading: '5.8',
    unit: 'meters gauge height (+1.8m surge)',
    status: 'CRITICAL',
    lastPing: '4s ago'
  },
  {
    id: 'tide-marina',
    name: 'INCOIS Marina Beach Deep Tide Station',
    type: 'tide',
    lat: 13.0500,
    lng: 80.2824,
    reading: '+0.84',
    unit: 'meters astronomical tide anomaly',
    status: 'ELEVATED',
    lastPing: '19s ago'
  },
  {
    id: 'thermal-georgetown',
    name: 'North Chennai Urban Heat Flux Station',
    type: 'thermal',
    lat: 13.0880,
    lng: 80.2840,
    reading: '36.8',
    unit: '°C Surface Skin Temp (+4.4°C UHI)',
    status: 'ELEVATED',
    lastPing: '25s ago'
  }
];

// REAL GEOMETRIES: Actual Chennai Hydrographic Networks (Adyar, Cooum, Buckingham Canal, Pallikaranai)
export const CHENNAI_HYDRO_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // Adyar River Path
    {
      type: 'Feature',
      properties: { name: 'Adyar River Basin', flowRate: '18,400 cusecs', risk: 'HIGH' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [80.050, 12.985],
          [80.110, 13.002],
          [80.155, 13.011],
          [80.200, 13.014],
          [80.235, 13.021],
          [80.252, 13.012],
          [80.274, 13.007] // River mouth into Bay of Bengal
        ]
      }
    },
    // Cooum River Path
    {
      type: 'Feature',
      properties: { name: 'Cooum River Central Channel', flowRate: '12,200 cusecs', risk: 'CRITICAL' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [80.130, 13.072],
          [80.180, 13.076],
          [80.220, 13.075],
          [80.250, 13.069],
          [80.278, 13.068],
          [80.288, 13.064] // Marina outfall
        ]
      }
    },
    // Buckingham Canal Corridor
    {
      type: 'Feature',
      properties: { name: 'Buckingham Canal Drainage Artery', flowRate: '4,500 cusecs', risk: 'CHOKED' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [80.320, 13.220],
          [80.300, 13.150],
          [80.288, 13.080],
          [80.270, 13.020],
          [80.250, 12.960],
          [80.238, 12.900],
          [80.220, 12.830]
        ]
      }
    },
    // Pallikaranai Marsh Wetland Sump Polygon
    {
      type: 'Feature',
      properties: { name: 'Pallikaranai Retention Basin', saturation: 98, depth: 2.1 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.200, 12.915],
          [80.228, 12.918],
          [80.235, 12.945],
          [80.222, 12.960],
          [80.198, 12.948],
          [80.200, 12.915]
        ]]
      }
    },
    // Velachery Flood Inundation Basin Polygon
    {
      type: 'Feature',
      properties: { name: 'Velachery Lowland Sump', saturation: 94, depth: 1.8 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.205, 12.968],
          [80.232, 12.970],
          [80.238, 12.992],
          [80.218, 12.998],
          [80.202, 12.985],
          [80.205, 12.968]
        ]]
      }
    },
    // South OMR Tech Corridor Submergence Polygon
    {
      type: 'Feature',
      properties: { name: 'Perumbakkam IT Zone Surcharge', saturation: 92, depth: 1.5 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.195, 12.885],
          [80.225, 12.888],
          [80.230, 12.912],
          [80.200, 12.910],
          [80.195, 12.885]
        ]]
      }
    }
  ]
};

// 3D URBAN BUILDINGS (T. Nagar commercial clusters, OMR IT parks, Guindy industrial blocks)
export const CHENNAI_3D_BUILDINGS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // T. Nagar High-Rise Commercial Hub
    {
      type: 'Feature',
      properties: { name: 'T. Nagar Commercial Towers', height: 48, base_height: 0, color: '#38bdf8' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.230, 13.038], [80.240, 13.038], [80.240, 13.046], [80.230, 13.046], [80.230, 13.038]
        ]]
      }
    },
    // OMR IT Towers (Sholinganallur & Perumbakkam)
    {
      type: 'Feature',
      properties: { name: 'OMR Cyber Park Towers', height: 72, base_height: 0, color: '#22d3ee' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.224, 12.900], [80.236, 12.900], [80.236, 12.912], [80.224, 12.912], [80.224, 12.900]
        ]]
      }
    },
    // Guindy Industrial SEZ
    {
      type: 'Feature',
      properties: { name: 'Guindy Industrial SEZ', height: 35, base_height: 0, color: '#818cf8' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.208, 13.004], [80.220, 13.004], [80.220, 13.016], [80.208, 13.016], [80.208, 13.004]
        ]]
      }
    },
    // Velachery MRTS & Transit Hub
    {
      type: 'Feature',
      properties: { name: 'Velachery MRTS Terminal', height: 28, base_height: 0, color: '#f43f5e' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.214, 12.978], [80.224, 12.978], [80.224, 12.986], [80.214, 12.986], [80.214, 12.978]
        ]]
      }
    }
  ]
};
