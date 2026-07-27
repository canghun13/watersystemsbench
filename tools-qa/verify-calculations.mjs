import { computeTDH } from "../assets/js/tools/total-dynamic-head.js";
import { computePipeFriction } from "../assets/js/tools/pipe-friction-loss.js";
import { computeVelocity } from "../assets/js/tools/pipe-velocity.js";
import { computePumpPower } from "../assets/js/tools/pump-power.js";
import { computeBooster } from "../assets/js/tools/booster-duty.js";
import { interpolateCurve, parseCurve } from "../assets/js/tools/pump-curve.js";
import { computeNPSHA } from "../assets/js/tools/npsh.js";
import { computeOperatingCost } from "../assets/js/tools/operating-cost.js";
import { diagnoseLowPressure } from "../assets/js/tools/low-pressure.js";
import { conversions, headToPressure, pressureToHead } from "../assets/js/unit-conversions.js";

let numericCases = 0;
let diagnosticCases = 0;
const failures = [];

function approx(name, actual, expected, tolerance) {
  numericCases += 1;
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    failures.push(`${name}: expected ${expected} ± ${tolerance}, received ${actual}`);
  }
}

function exact(name, actual, expected) {
  numericCases += 1;
  if (actual !== expected) failures.push(`${name}: expected ${expected}, received ${actual}`);
}

// TDH: independent hand values use ρ=998.2 kg/m³ and g=9.80665 m/s².
approx("TDH mixed components", computeTDH({ elevationM: 18, deliveryKPa: 250, inletKPa: 35, frictionM: 6.5, minorM: 1.2, equipmentM: .8 }).totalM, 48.463432758, 1e-8);
approx("TDH pressure-only", computeTDH({ elevationM: 0, deliveryKPa: 100, inletKPa: 0, frictionM: 0, minorM: 0, equipmentM: 0 }).totalM, 10.21555012, 1e-8);
approx("TDH surplus inlet", computeTDH({ elevationM: -5, deliveryKPa: 50, inletKPa: 100, frictionM: 0, minorM: 0, equipmentM: 0 }).totalM, -10.10777506, 1e-8);

// Pipe friction: reference values independently evaluated from the published equations.
approx("Hazen-Williams major loss", computePipeFriction({ method: "hazen", flowLpm: 120, diameterMm: 50, lengthM: 80, c: 140, minorK: 2 }).majorHeadM, 1.968561174, 1e-8);
approx("Darcy turbulent total loss", computePipeFriction({ method: "darcy", flowLpm: 120, diameterMm: 50, lengthM: 80, roughnessMm: .0015, tempC: 20, minorK: 2 }).totalHeadM, 1.867606234, 1e-8);
approx("Darcy laminar friction factor", computePipeFriction({ method: "darcy", flowLpm: .01, diameterMm: 50, lengthM: 10, roughnessMm: .0015, tempC: 20, minorK: 0 }).frictionFactor, 15.132745342, 1e-8);

// Velocity.
approx("Velocity SI", computeVelocity({ flowLpm: 120, diameterMm: 50 }), 1.018591636, 1e-9);
approx("Velocity converted US example", computeVelocity({ flowLpm: 3.785411784, diameterMm: 25.4 }), .1245100951, 1e-9);
approx("Velocity inverse diameter-squared", computeVelocity({ flowLpm: 120, diameterMm: 100 }), .2546479089, 1e-9);

// Pump power.
approx("Power standard duty", computePumpPower({ flowLpm: 120, headM: 50, pumpEfficiency: .7, motorEfficiency: .9 }).electricalKW, 1.553809211, 1e-9);
approx("Power efficient small duty", computePumpPower({ flowLpm: 60, headM: 20, pumpEfficiency: .8, motorEfficiency: .95 }).electricalKW, .2576052113, 1e-9);
approx("Power low boundary", computePumpPower({ flowLpm: 1, headM: 1, pumpEfficiency: .5, motorEfficiency: .5 }).electricalKW, .000652599869, 1e-12);

// Booster.
approx("Booster positive requirement", computeBooster({ inletKPa: 220, outletKPa: 300, elevationM: 12, pipeLossM: 4, equipmentLossM: 1, safetyPercent: 0 }).requiredKPa, 246.41296651, 1e-8);
exact("Booster unnecessary clamp", computeBooster({ inletKPa: 200, outletKPa: 100, elevationM: 0, pipeLossM: 0, equipmentLossM: 0, safetyPercent: 25 }).requiredKPa, 0);
approx("Booster allowance", computeBooster({ inletKPa: 100, outletKPa: 500, elevationM: 50, pipeLossM: 8, equipmentLossM: 2, safetyPercent: 10 }).requiredKPa, 1086.07386998, 1e-8);

// Pump curve.
const curve = parseCurve("200,31; 0,65; 100,53");
approx("Curve interpolation", interpolateCurve(curve, 120), 48.6, 1e-12);
exact("Curve exact point", interpolateCurve(curve, 100), 53);
exact("Curve extrapolation blocked", interpolateCurve(curve, 250), null);

// NPSH available.
approx("NPSHA flooded suction", computeNPSHA({ absoluteSurfaceKPa: 101.325, staticSuctionM: 2, frictionM: 1.5, additionalM: 0, tempC: 20 }).npshaM, 10.612191614, 1e-8);
approx("NPSHA hot suction lift", computeNPSHA({ absoluteSurfaceKPa: 101.325, staticSuctionM: -5, frictionM: 2, additionalM: .5, tempC: 80 }).npshaM, -1.908293101, 1e-8);
approx("NPSHA reduced absolute pressure", computeNPSHA({ absoluteSurfaceKPa: 80, staticSuctionM: 0, frictionM: 0, additionalM: 0, tempC: 0 }).npshaM, 8.096503307, 1e-8);

// Operating cost.
approx("Operating cost annual energy", computeOperatingCost({ powerKW: 4, hoursPerDay: 8, daysPerYear: 300, tariff: .15 }).annualEnergy, 9600, 1e-9);
approx("Operating cost with maintenance", computeOperatingCost({ powerKW: 1.5, hoursPerDay: 24, daysPerYear: 365, tariff: .1, maintenance: 500 }).annualTotal, 1814, 1e-9);
exact("Operating cost zero schedule", computeOperatingCost({ powerKW: 25, hoursPerDay: 0, daysPerYear: 365, tariff: 1, maintenance: 0 }).annualTotal, 0);

// Six shared conversion and round-trip cases.
approx("L/min to GPM", conversions.flow.toUS(3.785411784), 1, 1e-12);
approx("Metres to feet", conversions.head.toUS(1), 3.280839895, 1e-9);
approx("kPa to psi", conversions.pressure.toUS(6.894757293), 1, 1e-9);
approx("mm to inch", conversions.diameter.toUS(25.4), 1, 1e-12);
approx("Pressure-head round trip", headToPressure(pressureToHead(250)), 250, 1e-10);
approx("Temperature round trip", conversions.temperature.toSI(conversions.temperature.toUS(37)), 37, 1e-12);

function diagnostic(name, input, expectedText) {
  diagnosticCases += 1;
  const result = diagnoseLowPressure(input);
  if (!JSON.stringify(result).includes(expectedText)) failures.push(`${name}: expected result to include "${expectedText}".`);
}
diagnostic("Local fixture", { scope: "single", dynamicDrop: "unknown", filter: "no", prv: "no", pump: "no", sudden: "no", leak: "no", time: "no" }, "local fixture");
diagnostic("Dynamic restriction", { scope: "all", dynamicDrop: "large", filter: "no", prv: "no", pump: "no", sudden: "no", leak: "no", time: "no" }, "supply restriction");
diagnostic("PRV path", { scope: "all", dynamicDrop: "small", filter: "no", prv: "yes", pump: "no", sudden: "no", leak: "no", time: "no" }, "pressure-reducing valve");
diagnostic("Filter path", { scope: "all", dynamicDrop: "large", filter: "yes", prv: "no", pump: "no", sudden: "no", leak: "no", time: "no" }, "Filter or treatment");
diagnostic("Pump path", { scope: "all", dynamicDrop: "large", filter: "no", prv: "no", pump: "yes", sudden: "no", leak: "no", time: "no" }, "pressure-tank");
diagnostic("Sudden leak escalation", { scope: "all", dynamicDrop: "large", filter: "no", prv: "no", pump: "no", sudden: "yes", leak: "yes", time: "yes" }, "leak");

if (failures.length) {
  console.error(`Calculation verification failed with ${failures.length} issue(s):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Calculation verification passed: ${numericCases} independent numeric/conversion cases and ${diagnosticCases} troubleshooting scenarios.`);
