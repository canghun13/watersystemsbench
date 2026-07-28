import { computeTDH } from "../assets/js/tools/total-dynamic-head.js";
import { computePipeFriction } from "../assets/js/tools/pipe-friction-loss.js";
import { computeVelocity } from "../assets/js/tools/pipe-velocity.js";
import { computePumpPower } from "../assets/js/tools/pump-power.js";
import { computeBooster } from "../assets/js/tools/booster-duty.js";
import { interpolateCurve, parseCurve } from "../assets/js/tools/pump-curve.js";
import { computeNPSHA } from "../assets/js/tools/npsh.js";
import { computeOperatingCost } from "../assets/js/tools/operating-cost.js";
import { diagnoseLowPressure } from "../assets/js/tools/low-pressure.js";
import { computeWellPumpDuty } from "../assets/js/tools/well-pump-sizing.js";
import { computeWellYieldDemand } from "../assets/js/tools/well-yield-demand.js";
import { computePressureTank } from "../assets/js/tools/pressure-tank-sizing.js";
import { analyzeShortCycling } from "../assets/js/tools/short-cycling.js";
import { computeStorageTank } from "../assets/js/tools/storage-tank-sizing.js";
import { computeRainwaterYield } from "../assets/js/tools/rainwater-yield.js";
import { simulateRainwater } from "../assets/js/tools/rainwater-simulator.js";
import { computeFirstFlush } from "../assets/js/tools/first-flush.js";
import { conversions, headToPressure, pressureToHead } from "../assets/js/unit-conversions.js";

let numericCases = 0;
let diagnosticCases = 0;
let phase2Cases = 0;
let simulatorCases = 0;
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

function phase2Approx(name, actual, expected, tolerance = 1e-9) {
  phase2Cases += 1;
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) failures.push(`${name}: expected ${expected} ± ${tolerance}, received ${actual}`);
}

function simulatorApprox(name, actual, expected, tolerance = 1e-9) {
  simulatorCases += 1;
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) failures.push(`${name}: expected ${expected} ± ${tolerance}, received ${actual}`);
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

// Phase 2: 30 independent numeric and decision-path checks.
const wellDuty = computeWellPumpDuty({ demandLpm: 45, pumpingLevelM: 28, dischargeElevationM: 6, deliveryKPa: 240, frictionM: 6, equipmentM: 2, pumpSettingM: 42 });
phase2Approx("Well duty flow", wellDuty.flowLpm, 45);
phase2Approx("Well duty static lift", wellDuty.staticLiftM, 34);
phase2Approx("Well duty TDH", wellDuty.totalHeadM, 66.517320289, 1e-8);
phase2Approx("Well duty submergence", wellDuty.submergenceM, 14);

const yieldCase = computeWellYieldDemand({ yieldLpm: 12, pumpingHoursPerDay: 10, dailyDemandL: 4500, peakDemandLpm: 30, peakMinutes: 90, existingStorageL: 1000, reservePercent: 15 });
phase2Approx("Well daily production", yieldCase.dailyProductionL, 7200);
phase2Approx("Well daily balance", yieldCase.dailyBalanceL, 2700);
phase2Approx("Well average coverage", yieldCase.averageCoverage, 1.6);
phase2Approx("Well peak storage gap", yieldCase.peakStorageGapL, 1620);
phase2Approx("Well additional storage", yieldCase.storageGapL, 1295);

const tankCase = computePressureTank({ pumpLpm: 40, minimumRunMinutes: 1, prechargeKPa: 193, cutInKPa: 207, cutOutKPa: 345 });
phase2Approx("Pressure tank drawdown", tankCase.requiredDrawdownL, 40);
phase2Approx("Pressure tank fraction", tankCase.drawdownFraction, 0.2951523771, 1e-9);
phase2Approx("Pressure tank nominal volume", tankCase.minimumTankVolumeL, 135.5232182, 1e-7);
let invalidPressureOrder = false;
try { computePressureTank({ pumpLpm: 40, minimumRunMinutes: 1, prechargeKPa: 220, cutInKPa: 207, cutOutKPa: 345 }); } catch { invalidPressureOrder = true; }
phase2Approx("Pressure tank invalid order blocked", Number(invalidPressureOrder), 1);

const cycling = analyzeShortCycling({ starts: 6, observationMinutes: 20, drawdownL: 30, demandLpm: 10, pumpLpm: 40 });
phase2Approx("Cycling observed starts", cycling.startsPerHour, 18);
phase2Approx("Cycling off time", cycling.offMinutes, 3);
phase2Approx("Cycling on time", cycling.onMinutes, 1);
phase2Approx("Cycling modeled starts", cycling.modeledStartsPerHour, 15);

const storage = computeStorageTank({ dailyDemandL: 2000, outageDays: 3, refillLpm: 5, refillHoursPerDay: 4, reservePercent: 20, usableFraction: .9, existingVolumeL: 0 });
phase2Approx("Storage gross demand", storage.grossDemandL, 6000);
phase2Approx("Storage refill contribution", storage.refillContributionL, 3600);
phase2Approx("Storage net demand", storage.netDemandL, 2400);
phase2Approx("Storage usable requirement", storage.requiredUsableL, 2880);
phase2Approx("Storage nominal requirement", storage.requiredNominalL, 3200);

const rainYield = computeRainwaterYield({ areaM2: 150, rainfallMm: 80, runoffCoefficient: .9, collectionEfficiency: .85, fixedLossL: 100 });
phase2Approx("Rain gross yield", rainYield.grossL, 12000);
phase2Approx("Rain after runoff", rainYield.afterRunoffL, 10800);
phase2Approx("Rain harvested yield", rainYield.harvestedL, 9080);
phase2Approx("Rain total loss", rainYield.lostL, 2920);

const flushDepth = computeFirstFlush({ areaM2: 150, mode: "depth", diversionDepthMm: .2 });
const flushRate = computeFirstFlush({ areaM2: 200, mode: "rate", litresPerM2: .25 });
phase2Approx("First flush depth volume", flushDepth.volumeL, 30);
phase2Approx("First flush depth equivalent", flushDepth.equivalentDepthMm, .2);
phase2Approx("First flush rate volume", flushRate.volumeL, 50);
phase2Approx("First flush rate equivalent", flushRate.equivalentDepthMm, .25);

// Six independent 365-day simulator scenarios.
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
simulatorApprox("Simulator zero-flow reliability", simulateRainwater({ capacityL: 1000, initialL: 0, areaM2: 0, monthlyRainMm: Array(12).fill(0), coefficient: 1, dailyDemandL: 0 }).reliability, 1);
simulatorApprox("Simulator initial-only end volume", simulateRainwater({ capacityL: 1000, initialL: 1000, areaM2: 0, monthlyRainMm: Array(12).fill(0), coefficient: 1, dailyDemandL: 1 }).endStorageL, 635);
simulatorApprox("Simulator dry-year unmet volume", simulateRainwater({ capacityL: 1000, initialL: 0, areaM2: 0, monthlyRainMm: Array(12).fill(0), coefficient: 1, dailyDemandL: 10 }).unmetL, 3650);
simulatorApprox("Simulator overflow volume", simulateRainwater({ capacityL: 50, initialL: 0, areaM2: 1, monthlyRainMm: Array(12).fill(10), coefficient: 1, dailyDemandL: 0 }).overflowL, 70);
simulatorApprox("Simulator one-litre daily sequence", simulateRainwater({ capacityL: 100000, initialL: 0, areaM2: 1, monthlyRainMm: monthDays, coefficient: 1, dailyDemandL: .5 }).endStorageL, 182.5);
simulatorApprox("Simulator persistent daily deficit", simulateRainwater({ capacityL: 10, initialL: 0, areaM2: 1, monthlyRainMm: monthDays, coefficient: 1, dailyDemandL: 2 }).unmetL, 365);

if (failures.length) {
  console.error(`Calculation verification failed with ${failures.length} issue(s):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Calculation verification passed: ${numericCases} Phase 1 numeric/conversion cases, ${diagnosticCases} troubleshooting scenarios, ${phase2Cases} Phase 2 numeric/decision cases and ${simulatorCases} rainwater simulator scenarios.`);
