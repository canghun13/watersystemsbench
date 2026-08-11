import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, toSI } from "../unit-conversions.js";

const value = (form, name, options = {}) => numberValue(form, name, options);
const report = (form, label, primary, supporting, interpretation, warning = "") =>
  renderResult(form, { label, primary, supporting, interpretation, warning });

function positive(amount, label) {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error(`${label} must be greater than zero.`);
}

function nonnegative(amount, label) {
  if (!Number.isFinite(amount) || amount < 0) throw new Error(`${label} must be zero or greater.`);
}

function percent(amount, label, allowZero = true) {
  if (!Number.isFinite(amount) || amount > 100 || amount < (allowZero ? 0 : Number.EPSILON)) {
    throw new Error(`${label} must be ${allowZero ? "between 0% and 100%" : "greater than 0% and no more than 100%"}.`);
  }
}

function whole(amount, label, min = 1, max = 1000000) {
  if (!Number.isInteger(amount) || amount < min || amount > max) throw new Error(`${label} must be a whole number between ${min} and ${max}.`);
}

export function computeVehicleWashAudit({ startMeterL, endMeterL, vehicles, intervalDays, operatingDays }) {
  nonnegative(startMeterL, "Starting meter reading");
  positive(endMeterL, "Ending meter reading");
  if (endMeterL <= startMeterL) throw new Error("Ending meter reading must be greater than starting meter reading.");
  whole(vehicles, "Vehicles", 1, 10000000);
  positive(intervalDays, "Interval length");
  whole(operatingDays, "Operating days", 1, 366);
  const intervalUseL = endMeterL - startMeterL;
  const litresPerVehicle = intervalUseL / vehicles;
  const litresPerDay = intervalUseL / intervalDays;
  const annualL = litresPerDay * operatingDays;
  return { intervalUseL, litresPerVehicle, litresPerDay, annualL, annualM3: annualL / 1000 };
}

export function computeReclaimBalance({ grossAppliedL, spotFreeL, carryoutL, collectionPercent, recoveryPercent, vehiclesPerDay }) {
  positive(grossAppliedL, "Gross applied water");
  nonnegative(spotFreeL, "Spot-free rinse");
  nonnegative(carryoutL, "Carryout / evaporation");
  if (spotFreeL > grossAppliedL) throw new Error("Spot-free rinse cannot exceed gross applied water.");
  if (carryoutL >= grossAppliedL) throw new Error("Carryout / evaporation must be less than gross applied water.");
  percent(collectionPercent, "Collection efficiency");
  percent(recoveryPercent, "Treatment recovery");
  whole(vehiclesPerDay, "Vehicles per day", 1, 1000000);
  const collectableL = grossAppliedL - carryoutL;
  const potentialRecoveredL = collectableL * collectionPercent / 100 * recoveryPercent / 100;
  const reclaimEligibleL = Math.max(0, grossAppliedL - spotFreeL);
  const reclaimedL = Math.min(potentialRecoveredL, reclaimEligibleL);
  const freshL = grossAppliedL - reclaimedL;
  const dischargeL = Math.max(0, grossAppliedL - carryoutL - reclaimedL);
  return {
    collectableL, potentialRecoveredL, reclaimEligibleL, reclaimedL, freshL, dischargeL,
    reclaimSharePercent: reclaimedL / grossAppliedL * 100,
    dailyFreshL: freshL * vehiclesPerDay,
    dailyReclaimedL: reclaimedL * vehiclesPerDay,
    dailyDischargeL: dischargeL * vehiclesPerDay
  };
}

export function computeReclaimBuffer({ vehiclesPerHour, peakHours, demandPerVehicleL, returnPerVehicleL, delayMinutes, tankVolumeL, startingVolumeL, reserveL }) {
  positive(vehiclesPerHour, "Peak vehicles per hour");
  positive(peakHours, "Peak window");
  positive(demandPerVehicleL, "Reclaim demand per vehicle");
  nonnegative(returnPerVehicleL, "Recovered return per vehicle");
  nonnegative(delayMinutes, "Recovery delay");
  positive(tankVolumeL, "Working tank volume");
  nonnegative(startingVolumeL, "Starting stored volume");
  nonnegative(reserveL, "Minimum reserve");
  if (startingVolumeL > tankVolumeL) throw new Error("Starting stored volume cannot exceed working tank volume.");
  if (reserveL >= tankVolumeL) throw new Error("Minimum reserve must be less than working tank volume.");
  const minutes = Math.max(1, Math.ceil(peakHours * 60));
  const demandPerMinuteL = vehiclesPerHour / 60 * demandPerVehicleL;
  const returnPerMinuteL = vehiclesPerHour / 60 * returnPerVehicleL;
  let storedL = startingVolumeL;
  let minimumStoredL = storedL;
  let shortfallL = 0;
  let overflowL = 0;
  for (let minute = 0; minute < minutes; minute += 1) {
    const availableAboveReserve = Math.max(0, storedL - reserveL);
    const servedL = Math.min(demandPerMinuteL, availableAboveReserve);
    storedL -= servedL;
    shortfallL += demandPerMinuteL - servedL;
    if (minute >= delayMinutes) {
      storedL += returnPerMinuteL;
      if (storedL > tankVolumeL) {
        overflowL += storedL - tankVolumeL;
        storedL = tankVolumeL;
      }
    }
    minimumStoredL = Math.min(minimumStoredL, storedL);
  }
  return {
    minutes, demandPerMinuteL, returnPerMinuteL, endingStoredL: storedL, minimumStoredL,
    shortfallL, overflowL, reserveMarginL: minimumStoredL - reserveL,
    status: shortfallL > 1e-8 ? "Peak reclaim shortfall" : "Peak window covered"
  };
}

export function computeSpotFreeRo({ vehiclesPerDay, rinsePerVehicleL, ratedRateLh, productionHours, availabilityPercent, recoveryPercent, peakVehiclesPerHour, peakHours, usableStorageL }) {
  whole(vehiclesPerDay, "Vehicles per day", 1, 1000000);
  positive(rinsePerVehicleL, "Spot-free rinse per vehicle");
  positive(ratedRateLh, "Measured permeate production");
  positive(productionHours, "Production hours");
  if (productionHours > 24) throw new Error("Production hours cannot exceed 24 per day.");
  percent(availabilityPercent, "Production availability", false);
  percent(recoveryPercent, "Membrane recovery", false);
  positive(peakVehiclesPerHour, "Peak vehicles per hour");
  positive(peakHours, "Peak duration");
  nonnegative(usableStorageL, "Usable permeate storage");
  const dailyDemandL = vehiclesPerDay * rinsePerVehicleL;
  const effectiveRateLh = ratedRateLh * availabilityPercent / 100;
  const dailyProductionL = effectiveRateLh * productionHours;
  const dailyBalanceL = dailyProductionL - dailyDemandL;
  const feedL = dailyProductionL / (recoveryPercent / 100);
  const rejectL = feedL - dailyProductionL;
  const peakDemandL = peakVehiclesPerHour * peakHours * rinsePerVehicleL;
  const peakConcurrentProductionL = effectiveRateLh * peakHours;
  const peakStorageRequiredL = Math.max(0, peakDemandL - peakConcurrentProductionL);
  const storageMarginL = usableStorageL - peakStorageRequiredL;
  const status = dailyBalanceL >= 0 && storageMarginL >= 0 ? "Daily and peak case covered" : dailyBalanceL < 0 ? "Daily production shortfall" : "Peak storage shortfall";
  return { dailyDemandL, effectiveRateLh, dailyProductionL, dailyBalanceL, feedL, rejectL, peakDemandL, peakConcurrentProductionL, peakStorageRequiredL, storageMarginL, status };
}

export function computeVehicleWashSavings({ baselineFreshL, proposedFreshL, baselineSewerL, proposedSewerL, vehiclesPerDay, operatingDays, waterTariff, sewerTariff, annualOperatingCost, installedCost }) {
  for (const [amount, label] of [[baselineFreshL, "Baseline fresh water"], [proposedFreshL, "Proposed fresh water"], [baselineSewerL, "Baseline sewer discharge"], [proposedSewerL, "Proposed sewer discharge"]]) nonnegative(amount, label);
  whole(vehiclesPerDay, "Vehicles per day", 1, 1000000);
  whole(operatingDays, "Operating days", 1, 366);
  for (const [amount, label] of [[waterTariff, "Water tariff"], [sewerTariff, "Sewer tariff"], [annualOperatingCost, "Annual operating cost"], [installedCost, "Installed cost"]]) nonnegative(amount, label);
  const annualFreshSavedM3 = (baselineFreshL - proposedFreshL) * vehiclesPerDay * operatingDays / 1000;
  const annualSewerSavedM3 = (baselineSewerL - proposedSewerL) * vehiclesPerDay * operatingDays / 1000;
  const avoidedWaterCost = annualFreshSavedM3 * waterTariff;
  const avoidedSewerCost = annualSewerSavedM3 * sewerTariff;
  const grossAnnualSavings = avoidedWaterCost + avoidedSewerCost;
  const netAnnualSavings = grossAnnualSavings - annualOperatingCost;
  const simplePaybackYears = installedCost > 0 && netAnnualSavings > 0 ? installedCost / netAnnualSavings : null;
  return { annualFreshSavedM3, annualSewerSavedM3, avoidedWaterCost, avoidedSewerCost, grossAnnualSavings, netAnnualSavings, simplePaybackYears };
}

if (typeof document !== "undefined") for (const form of document.querySelectorAll('[data-tool-form^="vehicle-wash-"]')) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem?.value || "SI";
    const type = current.dataset.toolForm;
    const volume = (name, options = {}) => toSI(value(current, name, options), "volume", system);
    const shownVolume = (amount, digits = 1) => `${formatNumber(fromSI(amount, "volume", system), digits)} ${system === "US" ? "US gal" : "L"}`;
    if (type === "vehicle-wash-audit") {
      const result = computeVehicleWashAudit({
        startMeterL: volume("startMeter"), endMeterL: volume("endMeter"),
        vehicles: value(current, "vehicles", { allowZero: false }), intervalDays: value(current, "intervalDays", { allowZero: false }),
        operatingDays: value(current, "operatingDays", { allowZero: false, max: 366 })
      });
      report(current, "Fresh water per vehicle", `${shownVolume(result.litresPerVehicle)}<span class="reading-unit"> /vehicle</span>`, [
        `Metered interval use: ${shownVolume(result.intervalUseL, 0)}`,
        `Average daily use: ${shownVolume(result.litresPerDay, 0)}/day`,
        `Projected annual use: ${formatNumber(result.annualM3, 1)} m³/year`
      ], "Repeat comparable intervals and retain individual results; do not average unlike wash packages or operating states.", "A shared meter, leak, maintenance cycle or mismatched vehicle count can invalidate the baseline.");
    } else if (type === "vehicle-wash-balance") {
      const result = computeReclaimBalance({
        grossAppliedL: volume("gross", { allowZero: false }), spotFreeL: volume("spotFree"), carryoutL: volume("carryout"),
        collectionPercent: value(current, "collection", { max: 100 }), recoveryPercent: value(current, "recovery", { max: 100 }),
        vehiclesPerDay: value(current, "vehicles", { allowZero: false })
      });
      report(current, "Fresh requirement", `${shownVolume(result.freshL)}<span class="reading-unit"> /vehicle</span>`, [
        `Reclaim returned to the next cycle: ${shownVolume(result.reclaimedL)} /vehicle (${formatNumber(result.reclaimSharePercent, 1)}%)`,
        `Carryout / evaporation entered: ${shownVolume(volume("carryout"))} /vehicle`,
        `Remaining discharge: ${shownVolume(result.dischargeL)} /vehicle`,
        `Daily fresh / reclaim: ${shownVolume(result.dailyFreshL, 0)} / ${shownVolume(result.dailyReclaimedL, 0)}`
      ], "The reclaim result is capped by both recoverable return and the process volume eligible to receive reclaimed water.", "Confirm which wash steps may use reclaimed water and how reject, backwash, sludge and bypass are routed.");
    } else if (type === "vehicle-wash-buffer") {
      const result = computeReclaimBuffer({
        vehiclesPerHour: value(current, "vehiclesPerHour", { allowZero: false }), peakHours: value(current, "peakHours", { allowZero: false }),
        demandPerVehicleL: volume("demandPerVehicle", { allowZero: false }), returnPerVehicleL: volume("returnPerVehicle"),
        delayMinutes: value(current, "delayMinutes"), tankVolumeL: volume("tankVolume", { allowZero: false }),
        startingVolumeL: volume("startingVolume"), reserveL: volume("reserve")
      });
      report(current, "Peak buffer result", result.status, [
        `Minimum stored volume: ${shownVolume(result.minimumStoredL)}`,
        `Ending stored volume: ${shownVolume(result.endingStoredL)}`,
        `Reserve margin at minimum: ${shownVolume(result.reserveMarginL)}`,
        `Unserved reclaim demand: ${shownVolume(result.shortfallL)}`,
        `Tank overflow / bypass: ${shownVolume(result.overflowL)}`
      ], "Run more than one throughput, starting-level, delay and recovery case; a steady peak is a screening scenario, not a control-system model.", "Keep tank working limits, level controls, emergency make-up, overflow and maintenance access in the equipment design.");
    } else if (type === "vehicle-wash-ro") {
      const result = computeSpotFreeRo({
        vehiclesPerDay: value(current, "vehicles", { allowZero: false }), rinsePerVehicleL: volume("rinsePerVehicle", { allowZero: false }),
        ratedRateLh: volume("ratedRate", { allowZero: false }), productionHours: value(current, "productionHours", { allowZero: false, max: 24 }),
        availabilityPercent: value(current, "availability", { allowZero: false, max: 100 }), recoveryPercent: value(current, "recovery", { allowZero: false, max: 100 }),
        peakVehiclesPerHour: value(current, "peakVehiclesPerHour", { allowZero: false }), peakHours: value(current, "peakHours", { allowZero: false }),
        usableStorageL: volume("usableStorage")
      });
      report(current, "Spot-free production result", result.status, [
        `Daily permeate demand / production: ${shownVolume(result.dailyDemandL, 0)} / ${shownVolume(result.dailyProductionL, 0)}`,
        `Daily production balance: ${shownVolume(result.dailyBalanceL)}`,
        `Peak storage required: ${shownVolume(result.peakStorageRequiredL)}`,
        `Entered storage margin: ${shownVolume(result.storageMarginL)}`,
        `RO feed / reject at entered recovery: ${shownVolume(result.feedL, 0)} / ${shownVolume(result.rejectL, 0)}`
      ], "Use measured permeate production at actual temperature, pressure, feed quality and membrane condition.", "Do not assume RO reject is suitable for reclaim; verify chemistry, treatment compatibility and approved routing.");
    } else if (type === "vehicle-wash-savings") {
      const result = computeVehicleWashSavings({
        baselineFreshL: volume("baselineFresh"), proposedFreshL: volume("proposedFresh"),
        baselineSewerL: volume("baselineSewer"), proposedSewerL: volume("proposedSewer"),
        vehiclesPerDay: value(current, "vehicles", { allowZero: false }), operatingDays: value(current, "days", { allowZero: false, max: 366 }),
        waterTariff: value(current, "waterTariff"), sewerTariff: value(current, "sewerTariff"),
        annualOperatingCost: value(current, "operatingCost"), installedCost: value(current, "installedCost")
      });
      report(current, "Net annual savings", `${formatNumber(result.netAnnualSavings, 2)}<span class="reading-unit"> currency/year</span>`, [
        `Fresh water saved: ${formatNumber(result.annualFreshSavedM3, 1)} m³/year`,
        `Sewer discharge saved: ${formatNumber(result.annualSewerSavedM3, 1)} m³/year`,
        `Avoided water / sewer charge: ${formatNumber(result.avoidedWaterCost, 2)} / ${formatNumber(result.avoidedSewerCost, 2)} currency/year`,
        result.simplePaybackYears == null ? "Simple payback is unavailable because installed cost is zero or net savings are not positive." : `Simple payback: ${formatNumber(result.simplePaybackYears, 1)} years`
      ], "Test current tariff rules, lower throughput, lower recovery and higher maintenance cases before relying on one payback result.", "Simple payback excludes financing, tax, escalation, replacement, downtime, rebates and non-financial compliance benefits.");
    }
  });
}
