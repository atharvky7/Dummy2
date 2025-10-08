import type { Sensor, Sdg, Material } from '@/lib/types';

export const initialSensors: Sensor[] = [
  {
    id: 'energy',
    name: 'Energy Consumption',
    value: 450,
    unit: 'kWh',
    limit: 600,
    timestamp: Date.now(),
  },
  {
    id: 'water',
    name: 'Water Usage',
    value: 1200,
    unit: 'L',
    limit: 2000,
    timestamp: Date.now(),
  },
  {
    id: 'noise',
    name: 'Noise Level',
    value: 68,
    unit: 'dB',
    limit: 75,
    timestamp: Date.now(),
  },
  {
    id: 'air',
    name: 'Air Quality (PM2.5)',
    value: 35,
    unit: 'μg/m³',
    limit: 50,
    timestamp: Date.now(),
  },
];

export const sdgData: Sdg[] = [
  {
    id: 9,
    name: 'Industry, Innovation and Infrastructure',
    description: 'Promoting sustainable industrialization and fostering innovation.',
  },
  {
    id: 11,
    name: 'Sustainable Cities and Communities',
    description: 'Making cities inclusive, safe, resilient and sustainable.',
  },
  {
    id: 12,
    name: 'Responsible Consumption and Production',
    description: 'Ensuring sustainable consumption and production patterns.',
  },
  {
    id: 13,
    name: 'Climate Action',
    description: 'Taking urgent action to combat climate change and its impacts.',
  },
];

export const materialTypes: Material[] = ['concrete', 'steel', 'wood', 'glass', 'copper'];

export const materialLabels: Record<Material, string> = {
  concrete: 'Concrete',
  steel: 'Steel',
  wood: 'Wood',
  glass: 'Glass',
  copper: 'Copper',
};
