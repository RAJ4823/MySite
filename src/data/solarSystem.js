// Centralized constants for Background3D scene
// Import these into components to avoid hardcoded magic numbers.

// Camera defaults
export const DEFAULT_CAM = [7.94645553321638, 4.187099196870373, -6.322110195532062];
export const DEFAULT_TARGET = [2.8, 0, -4];

// Texture paths (relative to public/)
export const PLANET_TEXTURES = {
  mercury: '/textures/planets/mercury.jpg',
  venus: '/textures/planets/venus.jpg',
  earth: '/textures/planets/earth.jpg',
  mars: '/textures/planets/mars.jpg',
  jupiter: '/textures/planets/jupiter.jpg',
  saturn: '/textures/planets/saturn.jpg',
  uranus: '/textures/planets/uranus.jpg',
  neptune: '/textures/planets/neptune.jpg',
  saturnRing: '/textures/planets/saturn_ring.png',
};
export const EXTRA_TEXTURES = {
  sun: '/textures/sun.jpg',
  moon: '/textures/moon.jpg',
  milkyway: '/textures/milkyway.jpg',
};

// Sun
export const SUN = {
  radius: 0.35,
  emissiveColor: '#ffaa00',
  emissiveIntensity: 1.8,
  color: '#ffffff',
  pointLight: { intensity: 3.2, distance: 10, decay: 2 },
};

// Stars background
export const STARS = {
  radius: 60,
  depth: 120,
  count: 500,
  factor: 3,
  saturation: 0,
  fade: true,
  speed: 0.8,
};

// Planet visual/material parameters
export const PLANET_MATERIAL = {
  Mercury: { roughness: 0.9,  metalness: 0.05 },
  Venus:   { roughness: 0.85, metalness: 0.02 },
  Earth:   { roughness: 0.6,  metalness: 0.05 },
  Mars:    { roughness: 0.8,  metalness: 0.04 },
  Jupiter: { roughness: 0.5,  metalness: 0.06 },
  Saturn:  { roughness: 0.55, metalness: 0.06 },
  Uranus:  { roughness: 0.4,  metalness: 0.1  },
  Neptune: { roughness: 0.45, metalness: 0.1  },
};

// Planet base data (approx visual scale)
export const PLANETS_DEF = [
  { name: 'Mercury', color: '#9e9e9e', r: 0.06, AU: 0.39 },
  { name: 'Venus',   color: '#caa472', r: 0.10, AU: 0.72 },
  { name: 'Earth',   color: '#5AB1FF', r: 0.11, AU: 1.00 },
  { name: 'Mars',    color: '#ff6b57', r: 0.09, AU: 1.52 },
  { name: 'Jupiter', color: '#d2b48c', r: 0.24, AU: 5.20 },
  { name: 'Saturn',  color: '#e6d7a3', r: 0.20, AU: 9.58, ring: true },
  { name: 'Uranus',  color: '#79e0e8', r: 0.16, AU: 19.20 },
  { name: 'Neptune', color: '#6f8bff', r: 0.16, AU: 30.05 },
];

// Orbit layout and spacing parameters
export const ORBIT_LAYOUT = {
  base: 0.35,           // base offset from Sun
  scale: 1.25,          // sqrt(AU) visual scaling
  buffer: 0.12,         // min gap between neighboring orbits
  outerRingScale: 2.6,  // used for Saturn ring clearance
  orbitLineSteps: 64,
};

// Planet axial tilts (degrees)
export const AXIAL_TILT_DEG = {
  Mercury: 0.03,
  Venus: 177.36,
  Earth: 23.44,
  Mars: 25.19,
  Jupiter: 3.13,
  Saturn: 26.73,
  Uranus: 97.77,
  Neptune: 28.32,
};

// Planet axial rotation speeds (rad/s), retrograde negative
export const AXIAL_RATES = {
  Mercury: 0.6,
  Venus: -0.2,
  Earth: 1.0,
  Mars: 0.9,
  Jupiter: 3.0,
  Saturn: 2.4,
  Uranus: -1.6,
  Neptune: 1.4,
};

// Ring parameters for Saturn
export const SATURN_RING = {
  innerFactor: 1.8,
  outerFactor: 2.6,
  material: {
    opacity: 0.95,
    alphaTest: 0.15,
    depthWrite: false,
    doubleSide: true,
  },
  // Preferred texture mapping for saturn_ring.png (top=inner, bottom=outer)
  mapping: {
    repeat: [1, -1],
    offset: [0, 1],
    rotation: 0,
  },
};

// Earth-Moon quick params
export const MOON = {
  radius: 0.035,
  orbitRadiusFactor: 2.2, // relative to Earth radius r
};

// Asteroid belt defaults and per-asteroid randomization ranges
export const ASTEROID_BELT = {
  beltThickness: 0.06, // +/- in Y around center
  sizeRange: [0.006, 0.026],
  speedRange: [0.15, 0.30],
  wobble: { amp: [0.05, 0.17], freq: [0.5, 2.0] },
  spin: { x: [0.2, 0.8], y: [0.1, 0.5] },
  tintLightness: [140, 180], // HSL L%
  // Derived in code from Mars/Jupiter spacing; these are only fallbacks
  defaultInner: 1.7,
  defaultOuter: 2.1,
  defaultCount: 420,
};

// Comet defaults
export const COMETS = {
  count: 12,
  semiMajorAxis: [3, 11],      // a range
  eccentricity: [0.2, 0.9],    // e range
  inclinationDeg: [-12.5, 12.5],
  meanMotionK: 0.15,           // n = K / a^(3/2)
  sizeSmall: [0.012, 0.032],   // min, max for small mode
  sizeLarge: [0.02, 0.055],    // min, max for large mode
  tail: { lengthFactor: 12, baseRadiusFactor: 0.9, opacity: 0.35, color: '#8fd8ff' },
};

// Lights
export const LIGHTS = {
  hemi: { sky: 0x8899ff, ground: 0x0b0b12, intensity: 0.35 },
  ambient: { intensity: 0.35 },
  dir: {
    position: [4, 6, 4],
    intensity: 0.8,
    shadow: { mapSize: 2048, bias: -0.0006 },
  },
};

// Canvas camera config
export const CAMERA = {
  fov: 55,
};

// OrbitControls defaults for interactive mode
export const ORBIT_CONTROLS = {
  target: DEFAULT_TARGET,
  enablePan: false,
  enableDamping: true,
  dampingFactor: 0.08,
  rotateSpeed: 0.8,
  zoomSpeed: 0.9,
  minDistance: 2.5,
  maxDistance: 14,
  minPolarAngle: 0.05,
  maxPolarAngle: Math.PI - 0.25,
};

// Postprocessing
export const BLOOM = {
  intensityInteractive: 1.0,
  intensityBackground: 0.6,
  luminanceThreshold: 0.25,
  luminanceSmoothing: 0.65,
  radius: 0.9,
};

// Utility to derive planet speeds normalized to Earth based on AU
export function speedFromAU(auList) {
  const inv = auList.map((au) => 1 / Math.sqrt(au));
  const earth = inv[2];
  return inv.map((v) => Number((v / earth).toFixed(2)));
}
