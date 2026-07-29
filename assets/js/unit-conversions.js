export const G = 9.80665;
export const conversions = {
  flow: { toUS: (v) => v / 3.785411784, toSI: (v) => v * 3.785411784, si: "L/min", us: "GPM" },
  head: { toUS: (v) => v * 3.280839895, toSI: (v) => v / 3.280839895, si: "m", us: "ft" },
  pressure: { toUS: (v) => v / 6.894757293, toSI: (v) => v * 6.894757293, si: "kPa", us: "psi" },
  diameter: { toUS: (v) => v / 25.4, toSI: (v) => v * 25.4, si: "mm", us: "in" },
  length: { toUS: (v) => v * 3.280839895, toSI: (v) => v / 3.280839895, si: "m", us: "ft" },
  temperature: { toUS: (v) => (v * 9 / 5) + 32, toSI: (v) => (v - 32) * 5 / 9, si: "°C", us: "°F" },
  power: { toUS: (v) => v / 0.745699872, toSI: (v) => v * 0.745699872, si: "kW", us: "hp" },
  volume: { toUS: (v) => v / 3.785411784, toSI: (v) => v * 3.785411784, si: "L", us: "US gal" },
  area: { toUS: (v) => v * 10.763910417, toSI: (v) => v / 10.763910417, si: "m²", us: "ft²" },
  rainfall: { toUS: (v) => v / 25.4, toSI: (v) => v * 25.4, si: "mm", us: "in" },
  mass: { toUS: (v) => v * 2.2046226218, toSI: (v) => v / 2.2046226218, si: "kg", us: "lb" }
};

export const toSI = (value, kind, system) => system === "US" ? conversions[kind].toSI(Number(value)) : Number(value);
export const fromSI = (value, kind, system) => system === "US" ? conversions[kind].toUS(Number(value)) : Number(value);
export const pressureToHead = (kPa, density = 998.2) => (kPa * 1000) / (density * G);
export const headToPressure = (m, density = 998.2) => (m * density * G) / 1000;
export const flowToM3s = (litresPerMinute) => litresPerMinute / 60000;

export function waterProperties(tempC) {
  if (!Number.isFinite(tempC) || tempC < 0 || tempC > 100) throw new Error("Water temperature must be between 0 °C and 100 °C.");
  const density = 1000 * (1 - ((tempC + 288.9414) / (508929.2 * (tempC + 68.12963))) * Math.pow(tempC - 3.9863, 2));
  const dynamicViscosity = 2.414e-5 * Math.pow(10, 247.8 / (tempC + 133.15));
  const vaporPressureKPa = 0.61094 * Math.exp((17.625 * tempC) / (tempC + 243.04));
  return { density, dynamicViscosity, kinematicViscosity: dynamicViscosity / density, vaporPressureKPa };
}

export function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en", { maximumFractionDigits: digits }).format(value);
}
