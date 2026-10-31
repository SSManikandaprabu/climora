import type { NeighbourhoodData, ReliefShelter } from '../types/climate';
import {
  CHENNAI_NEIGHBOURHOODS,
  CHENNAI_HYDRO_GEOJSON,
  CHENNAI_3D_BUILDINGS_GEOJSON,
  CHENNAI_RELIEF_SHELTERS,
  CHENNAI_EVACUATION_ROUTES_GEOJSON,
} from './chennaiGeoData';

export interface CityGeoBundle {
  neighbourhoods: NeighbourhoodData[];
  landmarks3D: any;
  hydroGeoJSON: any;
  floodZonesGeoJSON: any;
  reliefShelters: ReliefShelter[];
  evacuationRoutesGeoJSON: any;
}

// ==========================================
// 1. ROTTERDAM GEODATA (Rhine-Meuse Delta)
// ==========================================
export const ROTTERDAM_NEIGHBOURHOODS: NeighbourhoodData[] = [
  {
    id: 'kop-van-zuid',
    name: 'Kop van Zuid',
    lat: 51.9054,
    lng: 4.4925,
    elevation: -0.5,
    floodRisk: 68,
    heatRisk: 42,
    vegetationIndex: 0.35,
    soilSaturation: 78,
    populationExposed: '42,000 residents',
    criticalAssets: ['Wilhelminapier Quay', 'Erasmusbrug South Abutment', 'De Rotterdam Complex'],
    drainageCapacity: 'Reinforced',
    alertStatus: 'Advisory',
    lastUpdated: '10 seconds ago',
    historicalFloods: ['1953 North Sea Flood (+3.85m surge)', '2013 Sinterklaas Storm (+2.4m)']
  },
  {
    id: 'feijenoord',
    name: 'Feijenoord & Noordereiland',
    lat: 51.9122,
    lng: 4.5020,
    elevation: -1.2,
    floodRisk: 74,
    heatRisk: 51,
    vegetationIndex: 0.28,
    soilSaturation: 82,
    populationExposed: '78,000 residents',
    criticalAssets: ['Noordereiland River Wall', 'Willemsbrug Pylon', 'Nieuwe Maas Embankment'],
    drainageCapacity: 'Sub-optimal',
    alertStatus: 'Advisory',
    lastUpdated: '15 seconds ago',
    historicalFloods: ['Unembanked outer-dike island vulnerable during high North Sea spring tides.']
  },
  {
    id: 'delfshaven',
    name: 'Delfshaven Historic Port',
    lat: 51.9068,
    lng: 4.4485,
    elevation: 0.8,
    floodRisk: 55,
    heatRisk: 48,
    vegetationIndex: 0.31,
    soilSaturation: 65,
    populationExposed: '35,000 residents',
    criticalAssets: ['Historic Sluice Gate', 'Aelbrechtskolk Lock', 'Westzeedijk Primary Levee'],
    drainageCapacity: 'Adequate',
    alertStatus: 'Normal',
    lastUpdated: '25 seconds ago',
    historicalFloods: ['Protected by Westzeedijk storm barrier.']
  },
  {
    id: 'waalhaven',
    name: 'Waalhaven Port Logistics',
    lat: 51.8842,
    lng: 4.4398,
    elevation: 1.5,
    floodRisk: 62,
    heatRisk: 64,
    vegetationIndex: 0.12,
    soilSaturation: 70,
    populationExposed: '12,000 port operators',
    criticalAssets: ['Waalhaven Container Terminal', 'Heavy Cargo Docks', 'Petrochemical Substation'],
    drainageCapacity: 'Reinforced',
    alertStatus: 'Normal',
    lastUpdated: '8 seconds ago',
    historicalFloods: ['Outer-dike industrial zone elevated +3.0m NAP.']
  }
];

export const ROTTERDAM_3D_BUILDINGS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'De Rotterdam', height: 149, base_height: 0, color: '#38bdf8' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[4.4855, 51.9048], [4.4875, 51.9048], [4.4875, 51.9062], [4.4855, 51.9062], [4.4855, 51.9048]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Erasmusbrug Pylon', height: 139, base_height: 0, color: '#f8fafc' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[4.4868, 51.9090], [4.4876, 51.9090], [4.4876, 51.9098], [4.4868, 51.9098], [4.4868, 51.9090]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Euromast Tower', height: 185, base_height: 0, color: '#22d3ee' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[4.4660, 51.9050], [4.4670, 51.9050], [4.4670, 51.9060], [4.4660, 51.9060], [4.4660, 51.9050]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Markthal Arch', height: 40, base_height: 0, color: '#a855f7' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[4.4860, 51.9200], [4.4880, 51.9200], [4.4880, 51.9215], [4.4860, 51.9215], [4.4860, 51.9200]]]
      }
    }
  ]
};

export const ROTTERDAM_HYDRO_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Nieuwe Maas River Channel', type: 'river' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.4200, 51.9000], [4.5400, 51.9150], [4.5400, 51.9250], [4.4200, 51.9120], [4.4200, 51.9000]
          ]
        ]
      }
    }
  ]
};

export const ROTTERDAM_RELIEF_SHELTERS: ReliefShelter[] = [
  {
    id: 'maeslant-barrier',
    name: 'Maeslantkering Barrier Command HQ',
    category: 'Major High-Ground Shelter',
    capacity: 2500,
    currentOccupancy: 340,
    elevation: 5.5,
    lat: 51.9542,
    lng: 4.1648,
    status: 'Operational',
    contact: '+31 10 503 1111',
    supplies: {
      cleanWaterDays: 14,
      powerGenerators: true,
      medicalStaff: 12,
      rescueBoats: 6,
    },
    connectedZones: ['Kop van Zuid', 'Waalhaven Port']
  },
  {
    id: 'rotterdam-ahoy',
    name: 'Rotterdam Ahoy Emergency Sanctuary',
    category: 'Major High-Ground Shelter',
    capacity: 12000,
    currentOccupancy: 1200,
    elevation: 3.2,
    lat: 51.8829,
    lng: 4.4887,
    status: 'Operational',
    contact: '+31 10 293 3333',
    supplies: {
      cleanWaterDays: 7,
      powerGenerators: true,
      medicalStaff: 24,
      rescueBoats: 4,
    },
    connectedZones: ['Feijenoord & Noordereiland', 'Delfshaven']
  }
];

// ==========================================
// 2. SINGAPORE GEODATA (Equatorial Island)
// ==========================================
export const SINGAPORE_NEIGHBOURHOODS: NeighbourhoodData[] = [
  {
    id: 'marina-bay',
    name: 'Marina Bay Basin',
    lat: 1.2847,
    lng: 103.8598,
    elevation: 2.1,
    floodRisk: 45,
    heatRisk: 68,
    vegetationIndex: 0.42,
    soilSaturation: 62,
    populationExposed: '65,000 residents & CBD workforce',
    criticalAssets: ['Marina Barrage 9-Crest Gates', 'Marina Bay Sands', 'Downtown MRT Interchanges'],
    drainageCapacity: 'Reinforced',
    alertStatus: 'Normal',
    lastUpdated: '14 seconds ago',
    historicalFloods: ['Protected from marine spring tides by Marina Barrage crest gates.']
  },
  {
    id: 'kallang-basin',
    name: 'Kallang River Basin',
    lat: 1.3048,
    lng: 103.8680,
    elevation: 1.6,
    floodRisk: 64,
    heatRisk: 58,
    vegetationIndex: 0.48,
    soilSaturation: 74,
    populationExposed: '185,000 residents',
    criticalAssets: ['National Stadium Basin', 'Pelton Canal Confluence', 'Kallang Gasworks Buffer'],
    drainageCapacity: 'Sub-optimal',
    alertStatus: 'Advisory',
    lastUpdated: '20 seconds ago',
    historicalFloods: ['Flash inundation during simultaneous high tide and 100mm/h tropical monsoon downpours.']
  },
  {
    id: 'bukit-timah',
    name: 'Bukit Timah Lowland Corridor',
    lat: 1.3320,
    lng: 103.8050,
    elevation: 4.8,
    floodRisk: 58,
    heatRisk: 52,
    vegetationIndex: 0.65,
    soilSaturation: 80,
    populationExposed: '95,000 residents',
    criticalAssets: ['Bukit Timah Canal', 'Stamford Detention Tank', 'Sixth Avenue Sump'],
    drainageCapacity: 'Adequate',
    alertStatus: 'Normal',
    lastUpdated: '18 seconds ago',
    historicalFloods: ['Historically flooded in 2009 & 2011; mitigated by 38,000m³ underground detention basin.']
  }
];

export const SINGAPORE_3D_BUILDINGS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Marina Bay Sands Tower 1-3 & SkyPark', height: 207, base_height: 0, color: '#38bdf8' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[103.8590, 1.2825], [103.8615, 1.2825], [103.8615, 1.2850], [103.8590, 1.2850], [103.8590, 1.2825]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Marina Barrage Pump Station', height: 25, base_height: 0, color: '#10b981' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[103.8700, 1.2800], [103.8730, 1.2800], [103.8730, 1.2820], [103.8700, 1.2820], [103.8700, 1.2800]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Singapore Flyer', height: 165, base_height: 0, color: '#f8fafc' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[103.8625, 1.2890], [103.8640, 1.2890], [103.8640, 1.2905], [103.8625, 1.2905], [103.8625, 1.2890]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Guoco Tower CBD', height: 284, base_height: 0, color: '#a855f7' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[103.8450, 1.2760], [103.8470, 1.2760], [103.8470, 1.2780], [103.8450, 1.2780], [103.8450, 1.2760]]]
      }
    }
  ]
};

export const SINGAPORE_HYDRO_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Marina Reservoir & Singapore River', type: 'reservoir' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [103.8450, 1.2850], [103.8750, 1.2800], [103.8750, 1.3050], [103.8500, 1.3000], [103.8450, 1.2850]
          ]
        ]
      }
    }
  ]
};

export const SINGAPORE_RELIEF_SHELTERS: ReliefShelter[] = [
  {
    id: 'scdf-hq',
    name: 'Singapore Civil Defence Force (SCDF) Command HQ',
    category: 'Medical Emergency Center',
    capacity: 3500,
    currentOccupancy: 280,
    elevation: 15.0,
    lat: 1.3340,
    lng: 103.8920,
    status: 'Operational',
    contact: '+65 6848 0000',
    supplies: {
      cleanWaterDays: 10,
      powerGenerators: true,
      medicalStaff: 30,
      rescueBoats: 8,
    },
    connectedZones: ['Kallang River Basin', 'Marina Bay Basin']
  },
  {
    id: 'sports-hub',
    name: 'Singapore Sports Hub Mega Shelter',
    category: 'Major High-Ground Shelter',
    capacity: 15000,
    currentOccupancy: 850,
    elevation: 4.5,
    lat: 1.3035,
    lng: 103.8745,
    status: 'Operational',
    contact: '+65 6653 8900',
    supplies: {
      cleanWaterDays: 8,
      powerGenerators: true,
      medicalStaff: 40,
      rescueBoats: 6,
    },
    connectedZones: ['Kallang River Basin']
  }
];

// ==========================================
// 3. TOKYO GEODATA (Tokyo Bay & Zero-Meter Basin)
// ==========================================
export const TOKYO_NEIGHBOURHOODS: NeighbourhoodData[] = [
  {
    id: 'koto-ward',
    name: 'Koto Zero-Meter Lowlands',
    lat: 35.6720,
    lng: 139.8170,
    elevation: -1.8,
    floodRisk: 86,
    heatRisk: 62,
    vegetationIndex: 0.16,
    soilSaturation: 88,
    populationExposed: '520,000 residents below sea level',
    criticalAssets: ['Arakawa Flood Barrier', 'Tokyo Big Sight Sump', 'Koto Pumping Station'],
    drainageCapacity: 'Critical Deficit',
    alertStatus: 'Emergency',
    lastUpdated: '8 seconds ago',
    historicalFloods: ['1947 Typhoon Kathleen, 2019 Typhoon Hagibis (+2.1m river crest).']
  },
  {
    id: 'edogawa',
    name: 'Edogawa Confluence Sump',
    lat: 35.6980,
    lng: 139.8830,
    elevation: -2.2,
    floodRisk: 89,
    heatRisk: 55,
    vegetationIndex: 0.22,
    soilSaturation: 92,
    populationExposed: '690,000 residents',
    criticalAssets: ['Edogawa Sluice Gate', 'Tozai Line Underground Tunnel', 'Kasai Rinkai Dike'],
    drainageCapacity: 'Critical Deficit',
    alertStatus: 'Emergency',
    lastUpdated: '12 seconds ago',
    historicalFloods: ['70% of ward lies below mean high-tide level (Zero-Meter Zone).']
  },
  {
    id: 'minato-bay',
    name: 'Minato Tokyo Bay Waterfront',
    lat: 35.6450,
    lng: 139.7550,
    elevation: 2.4,
    floodRisk: 52,
    heatRisk: 72,
    vegetationIndex: 0.28,
    soilSaturation: 64,
    populationExposed: '260,000 residents',
    criticalAssets: ['Rainbow Bridge Abutment', 'Odaiba Tide Barrier', 'Shibaura Water Reclamation'],
    drainageCapacity: 'Reinforced',
    alertStatus: 'Normal',
    lastUpdated: '19 seconds ago',
    historicalFloods: ['Protected by Tokyo Bay 5.5m tidal seawalls.']
  }
];

export const TOKYO_3D_BUILDINGS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Tokyo Tower', height: 333, base_height: 0, color: '#ef4444' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[139.7445, 35.6580], [139.7465, 35.6580], [139.7465, 35.6595], [139.7445, 35.6595], [139.7445, 35.6580]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Roppongi Hills Mori Tower', height: 238, base_height: 0, color: '#38bdf8' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[139.7280, 35.6600], [139.7305, 35.6600], [139.7305, 35.6618], [139.7280, 35.6618], [139.7280, 35.6600]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'G-Cans Subterranean Intake Silo #1', height: 65, base_height: -50, color: '#10b981' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[139.8100, 35.9900], [139.8130, 35.9900], [139.8130, 35.9925], [139.8100, 35.9925], [139.8100, 35.9900]]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Rainbow Bridge Tower', height: 126, base_height: 0, color: '#f8fafc' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[139.7620, 35.6350], [139.7635, 35.6350], [139.7635, 35.6365], [139.7620, 35.6365], [139.7620, 35.6350]]]
      }
    }
  ]
};

export const TOKYO_HYDRO_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Sumida & Arakawa Rivers Confluence into Tokyo Bay', type: 'river' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [139.7800, 35.6200], [139.8600, 35.6200], [139.8500, 35.7300], [139.7900, 35.7300], [139.7800, 35.6200]
          ]
        ]
      }
    }
  ]
};

export const TOKYO_RELIEF_SHELTERS: ReliefShelter[] = [
  {
    id: 'tokyo-rinkai',
    name: 'Tokyo Rinkai Disaster Prevention Park HQ',
    category: 'Major High-Ground Shelter',
    capacity: 20000,
    currentOccupancy: 1400,
    elevation: 6.8,
    lat: 35.6335,
    lng: 139.7915,
    status: 'Operational',
    contact: '+81 3 3529 2180',
    supplies: {
      cleanWaterDays: 14,
      powerGenerators: true,
      medicalStaff: 50,
      rescueBoats: 10,
    },
    connectedZones: ['Koto Zero-Meter Lowlands', 'Minato Tokyo Bay Waterfront']
  },
  {
    id: 'gcans-intake',
    name: 'G-Cans Subterranean Drainage Control Facility',
    category: 'NDRF Boat Staging Depot',
    capacity: 3500,
    currentOccupancy: 410,
    elevation: 8.5,
    lat: 35.9960,
    lng: 139.8115,
    status: 'Operational',
    contact: '+81 48 746 0750',
    supplies: {
      cleanWaterDays: 20,
      powerGenerators: true,
      medicalStaff: 15,
      rescueBoats: 8,
    },
    connectedZones: ['Edogawa Confluence Sump']
  }
];

// ==========================================
// REGISTRY: UNIFIED MULTI-CITY RESOLVER
// ==========================================
export function getCityGeoBundle(cityId: string): CityGeoBundle {
  switch (cityId.toLowerCase()) {
    case 'rotterdam':
      return {
        neighbourhoods: ROTTERDAM_NEIGHBOURHOODS,
        landmarks3D: ROTTERDAM_3D_BUILDINGS,
        hydroGeoJSON: ROTTERDAM_HYDRO_GEOJSON,
        floodZonesGeoJSON: ROTTERDAM_HYDRO_GEOJSON,
        reliefShelters: ROTTERDAM_RELIEF_SHELTERS,
        evacuationRoutesGeoJSON: { type: 'FeatureCollection', features: [] },
      };

    case 'singapore':
      return {
        neighbourhoods: SINGAPORE_NEIGHBOURHOODS,
        landmarks3D: SINGAPORE_3D_BUILDINGS,
        hydroGeoJSON: SINGAPORE_HYDRO_GEOJSON,
        floodZonesGeoJSON: SINGAPORE_HYDRO_GEOJSON,
        reliefShelters: SINGAPORE_RELIEF_SHELTERS,
        evacuationRoutesGeoJSON: { type: 'FeatureCollection', features: [] },
      };

    case 'tokyo':
      return {
        neighbourhoods: TOKYO_NEIGHBOURHOODS,
        landmarks3D: TOKYO_3D_BUILDINGS,
        hydroGeoJSON: TOKYO_HYDRO_GEOJSON,
        floodZonesGeoJSON: TOKYO_HYDRO_GEOJSON,
        reliefShelters: TOKYO_RELIEF_SHELTERS,
        evacuationRoutesGeoJSON: { type: 'FeatureCollection', features: [] },
      };

    case 'chennai':
    default:
      return {
        neighbourhoods: CHENNAI_NEIGHBOURHOODS,
        landmarks3D: CHENNAI_3D_BUILDINGS_GEOJSON,
        hydroGeoJSON: CHENNAI_HYDRO_GEOJSON,
        floodZonesGeoJSON: CHENNAI_HYDRO_GEOJSON,
        reliefShelters: CHENNAI_RELIEF_SHELTERS,
        evacuationRoutesGeoJSON: CHENNAI_EVACUATION_ROUTES_GEOJSON,
      };
  }
}
