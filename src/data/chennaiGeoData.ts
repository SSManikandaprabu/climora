import type { NeighbourhoodData, ReliefShelter } from '../types/climate';

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
    criticalAssets: ['Velachery MRTS Station', 'Vijayanagar Junction Underpass', 'Grand Square Drainage Basin', 'South Grid Substation', 'Phoenix MarketCity'],
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
    criticalAssets: ['Guindy National Park Canopy', 'Saidapet Adyar Crossing', 'Olympia Tech Park', 'Industrial Estate Substations'],
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
  },
  {
    id: 'red_hills',
    name: 'Red Hills (Puzhal Reservoir)',
    lat: 13.1980,
    lng: 80.1780,
    elevation: 16.5,
    floodRisk: 74,
    heatRisk: 62,
    vegetationIndex: 0.58,
    soilSaturation: 84,
    populationExposed: '195,000 residents & peripheral villages',
    criticalAssets: [
      'Puzhal Lake Dam Sluices (3,300 mcft)',
      'Metro Water Treatment Plant',
      'Kosasthalaiyar Surplus Channel',
      'Grand Northern Trunk Road'
    ],
    drainageCapacity: 'Adequate',
    alertStatus: 'Warning',
    lastUpdated: '8 seconds ago',
    historicalFloods: [
      '2015 surplus spillway discharge reached 12,000 cusecs into Kosasthalaiyar River',
      '2023 Cyclone Michaung reservoir touched 94% storage threshold within 18 hours'
    ]
  },
  {
    id: 'anna_nagar',
    name: 'Anna Nagar (Central Metro)',
    lat: 13.0850,
    lng: 80.2100,
    elevation: 12.4,
    floodRisk: 52,
    heatRisk: 86,
    vegetationIndex: 0.28,
    soilSaturation: 66,
    populationExposed: '340,000 residents',
    criticalAssets: [
      'Anna Nagar Tower Park Sump',
      'Otteri Nullah Storm Canal',
      'Thirumangalam Metro Station',
      'Roundtana Commercial Grid'
    ],
    drainageCapacity: 'Reinforced',
    alertStatus: 'Normal',
    lastUpdated: '14 seconds ago',
    historicalFloods: [
      'Otteri Nullah canal overspill during 100mm/h cloudbursts; localized underpass inundation at 3rd Avenue'
    ]
  },
  {
    id: 'porur',
    name: 'Porur & Porur Lake Basin',
    lat: 13.0382,
    lng: 80.1565,
    elevation: 14.8,
    floodRisk: 82,
    heatRisk: 76,
    vegetationIndex: 0.34,
    soilSaturation: 88,
    populationExposed: '280,000 residents & IT workers',
    criticalAssets: [
      'Porur Drinking Water Lake',
      'Sri Ramachandra Institute of Higher Education',
      'Mount-Poonamallee Highway Flyover',
      'Porur Junction Underpass'
    ],
    drainageCapacity: 'Sub-optimal',
    alertStatus: 'Warning',
    lastUpdated: '11 seconds ago',
    historicalFloods: [
      '2015 lake breach submerged Porur-Kundrathur highway under 1.5m water',
      '2023 severe junction waterlogging and Mugalivakkam drainage overflow'
    ]
  },
  {
    id: 'poonamallee',
    name: 'Poonamallee Western Hub',
    lat: 13.0489,
    lng: 80.0984,
    elevation: 18.2,
    floodRisk: 68,
    heatRisk: 79,
    vegetationIndex: 0.36,
    soilSaturation: 75,
    populationExposed: '235,000 residents',
    criticalAssets: [
      'Bengaluru National Highway (NH-48) Corridor',
      'Chennai Metro Phase-2 Depot',
      'Cooum Western Inflow Channel',
      'Blind Eye Lake Cascading Network'
    ],
    drainageCapacity: 'Sub-optimal',
    alertStatus: 'Advisory',
    lastUpdated: '19 seconds ago',
    historicalFloods: [
      'Agricultural runoff overflow from surrounding peri-urban tanks during northeast monsoon peaks'
    ]
  },
  {
    id: 'avadi',
    name: 'Avadi Municipal Corporation',
    lat: 13.1147,
    lng: 80.1009,
    elevation: 21.0,
    floodRisk: 76,
    heatRisk: 74,
    vegetationIndex: 0.41,
    soilSaturation: 84,
    populationExposed: '375,000 residents',
    criticalAssets: [
      'Heavy Vehicles Factory (HVF) Complex',
      'Paruthipattu Lake Eco-Park Basin',
      'Avadi Railway Junction',
      'Military Ordnance Depot'
    ],
    drainageCapacity: 'Sub-optimal',
    alertStatus: 'Warning',
    lastUpdated: '16 seconds ago',
    historicalFloods: [
      'Paruthipattu Lake overflow inundated surrounding residential layouts; low-lying railway subways submerged in 2023'
    ]
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
          [80.274, 13.007]
        ]
      }
    },
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
          [80.288, 13.064]
        ]
      }
    },
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
    },
    // Red Hills (Puzhal Lake) Drinking Water Reservoir
    {
      type: 'Feature',
      properties: { name: 'Red Hills (Puzhal Lake) Reservoir Basin', saturation: 84, depth: 4.8 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.160, 13.180],
          [80.195, 13.182],
          [80.205, 13.215],
          [80.170, 13.220],
          [80.155, 13.200],
          [80.160, 13.180]
        ]]
      }
    },
    // Porur Lake Reservoir & Discharge Channel
    {
      type: 'Feature',
      properties: { name: 'Porur Lake Reservoir Basin', saturation: 88, depth: 3.2 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.145, 13.030],
          [80.165, 13.032],
          [80.168, 13.045],
          [80.150, 13.048],
          [80.142, 13.038],
          [80.145, 13.030]
        ]]
      }
    }
  ]
};

// 3D REAL URBAN BUILDINGS (Accurately geo-referenced to Google Maps coordinates)
export const CHENNAI_3D_BUILDINGS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // Chennai Central Railway Station & Ripon Building
    {
      type: 'Feature',
      properties: { name: 'Chennai Central & Heritage Terminus', height: 45, base_height: 0, color: '#06b6d4' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.272, 13.081], [80.278, 13.081], [80.278, 13.086], [80.272, 13.086], [80.272, 13.081]
        ]]
      }
    },
    // T. Nagar Panagal Park Commercial Towers
    {
      type: 'Feature',
      properties: { name: 'T. Nagar Commercial Towers', height: 54, base_height: 0, color: '#38bdf8' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.230, 13.038], [80.242, 13.038], [80.242, 13.048], [80.230, 13.048], [80.230, 13.038]
        ]]
      }
    },
    // TIDEL Park & Ascendas IT Park (Taramani/OMR)
    {
      type: 'Feature',
      properties: { name: 'TIDEL Park & Ascendas Tech Towers', height: 68, base_height: 0, color: '#22d3ee' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.244, 12.987], [80.254, 12.987], [80.254, 12.995], [80.244, 12.995], [80.244, 12.987]
        ]]
      }
    },
    // Olympia Tech Park (Guindy)
    {
      type: 'Feature',
      properties: { name: 'Olympia Tech Park Towers', height: 58, base_height: 0, color: '#818cf8' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.205, 13.010], [80.215, 13.010], [80.215, 13.018], [80.205, 13.018], [80.205, 13.010]
        ]]
      }
    },
    // Velachery MRTS & Phoenix MarketCity Hub
    {
      type: 'Feature',
      properties: { name: 'Phoenix MarketCity & Velachery Complex', height: 42, base_height: 0, color: '#f43f5e' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.213, 12.988], [80.222, 12.988], [80.222, 12.995], [80.213, 12.995], [80.213, 12.988]
        ]]
      }
    },
    // ELCOT IT SEZ & Sholinganallur Towers (OMR)
    {
      type: 'Feature',
      properties: { name: 'ELCOT IT SEZ Tech Towers', height: 75, base_height: 0, color: '#a855f7' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.224, 12.900], [80.236, 12.900], [80.236, 12.912], [80.224, 12.912], [80.224, 12.900]
        ]]
      }
    },
    // Meenambakkam Airport Passenger Terminals & Hangars
    {
      type: 'Feature',
      properties: { name: 'Chennai International Airport Terminals', height: 32, base_height: 0, color: '#3b82f6' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.165, 12.988], [80.178, 12.988], [80.178, 12.998], [80.165, 12.998], [80.165, 12.988]
        ]]
      }
    },
    // Chepauk Stadium & Marina Coastline Towers
    {
      type: 'Feature',
      properties: { name: 'Chepauk Arena & Marina Towers', height: 50, base_height: 0, color: '#10b981' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.276, 13.060], [80.284, 13.060], [80.284, 13.068], [80.276, 13.068], [80.276, 13.060]
        ]]
      }
    },
    // Anna Nagar Tower & Commercial Grid
    {
      type: 'Feature',
      properties: { name: 'Anna Nagar Tower & Metro Grid', height: 48, base_height: 0, color: '#38bdf8' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.206, 13.082], [80.214, 13.082], [80.214, 13.088], [80.206, 13.088], [80.206, 13.082]
        ]]
      }
    },
    // Porur DLF IT Park & Medical Campus
    {
      type: 'Feature',
      properties: { name: 'Porur DLF Cybercity & Sri Ramachandra Campus', height: 55, base_height: 0, color: '#06b6d4' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.152, 13.033], [80.162, 13.033], [80.162, 13.042], [80.152, 13.042], [80.152, 13.033]
        ]]
      }
    },
    // Red Hills Puzhal Water Treatment Works & Dam Crest
    {
      type: 'Feature',
      properties: { name: 'Red Hills Puzhal Dam & Water Treatment Complex', height: 26, base_height: 0, color: '#22d3ee' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.174, 13.194], [80.183, 13.194], [80.183, 13.202], [80.174, 13.202], [80.174, 13.194]
        ]]
      }
    },
    // Avadi Heavy Vehicles Factory (HVF) Complex
    {
      type: 'Feature',
      properties: { name: 'Avadi Heavy Vehicles Factory (HVF) Complex', height: 35, base_height: 0, color: '#f59e0b' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.096, 13.111], [80.106, 13.111], [80.106, 13.119], [80.096, 13.119], [80.096, 13.111]
        ]]
      }
    },
    // Poonamallee Metro Depot & Transport Hub
    {
      type: 'Feature',
      properties: { name: 'Poonamallee Transit Hub & Metro Depot', height: 30, base_height: 0, color: '#8b5cf6' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.093, 13.045], [80.103, 13.045], [80.103, 13.053], [80.093, 13.053], [80.093, 13.045]
        ]]
      }
    }
  ]
};

// Designated Municipal Flood Relief Shelters & Rescue Depots
export const CHENNAI_RELIEF_SHELTERS: ReliefShelter[] = [
  {
    id: 'anna_univ',
    name: 'Anna University CEG Relief Hub',
    category: 'Major High-Ground Shelter',
    lat: 13.0110,
    lng: 80.2355,
    elevation: 12.5,
    capacity: 12000,
    currentOccupancy: 4250,
    status: 'Operational',
    contact: '+91 44 2235 7004 (GCC Sector 8)',
    supplies: {
      cleanWaterDays: 14,
      powerGenerators: true,
      medicalStaff: 32,
      rescueBoats: 6,
    },
    connectedZones: ['Velachery', 'Guindy', 'Saidapet', 'Adyar'],
  },
  {
    id: 'jn_stadium',
    name: 'Jawaharlal Nehru Indoor Stadium',
    category: 'Major High-Ground Shelter',
    lat: 13.0842,
    lng: 80.2764,
    elevation: 9.2,
    capacity: 8500,
    currentOccupancy: 2800,
    status: 'Operational',
    contact: '+91 44 2538 4501 (EOC Central)',
    supplies: {
      cleanWaterDays: 10,
      powerGenerators: true,
      medicalStaff: 24,
      rescueBoats: 12,
    },
    connectedZones: ['Chennai Central', 'Periamet', 'Choolai', 'George Town'],
  },
  {
    id: 'loyola_camp',
    name: 'Loyola College High Grounds Depot',
    category: 'Medical Emergency Center',
    lat: 13.0628,
    lng: 80.2338,
    elevation: 10.4,
    capacity: 6500,
    currentOccupancy: 3100,
    status: 'Operational',
    contact: '+91 44 2817 8200 (Medical Response Wing)',
    supplies: {
      cleanWaterDays: 8,
      powerGenerators: true,
      medicalStaff: 40,
      rescueBoats: 4,
    },
    connectedZones: ['T. Nagar', 'Nungambakkam', 'Kodambakkam', 'Chetpet'],
  },
  {
    id: 'tambaram_airbase',
    name: 'Tambaram IAF Base (Air Evacuation Command)',
    category: 'Air Rescue Base',
    lat: 12.9150,
    lng: 80.1200,
    elevation: 28.0,
    capacity: 5000,
    currentOccupancy: 950,
    status: 'Operational',
    contact: '+91 44 2239 5500 (NDRF / IAF Coordination)',
    supplies: {
      cleanWaterDays: 30,
      powerGenerators: true,
      medicalStaff: 55,
      rescueBoats: 18,
    },
    connectedZones: ['Pallikaranai', 'Perumbakkam', 'Tambaram', 'Medavakkam'],
  },
  {
    id: 'phoenix_bypass',
    name: 'Phoenix-Velachery Elevated Relief Deck',
    category: 'NDRF Boat Staging Depot',
    lat: 12.9860,
    lng: 80.2195,
    elevation: 7.8,
    capacity: 3800,
    currentOccupancy: 2750,
    status: 'Near Capacity',
    contact: '+91 44 2243 1102 (NDRF 4th Battalion)',
    supplies: {
      cleanWaterDays: 6,
      powerGenerators: true,
      medicalStaff: 18,
      rescueBoats: 16,
    },
    connectedZones: ['Velachery Low Sump', 'Madipakkam', 'Adambakkam'],
  },
];

// Strategic High-Ground Evacuation Corridors (GeoJSON LineStrings)
export const CHENNAI_EVACUATION_ROUTES_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // Corridor Alpha: Velachery Inundation Sump -> Guindy High Grounds
    {
      type: 'Feature',
      properties: {
        id: 'route_alpha',
        name: 'Corridor Alpha (Velachery Bypass -> Guindy High Grounds)',
        clearance: 'Elevated Viaduct Passable',
        elevationGain: '+8.4m',
        distanceKm: '4.8 km',
        priority: 'CRITICAL EVACUATION',
        color: '#10b981', // green safe
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [80.2180, 12.9815], // Velachery
          [80.2160, 12.9900], // Inner Ring Road
          [80.2140, 13.0010], // Halda Junction
          [80.2150, 13.0102], // Guindy & Saidapet High Grounds
          [80.2355, 13.0110]  // Anna University Shelter
        ]
      }
    },
    // Corridor Bravo: Pallikaranai Marsh -> Tambaram Air Force Base
    {
      type: 'Feature',
      properties: {
        id: 'route_bravo',
        name: 'Corridor Bravo (200ft Radial Flyover -> Tambaram High Grounds)',
        clearance: 'NDRF Heavy Vehicle Escort',
        elevationGain: '+26.2m',
        distanceKm: '9.2 km',
        priority: 'HIGH PRIORITY',
        color: '#22d3ee', // cyan
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [80.2137, 12.9349], // Pallikaranai
          [80.1850, 12.9360], // Medavakkam High Rd
          [80.1500, 12.9250], // East Tambaram
          [80.1200, 12.9150]  // Tambaram Air Base
        ]
      }
    },
    // Corridor Charlie: T. Nagar -> Loyola College High Grounds
    {
      type: 'Feature',
      properties: {
        id: 'route_charlie',
        name: 'Corridor Charlie (G.N. Chetty Arterial -> Loyola Campus)',
        clearance: 'Clear / Paved',
        elevationGain: '+3.6m',
        distanceKm: '3.1 km',
        priority: 'STANDARD ROUTE',
        color: '#38bdf8', // light blue
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [80.2341, 13.0418], // T. Nagar
          [80.2360, 13.0510], // Gemini / Sterling Rd
          [80.2338, 13.0628]  // Loyola Shelter
        ]
      }
    },
    // Corridor Delta: Perumbakkam OMR -> ECR Coastal Ridge (Sand Dunes)
    {
      type: 'Feature',
      properties: {
        id: 'route_delta',
        name: 'Corridor Delta (Sholinganallur Link -> ECR Dune High Ground)',
        clearance: 'Tidal Backflow Watch',
        elevationGain: '+5.2m',
        distanceKm: '3.6 km',
        priority: 'SECONDARY CONTINGENCY',
        color: '#f59e0b', // warning amber
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [80.2084, 12.8988], // Perumbakkam
          [80.2280, 12.9000], // Sholinganallur Junction
          [80.2520, 12.8970]  // ECR Coastal Dune
        ]
      }
    }
  ]
};
