// ============================================================
// data.js — All constants for Singapore Nuclear Energy Explorer
// ============================================================

const SG_BASELINE = {
  peakDemandMW: 8000,
  annualTWh: 55,
  naturalGasPercent: 95,
  annualCO2Mt: 50,
  gasEmissionFactor: 0.4, // tCO2/MWh
  population: 5.9e6,
  areaKm2: 733,
};

const INDUSTRIES = [
  {
    id: 'data-centres',
    name: 'Data Centres',
    icon: '🖥️',
    minMW: 50,
    maxMW: 200,
    defaultCount: 0,
    maxCount: 20,
    description: 'AI / cloud computing facilities',
  },
  {
    id: 'desalination',
    name: 'Desalination',
    icon: '💧',
    minMW: 20,
    maxMW: 50,
    defaultCount: 0,
    maxCount: 10,
    description: 'Seawater reverse-osmosis plants',
  },
  {
    id: 'vertical-farming',
    name: 'Vertical Farming',
    icon: '🌱',
    minMW: 10,
    maxMW: 30,
    defaultCount: 0,
    maxCount: 20,
    description: 'Indoor agriculture facilities',
  },
  {
    id: 'semiconductor-fabs',
    name: 'Semiconductor Fabs',
    icon: '🔬',
    minMW: 100,
    maxMW: 200,
    defaultCount: 0,
    maxCount: 10,
    description: 'Chip fabrication plants',
  },
  {
    id: 'green-hydrogen',
    name: 'Green Hydrogen',
    icon: '⚡',
    minMW: 250,
    maxMW: 500,
    defaultCount: 0,
    maxCount: 5,
    description: 'Electrolysis hydrogen production',
  },
  {
    id: 'direct-air-capture',
    name: 'Direct Air Capture',
    icon: '🌍',
    minMW: 150,
    maxMW: 250,
    defaultCount: 0,
    maxCount: 10,
    description: 'CO₂ removal facilities (~1 MtCO₂/yr each)',
    co2CapturedMtPerUnit: 1,
  },
  {
    id: 'ev-charging',
    name: 'EV Charging Network',
    icon: '🔋',
    minMW: 2000,
    maxMW: 4000,
    defaultCount: 0,
    maxCount: 1,
    description: 'National EV charging infrastructure',
  },
  {
    id: 'synthetic-fuels',
    name: 'Synthetic Fuels',
    icon: '⛽',
    minMW: 500,
    maxMW: 800,
    defaultCount: 0,
    maxCount: 5,
    description: 'E-fuel / SAF production',
  },
];

const REACTOR_CATEGORIES = [
  {
    id: 'fission-smr',
    name: 'Fission SMRs',
    color: '#d4920b',
    colorLight: '#fef3c7',
  },
  {
    id: 'molten-salt',
    name: 'Molten Salt',
    color: '#b45309',
    colorLight: '#fde68a',
  },
  {
    id: 'high-temp-gas',
    name: 'High-Temp Gas',
    color: '#0369a1',
    colorLight: '#bae6fd',
  },
  {
    id: 'fusion',
    name: 'Magnetic Confinement Fusion',
    color: '#7c3aed',
    colorLight: '#ede9fe',
  },
];

const REACTORS = [
  // Fission SMRs
  {
    id: 'nuscale',
    name: 'NuScale VOYGR',
    category: 'fission-smr',
    mwe: 77,
    footprintHa: 1.5,
    wasteM3PerGWYear: 20,
    decayYears: 100000,
    type: 'fission',
    description: 'Light-water SMR, NRC-certified design',
  },
  {
    id: 'bwrx300',
    name: 'BWRX-300',
    category: 'fission-smr',
    mwe: 300,
    footprintHa: 4,
    wasteM3PerGWYear: 20,
    decayYears: 100000,
    type: 'fission',
    description: 'GE Hitachi boiling-water SMR',
  },
  {
    id: 'rolls-royce',
    name: 'Rolls-Royce SMR',
    category: 'fission-smr',
    mwe: 470,
    footprintHa: 6,
    wasteM3PerGWYear: 20,
    decayYears: 100000,
    type: 'fission',
    description: 'Pressurised-water reactor, factory-built modules',
  },
  // Molten Salt
  {
    id: 'seaborg',
    name: 'Seaborg CMSR',
    category: 'molten-salt',
    mwe: 100,
    footprintHa: 0.5,
    wasteM3PerGWYear: 15,
    decayYears: 100000,
    type: 'fission',
    description: 'Compact, barge-mounted molten-salt reactor',
    bargeMounted: true,
  },
  {
    id: 'thorcon',
    name: 'ThorCon IMSR',
    category: 'molten-salt',
    mwe: 250,
    footprintHa: 3,
    wasteM3PerGWYear: 15,
    decayYears: 100000,
    type: 'fission',
    description: 'Thorium molten-salt, shipyard-fabricated',
  },
  // High-Temp Gas
  {
    id: 'htrpm',
    name: 'HTR-PM',
    category: 'high-temp-gas',
    mwe: 210,
    footprintHa: 5,
    wasteM3PerGWYear: 25,
    decayYears: 100000,
    type: 'fission',
    description: 'Pebble-bed high-temperature gas reactor',
  },
  // Fusion
  {
    id: 'cfs-arc',
    name: 'CFS ARC',
    category: 'fusion',
    mwe: 500,
    footprintHa: 5,
    wasteM3PerGWYear: 5,
    decayYears: 100,
    type: 'fusion',
    description: 'Commonwealth Fusion Systems, HTS magnets',
  },
  {
    id: 'tokamak-energy',
    name: 'Tokamak Energy ST',
    category: 'fusion',
    mwe: 200,
    footprintHa: 3,
    wasteM3PerGWYear: 5,
    decayYears: 100,
    type: 'fusion',
    description: 'Spherical tokamak, compact design',
  },
];

const LANDMARKS = [
  { name: 'Jurong Island', areaHa: 3200 },
  { name: 'Gardens by the Bay', areaHa: 101 },
  { name: 'Marina Bay Sands site', areaHa: 15.5 },
  { name: 'Changi Airport T5 (planned)', areaHa: 1080 },
  { name: 'Sentosa', areaHa: 500 },
];

const COLORS = {
  navy: '#0f172a',
  navyLight: '#1e293b',
  blue: '#2563eb',
  blueLight: '#3b82f6',
  green: '#059669',
  greenLight: '#10b981',
  amber: '#d97706',
  amberLight: '#f59e0b',
  purple: '#7c3aed',
  purpleLight: '#8b5cf6',
  red: '#dc2626',
  redLight: '#ef4444',
  slate: '#64748b',
  slateLight: '#94a3b8',
  white: '#ffffff',
  offWhite: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
};

const UNDERGROUND_SURFACE_FRACTION = 0.3;
const GAS_PLANT_FOOTPRINT_HA_PER_GW = 12;
const GAS_INFRA_MULTIPLIER = 2.5;
const CAPACITY_FACTOR = 0.9;

// Industry colors for stacked chart
const INDUSTRY_COLORS = [
  '#3b82f6', // Data centres - blue
  '#06b6d4', // Desalination - cyan
  '#10b981', // Vertical farming - emerald
  '#8b5cf6', // Semiconductor - violet
  '#f59e0b', // Green hydrogen - amber
  '#6366f1', // DAC - indigo
  '#ec4899', // EV charging - pink
  '#f97316', // Synthetic fuels - orange
];
