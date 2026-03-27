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
    profile: {
      overview: 'A light-water small modular reactor using proven pressurised-water technology scaled down to a compact, factory-built module. Each module produces 77 MWe and up to 12 modules can be combined in a single plant. It was the first SMR to receive NRC design certification (2023).',
      safety: [
        'Passive cooling via natural circulation — no pumps needed for emergency heat removal',
        'Below-ground containment vessel provides physical protection and seismic resilience',
        'Each module operates independently — a fault in one does not affect others',
        'Small core size limits the maximum possible radioactive release',
      ],
      wasteProfile: 'Produces standard light-water reactor spent fuel (uranium oxide). ~20 m³ of high-level waste per GW-year, requiring dry cask storage and eventual deep geological disposal. Waste remains hazardous for ~100,000 years.',
      safetyLink: { text: 'PWR safety in depth', hash: '#section-advanced' },
    },
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
    profile: {
      overview: 'A simplified boiling-water reactor by GE Hitachi that eliminates large recirculation pumps and reduces the number of safety systems compared to earlier BWR designs. Water boils directly in the reactor vessel, producing steam that drives the turbine with no secondary loop.',
      safety: [
        'Passive safety systems require no operator action or external power for 7+ days',
        'Simplified design eliminates large-bore piping, reducing loss-of-coolant accident risk',
        'Natural circulation cooling removes decay heat without pumps',
        'Negative void coefficient — if coolant boils away, the reaction slows down automatically',
      ],
      wasteProfile: 'Produces standard BWR spent fuel assemblies. ~20 m³ of high-level waste per GW-year, similar to other light-water reactors. Spent fuel requires interim dry cask storage followed by deep geological disposal over ~100,000 years.',
      safetyLink: { text: 'Defence in depth principles', hash: '#section-defense' },
    },
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
    profile: {
      overview: 'A factory-built pressurised-water reactor designed for rapid deployment. Modules are manufactured off-site and assembled on location, targeting a 4-year construction timeline. At 470 MWe it is the largest of the SMR designs, straddling the boundary between SMR and conventional plant.',
      safety: [
        'Conventional PWR safety systems with decades of operational heritage',
        'Negative temperature coefficient provides inherent self-regulation',
        'Steel-lined concrete containment building rated for extreme external events',
        'Emergency core cooling and control rod SCRAM systems shut reactor within seconds',
      ],
      wasteProfile: 'Standard PWR spent fuel — enriched uranium oxide pellets in zirconium cladding. ~20 m³ of high-level waste per GW-year. Same disposal pathway as existing PWR fleets: interim storage in spent fuel pools, then dry casks, then deep geological repository.',
      safetyLink: { text: 'PWR safety features', hash: '#section-advanced' },
    },
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
    profile: {
      overview: 'A compact molten-salt reactor designed to be mounted on a barge — making it deployable without permanent land infrastructure. The fuel is dissolved directly in a fluoride salt coolant, meaning there are no solid fuel rods. Particularly suited to island nations and coastal cities like Singapore.',
      safety: [
        'Freeze plug melts on overheating, passively draining fuel into a subcritical dump tank',
        'Operates at atmospheric pressure — no risk of pressure-driven explosions',
        'Fuel is already liquid, so a traditional "meltdown" is physically impossible',
        'Strong negative temperature coefficient — reaction rate drops as temperature rises',
      ],
      wasteProfile: 'Produces ~15 m³ of waste per GW-year. Molten salt reactors can be designed to consume some of their own waste products through online fuel processing, potentially reducing long-lived actinide waste. Remaining waste still requires geological disposal but the volume is lower than conventional reactors.',
      safetyLink: { text: 'Molten salt reactor safety', hash: '#section-advanced' },
    },
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
    profile: {
      overview: 'A thorium-fuelled molten-salt reactor fabricated using shipyard construction techniques for cost and speed. Thorium (Th-232) is converted to fissile U-233 in the reactor. The entire reactor module is designed to be swapped out every 4 years and returned to a central facility for processing.',
      safety: [
        'Freeze plug provides passive emergency drain — no operator intervention needed',
        'Atmospheric pressure operation eliminates pressure-vessel rupture scenarios',
        'Thorium fuel cycle produces far less plutonium than uranium cycles, reducing proliferation risk',
        'Negative temperature coefficient ensures the reactor self-regulates',
      ],
      wasteProfile: 'Produces ~15 m³ of waste per GW-year. The thorium fuel cycle generates significantly less long-lived transuranics (plutonium, americium) than uranium-based reactors. This means the waste, while still requiring long-term isolation, has a lower total radiotoxicity over geological timescales.',
      safetyLink: { text: 'Molten salt reactor safety', hash: '#section-advanced' },
    },
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
    profile: {
      overview: 'A Chinese-designed pebble-bed high-temperature gas-cooled reactor — the world\'s first commercial HTGR (operational at Shidao Bay since 2023). Fuel is encased in tennis-ball-sized graphite pebbles containing thousands of TRISO particles, cooled by inert helium gas at up to 750 °C.',
      safety: [
        'TRISO fuel particles withstand temperatures above 1,600 °C without releasing fission products',
        'Helium coolant is chemically inert — no risk of steam explosions or hydrogen generation',
        'Graphite moderator provides enormous thermal inertia, slowing any temperature changes',
        'Demonstrated walkaway safety — reactor shuts itself down without any human intervention',
      ],
      wasteProfile: 'Produces ~25 m³ of waste per GW-year — higher volume than other designs because the graphite pebble matrix is bulky. However, TRISO particles provide an excellent first containment barrier even during disposal. Spent pebbles are classified as high-level waste requiring geological disposal.',
      safetyLink: { text: 'HTGR safety features', hash: '#section-advanced' },
    },
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
    profile: {
      overview: 'A compact tokamak fusion reactor using high-temperature superconducting (HTS) magnets to achieve a much stronger magnetic field in a smaller device. Fuses deuterium and tritium at over 100 million °C. CFS demonstrated a 20-tesla HTS magnet in 2021, a key milestone toward commercial fusion.',
      safety: [
        'Fusion plasma contains only a few grams of fuel at any time — no chain reaction possible',
        'If containment is lost, the plasma cools instantly and the reaction stops on its own',
        'No long-lived radioactive waste — activated structural materials decay within ~100 years',
        'No risk of meltdown — fundamentally different physics from fission',
      ],
      wasteProfile: 'Produces ~5 m³ of activated structural materials per GW-year (neutron activation of the reactor vessel). This waste decays to safe handling levels within 50–100 years — orders of magnitude shorter than fission waste. The primary reaction product is helium, which is stable and non-radioactive.',
      safetyLink: { text: 'Fusion safety profile', hash: '#section-fusion' },
    },
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
    profile: {
      overview: 'A spherical tokamak design that achieves higher plasma pressure in a more compact shape than conventional tokamaks. The cored-apple geometry is inherently more efficient at confining plasma. Tokamak Energy is targeting a pilot plant in the early 2030s, using HTS magnets similar to CFS.',
      safety: [
        'Same inherent fusion safety — plasma self-extinguishes if disturbed',
        'Compact size means less structural material to become activated',
        'No fissile materials, no chain reaction, no meltdown scenario',
        'Tritium inventory is small and continuously consumed in the reaction',
      ],
      wasteProfile: 'Produces ~5 m³ of activated materials per GW-year. Like all D-T fusion designs, waste consists of neutron-activated structural components that decay to safe levels within 50–100 years. Using low-activation materials (e.g. RAFM steels, vanadium alloys) further shortens this timeline.',
      safetyLink: { text: 'Fusion safety profile', hash: '#section-fusion' },
    },
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
