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
import { computeDrip, computeFlowTest, computePrecipitation, computePumpZone, computeRuntime, computeZoneCapacity, diagnoseIrrigation } from "../assets/js/tools/irrigation-tools.js";
import { computeChlorineDose, computeContactTime, computeMediaFilter, computeRoProduction, computeRoRecovery, computeSaltRegeneration, computeSoftenerSizing, selectTreatmentTrain } from "../assets/js/tools/treatment-tools.js";
import { computeGreywaterSupply, computeIrrigationMatch, computeLaundryZone, computeSurgeBasin, computeReuseSavings } from "../assets/js/tools/greywater-tools.js";
import { computeReclaimBalance, computeReclaimBuffer, computeSpotFreeRo, computeVehicleWashAudit, computeVehicleWashSavings } from "../assets/js/tools/vehicle-wash-tools.js";
import { computeCountercurrentRinse, computeDragOut, computeRinseAudit, computeRinseLog, computeRinseSavings, parseRinseLog } from "../assets/js/tools/metal-finishing-tools.js";
import { analyzeStabilization, checkLowFlowSetup, computeEquipmentInterval, computePurgeVolume, parseStabilizationLog } from "../assets/js/tools/monitoring-well-tools.js";
import { conversions, headToPressure, pressureToHead } from "../assets/js/unit-conversions.js";

let numericCases = 0;
let diagnosticCases = 0;
let phase2Cases = 0;
let simulatorCases = 0;
let irrigationCases = 0;
let irrigationDiagnosticCases = 0;
let treatmentCases = 0;
let treatmentSelectorCases = 0;
let greywaterCases = 0;
let vehicleWashCases = 0;
let metalCases = 0;
let monitoringWellCases = 0;
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
function irrigationApprox(name, actual, expected, tolerance = 1e-8) {
  irrigationCases += 1;
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) failures.push(`${name}: expected ${expected} ± ${tolerance}, received ${actual}`);
}
function irrigationExact(name, actual, expected) {
  irrigationCases += 1;
  if (actual !== expected) failures.push(`${name}: expected ${expected}, received ${actual}`);
}
function treatmentApprox(name, actual, expected, tolerance = 1e-8) {
  treatmentCases += 1;
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) failures.push(`${name}: expected ${expected} ± ${tolerance}, received ${actual}`);
}
function treatmentExact(name, actual, expected) {
  treatmentCases += 1;
  if (actual !== expected) failures.push(`${name}: expected ${expected}, received ${actual}`);
}
function greywaterApprox(name, actual, expected, tolerance = 1e-8) {
  greywaterCases += 1;
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) failures.push(`${name}: expected ${expected} ± ${tolerance}, received ${actual}`);
}
function greywaterExact(name, actual, expected) {
  greywaterCases += 1;
  if (actual !== expected) failures.push(`${name}: expected ${expected}, received ${actual}`);
}
function metalApprox(name, actual, expected, tolerance = 1e-8) { metalCases += 1; if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) failures.push(`${name}: expected ${expected}, received ${actual}`); }
function metalExact(name, actual, expected) { metalCases += 1; if (actual !== expected) failures.push(`${name}: expected ${expected}, received ${actual}`); }
function metalThrows(name, fn) { metalCases += 1; let threw = false; try { fn(); } catch { threw = true; } if (!threw) failures.push(`${name}: expected error`); }
function monitoringWellApprox(name, actual, expected, tolerance = 1e-8) { monitoringWellCases += 1; if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) failures.push(`${name}: expected ${expected}, received ${actual}`); }
function monitoringWellExact(name, actual, expected) { monitoringWellCases += 1; if (actual !== expected) failures.push(`${name}: expected ${expected}, received ${actual}`); }
function monitoringWellThrows(name, fn) { monitoringWellCases += 1; let threw = false; try { fn(); } catch { threw = true; } if (!threw) failures.push(`${name}: expected error`); }
function greywaterThrows(name, calculation) {
  greywaterCases += 1;
  let threw = false;
  try { calculation(); } catch { threw = true; }
  if (!threw) failures.push(`${name}: expected validation error.`);
}
function vehicleWashApprox(name, actual, expected, tolerance = 1e-8) {
  vehicleWashCases += 1;
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) failures.push(`${name}: expected ${expected} ± ${tolerance}, received ${actual}`);
}
function vehicleWashExact(name, actual, expected) {
  vehicleWashCases += 1;
  if (actual !== expected) failures.push(`${name}: expected ${expected}, received ${actual}`);
}
function vehicleWashThrows(name, calculation) {
  vehicleWashCases += 1;
  let threw = false;
  try { calculation(); } catch { threw = true; }
  if (!threw) failures.push(`${name}: expected validation error.`);
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

// Irrigation cluster: 36 independent numeric/validation checks.
let flow = computeFlowTest({ volumeL: 10, seconds: 20 });
irrigationApprox("A1 bucket L/min", flow.averageLpm, 30); irrigationApprox("A1 bucket L/s", flow.averageLpm / 60, .5); irrigationApprox("A1 bucket m3/h", flow.averageLpm * .06, 1.8); irrigationApprox("A1 bucket GPM", flow.averageLpm / 3.785411784, 7.9251615707);
flow = computeFlowTest({ volumeL: 5 * 3.785411784, seconds: 40 }); irrigationApprox("A2 meter GPM", flow.averageLpm / 3.785411784, 7.5); irrigationApprox("A2 meter L/min", flow.averageLpm, 28.39058838);
flow = computeFlowTest({ volumeL: 250, seconds: 300 }); irrigationApprox("A3 meter difference", flow.averageLpm, 50);
flow = computeFlowTest({ volumeL: 10, seconds: 20, trials: [25, 30] }); irrigationApprox("A4 repeat average", flow.averageLpm, 24.666666667); irrigationApprox("A4 repeat spread", flow.spreadPercent, 40.54054054);
let invalid = false; try { computeFlowTest({ volumeL: 10, seconds: 0 }); } catch { invalid = true; } irrigationExact("A5 zero seconds blocked", invalid, true);

let zone = computeZoneCapacity({ availableLpm: 100, reservePercent: 10, perHeadLpm: 12 }); irrigationApprox("Z1 usable", zone.usableLpm, 90); irrigationExact("Z1 heads", zone.maxHeads, 7); irrigationApprox("Z1 unused", zone.usableLpm - zone.maxHeads * 12, 6);
zone = computeZoneCapacity({ availableLpm: 72, reservePercent: 0, perHeadLpm: 12 }); irrigationExact("Z2 exact heads", zone.maxHeads, 6);
zone = computeZoneCapacity({ availableLpm: 100, reservePercent: 10, perHeadLpm: 12, dynamicKPa: 350, requiredKPa: 210, lossKPa: 50, riseM: 10 }); irrigationApprox("Z3 pressure margin", zone.pressureMarginKPa, -8.0665); irrigationExact("Z3 pressure fail", zone.status, "Insufficient");
zone = computeZoneCapacity({ availableLpm: 100, reservePercent: 10, perHeadLpm: 12, dynamicKPa: 400, requiredKPa: 210, lossKPa: 50, riseM: 10 }); irrigationApprox("Z4 pressure margin", zone.pressureMarginKPa, 41.9335); irrigationExact("Z4 pass", zone.status, "Pass");
invalid = false; try { computeZoneCapacity({ availableLpm: 100, reservePercent: 51, perHeadLpm: 12 }); } catch { invalid = true; } irrigationExact("Z6 reserve blocked", invalid, true);

let precip = computePrecipitation({ flowLpm: 120, areaM2: 4000 }); irrigationApprox("P1 mm/h", precip.mmh, 1.8); irrigationApprox("P1 in/h", precip.inchh, .07086614173);
precip = computePrecipitation({ flowLpm: 1, xM: 4, yM: 4, layout: "rect" }); irrigationApprox("P3 rectangular", precip.mmh, 3.75);
precip = computePrecipitation({ flowLpm: 1, xM: 4, yM: 4, layout: "tri" }); irrigationApprox("P4 triangular", precip.mmh, 4.330127019); precip = computePrecipitation({ flowLpm: 1, areaM2: 6, runtimeMin: 45 }); irrigationApprox("P5 depth", precip.appliedMm, 7.5);
invalid = false; try { computePrecipitation({ flowLpm: 1, areaM2: 0 }); } catch { invalid = true; } irrigationExact("P6 area blocked", invalid, true);

let runtime = computeRuntime({ targetMm: 20, rateMmh: 10, efficiencyPercent: 80, areaM2: 500 }); irrigationApprox("R1 gross depth", runtime.grossMm, 25); irrigationApprox("R1 runtime", runtime.totalMinutes, 150); irrigationApprox("R1 gross volume", runtime.grossVolumeL, 12500);
runtime = computeRuntime({ targetMm: 30, rateMmh: 15, efficiencyPercent: 75, events: 3, cycles: 2 }); irrigationApprox("R2 total", runtime.totalMinutes, 160); irrigationApprox("R2 event", runtime.eventMinutes, 53.33333333); irrigationApprox("R2 cycle", runtime.cycleMinutes, 26.66666667);
runtime = computeRuntime({ targetMm: 0, rateMmh: 10, efficiencyPercent: 80 }); irrigationExact("R3 no irrigation", runtime.totalMinutes, 0); invalid = false; try { computeRuntime({ targetMm: 1, rateMmh: 0, efficiencyPercent: 80 }); } catch { invalid = true; } irrigationExact("R5 zero rate blocked", invalid, true);

let drip = computeDrip({ mode: "direct", emitters: 100, emitterLph: 4, hours: 1.5 }); irrigationApprox("D1 total L/h", drip.totalLph, 400); irrigationApprox("D1 L/min", drip.flowLpm, 6.666666667); irrigationApprox("D2 event", drip.eventL, 600);
drip = computeDrip({ mode: "rows", emitterLph: 2, rowLengthM: 100, spacingM: .5, rows: 10, availableLpm: 50, reservePercent: 10 }); irrigationExact("D3 emitters row", drip.emittersPerRow, 201); irrigationExact("D3 total emitters", drip.totalEmitters, 2010); irrigationApprox("D3 total L/h", drip.totalLph, 4020); irrigationExact("D4 rows zone", drip.rowsPerZone, 6); irrigationExact("D4 zones", drip.requiredZones, 2);
drip = computeDrip({ mode: "direct", emitters: 1, emitterLph: 2, availableLpm: 10 }); irrigationExact("D5 max emitters", drip.maxEmitters, 300);

let matcher = computePumpZone({ pumpFlowLpm: 100, pumpHeadM: 60, zoneFlowLpm: 80, operatingKPa: 200, riseM: 10, lossM: 5, reservePercent: 10 }); irrigationApprox("M1 base head", matcher.baseHeadM, 35.39432, 1e-4); irrigationApprox("M1 adjusted flow", matcher.adjustedFlowLpm, 88); irrigationApprox("M1 adjusted head", matcher.adjustedHeadM, 38.933752, 1e-4); irrigationExact("M1 match", matcher.status, "Match");
matcher = computePumpZone({ pumpFlowLpm: 85, pumpHeadM: 36, zoneFlowLpm: 80, operatingKPa: 200, riseM: 10, lossM: 5, reservePercent: 10 }); irrigationExact("M2 marginal", matcher.status, "Marginal"); matcher = computePumpZone({ pumpFlowLpm: 70, pumpHeadM: 60, zoneFlowLpm: 80, operatingKPa: 200, riseM: 10, lossM: 5, reservePercent: 10 }); irrigationExact("M3 flow insufficient", matcher.status, "Insufficient"); matcher = computePumpZone({ pumpFlowLpm: 100, pumpHeadM: 30, zoneFlowLpm: 80, operatingKPa: 200, riseM: 10, lossM: 5, reservePercent: 10 }); irrigationExact("M4 head insufficient", matcher.status, "Insufficient");

for (const [name, input, expected] of [["T1", { scope: "zone", filter: "yes", leak: "no", nozzle: "no", pump: "no", dynamic: "no" }, "Zone valve/filter restriction"], ["T2", { scope: "all", filter: "no", leak: "no", nozzle: "no", pump: "no", dynamic: "yes" }, "Source-wide flow/pressure limitation"], ["T3", { scope: "zone", filter: "no", leak: "no", nozzle: "yes", pump: "no", dynamic: "no" }, "Excess zone demand"], ["T4", { scope: "one", filter: "no", leak: "no", nozzle: "no", pump: "no", dynamic: "no" }, "Individual head/nozzle obstruction"], ["T5", { scope: "zone", filter: "no", leak: "yes", nozzle: "no", pump: "no", dynamic: "no" }, "Active leak/lateral problem"], ["T6", { scope: "all", filter: "no", leak: "no", nozzle: "no", pump: "yes", dynamic: "yes" }, "Pump/source behavior"]]) { irrigationDiagnosticCases += 1; if (diagnoseIrrigation(input).cause !== expected) failures.push(`${name}: expected ${expected}.`); }

// Water treatment cluster: 65 independent numeric, state, and validation checks.
let softener = computeSoftenerSizing({ hardness: 171.18061, hardnessUnit: "mgL", dailyUseL: 1000, regenerationDays: 7, reservePercent: 20, peakFlowLpm: 40 });
treatmentApprox("WT-S1 hardness conversion", softener.hardnessGpg, 10);
treatmentApprox("WT-S2 daily US gallons", softener.dailyGallons, 264.17205236);
treatmentApprox("WT-S3 daily grain load", softener.dailyGrainLoad, 2641.7205236, 1e-7);
treatmentApprox("WT-S4 working capacity", softener.workingCapacityGrains, 18492.0436652, 1e-6);
treatmentApprox("WT-S5 reserve capacity", softener.reserveAdjustedCapacityGrains, 22190.45239824, 1e-6);
softener = computeSoftenerSizing({ hardness: 15, hardnessUnit: "gpg", dailyUseL: 378.5411784, regenerationDays: 5, reservePercent: 0, ironMgL: 2, ironFactorGpgPerMgL: 4, peakFlowLpm: 50 });
treatmentApprox("WT-S6 iron allowance", softener.ironAllowanceGpg, 8);
treatmentApprox("WT-S7 adjusted hardness", softener.adjustedHardnessGpg, 23);
treatmentApprox("WT-S8 direct-gpg daily load", softener.dailyGrainLoad, 2300);
let treatmentInvalid = false;
try { computeSoftenerSizing({ hardness: 10, hardnessUnit: "gpg", dailyUseL: 1000, regenerationDays: 7, reservePercent: 10, ironMgL: 1, peakFlowLpm: 40 }); } catch { treatmentInvalid = true; }
treatmentExact("WT-S9 iron factor required", treatmentInvalid, true);

const salt = computeSaltRegeneration({ dailyGrainLoad: 3000, usableCapacityGrains: 30000, saltDoseKg: 4, reservePercent: 10, regenerationWaterL: 200, saltPricePerKg: 1.5, waterPricePerM3: 2 });
treatmentApprox("WT-R1 service capacity", salt.serviceCapacityGrains, 27000);
treatmentApprox("WT-R2 regeneration interval", salt.daysBetweenRegeneration, 9);
treatmentApprox("WT-R3 monthly regenerations", salt.regenerationsPerMonth, 3.3819444444);
treatmentApprox("WT-R4 annual regenerations", salt.regenerationsPerYear, 40.5833333333);
treatmentApprox("WT-R5 annual salt", salt.saltKgPerYear, 162.3333333333);
treatmentApprox("WT-R6 salt efficiency", salt.saltEfficiencyGrainsPerLb, 3401.9427751, 1e-6);
treatmentApprox("WT-R7 annual regeneration water", salt.regenerationWaterLPerYear, 8116.6666667, 1e-7);
treatmentApprox("WT-R8 annual salt cost", salt.annualSaltCost, 243.5);
treatmentApprox("WT-R9 annual water cost", salt.annualWaterCost, 16.2333333333);

let roBalance = computeRoRecovery({ mode: "flow", feedLpm: 10, permeateLpm: 4, operatingHours: 8, operatingDays: 30 });
treatmentApprox("WT-RO1 recovery from flows", roBalance.recoveryPercent, 40);
treatmentApprox("WT-RO2 reject flow", roBalance.rejectLpm, 6);
treatmentApprox("WT-RO3 daily product", roBalance.dailyProductL, 1920);
treatmentApprox("WT-RO4 daily reject", roBalance.dailyRejectL, 2880);
treatmentApprox("WT-RO5 period product", roBalance.periodProductL, 57600);
treatmentApprox("WT-RO6 period reject", roBalance.periodRejectL, 86400);
roBalance = computeRoRecovery({ mode: "recovery", feedLpm: 10, recoveryPercent: 50, operatingHours: 24, operatingDays: 1 });
treatmentApprox("WT-RO7 product from recovery", roBalance.productLpm, 5);
treatmentApprox("WT-RO8 full-day product", roBalance.dailyProductL, 7200);
treatmentInvalid = false;
try { computeRoRecovery({ mode: "flow", feedLpm: 10, permeateLpm: 10, operatingHours: 8, operatingDays: 1 }); } catch { treatmentInvalid = true; }
treatmentExact("WT-RO9 permeate below feed enforced", treatmentInvalid, true);

let roProduction = computeRoProduction({ ratedProductionL: 2000, ratingHours: 24, actualOperatingHours: 20, temperatureFactor: .9, pressureFactor: .95, otherFactor: .98, dailyDemandL: 1200, peakDemandL: 500, peakHours: 4, usableStorageL: 600, initialStoredL: 400, reservePercent: 10 });
treatmentApprox("WT-P1 adjusted production", roProduction.adjustedDailyProductionL, 1396.5);
treatmentApprox("WT-P2 reserve-adjusted demand", roProduction.reserveAdjustedDemandL, 1320);
treatmentApprox("WT-P3 daily balance", roProduction.dailyBalanceL, 76.5);
treatmentApprox("WT-P4 peak production", roProduction.productionDuringPeakL, 232.75);
treatmentApprox("WT-P5 peak storage need", roProduction.peakStorageNeedL, 267.25);
treatmentApprox("WT-P6 required buffer", roProduction.requiredStorageBufferL, 267.25);
treatmentApprox("WT-P7 storage margin", roProduction.storageMarginL, 132.75);
treatmentExact("WT-P8 balanced status", roProduction.status, "Balanced");
treatmentExact("WT-P9 no refill estimate", roProduction.refillHours, null);
roProduction = computeRoProduction({ ratedProductionL: 1000, ratingHours: 24, actualOperatingHours: 24, temperatureFactor: 1, pressureFactor: 1, otherFactor: 1, dailyDemandL: 1200, peakDemandL: 0, peakHours: 0, usableStorageL: 500, reservePercent: 0 });
treatmentExact("WT-P10 daily deficit status", roProduction.status, "Daily deficit");
treatmentApprox("WT-P11 deficit buffer", roProduction.requiredStorageBufferL, 200);
treatmentInvalid = false;
try { computeRoProduction({ ratedProductionL: 1000, ratingHours: 24, actualOperatingHours: 24, temperatureFactor: 0, pressureFactor: 1, otherFactor: 1, dailyDemandL: 500, peakDemandL: 0, peakHours: 0, usableStorageL: 500, reservePercent: 0 }); } catch { treatmentInvalid = true; }
treatmentExact("WT-P12 zero correction factor blocked", treatmentInvalid, true);

let media = computeMediaFilter({ shape: "circle", flowLpm: 100, diameterM: 1, vessels: 2, bedDepthM: 1.2, backwashFlowLpm: 300, serviceLimitLpmM2: 70, backwashLimitLpmM2: 180 });
treatmentApprox("WT-M1 circular area per vessel", media.areaPerVesselM2, .785398163397);
treatmentApprox("WT-M2 circular total area", media.totalAreaM2, 1.570796326795);
treatmentApprox("WT-M3 flow per vessel", media.flowPerVesselLpm, 50);
treatmentApprox("WT-M4 service loading", media.serviceLoadingLpmM2, 63.6619772368);
treatmentApprox("WT-M5 backwash loading", media.backwashLoadingLpmM2, 190.9859317103);
treatmentApprox("WT-M6 service margin", media.serviceMarginLpmM2, 6.3380227632);
treatmentApprox("WT-M7 backwash margin", media.backwashMarginLpmM2, 10.9859317103);
treatmentApprox("WT-M8 geometric bed volume", media.bedVolumeM3, 1.8849555922);
media = computeMediaFilter({ shape: "area", flowLpm: 80, areaM2: .5, vessels: 4 });
treatmentApprox("WT-M9 direct total area", media.totalAreaM2, 2);
treatmentApprox("WT-M10 direct service loading", media.serviceLoadingLpmM2, 40);

let chlorine = computeChlorineDose({ waterVolumeL: 10000, targetDoseMgL: 2, existingMgL: .2, concentrationBasis: "percent", productConcentration: 10, densityKgL: 1.1 });
treatmentApprox("WT-C1 net chlorine dose", chlorine.netDoseMgL, 1.8);
treatmentApprox("WT-C2 active mass", chlorine.activeMassMg, 18000);
treatmentApprox("WT-C3 percent active concentration", chlorine.activeMgPerL, 110000);
treatmentApprox("WT-C4 solution volume", chlorine.requiredSolutionL, .1636363636);
chlorine = computeChlorineDose({ waterVolumeL: 1000, targetDoseMgL: 1, existingMgL: 0, concentrationBasis: "mgL", productConcentration: 50000 });
treatmentApprox("WT-C5 mg/L basis solution", chlorine.requiredSolutionL, .02);
chlorine = computeChlorineDose({ waterVolumeL: 1000, targetDoseMgL: .5, existingMgL: 1, concentrationBasis: "mgL", productConcentration: 50000 });
treatmentApprox("WT-C6 nonpositive addition clamp", chlorine.requiredSolutionL, 0);
treatmentExact("WT-C7 nonpositive addition status", chlorine.status, "No positive addition calculated");
treatmentInvalid = false;
try { computeChlorineDose({ waterVolumeL: 1000, targetDoseMgL: 1, concentrationBasis: "percent", productConcentration: 10 }); } catch { treatmentInvalid = true; }
treatmentExact("WT-C8 percent basis density required", treatmentInvalid, true);

let contact = computeContactTime({ volumeL: 5000, flowLpm: 100, residualMgL: .5, bafflingFactor: .7, targetCt: 20 });
treatmentApprox("WT-CT1 nominal time", contact.nominalMinutes, 50);
treatmentApprox("WT-CT2 effective time", contact.effectiveMinutes, 35);
treatmentApprox("WT-CT3 calculated CT", contact.ctMgMinL, 17.5);
treatmentApprox("WT-CT4 target margin", contact.margin, -2.5);
treatmentExact("WT-CT5 below-target status", contact.status, "Below entered target");
contact = computeContactTime({ volumeL: 6000, flowLpm: 100, residualMgL: .5, bafflingFactor: 1 });
treatmentApprox("WT-CT6 unbaffled time", contact.effectiveMinutes, 60);
treatmentExact("WT-CT7 no-target status", contact.status, "No target entered");
treatmentInvalid = false;
try { computeContactTime({ volumeL: 5000, flowLpm: 100, residualMgL: .5, bafflingFactor: 0 }); } catch { treatmentInvalid = true; }
treatmentExact("WT-CT8 zero baffling blocked", treatmentInvalid, true);

const selectorBase = { lab: "yes", source: "well", intendedUse: "utility", sediment: "no", turbidity: "no", iron: "no", manganese: "no", chlorine: "no", tasteOdor: "no", organics: "no", hardness: "no", tds: "no", rejectLimit: "no", pH: "no", microbiology: "negative", color: "no", flowKnown: "yes", peakFlow: "normal", existingEquipment: "none", space: "available", drainage: "available" };
for (const [name, override, expected] of [
  ["WT-T1 no evidence", {}, "No treatment stage selected from current evidence"],
  ["WT-T2 sediment", { sediment: "yes" }, "Sediment prefiltration"],
  ["WT-T3 turbidity", { turbidity: "yes" }, "Media filtration or verified turbidity reduction"],
  ["WT-T4 iron", { iron: "yes" }, "Iron/manganese media filtration"],
  ["WT-T5 carbon", { tasteOdor: "yes" }, "Activated carbon review"],
  ["WT-T6 hardness", { hardness: "yes" }, "Water softening review"],
  ["WT-T7 dissolved solids", { tds: "yes" }, "Reverse osmosis or source-blending review"],
  ["WT-T8 pH", { pH: "yes" }, "pH, alkalinity and corrosion-control review"],
  ["WT-T9 positive microbiology", { microbiology: "positive", intendedUse: "drinking" }, "Validated disinfection barrier"],
  ["WT-T10 rainwater", { source: "rainwater" }, "Source protection and first-flush review"],
  ["WT-T11 surface water", { source: "surface", intendedUse: "drinking" }, "Source protection and validated multi-barrier review"],
  ["WT-T12 final monitoring", { hardness: "yes" }, "Final monitoring and maintenance plan"]
]) {
  treatmentSelectorCases += 1;
  const result = selectTreatmentTrain({ ...selectorBase, ...override });
  if (!result.stages.includes(expected)) failures.push(`${name}: expected stage "${expected}".`);
}
for (const [name, override, collection, expected] of [
  ["WT-T13 undefined flow", { flowKnown: "no" }, "tests", "Measure or define both service flow"],
  ["WT-T14 existing equipment", { existingEquipment: "yes" }, "cautions", "Identify existing equipment"],
  ["WT-T15 limited space", { space: "limited" }, "cautions", "Limited equipment space"]
]) {
  treatmentSelectorCases += 1;
  const result = selectTreatmentTrain({ ...selectorBase, ...override });
  if (!result[collection].some((item) => item.includes(expected))) failures.push(`${name}: expected ${collection} to include "${expected}".`);
}

// Greywater cluster: independent hand calculations, SI/US equivalence, boundaries and invalid states.
let greywater = computeGreywaterSupply({ occupants: 2, showerFlowLpm: 8, showerMinutesPerPerson: 6, bathLPerDay: 0, laundryLPerLoad: 55, loadsPerWeek: 4, basinLPerPersonDay: 8, capturePercent: 85 });
greywaterApprox("GW-S1 shower daily", greywater.showerLPerDay, 96);
greywaterApprox("GW-S2 laundry daily", greywater.laundryLPerDay, 220 / 7);
greywaterApprox("GW-S3 basin daily", greywater.basinLPerDay, 16);
greywaterApprox("GW-S4 raw daily", greywater.rawLPerDay, 143.4285714286);
greywaterApprox("GW-S5 usable daily", greywater.usableLPerDay, 121.9142857143);
greywaterApprox("GW-S6 weekly", greywater.weeklyL, 853.4);
greywater = computeGreywaterSupply({ occupants: 1, showerFlowLpm: 0, showerMinutesPerPerson: 0, bathLPerDay: 0, laundryLPerLoad: 40, loadsPerWeek: 7, basinLPerPersonDay: 0, capturePercent: 100 });
greywaterApprox("GW-S7 laundry-only boundary", greywater.usableLPerDay, 40);
greywaterApprox("GW-S8 US gallon source equivalence", computeGreywaterSupply({ occupants: 1, showerFlowLpm: 3.785411784, showerMinutesPerPerson: 1, bathLPerDay: 0, laundryLPerLoad: 0, loadsPerWeek: 0, basinLPerPersonDay: 0, capturePercent: 100 }).usableLPerDay, 3.785411784);
greywaterThrows("GW-S9 zero total rejected", () => computeGreywaterSupply({ occupants: 1, showerFlowLpm: 0, showerMinutesPerPerson: 0, bathLPerDay: 0, laundryLPerLoad: 0, loadsPerWeek: 0, basinLPerPersonDay: 0, capturePercent: 100 }));
greywaterThrows("GW-S10 negative source rejected", () => computeGreywaterSupply({ occupants: 1, showerFlowLpm: -1, showerMinutesPerPerson: 1, bathLPerDay: 0, laundryLPerLoad: 0, loadsPerWeek: 0, basinLPerPersonDay: 0, capturePercent: 100 }));
greywaterThrows("GW-S11 unrealistic occupants rejected", () => computeGreywaterSupply({ occupants: 101, showerFlowLpm: 1, showerMinutesPerPerson: 1, bathLPerDay: 0, laundryLPerLoad: 0, loadsPerWeek: 0, basinLPerPersonDay: 0, capturePercent: 100 }));

let match = computeIrrigationMatch({ supplyLPerDay: 150, etoMmWeek: 35, rainfallMmWeek: 2, plantFactor: .4, areaM2: 100, irrigationEfficiencyPercent: 80 });
greywaterApprox("GW-I1 net depth", match.netDepthMmWeek, 12);
greywaterApprox("GW-I2 gross depth", match.grossDepthMmWeek, 15);
greywaterApprox("GW-I3 demand", match.demandLWeek, 1500);
greywaterApprox("GW-I4 supply", match.supplyLWeek, 1050);
greywaterApprox("GW-I5 coverage", match.coveragePercent, 70);
greywaterApprox("GW-I6 balance", match.balanceLWeek, -450);
greywaterApprox("GW-I7 supported area", match.supportedAreaM2, 70);
match = computeIrrigationMatch({ supplyLPerDay: 100, etoMmWeek: 5, rainfallMmWeek: 10, plantFactor: .5, areaM2: 100, irrigationEfficiencyPercent: 80 });
greywaterApprox("GW-I8 rain boundary demand", match.demandLWeek, 0);
greywaterExact("GW-I9 rain boundary coverage", match.coveragePercent, 100);
greywaterThrows("GW-I10 zero efficiency rejected", () => computeIrrigationMatch({ supplyLPerDay: 100, etoMmWeek: 10, rainfallMmWeek: 0, plantFactor: .5, areaM2: 100, irrigationEfficiencyPercent: 0 }));
greywaterThrows("GW-I11 unreasonable plant factor rejected", () => computeIrrigationMatch({ supplyLPerDay: 100, etoMmWeek: 10, rainfallMmWeek: 0, plantFactor: 2, areaM2: 100, irrigationEfficiencyPercent: 80 }));

let greywaterZone = computeLaundryZone({ loadVolumeL: 60, outletCount: 4, minimumLPerOutlet: 10, maximumLPerOutlet: 20, loadsPerWeek: 4 });
greywaterApprox("GW-L1 per outlet", greywaterZone.perOutletL, 15);
greywaterExact("GW-L2 minimum outlets", greywaterZone.minimumOutlets, 3);
greywaterExact("GW-L3 maximum outlets", greywaterZone.maximumOutlets, 6);
greywaterExact("GW-L4 target status", greywaterZone.status, "Within entered target");
greywaterApprox("GW-L5 weekly per outlet", greywaterZone.weeklyLPerOutlet, 60);
greywaterZone = computeLaundryZone({ loadVolumeL: 60, outletCount: 2, minimumLPerOutlet: 10, maximumLPerOutlet: 20, loadsPerWeek: 0 });
greywaterExact("GW-L6 high outlet status", greywaterZone.status, "Above entered target");
greywaterThrows("GW-L7 invalid target combination", () => computeLaundryZone({ loadVolumeL: 60, outletCount: 4, minimumLPerOutlet: 20, maximumLPerOutlet: 10, loadsPerWeek: 4 }));
greywaterThrows("GW-L8 fractional outlet rejected", () => computeLaundryZone({ loadVolumeL: 60, outletCount: 4.5, minimumLPerOutlet: 10, maximumLPerOutlet: 20, loadsPerWeek: 4 }));

const surge = computeSurgeBasin({ eventVolumeL: 60, outletCount: 4, basinAreaM2: .25, basinDepthM: .1, voidPercent: 30, infiltrationMmHour: 15, drainHours: 2, deliveryPercent: 90 });
greywaterApprox("GW-B1 delivered", surge.deliveredL, 54);
greywaterApprox("GW-B2 void capacity", surge.storageL, 30);
greywaterApprox("GW-B3 infiltration", surge.infiltrationL, 30);
greywaterApprox("GW-B4 acceptance", surge.acceptanceL, 60);
greywaterApprox("GW-B5 margin", surge.marginL, 6);
greywaterExact("GW-B6 status", surge.status, "Entered capacity covers event");
greywaterExact("GW-B7 zero infiltration accepted", computeSurgeBasin({ eventVolumeL: 60, outletCount: 4, basinAreaM2: .25, basinDepthM: .1, voidPercent: 30, infiltrationMmHour: 0, drainHours: 2, deliveryPercent: 90 }).status, "Entered capacity shortfall");
greywaterThrows("GW-B8 negative infiltration rejected", () => computeSurgeBasin({ eventVolumeL: 60, outletCount: 4, basinAreaM2: .25, basinDepthM: .1, voidPercent: 30, infiltrationMmHour: -1, drainHours: 2, deliveryPercent: 90 }));

const savings = computeReuseSavings({ dailyReuseL: 150, activeDays: 240, waterTariff: 2.5, sewerTariff: 3, sewerOffsetPercent: 50, annualOperatingCost: 40, installedCost: 1200 });
greywaterApprox("GW-E1 annual volume", savings.annualReuseM3, 36);
greywaterApprox("GW-E2 water savings", savings.avoidedWaterCost, 90);
greywaterApprox("GW-E3 sewer savings", savings.avoidedSewerCost, 54);
greywaterApprox("GW-E4 gross savings", savings.grossAnnualSavings, 144);
greywaterApprox("GW-E5 net savings", savings.netAnnualSavings, 104);
greywaterApprox("GW-E6 payback", savings.simplePaybackYears, 1200 / 104);
greywaterExact("GW-E7 no positive payback", computeReuseSavings({ dailyReuseL: 1, activeDays: 1, waterTariff: 0, sewerTariff: 0, sewerOffsetPercent: 0, annualOperatingCost: 10, installedCost: 100 }).simplePaybackYears, null);
greywaterThrows("GW-E8 invalid active days", () => computeReuseSavings({ dailyReuseL: 10, activeDays: 367, waterTariff: 1, sewerTariff: 1, sewerOffsetPercent: 100, annualOperatingCost: 0, installedCost: 0 }));

// Vehicle-wash cluster: independent meter, mass-balance, minute simulation, RO and economic reference cases.
let washAudit = computeVehicleWashAudit({ startMeterL: 100000, endMeterL: 115000, vehicles: 300, intervalDays: 5, operatingDays: 300 });
vehicleWashApprox("VW-A1 interval use", washAudit.intervalUseL, 15000);
vehicleWashApprox("VW-A2 per vehicle", washAudit.litresPerVehicle, 50);
vehicleWashApprox("VW-A3 daily use", washAudit.litresPerDay, 3000);
vehicleWashApprox("VW-A4 annual litres", washAudit.annualL, 900000);
vehicleWashApprox("VW-A5 annual cubic metres", washAudit.annualM3, 900);
washAudit = computeVehicleWashAudit({ startMeterL: 0, endMeterL: 378.5411784, vehicles: 10, intervalDays: 1, operatingDays: 1 });
vehicleWashApprox("VW-A6 US-volume equivalence", washAudit.litresPerVehicle, 37.85411784);
vehicleWashThrows("VW-A7 reversed meter rejected", () => computeVehicleWashAudit({ startMeterL: 100, endMeterL: 99, vehicles: 1, intervalDays: 1, operatingDays: 1 }));
vehicleWashThrows("VW-A8 zero vehicles rejected", () => computeVehicleWashAudit({ startMeterL: 0, endMeterL: 1, vehicles: 0, intervalDays: 1, operatingDays: 1 }));
vehicleWashThrows("VW-A9 fractional vehicles rejected", () => computeVehicleWashAudit({ startMeterL: 0, endMeterL: 1, vehicles: 1.5, intervalDays: 1, operatingDays: 1 }));
vehicleWashThrows("VW-A10 367 operating days rejected", () => computeVehicleWashAudit({ startMeterL: 0, endMeterL: 1, vehicles: 1, intervalDays: 1, operatingDays: 367 }));

let reclaimBalance = computeReclaimBalance({ grossAppliedL: 180, spotFreeL: 20, carryoutL: 30, collectionPercent: 90, recoveryPercent: 80, vehiclesPerDay: 120 });
vehicleWashApprox("VW-M1 collectable", reclaimBalance.collectableL, 150);
vehicleWashApprox("VW-M2 potential recovered", reclaimBalance.potentialRecoveredL, 108);
vehicleWashApprox("VW-M3 eligible demand", reclaimBalance.reclaimEligibleL, 160);
vehicleWashApprox("VW-M4 reclaimed", reclaimBalance.reclaimedL, 108);
vehicleWashApprox("VW-M5 fresh", reclaimBalance.freshL, 72);
vehicleWashApprox("VW-M6 discharge", reclaimBalance.dischargeL, 42);
vehicleWashApprox("VW-M7 reclaim share", reclaimBalance.reclaimSharePercent, 60);
vehicleWashApprox("VW-M8 daily fresh", reclaimBalance.dailyFreshL, 8640);
vehicleWashApprox("VW-M9 daily reclaimed", reclaimBalance.dailyReclaimedL, 12960);
vehicleWashApprox("VW-M10 daily discharge", reclaimBalance.dailyDischargeL, 5040);
reclaimBalance = computeReclaimBalance({ grossAppliedL: 100, spotFreeL: 40, carryoutL: 0, collectionPercent: 100, recoveryPercent: 100, vehiclesPerDay: 1 });
vehicleWashApprox("VW-M11 reclaim capped by eligible steps", reclaimBalance.reclaimedL, 60);
vehicleWashApprox("VW-M12 capped-case discharge", reclaimBalance.dischargeL, 40);
vehicleWashExact("VW-M13 zero recovery fresh", computeReclaimBalance({ grossAppliedL: 100, spotFreeL: 10, carryoutL: 5, collectionPercent: 100, recoveryPercent: 0, vehiclesPerDay: 1 }).freshL, 100);
vehicleWashThrows("VW-M14 spot-free above gross rejected", () => computeReclaimBalance({ grossAppliedL: 100, spotFreeL: 101, carryoutL: 0, collectionPercent: 100, recoveryPercent: 100, vehiclesPerDay: 1 }));
vehicleWashThrows("VW-M15 carryout equal to gross rejected", () => computeReclaimBalance({ grossAppliedL: 100, spotFreeL: 0, carryoutL: 100, collectionPercent: 100, recoveryPercent: 100, vehiclesPerDay: 1 }));

let buffer = computeReclaimBuffer({ vehiclesPerHour: 12, peakHours: 4, demandPerVehicleL: 100, returnPerVehicleL: 90, delayMinutes: 20, tankVolumeL: 5000, startingVolumeL: 3000, reserveL: 500 });
vehicleWashExact("VW-B1 simulated minutes", buffer.minutes, 240);
vehicleWashApprox("VW-B2 demand per minute", buffer.demandPerMinuteL, 20);
vehicleWashApprox("VW-B3 return per minute", buffer.returnPerMinuteL, 18);
vehicleWashApprox("VW-B4 ending storage", buffer.endingStoredL, 2160);
vehicleWashApprox("VW-B5 minimum storage", buffer.minimumStoredL, 2160);
vehicleWashApprox("VW-B6 reserve margin", buffer.reserveMarginL, 1660);
vehicleWashApprox("VW-B7 no shortfall", buffer.shortfallL, 0);
vehicleWashApprox("VW-B8 no overflow", buffer.overflowL, 0);
vehicleWashExact("VW-B9 covered status", buffer.status, "Peak window covered");
buffer = computeReclaimBuffer({ vehiclesPerHour: 60, peakHours: 1, demandPerVehicleL: 10, returnPerVehicleL: 0, delayMinutes: 0, tankVolumeL: 100, startingVolumeL: 50, reserveL: 10 });
vehicleWashApprox("VW-B10 reserve-limited shortfall", buffer.shortfallL, 560);
vehicleWashExact("VW-B11 shortfall status", buffer.status, "Peak reclaim shortfall");
buffer = computeReclaimBuffer({ vehiclesPerHour: 1, peakHours: 1, demandPerVehicleL: 1, returnPerVehicleL: 100, delayMinutes: 0, tankVolumeL: 100, startingVolumeL: 100, reserveL: 0 });
vehicleWashApprox("VW-B12 overflow conservation", buffer.overflowL, 99, 1e-7);
vehicleWashThrows("VW-B13 start above tank rejected", () => computeReclaimBuffer({ vehiclesPerHour: 1, peakHours: 1, demandPerVehicleL: 1, returnPerVehicleL: 1, delayMinutes: 0, tankVolumeL: 100, startingVolumeL: 101, reserveL: 0 }));
vehicleWashThrows("VW-B14 reserve equal to tank rejected", () => computeReclaimBuffer({ vehiclesPerHour: 1, peakHours: 1, demandPerVehicleL: 1, returnPerVehicleL: 1, delayMinutes: 0, tankVolumeL: 100, startingVolumeL: 50, reserveL: 100 }));

let spotFree = computeSpotFreeRo({ vehiclesPerDay: 120, rinsePerVehicleL: 15, ratedRateLh: 120, productionHours: 18, availabilityPercent: 90, recoveryPercent: 50, peakVehiclesPerHour: 12, peakHours: 4, usableStorageL: 800 });
vehicleWashApprox("VW-R1 daily demand", spotFree.dailyDemandL, 1800);
vehicleWashApprox("VW-R2 effective rate", spotFree.effectiveRateLh, 108);
vehicleWashApprox("VW-R3 daily production", spotFree.dailyProductionL, 1944);
vehicleWashApprox("VW-R4 daily balance", spotFree.dailyBalanceL, 144);
vehicleWashApprox("VW-R5 feed", spotFree.feedL, 3888);
vehicleWashApprox("VW-R6 reject", spotFree.rejectL, 1944);
vehicleWashApprox("VW-R7 peak demand", spotFree.peakDemandL, 720);
vehicleWashApprox("VW-R8 concurrent production", spotFree.peakConcurrentProductionL, 432);
vehicleWashApprox("VW-R9 storage required", spotFree.peakStorageRequiredL, 288);
vehicleWashApprox("VW-R10 storage margin", spotFree.storageMarginL, 512);
vehicleWashExact("VW-R11 covered status", spotFree.status, "Daily and peak case covered");
vehicleWashExact("VW-R12 100-percent recovery reject", computeSpotFreeRo({ vehiclesPerDay: 1, rinsePerVehicleL: 1, ratedRateLh: 1, productionHours: 1, availabilityPercent: 100, recoveryPercent: 100, peakVehiclesPerHour: 1, peakHours: 1, usableStorageL: 1 }).rejectL, 0);
vehicleWashExact("VW-R13 daily shortfall status", computeSpotFreeRo({ vehiclesPerDay: 100, rinsePerVehicleL: 10, ratedRateLh: 10, productionHours: 1, availabilityPercent: 100, recoveryPercent: 50, peakVehiclesPerHour: 1, peakHours: 1, usableStorageL: 100 }).status, "Daily production shortfall");
vehicleWashExact("VW-R14 peak shortfall status", computeSpotFreeRo({ vehiclesPerDay: 1, rinsePerVehicleL: 10, ratedRateLh: 10, productionHours: 24, availabilityPercent: 100, recoveryPercent: 50, peakVehiclesPerHour: 100, peakHours: 1, usableStorageL: 0 }).status, "Peak storage shortfall");
vehicleWashThrows("VW-R15 zero recovery rejected", () => computeSpotFreeRo({ vehiclesPerDay: 1, rinsePerVehicleL: 1, ratedRateLh: 1, productionHours: 1, availabilityPercent: 100, recoveryPercent: 0, peakVehiclesPerHour: 1, peakHours: 1, usableStorageL: 0 }));
vehicleWashThrows("VW-R16 production beyond 24 hours rejected", () => computeSpotFreeRo({ vehiclesPerDay: 1, rinsePerVehicleL: 1, ratedRateLh: 1, productionHours: 25, availabilityPercent: 100, recoveryPercent: 50, peakVehiclesPerHour: 1, peakHours: 1, usableStorageL: 0 }));

let washSavings = computeVehicleWashSavings({ baselineFreshL: 180, proposedFreshL: 72, baselineSewerL: 150, proposedSewerL: 42, vehiclesPerDay: 120, operatingDays: 300, waterTariff: 2.5, sewerTariff: 3, annualOperatingCost: 3500, installedCost: 45000 });
vehicleWashApprox("VW-E1 annual fresh saved", washSavings.annualFreshSavedM3, 3888);
vehicleWashApprox("VW-E2 annual sewer saved", washSavings.annualSewerSavedM3, 3888);
vehicleWashApprox("VW-E3 avoided water cost", washSavings.avoidedWaterCost, 9720);
vehicleWashApprox("VW-E4 avoided sewer cost", washSavings.avoidedSewerCost, 11664);
vehicleWashApprox("VW-E5 gross savings", washSavings.grossAnnualSavings, 21384);
vehicleWashApprox("VW-E6 net savings", washSavings.netAnnualSavings, 17884);
vehicleWashApprox("VW-E7 simple payback", washSavings.simplePaybackYears, 45000 / 17884);
vehicleWashExact("VW-E8 zero capex no payback", computeVehicleWashSavings({ baselineFreshL: 1, proposedFreshL: 0, baselineSewerL: 1, proposedSewerL: 0, vehiclesPerDay: 1, operatingDays: 1, waterTariff: 1, sewerTariff: 1, annualOperatingCost: 0, installedCost: 0 }).simplePaybackYears, null);
vehicleWashExact("VW-E9 negative savings no payback", computeVehicleWashSavings({ baselineFreshL: 1, proposedFreshL: 2, baselineSewerL: 1, proposedSewerL: 2, vehiclesPerDay: 1, operatingDays: 1, waterTariff: 1, sewerTariff: 1, annualOperatingCost: 0, installedCost: 100 }).simplePaybackYears, null);
vehicleWashThrows("VW-E10 367 days rejected", () => computeVehicleWashSavings({ baselineFreshL: 1, proposedFreshL: 0, baselineSewerL: 1, proposedSewerL: 0, vehiclesPerDay: 1, operatingDays: 367, waterTariff: 1, sewerTariff: 1, annualOperatingCost: 0, installedCost: 0 }));

const rinseAudit = computeRinseAudit({ startMeterL: 50000, endMeterL: 60000, intervalHours: 8, loads: 200, hoursPerDay: 8, daysPerYear: 250, combinedTariff: 5.5 });
metalApprox("MF-A1 interval", rinseAudit.intervalL, 10000); metalApprox("MF-A2 per load", rinseAudit.litresPerLoad, 50); metalApprox("MF-A3 hourly", rinseAudit.litresPerHour, 1250); metalApprox("MF-A4 annual", rinseAudit.annualM3, 2500); metalApprox("MF-A5 cost", rinseAudit.annualUtilityCost, 13750);
metalApprox("MF-A6 US equivalence", computeRinseAudit({ startMeterL: 0, endMeterL: 378.5411784, intervalHours: 1, loads: 10, hoursPerDay: 1, daysPerYear: 1, combinedTariff: 0 }).litresPerLoad, 37.85411784);
metalThrows("MF-A7 reversed meter", () => computeRinseAudit({ startMeterL: 2, endMeterL: 1, intervalHours: 1, loads: 1, hoursPerDay: 1, daysPerYear: 1, combinedTariff: 0 }));
metalThrows("MF-A8 zero loads", () => computeRinseAudit({ startMeterL: 0, endMeterL: 1, intervalHours: 1, loads: 0, hoursPerDay: 1, daysPerYear: 1, combinedTariff: 0 }));
metalThrows("MF-A9 invalid days", () => computeRinseAudit({ startMeterL: 0, endMeterL: 1, intervalHours: 1, loads: 1, hoursPerDay: 1, daysPerYear: 367, combinedTariff: 0 }));

const drag = computeDragOut({ retainedMlPerLoad: 40, loadsPerHour: 25, concentrationGPerL: 100, valuePerKg: 12, shiftHours: 8 });
metalApprox("MF-D1 flow", drag.dragOutLh, 1); metalApprox("MF-D2 solution shift", drag.solutionPerShiftL, 8); metalApprox("MF-D3 mass hourly", drag.massKgH, .1); metalApprox("MF-D4 mass shift", drag.massPerShiftKg, .8); metalApprox("MF-D5 value", drag.valuePerShift, 9.6);
metalExact("MF-D6 zero concentration", computeDragOut({ retainedMlPerLoad: 1, loadsPerHour: 1, concentrationGPerL: 0, valuePerKg: 0, shiftHours: 1 }).massKgH, 0);
metalThrows("MF-D7 negative retention", () => computeDragOut({ retainedMlPerLoad: -1, loadsPerHour: 1, concentrationGPerL: 0, valuePerKg: 0, shiftHours: 1 }));
metalThrows("MF-D8 long shift", () => computeDragOut({ retainedMlPerLoad: 1, loadsPerHour: 1, concentrationGPerL: 0, valuePerKg: 0, shiftHours: 25 }));

const counter = computeCountercurrentRinse({ dragOutLh: 1, dilutionRatio: 1000, stages: 2 });
metalApprox("MF-C1 counterflow", counter.requiredFlowLh, 2 * Math.sqrt(1000)); metalApprox("MF-C2 one stage", counter.oneStageFlowLh, 1000); metalApprox("MF-C3 reduction", counter.reductionLh, 1000 - 2 * Math.sqrt(1000));
metalExact("MF-C4 one-stage zero reduction", computeCountercurrentRinse({ dragOutLh: 1, dilutionRatio: 10, stages: 1 }).reductionPercent, 0);
metalApprox("MF-C5 high four-stage", computeCountercurrentRinse({ dragOutLh: 100, dilutionRatio: 1000000, stages: 4 }).requiredFlowLh, 400 * Math.pow(1000000, .25));
metalThrows("MF-C6 ratio boundary", () => computeCountercurrentRinse({ dragOutLh: 1, dilutionRatio: 1, stages: 2 })); metalThrows("MF-C7 fractional stages", () => computeCountercurrentRinse({ dragOutLh: 1, dilutionRatio: 10, stages: 2.5 })); metalThrows("MF-C8 fifth stage", () => computeCountercurrentRinse({ dragOutLh: 1, dilutionRatio: 10, stages: 5 }));

const parsed = parseRinseLog("minutes,flow,conductivity,loads\n60,5,400,10\n30,5,800,0");
metalExact("MF-L1 parsed rows", parsed.length, 2); const log = computeRinseLog({ rows: parsed, alertConductivity: 600 });
metalApprox("MF-L2 total water", log.totalWaterL, 450); metalApprox("MF-L3 water per load", log.litresPerLoad, 45); metalApprox("MF-L4 idle water", log.idleWaterL, 150); metalExact("MF-L5 excursions", log.excursions, 1); metalExact("MF-L6 peak", log.peakConductivity, 800);
metalExact("MF-L7 tab input", parseRinseLog("1\t2\t3\t4").length, 1); metalThrows("MF-L8 empty log", () => parseRinseLog("")); metalThrows("MF-L9 malformed row", () => parseRinseLog("1,2,3")); metalThrows("MF-L10 zero production", () => computeRinseLog({ rows: [{ minutes: 1, flowLpm: 1, conductivity: 1, loads: 0 }], alertConductivity: 1 }));

const economics = computeRinseSavings({ baselineLh: 1000, proposedLh: 100, hoursPerDay: 8, daysPerYear: 250, waterTariff: 2.5, sewerTariff: 3, treatmentCost: 1.5, annualOperatingCost: 2500, installedCost: 30000 });
metalApprox("MF-E1 water", economics.annualSavedM3, 1800); metalApprox("MF-E2 gross", economics.grossAnnualSavings, 12600); metalApprox("MF-E3 net", economics.netAnnualSavings, 10100); metalApprox("MF-E4 payback", economics.paybackYears, 30000 / 10100);
metalExact("MF-E5 no capex payback", computeRinseSavings({ baselineLh: 1, proposedLh: 0, hoursPerDay: 1, daysPerYear: 1, waterTariff: 1, sewerTariff: 0, treatmentCost: 0, annualOperatingCost: 0, installedCost: 0 }).paybackYears, null);
metalExact("MF-E6 negative net", computeRinseSavings({ baselineLh: 1, proposedLh: 0, hoursPerDay: 1, daysPerYear: 1, waterTariff: 0, sewerTariff: 0, treatmentCost: 0, annualOperatingCost: 1, installedCost: 1 }).paybackYears, null);
metalThrows("MF-E7 proposed above baseline", () => computeRinseSavings({ baselineLh: 1, proposedLh: 2, hoursPerDay: 1, daysPerYear: 1, waterTariff: 0, sewerTariff: 0, treatmentCost: 0, annualOperatingCost: 0, installedCost: 0 })); metalThrows("MF-E8 negative cost", () => computeRinseSavings({ baselineLh: 1, proposedLh: 0, hoursPerDay: 1, daysPerYear: 1, waterTariff: -1, sewerTariff: 0, treatmentCost: 0, annualOperatingCost: 0, installedCost: 0 }));

const purge = computePurgeVolume({ internalDiameterMm: 50, totalDepthM: 12, depthToWaterM: 4, purgeMultiplier: 3, flowLpm: 1, containerCapacityL: 20 });
monitoringWellApprox("MW-P1 water column", purge.waterColumnM, 8); monitoringWellApprox("MW-P2 one well volume", purge.wellVolumeL, Math.PI * 5); monitoringWellApprox("MW-P3 target volume", purge.targetVolumeL, Math.PI * 15); monitoringWellApprox("MW-P4 time", purge.purgeTimeMinutes, Math.PI * 15); monitoringWellExact("MW-P5 containers", purge.containers, 3);
monitoringWellThrows("MW-P6 water level beyond bottom", () => computePurgeVolume({ internalDiameterMm: 50, totalDepthM: 4, depthToWaterM: 4, purgeMultiplier: 1, flowLpm: 1, containerCapacityL: 1 }));
monitoringWellThrows("MW-P7 zero flow", () => computePurgeVolume({ internalDiameterMm: 50, totalDepthM: 4, depthToWaterM: 1, purgeMultiplier: 1, flowLpm: 0, containerCapacityL: 1 }));

let setup = checkLowFlowSetup({ screenTopM: 10, screenBottomM: 13, intakeDepthM: 11.5, initialWaterDepthM: 4, stabilizedWaterDepthM: 4.08, flowLpm: .25, maximumDrawdownM: .1, maximumFlowLpm: .5 });
monitoringWellApprox("MW-S1 drawdown", setup.drawdownM, .08); monitoringWellApprox("MW-S2 submerged head", setup.submergedHeadM, 7.42); monitoringWellExact("MW-S3 setup met", setup.criteriaMet, true);
setup = checkLowFlowSetup({ screenTopM: 10, screenBottomM: 13, intakeDepthM: 9, initialWaterDepthM: 4, stabilizedWaterDepthM: 4.2, flowLpm: .6, maximumDrawdownM: .1, maximumFlowLpm: .5 });
monitoringWellExact("MW-S4 intake check", setup.intakeInsideScreen, false); monitoringWellExact("MW-S5 drawdown check", setup.drawdownWithinEnteredLimit, false); monitoringWellExact("MW-S6 flow check", setup.flowWithinEnteredLimit, false); monitoringWellExact("MW-S7 setup not met", setup.criteriaMet, false);
monitoringWellThrows("MW-S8 reversed screen", () => checkLowFlowSetup({ screenTopM: 13, screenBottomM: 10, intakeDepthM: 11, initialWaterDepthM: 4, stabilizedWaterDepthM: 4.1, flowLpm: .2, maximumDrawdownM: .2, maximumFlowLpm: .5 }));

let interval = computeEquipmentInterval({ tubingInternalDiameterMm: 6, tubingLengthM: 20, pumpVolumeMl: 100, flowCellVolumeMl: 250, otherVolumeMl: 50, exchanges: 1, flowLpm: .25, plannedIntervalMinutes: 5 });
monitoringWellApprox("MW-E1 tubing volume", interval.tubingVolumeL, Math.PI * .18); monitoringWellApprox("MW-E2 equipment volume", interval.totalEquipmentVolumeL, Math.PI * .18 + .4); monitoringWellApprox("MW-E3 interval", interval.minimumIntervalMinutes, (Math.PI * .18 + .4) / .25); monitoringWellExact("MW-E4 planned pass", interval.intervalMeetsEnteredExchange, true);
interval = computeEquipmentInterval({ tubingInternalDiameterMm: 6, tubingLengthM: 20, pumpVolumeMl: 100, flowCellVolumeMl: 250, otherVolumeMl: 50, exchanges: 2, flowLpm: .25, plannedIntervalMinutes: 5 });
monitoringWellExact("MW-E5 planned fail", interval.intervalMeetsEnteredExchange, false); monitoringWellThrows("MW-E6 negative chamber", () => computeEquipmentInterval({ tubingInternalDiameterMm: 6, tubingLengthM: 20, pumpVolumeMl: -1, flowCellVolumeMl: 0, otherVolumeMl: 0, exchanges: 1, flowLpm: .25, plannedIntervalMinutes: 5 }));

const stabilizationRows = parseStabilizationLog("minutes,pH,temperature,conductivity,do,orp,turbidity,depthToWater,flow\n0,7.01,15.0,500,4.0,120,5.0,4.05,0.25\n5,7.03,15.1,505,3.9,122,4.8,4.06,0.25\n10,7.02,15.1,503,3.9,121,4.9,4.06,0.24");
monitoringWellExact("MW-L1 parsed rows", stabilizationRows.length, 3);
const stabilization = analyzeStabilization({ rows: stabilizationRows, consecutiveReadings: 3, criteria: { pH: .1, temperature: 3, conductivity: 3, dissolvedOxygen: 10, orp: 10, turbidity: 10, depthToWater: .05, flow: .05 } });
monitoringWellApprox("MW-L2 pH range", stabilization.metrics.pH, .02); monitoringWellApprox("MW-L3 conductivity relative range", stabilization.metrics.conductivity, 5 / (1508 / 3) * 100); monitoringWellApprox("MW-L4 purge integration", stabilization.purgeVolumeL, 2.5); monitoringWellExact("MW-L5 criteria met", stabilization.criteriaMet, true);
monitoringWellExact("MW-L6 strict failed parameter", analyzeStabilization({ rows: stabilizationRows, consecutiveReadings: 3, criteria: { pH: .01, temperature: 3, conductivity: 3, dissolvedOxygen: 10, orp: 10, turbidity: 10, depthToWater: .05, flow: .05 } }).criteriaMet, false);
monitoringWellThrows("MW-L7 malformed row", () => parseStabilizationLog("0,7,15")); monitoringWellThrows("MW-L8 non-increasing time", () => parseStabilizationLog("0,7,15,500,4,120,5,4,.2\n0,7,15,500,4,120,5,4,.2")); monitoringWellThrows("MW-L9 insufficient window", () => analyzeStabilization({ rows: stabilizationRows, consecutiveReadings: 4, criteria: { pH: 1, temperature: 1, conductivity: 1, dissolvedOxygen: 1, orp: 1, turbidity: 1, depthToWater: 1, flow: 1 } }));

if (failures.length) {
  console.error(`Calculation verification failed with ${failures.length} issue(s):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Calculation verification passed: ${numericCases} Phase 1 numeric/conversion cases, ${diagnosticCases} troubleshooting scenarios, ${phase2Cases} Phase 2 numeric/decision cases, ${simulatorCases} rainwater simulator scenarios, ${irrigationCases} irrigation numeric/validation checks, ${irrigationDiagnosticCases} irrigation troubleshooting scenarios, ${treatmentCases} treatment numeric/validation checks, ${treatmentSelectorCases} treatment selector scenarios, ${greywaterCases} greywater numeric/validation checks, ${vehicleWashCases} vehicle-wash numeric/validation checks, ${metalCases} metal-finishing numeric/validation checks, and ${monitoringWellCases} monitoring-well numeric/validation checks.`);
