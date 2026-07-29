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
import { conversions, headToPressure, pressureToHead } from "../assets/js/unit-conversions.js";

let numericCases = 0;
let diagnosticCases = 0;
let phase2Cases = 0;
let simulatorCases = 0;
let irrigationCases = 0;
let irrigationDiagnosticCases = 0;
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

if (failures.length) {
  console.error(`Calculation verification failed with ${failures.length} issue(s):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Calculation verification passed: ${numericCases} Phase 1 numeric/conversion cases, ${diagnosticCases} troubleshooting scenarios, ${phase2Cases} Phase 2 numeric/decision cases, ${simulatorCases} rainwater simulator scenarios, ${irrigationCases} irrigation numeric/validation checks and ${irrigationDiagnosticCases} irrigation troubleshooting scenarios.`);
