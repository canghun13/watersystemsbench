import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, toSI } from "../unit-conversions.js";

const MG_L_PER_GPG = 17.118061;
const LB_PER_KG = 2.2046226218;
const value = (form, name, options = {}) => numberValue(form, name, options);
const optional = (form, name, options = {}) => {
  const raw = form.elements.namedItem(name)?.value?.trim();
  return raw === "" || raw == null ? null : value(form, name, options);
};
const report = (form, label, primary, supporting, interpretation, warning = "") =>
  renderResult(form, { label, primary, supporting, interpretation, warning });

function finiteNonnegative(value, label) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${label} must be zero or greater.`);
}

function percent(value, label, maximum = 100) {
  if (!Number.isFinite(value) || value < 0 || value > maximum) throw new Error(`${label} must be between 0% and ${maximum}%.`);
}

export function computeSoftenerSizing({
  hardness,
  hardnessUnit = "mgL",
  dailyUseL,
  regenerationDays,
  reservePercent,
  ironMgL = 0,
  ironFactorGpgPerMgL = null,
  peakFlowLpm
}) {
  finiteNonnegative(hardness, "Hardness");
  if (!(dailyUseL > 0)) throw new Error("Daily water use must be greater than zero.");
  if (!(regenerationDays > 0)) throw new Error("Days between regeneration must be greater than zero.");
  percent(reservePercent, "Reserve allowance", 100);
  finiteNonnegative(ironMgL, "Iron concentration");
  if (!(peakFlowLpm > 0)) throw new Error("Peak service flow must be greater than zero.");
  if (ironMgL > 0 && !(ironFactorGpgPerMgL > 0)) {
    throw new Error("Enter a positive iron compensation factor from the selected equipment or an authoritative source.");
  }
  const hardnessGpg = hardnessUnit === "gpg" ? hardness : hardness / MG_L_PER_GPG;
  const ironAllowanceGpg = ironMgL > 0 ? ironMgL * ironFactorGpgPerMgL : 0;
  const adjustedHardnessGpg = hardnessGpg + ironAllowanceGpg;
  if (!(adjustedHardnessGpg > 0)) throw new Error("A positive adjusted hardness load is required.");
  const dailyGallons = dailyUseL / 3.785411784;
  const dailyGrainLoad = adjustedHardnessGpg * dailyGallons;
  const workingCapacityGrains = dailyGrainLoad * regenerationDays;
  const reserveAdjustedCapacityGrains = workingCapacityGrains * (1 + reservePercent / 100);
  return {
    hardnessGpg,
    hardnessMgL: hardnessGpg * MG_L_PER_GPG,
    ironAllowanceGpg,
    adjustedHardnessGpg,
    dailyGallons,
    dailyGrainLoad,
    workingCapacityGrains,
    reserveAdjustedCapacityGrains,
    peakFlowLpm
  };
}

export function computeSaltRegeneration({
  dailyGrainLoad,
  usableCapacityGrains,
  saltDoseKg,
  reservePercent,
  regenerationWaterL = null,
  saltPricePerKg = null,
  waterPricePerM3 = null
}) {
  if (!(dailyGrainLoad > 0)) throw new Error("Daily hardness load must be greater than zero.");
  if (!(usableCapacityGrains > 0)) throw new Error("Usable capacity per regeneration must be greater than zero.");
  if (!(saltDoseKg > 0)) throw new Error("Salt dose per regeneration must be greater than zero.");
  percent(reservePercent, "Reserve allowance", 90);
  for (const [amount, label] of [[regenerationWaterL, "Regeneration water"], [saltPricePerKg, "Salt price"], [waterPricePerM3, "Water price"]]) {
    if (amount != null) finiteNonnegative(amount, label);
  }
  const serviceCapacityGrains = usableCapacityGrains * (1 - reservePercent / 100);
  if (!(serviceCapacityGrains > 0)) throw new Error("Reserve leaves no service capacity.");
  const daysBetweenRegeneration = serviceCapacityGrains / dailyGrainLoad;
  const regenerationsPerMonth = 30.4375 / daysBetweenRegeneration;
  const regenerationsPerYear = 365.25 / daysBetweenRegeneration;
  const saltKgPerMonth = regenerationsPerMonth * saltDoseKg;
  const saltKgPerYear = regenerationsPerYear * saltDoseKg;
  const saltEfficiencyGrainsPerLb = usableCapacityGrains / (saltDoseKg * LB_PER_KG);
  const regenerationWaterLPerYear = regenerationWaterL == null ? null : regenerationsPerYear * regenerationWaterL;
  const annualSaltCost = saltPricePerKg == null ? null : saltKgPerYear * saltPricePerKg;
  const annualWaterCost = waterPricePerM3 == null || regenerationWaterLPerYear == null ? null : regenerationWaterLPerYear / 1000 * waterPricePerM3;
  return {
    serviceCapacityGrains,
    daysBetweenRegeneration,
    regenerationsPerMonth,
    regenerationsPerYear,
    saltKgPerMonth,
    saltKgPerYear,
    saltEfficiencyGrainsPerLb,
    regenerationWaterLPerYear,
    annualSaltCost,
    annualWaterCost
  };
}

export function computeRoRecovery({
  mode,
  feedLpm,
  permeateLpm = null,
  recoveryPercent = null,
  operatingHours = 24,
  operatingDays = 1
}) {
  if (!(feedLpm > 0)) throw new Error("Feed flow must be greater than zero.");
  if (!(operatingHours > 0 && operatingHours <= 24)) throw new Error("Operating hours must be greater than zero and no more than 24 per day.");
  if (!(operatingDays > 0 && operatingDays <= 366)) throw new Error("Operating days must be between 1 and 366.");
  let productLpm;
  let recovery;
  if (mode === "flow") {
    if (!(permeateLpm > 0) || permeateLpm >= feedLpm) throw new Error("Permeate flow must be greater than zero and lower than feed flow.");
    productLpm = permeateLpm;
    recovery = productLpm / feedLpm * 100;
  } else {
    if (!(recoveryPercent > 0 && recoveryPercent < 100)) throw new Error("Recovery must be greater than 0% and lower than 100%.");
    recovery = recoveryPercent;
    productLpm = feedLpm * recovery / 100;
  }
  const rejectLpm = feedLpm - productLpm;
  const dailyProductL = productLpm * 60 * operatingHours;
  const dailyRejectL = rejectLpm * 60 * operatingHours;
  return {
    feedLpm,
    productLpm,
    rejectLpm,
    recoveryPercent: recovery,
    dailyProductL,
    dailyRejectL,
    periodProductL: dailyProductL * operatingDays,
    periodRejectL: dailyRejectL * operatingDays
  };
}

export function computeRoProduction({
  ratedProductionL,
  ratingHours,
  actualOperatingHours,
  temperatureFactor,
  pressureFactor,
  otherFactor,
  dailyDemandL,
  peakDemandL,
  peakHours,
  usableStorageL,
  initialStoredL = null,
  reservePercent
}) {
  if (!(ratedProductionL > 0) || !(ratingHours > 0)) throw new Error("Rated production and its rating period must be greater than zero.");
  if (!(actualOperatingHours > 0 && actualOperatingHours <= 24)) throw new Error("Actual operating hours must be greater than zero and no more than 24.");
  for (const [factor, label] of [[temperatureFactor, "Temperature factor"], [pressureFactor, "Pressure factor"], [otherFactor, "Other derating factor"]]) {
    if (!(factor > 0 && factor <= 1.5)) throw new Error(`${label} must be greater than zero and no more than 1.5.`);
  }
  if (!(dailyDemandL > 0)) throw new Error("Daily demand must be greater than zero.");
  finiteNonnegative(peakDemandL, "Peak demand volume");
  if (!(peakHours >= 0 && peakHours <= 24)) throw new Error("Peak period must be between 0 and 24 hours.");
  finiteNonnegative(usableStorageL, "Usable storage");
  percent(reservePercent, "Reserve allowance", 100);
  const storedL = initialStoredL == null ? usableStorageL : initialStoredL;
  finiteNonnegative(storedL, "Initial stored volume");
  if (storedL > usableStorageL) throw new Error("Initial stored volume cannot exceed usable storage.");
  const adjustedDailyProductionL = ratedProductionL * temperatureFactor * pressureFactor * otherFactor * actualOperatingHours / ratingHours;
  const reserveAdjustedDemandL = dailyDemandL * (1 + reservePercent / 100);
  const dailyBalanceL = adjustedDailyProductionL - reserveAdjustedDemandL;
  const productionDuringPeakL = adjustedDailyProductionL * peakHours / 24;
  const peakStorageNeedL = Math.max(0, peakDemandL - productionDuringPeakL);
  const dailyDeficitBufferL = Math.max(0, -dailyBalanceL);
  const requiredStorageBufferL = Math.max(peakStorageNeedL, dailyDeficitBufferL);
  const storageMarginL = storedL - requiredStorageBufferL;
  const netRefillRateLph = (adjustedDailyProductionL - dailyDemandL) / 24;
  const refillHours = storageMarginL < 0 && netRefillRateLph > 0 ? -storageMarginL / netRefillRateLph : null;
  const status = dailyBalanceL < 0 ? "Daily deficit" : storageMarginL < 0 ? "Storage shortfall" : "Balanced";
  return {
    adjustedDailyProductionL,
    reserveAdjustedDemandL,
    dailyBalanceL,
    productionDuringPeakL,
    peakStorageNeedL,
    requiredStorageBufferL,
    storedL,
    storageMarginL,
    refillHours,
    status
  };
}

export function computeMediaFilter({
  shape,
  flowLpm,
  diameterM = null,
  areaM2 = null,
  vessels,
  bedDepthM = null,
  backwashFlowLpm = null,
  serviceLimitLpmM2 = null,
  backwashLimitLpmM2 = null
}) {
  if (!(flowLpm > 0)) throw new Error("Service flow must be greater than zero.");
  if (!Number.isInteger(vessels) || vessels < 1) throw new Error("Number of vessels must be a whole number greater than zero.");
  let areaPerVesselM2;
  if (shape === "circle") {
    if (!(diameterM > 0)) throw new Error("Vessel diameter must be greater than zero.");
    areaPerVesselM2 = Math.PI * diameterM ** 2 / 4;
  } else {
    if (!(areaM2 > 0)) throw new Error("Filter area must be greater than zero.");
    areaPerVesselM2 = areaM2;
  }
  for (const [amount, label] of [[backwashFlowLpm, "Backwash flow"], [serviceLimitLpmM2, "Service loading limit"], [backwashLimitLpmM2, "Backwash loading target"]]) {
    if (amount != null && !(amount > 0)) throw new Error(`${label} must be greater than zero when entered.`);
  }
  if (bedDepthM != null && !(bedDepthM > 0)) throw new Error("Media bed depth must be greater than zero when entered.");
  const totalAreaM2 = areaPerVesselM2 * vessels;
  const serviceLoadingLpmM2 = flowLpm / totalAreaM2;
  const backwashLoadingLpmM2 = backwashFlowLpm == null ? null : backwashFlowLpm / totalAreaM2;
  return {
    areaPerVesselM2,
    totalAreaM2,
    bedVolumeM3: bedDepthM == null ? null : totalAreaM2 * bedDepthM,
    flowPerVesselLpm: flowLpm / vessels,
    serviceLoadingLpmM2,
    backwashLoadingLpmM2,
    serviceMarginLpmM2: serviceLimitLpmM2 == null ? null : serviceLimitLpmM2 - serviceLoadingLpmM2,
    backwashMarginLpmM2: backwashLimitLpmM2 == null || backwashLoadingLpmM2 == null ? null : backwashLoadingLpmM2 - backwashLimitLpmM2
  };
}

export function computeChlorineDose({
  waterVolumeL,
  targetDoseMgL,
  existingMgL = 0,
  concentrationBasis,
  productConcentration,
  densityKgL = null
}) {
  if (!(waterVolumeL > 0)) throw new Error("Water volume must be greater than zero.");
  finiteNonnegative(targetDoseMgL, "Target dose");
  finiteNonnegative(existingMgL, "Existing concentration");
  if (!(productConcentration > 0)) throw new Error("Product active concentration must be greater than zero.");
  let activeMgPerL;
  if (concentrationBasis === "percent") {
    if (productConcentration > 100) throw new Error("Percent active concentration cannot exceed 100%.");
    if (!(densityKgL > 0)) throw new Error("Enter product solution density for percent-by-weight concentration.");
    activeMgPerL = productConcentration / 100 * densityKgL * 1e6;
  } else {
    activeMgPerL = productConcentration;
  }
  const netDoseMgL = Math.max(0, targetDoseMgL - existingMgL);
  const activeMassMg = netDoseMgL * waterVolumeL;
  const requiredSolutionL = activeMassMg / activeMgPerL;
  return {
    waterVolumeL,
    netDoseMgL,
    activeMassMg,
    activeMgPerL,
    requiredSolutionL,
    status: targetDoseMgL <= existingMgL ? "No positive addition calculated" : "Calculated from user-entered dose"
  };
}

export function computeContactTime({
  volumeL,
  flowLpm,
  residualMgL,
  bafflingFactor,
  targetCt = null
}) {
  if (!(volumeL > 0)) throw new Error("Contact volume must be greater than zero.");
  if (!(flowLpm > 0)) throw new Error("Flow must be greater than zero.");
  finiteNonnegative(residualMgL, "Measured disinfectant residual");
  if (!(bafflingFactor > 0 && bafflingFactor <= 1)) throw new Error("Baffling factor must be greater than 0 and no more than 1.");
  if (targetCt != null && !(targetCt > 0)) throw new Error("Entered CT target must be greater than zero.");
  const nominalMinutes = volumeL / flowLpm;
  const effectiveMinutes = nominalMinutes * bafflingFactor;
  const ctMgMinL = residualMgL * effectiveMinutes;
  const margin = targetCt == null ? null : ctMgMinL - targetCt;
  return { nominalMinutes, effectiveMinutes, ctMgMinL, targetCt, margin, status: targetCt == null ? "No target entered" : margin >= 0 ? "Meets entered target" : "Below entered target" };
}

export function selectTreatmentTrain(input) {
  const stages = [];
  const tests = [];
  const reasons = [];
  const cautions = [];
  const add = (stage, reason) => {
    if (!stages.includes(stage)) stages.push(stage);
    if (reason && !reasons.includes(reason)) reasons.push(reason);
  };
  if (input.lab !== "yes") tests.push("Obtain an accredited laboratory water test for the intended use before selecting health-protection treatment.");
  if (input.source === "rainwater") add("Source protection and first-flush review", "Rainwater quality varies with catchment, storage and local contamination.");
  if (input.source === "surface") add("Source protection and validated multi-barrier review", "Surface water can carry variable turbidity, microorganisms and chemicals.");
  if (input.sediment === "yes") add("Sediment prefiltration", "Visible or reported sediment should be controlled before fine treatment.");
  if (input.turbidity === "yes") add("Media filtration or verified turbidity reduction", "Turbidity can interfere with downstream treatment and disinfection.");
  if (input.iron === "yes" || input.manganese === "yes") {
    add("Oxidation review", "Iron or manganese treatment depends on oxidation state, pH and water chemistry.");
    add("Iron/manganese media filtration", "Use media and loading data matched to confirmed test results.");
  }
  if (input.chlorine === "yes" || input.tasteOdor === "yes" || input.organics === "yes") {
    add("Activated carbon review", "Carbon can address selected taste, odor, chlorine or organic compounds only when its certified claim matches the problem.");
  }
  if (input.hardness === "yes") add("Water softening review", "Hardness is principally calcium and magnesium; confirm usable capacity, salt setting and service flow.");
  if (input.tds === "yes") {
    add("Reverse osmosis or source-blending review", "High dissolved-solids concerns require contaminant-specific data and reject-water planning.");
    if (input.rejectLimit === "yes") cautions.push("RO may be impractical until reject-water disposal or recovery constraints are resolved.");
  }
  if (input.pH === "yes") add("pH, alkalinity and corrosion-control review", "pH alone does not define correction chemistry; alkalinity and materials matter.");
  if (input.microbiology === "positive") {
    tests.push("Use an alternate safe source as advised and contact the responsible health authority; confirm the result and corrective action.");
    add("Validated disinfection barrier", "A positive microbiological result requires urgent, source-specific public-health action.");
    cautions.push("Do not rely on an unvalidated household device or this selector to declare the water safe.");
  } else if (input.microbiology === "unknown" && input.intendedUse === "drinking") {
    tests.push("Include microbiological testing before drinking or cooking use.");
  }
  if (input.color === "yes" && input.iron !== "yes" && input.manganese !== "yes") tests.push("Identify the cause of color before choosing oxidation, carbon or filtration.");
  if (input.peakFlow === "high") cautions.push("Confirm pressure loss and certified service flow at peak demand; parallel vessels or storage may be needed.");
  if (input.flowKnown === "no") tests.push("Measure or define both service flow and peak flow before sizing treatment vessels, pressure loss or storage.");
  if (input.existingEquipment === "yes") cautions.push("Identify existing equipment, settings, bypasses, certified claims and current condition before adding or reordering stages.");
  if (input.existingEquipment === "unknown") tests.push("Inventory the existing treatment equipment and obtain its model, settings and maintenance history.");
  if (input.space === "limited") cautions.push("Limited equipment space can constrain safe access, vessel arrangement, chemical separation, drainage and maintenance.");
  if (input.drainage === "limited") cautions.push("Regeneration, backwash and RO reject streams require a permitted and practical drainage path.");
  if (!stages.length) add("No treatment stage selected from current evidence", "Testing and the intended use must define the objective before equipment selection.");
  add("Final monitoring and maintenance plan", "Verify performance with follow-up testing and the manufacturer’s maintenance schedule.");
  return {
    stages,
    tests,
    reasons,
    cautions,
    urgent: input.microbiology === "positive" || input.source === "surface" && input.intendedUse === "drinking",
    summary: tests.length ? "Testing or confirmation is required before a treatment train can be finalized." : "The listed stages are planning candidates, not a prescribed or approved design."
  };
}

function syncModeFields(form, type) {
  const toggle = (name, visible) => {
    const field = form.elements.namedItem(name);
    field?.closest(".field")?.toggleAttribute("hidden", !visible);
  };
  if (type === "treatment-ro-recovery") {
    const flow = form.elements.mode.value === "flow";
    toggle("permeate", flow);
    toggle("recovery", !flow);
  } else if (type === "treatment-media") {
    const circle = form.elements.shape.value === "circle";
    toggle("diameter", circle);
    toggle("filterArea", !circle);
  } else if (type === "treatment-chlorine") {
    const percentBasis = form.elements.concentrationBasis.value === "percent";
    const directVolume = form.elements.waterMode.value === "volume";
    toggle("density", percentBasis);
    toggle("waterVolume", directVolume);
    toggle("doseFlow", !directVolume);
    toggle("doseHours", !directVolume);
  } else if (type === "treatment-ct") {
    const direct = form.elements.volumeMode.value === "volume";
    toggle("volume", direct);
    for (const name of ["tankLength", "tankWidth", "waterDepth"]) toggle(name, !direct);
  }
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form]");
if (form) {
  const type = form.dataset.toolForm;
  if (form.elements.unitSystem) setupUnitSystem(form);
  for (const name of ["mode", "shape", "concentrationBasis", "volumeMode", "waterMode"]) {
    form.elements.namedItem(name)?.addEventListener("change", () => syncModeFields(form, type));
  }
  syncModeFields(form, type);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem?.value || "SI";
    if (type === "treatment-softener") {
      const result = computeSoftenerSizing({
        hardness: value(current, "hardness"),
        hardnessUnit: current.elements.hardnessUnit.value,
        dailyUseL: toSI(value(current, "dailyUse", { allowZero: false }), "volume", system),
        regenerationDays: value(current, "regenerationDays", { allowZero: false }),
        reservePercent: value(current, "reserve", { max: 100 }),
        ironMgL: optional(current, "iron") ?? 0,
        ironFactorGpgPerMgL: optional(current, "ironFactor", { allowZero: false }),
        peakFlowLpm: toSI(value(current, "peakFlow", { allowZero: false }), "flow", system)
      });
      report(current, "Reserve-adjusted working capacity", `${formatNumber(result.reserveAdjustedCapacityGrains, 0)}<span class="reading-unit"> grains</span>`, [
        `Adjusted hardness: ${formatNumber(result.adjustedHardnessGpg, 2)} grains/US gal (${formatNumber(result.adjustedHardnessGpg * MG_L_PER_GPG, 1)} mg/L as CaCO₃)`,
        `Daily hardness load: ${formatNumber(result.dailyGrainLoad, 0)} grains/day`,
        `Working capacity before reserve: ${formatNumber(result.workingCapacityGrains, 0)} grains`,
        `Peak service flow to verify: ${formatNumber(fromSI(result.peakFlowLpm, "flow", system), 2)} ${system === "US" ? "GPM" : "L/min"}`
      ], "Compare both capacity at the chosen salt setting and certified service-flow data; nominal grain labels can overstate usable capacity.");
    } else if (type === "treatment-salt") {
      const result = computeSaltRegeneration({
        dailyGrainLoad: value(current, "dailyLoad", { allowZero: false }),
        usableCapacityGrains: value(current, "usableCapacity", { allowZero: false }),
        saltDoseKg: toSI(value(current, "saltDose", { allowZero: false }), "mass", system),
        reservePercent: value(current, "reserve", { max: 90 }),
        regenerationWaterL: optional(current, "regenWater") == null ? null : toSI(value(current, "regenWater"), "volume", system),
        saltPricePerKg: optional(current, "saltPrice"),
        waterPricePerM3: optional(current, "waterPrice")
      });
      report(current, "Expected regeneration interval", `${formatNumber(result.daysBetweenRegeneration, 2)}<span class="reading-unit"> days</span>`, [
        `Regenerations per month: ${formatNumber(result.regenerationsPerMonth, 2)}`,
        `Salt per month: ${formatNumber(fromSI(result.saltKgPerMonth, "mass", system), 2)} ${system === "US" ? "lb" : "kg"}`,
        `Salt per year: ${formatNumber(fromSI(result.saltKgPerYear, "mass", system), 2)} ${system === "US" ? "lb" : "kg"}`,
        `Capacity efficiency: ${formatNumber(result.saltEfficiencyGrainsPerLb, 0)} grains/lb`,
        result.regenerationWaterLPerYear == null ? "Regeneration water not entered." : `Regeneration water per year: ${formatNumber(fromSI(result.regenerationWaterLPerYear, "volume", system), 0)} ${system === "US" ? "US gal" : "L"}`
      ], "Use actual manufacturer usable capacity at the entered salt setting; verify discharge restrictions and hardness breakthrough.");
    } else if (type === "treatment-ro-recovery") {
      const result = computeRoRecovery({
        mode: current.elements.mode.value,
        feedLpm: toSI(value(current, "feed", { allowZero: false }), "flow", system),
        permeateLpm: current.elements.mode.value === "flow" ? toSI(value(current, "permeate", { allowZero: false }), "flow", system) : null,
        recoveryPercent: current.elements.mode.value === "recovery" ? value(current, "recovery", { allowZero: false }) : null,
        operatingHours: value(current, "hours", { allowZero: false, max: 24 }),
        operatingDays: value(current, "days", { allowZero: false, max: 366 })
      });
      report(current, "RO recovery", `${formatNumber(result.recoveryPercent, 2)}<span class="reading-unit"> %</span>`, [
        `Permeate flow: ${formatNumber(fromSI(result.productLpm, "flow", system), 2)} ${system === "US" ? "GPM" : "L/min"}`,
        `Reject flow: ${formatNumber(fromSI(result.rejectLpm, "flow", system), 2)} ${system === "US" ? "GPM" : "L/min"}`,
        `Daily product: ${formatNumber(fromSI(result.dailyProductL, "volume", system), 0)} ${system === "US" ? "US gal" : "L"}`,
        `Daily reject: ${formatNumber(fromSI(result.dailyRejectL, "volume", system), 0)} ${system === "US" ? "US gal" : "L"}`,
        `Entered-period product/reject: ${formatNumber(fromSI(result.periodProductL, "volume", system), 0)} / ${formatNumber(fromSI(result.periodRejectL, "volume", system), 0)} ${system === "US" ? "US gal" : "L"}`
      ], "Recovery is a water balance, not membrane performance or product-water safety.", "Higher recovery can increase scaling and fouling risk; use current membrane design data and feed-water analysis.");
    } else if (type === "treatment-ro-production") {
      const result = computeRoProduction({
        ratedProductionL: toSI(value(current, "ratedProduction", { allowZero: false }), "volume", system),
        ratingHours: value(current, "ratingHours", { allowZero: false }),
        actualOperatingHours: value(current, "actualHours", { allowZero: false, max: 24 }),
        temperatureFactor: value(current, "temperatureFactor", { allowZero: false, max: 1.5 }),
        pressureFactor: value(current, "pressureFactor", { allowZero: false, max: 1.5 }),
        otherFactor: value(current, "otherFactor", { allowZero: false, max: 1.5 }),
        dailyDemandL: toSI(value(current, "dailyDemand", { allowZero: false }), "volume", system),
        peakDemandL: toSI(value(current, "peakDemand"), "volume", system),
        peakHours: value(current, "peakHours", { max: 24 }),
        usableStorageL: toSI(value(current, "usableStorage"), "volume", system),
        initialStoredL: optional(current, "initialStored") == null ? null : toSI(value(current, "initialStored"), "volume", system),
        reservePercent: value(current, "reserve", { max: 100 })
      });
      report(current, "Production versus demand", `${result.status}`, [
        `Adjusted daily production: ${formatNumber(fromSI(result.adjustedDailyProductionL, "volume", system), 0)} ${system === "US" ? "US gal" : "L"}`,
        `Reserve-adjusted demand: ${formatNumber(fromSI(result.reserveAdjustedDemandL, "volume", system), 0)} ${system === "US" ? "US gal" : "L"}`,
        `Daily balance: ${formatNumber(fromSI(result.dailyBalanceL, "volume", system), 0)} ${system === "US" ? "US gal" : "L"}`,
        `Required buffer: ${formatNumber(fromSI(result.requiredStorageBufferL, "volume", system), 0)} ${system === "US" ? "US gal" : "L"}`,
        `Storage margin: ${formatNumber(fromSI(result.storageMarginL, "volume", system), 0)} ${system === "US" ? "US gal" : "L"}`,
        result.refillHours == null ? "Refill time unavailable or no shortfall." : `Estimated net refill time: ${formatNumber(result.refillHours, 2)} h`
      ], "Correction factors must come from the exact membrane/system performance data; nominal tank size is not usable storage.");
    } else if (type === "treatment-media") {
      const result = computeMediaFilter({
        shape: current.elements.shape.value,
        flowLpm: toSI(value(current, "flow", { allowZero: false }), "flow", system),
        diameterM: current.elements.shape.value === "circle" ? toSI(value(current, "diameter", { allowZero: false }), "diameter", system) / 1000 : null,
        areaM2: current.elements.shape.value === "area" ? toSI(value(current, "filterArea", { allowZero: false }), "area", system) : null,
        vessels: value(current, "vessels", { allowZero: false, min: 1 }),
        bedDepthM: optional(current, "bedDepth") == null ? null : toSI(value(current, "bedDepth", { allowZero: false }), "length", system),
        backwashFlowLpm: optional(current, "backwashFlow") == null ? null : toSI(value(current, "backwashFlow", { allowZero: false }), "flow", system),
        serviceLimitLpmM2: optional(current, "serviceLimit", { allowZero: false }),
        backwashLimitLpmM2: optional(current, "backwashLimit", { allowZero: false })
      });
      report(current, "Service loading rate", `${formatNumber(result.serviceLoadingLpmM2, 2)}<span class="reading-unit"> L/min/m²</span>`, [
        `Total filter area: ${formatNumber(result.totalAreaM2, 3)} m²`,
        result.bedVolumeM3 == null ? "Media bed depth not entered." : `Geometric bed volume: ${formatNumber(result.bedVolumeM3, 3)} m³`,
        `Flow per vessel: ${formatNumber(fromSI(result.flowPerVesselLpm, "flow", system), 2)} ${system === "US" ? "GPM" : "L/min"}`,
        result.backwashLoadingLpmM2 == null ? "Backwash flow not entered." : `Backwash loading: ${formatNumber(result.backwashLoadingLpmM2, 2)} L/min/m²`,
        result.serviceMarginLpmM2 == null ? "No service limit entered." : `Margin to entered service limit: ${formatNumber(result.serviceMarginLpmM2, 2)} L/min/m²`
      ], "Compare against the exact media and vessel specification; media type, bed depth, temperature and water chemistry change valid rates.");
    } else if (type === "treatment-chlorine") {
      const waterVolumeL = current.elements.waterMode.value === "volume"
        ? toSI(value(current, "waterVolume", { allowZero: false }), "volume", system)
        : toSI(value(current, "doseFlow", { allowZero: false }), "flow", system) * 60 * value(current, "doseHours", { allowZero: false });
      const result = computeChlorineDose({
        waterVolumeL,
        targetDoseMgL: value(current, "targetDose"),
        existingMgL: optional(current, "existing") ?? 0,
        concentrationBasis: current.elements.concentrationBasis.value,
        productConcentration: value(current, "productConcentration", { allowZero: false }),
        densityKgL: optional(current, "density", { allowZero: false })
      });
      report(current, "Required solution volume", `${formatNumber(fromSI(result.requiredSolutionL, "volume", system), 4)}<span class="reading-unit"> ${system === "US" ? "US gal" : "L"}</span>`, [
        `Water treated: ${formatNumber(fromSI(result.waterVolumeL, "volume", system), 1)} ${system === "US" ? "US gal" : "L"}`,
        `Net user-entered dose: ${formatNumber(result.netDoseMgL, 3)} mg/L`,
        `Required active chlorine mass: ${formatNumber(result.activeMassMg / 1000, 3)} g`,
        `Active concentration used: ${formatNumber(result.activeMgPerL, 0)} mg/L solution`,
        result.status
      ], "This arithmetic uses the dose you entered; it does not recommend a dose or establish drinking-water safety.", "Never mix hypochlorite with acids, ammonia or other products. Follow the product label and SDS, use required PPE and ventilation, and obtain local-authority guidance.");
    } else if (type === "treatment-ct") {
      const volumeL = current.elements.volumeMode.value === "volume"
        ? toSI(value(current, "volume", { allowZero: false }), "volume", system)
        : toSI(value(current, "tankLength", { allowZero: false }), "length", system)
          * toSI(value(current, "tankWidth", { allowZero: false }), "length", system)
          * toSI(value(current, "waterDepth", { allowZero: false }), "length", system) * 1000;
      const result = computeContactTime({
        volumeL,
        flowLpm: toSI(value(current, "flow", { allowZero: false }), "flow", system),
        residualMgL: value(current, "residual"),
        bafflingFactor: value(current, "bafflingFactor", { allowZero: false, max: 1 }),
        targetCt: optional(current, "targetCt", { allowZero: false })
      });
      report(current, "Calculated CT", `${formatNumber(result.ctMgMinL, 2)}<span class="reading-unit"> mg·min/L</span>`, [
        `Nominal detention time: ${formatNumber(result.nominalMinutes, 2)} min`,
        `Effective contact time: ${formatNumber(result.effectiveMinutes, 2)} min`,
        `Measured residual: ${formatNumber(value(current, "residual"), 3)} mg/L`,
        result.targetCt == null ? "No CT target entered." : `Entered-target margin: ${formatNumber(result.margin, 2)} mg·min/L`,
        result.status
      ], "CT targets depend on disinfectant, organism, temperature, pH, residual location and jurisdiction. This is not a compliance determination.");
    } else if (type === "treatment-selector") {
      const keys = ["source", "intendedUse", "lab", "sediment", "turbidity", "hardness", "iron", "manganese", "chlorine", "tasteOdor", "tds", "pH", "microbiology", "color", "organics", "flowKnown", "peakFlow", "existingEquipment", "space", "drainage", "rejectLimit"];
      const result = selectTreatmentTrain(Object.fromEntries(keys.map((key) => [key, current.elements[key].value])));
      report(current, "Preliminary treatment path", `${result.stages[0]}<span class="reading-unit">${result.urgent ? " / urgent review" : ""}</span>`, [
        `Candidate sequence: ${result.stages.join(" → ")}`,
        result.tests.length ? `Testing/confirmation: ${result.tests.join(" ")}` : "No additional testing flag was generated from the entered answers.",
        `Reasons: ${result.reasons.join(" ")}`,
        result.cautions.length ? `Constraints: ${result.cautions.join(" ")}` : "No additional space, flow, drainage or reject constraint was entered."
      ], result.summary, "This selector does not diagnose contamination, certify potable water, prescribe a universal train or replace a laboratory, public authority, certified product listing or qualified design.");
    }
  }, { afterReset: (current) => syncModeFields(current, type) });
}
