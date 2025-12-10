// Maps Data for MDRRMO Pio Duran
// Hazard zones and MDRRMO assets data

import type { HazardZone, MapAsset } from '@shared/schema';

export const hazardZones: HazardZone[] = [
  {
    id: 'hz-1',
    name: 'Barangay Caguscos Flood Zone',
    type: 'flood',
    riskLevel: 'High',
    coordinates: [
      { lat: 13.0524, lng: 123.4867 },
      { lat: 13.0534, lng: 123.4877 },
      { lat: 13.0544, lng: 123.4867 },
      { lat: 13.0534, lng: 123.4857 },
    ],
    description: 'Low-lying area prone to flooding during heavy rainfall. Flood depth can reach up to 2 meters.',
    affectedBarangays: ['Caguscos', 'Poblacion'],
    lastAssessment: '2024-06-15',
  },
  {
    id: 'hz-2',
    name: 'Barangay Sugod Landslide Zone',
    type: 'landslide',
    riskLevel: 'High',
    coordinates: [
      { lat: 13.0624, lng: 123.4967 },
      { lat: 13.0634, lng: 123.4977 },
      { lat: 13.0644, lng: 123.4967 },
      { lat: 13.0634, lng: 123.4957 },
    ],
    description: 'Steep slope area with loose soil. High risk during monsoon season.',
    affectedBarangays: ['Sugod', 'San Ramon'],
    lastAssessment: '2024-05-20',
  },
  {
    id: 'hz-3',
    name: 'Coastal Storm Surge Zone',
    type: 'storm-surge',
    riskLevel: 'Medium',
    coordinates: [
      { lat: 13.0424, lng: 123.4767 },
      { lat: 13.0434, lng: 123.4777 },
      { lat: 13.0444, lng: 123.4767 },
      { lat: 13.0434, lng: 123.4757 },
    ],
    description: 'Coastal areas vulnerable to storm surge during typhoons.',
    affectedBarangays: ['Rawis', 'Malobago'],
    lastAssessment: '2024-04-10',
  },
  {
    id: 'hz-4',
    name: 'Barangay Rangas Flood Plain',
    type: 'flood',
    riskLevel: 'Medium',
    coordinates: [
      { lat: 13.0724, lng: 123.5067 },
      { lat: 13.0734, lng: 123.5077 },
      { lat: 13.0744, lng: 123.5067 },
      { lat: 13.0734, lng: 123.5057 },
    ],
    description: 'Agricultural area with seasonal flooding during wet season.',
    affectedBarangays: ['Rangas'],
    lastAssessment: '2024-07-01',
  },
  {
    id: 'hz-5',
    name: 'San Jose Erosion Zone',
    type: 'landslide',
    riskLevel: 'Low',
    coordinates: [
      { lat: 13.0824, lng: 123.5167 },
      { lat: 13.0834, lng: 123.5177 },
      { lat: 13.0844, lng: 123.5167 },
      { lat: 13.0834, lng: 123.5157 },
    ],
    description: 'Riverbank erosion area requiring monitoring.',
    affectedBarangays: ['San Jose'],
    lastAssessment: '2024-03-25',
  },
];

export const mapAssets: MapAsset[] = [
  {
    id: 'asset-1',
    name: 'MDRRMO Main Office',
    type: 'command-post',
    status: 'available',
    position: { lat: 13.0544, lng: 123.4887 },
    description: 'Municipal Disaster Risk Reduction and Management Office headquarters',
    capacity: 50,
  },
  {
    id: 'asset-2',
    name: 'Pio Duran Central School Evacuation Center',
    type: 'evacuation-center',
    status: 'available',
    position: { lat: 13.0554, lng: 123.4897 },
    description: 'Primary evacuation center with capacity for 500 evacuees',
    capacity: 500,
  },
  {
    id: 'asset-3',
    name: 'Barangay Caguscos Evacuation Center',
    type: 'evacuation-center',
    status: 'available',
    position: { lat: 13.0524, lng: 123.4857 },
    description: 'Barangay-level evacuation facility',
    capacity: 150,
  },
  {
    id: 'asset-4',
    name: 'Rescue Vehicle Unit 1',
    type: 'rescue-vehicle',
    status: 'available',
    position: { lat: 13.0544, lng: 123.4885 },
    description: '6x6 Rescue Truck with water rescue equipment',
  },
  {
    id: 'asset-5',
    name: 'Rescue Vehicle Unit 2',
    type: 'rescue-vehicle',
    status: 'deployed',
    position: { lat: 13.0624, lng: 123.4967 },
    description: 'Ambulance currently deployed at Sugod',
  },
  {
    id: 'asset-6',
    name: 'Rural Health Unit',
    type: 'medical',
    status: 'available',
    position: { lat: 13.0564, lng: 123.4907 },
    description: 'Municipal health center with emergency medical supplies',
    capacity: 30,
  },
  {
    id: 'asset-7',
    name: 'Emergency Equipment Storage',
    type: 'equipment',
    status: 'low',
    position: { lat: 13.0540, lng: 123.4880 },
    description: 'Storage facility for rescue and relief equipment. Currently low on life vests.',
  },
  {
    id: 'asset-8',
    name: 'Barangay Rawis Evacuation Center',
    type: 'evacuation-center',
    status: 'available',
    position: { lat: 13.0424, lng: 123.4767 },
    description: 'Coastal barangay evacuation facility',
    capacity: 200,
  },
];

export function getHazardZones(): HazardZone[] {
  return hazardZones;
}

export function getMapAssets(): MapAsset[] {
  return mapAssets;
}
