import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, toSI } from "../unit-conversions.js";

const value = (form, name, options = {}) => numberValue(form, name, options);
const positive = (n, label) => { if (!Number.isFinite(n) || n <= 0) throw new Error(`${label} must be greater than zero.`); };
const nonnegative = (n, label) => { if (!Number.isFinite(n) || n < 0) throw new Error(`${label} must be zero or greater.`); };

export function computeRinseAudit({ startMeterL, endMeterL, intervalHours, loads, hoursPerDay, daysPerYear, combinedTariff }) {
  nonnegative(startMeterL, "Starting meter reading"); positive(endMeterL, "Ending meter reading");
  if (endMeterL <= startMeterL) throw new Error("Ending meter reading must be greater than starting meter reading.");
  [intervalHours, loads, hoursPerDay].forEach((n, i) => positive(n, ["Interval hours", "Loads", "Operating hours per day"][i]));
  if (hoursPerDay > 24) throw new Error("Operating hours per day cannot exceed 24.");
  if (!Number.isInteger(daysPerYear) || daysPerYear < 1 || daysPerYear > 366) throw new Error("Operating days must be a whole number from 1 to 366.");
  nonnegative(combinedTariff, "Combined tariff");
  const intervalL = endMeterL - startMeterL;
  const litresPerLoad = intervalL / loads;
  const litresPerHour = intervalL / intervalHours;
  const annualM3 = litresPerHour * hoursPerDay * daysPerYear / 1000;
  return { intervalL, litresPerLoad, litresPerHour, annualM3, annualUtilityCost: annualM3 * combinedTariff };
}

export function computeDragOut({ retainedMlPerLoad, loadsPerHour, concentrationGPerL, valuePerKg, shiftHours }) {
  positive(retainedMlPerLoad, "Retained solution per load"); positive(loadsPerHour, "Loads per hour");
  nonnegative(concentrationGPerL, "Bath concentration"); nonnegative(valuePerKg, "Material value"); positive(shiftHours, "Shift hours");
  if (shiftHours > 24) throw new Error("Shift hours cannot exceed 24.");
  const dragOutLh = retainedMlPerLoad / 1000 * loadsPerHour;
  const massKgH = dragOutLh * concentrationGPerL / 1000;
  return { dragOutLh, solutionPerShiftL: dragOutLh * shiftHours, massKgH, massPerShiftKg: massKgH * shiftHours, valuePerShift: massKgH * shiftHours * valuePerKg };
}

export function computeCountercurrentRinse({ dragOutLh, dilutionRatio, stages }) {
  positive(dragOutLh, "Drag-out rate"); positive(dilutionRatio, "Required dilution ratio");
  if (dilutionRatio <= 1) throw new Error("Required dilution ratio must be greater than 1.");
  if (!Number.isInteger(stages) || stages < 1 || stages > 4) throw new Error("Stages must be a whole number from 1 to 4.");
  const requiredFlowLh = stages * dragOutLh * Math.pow(dilutionRatio, 1 / stages);
  const oneStageFlowLh = dragOutLh * dilutionRatio;
  const reductionPercent = (1 - requiredFlowLh / oneStageFlowLh) * 100;
  return { requiredFlowLh, oneStageFlowLh, reductionLh: oneStageFlowLh - requiredFlowLh, reductionPercent };
}

export function parseRinseLog(text) {
  if (typeof text !== "string" || !text.trim()) throw new Error("Paste log rows or choose a local CSV file.");
  const rows = [];
  for (const [index, raw] of text.trim().split(/\r?\n/).entries()) {
    const cells = raw.split(/[,\t]/).map((cell) => cell.trim());
    if (index === 0 && cells.some((cell) => /[a-z]/i.test(cell))) continue;
    if (cells.length !== 4) throw new Error(`Row ${index + 1} must contain minutes, flow, conductivity and loads.`);
    const [minutes, flowLpm, conductivity, loads] = cells.map(Number);
    if (![minutes, flowLpm, conductivity, loads].every(Number.isFinite) || minutes <= 0 || flowLpm < 0 || conductivity < 0 || loads < 0) throw new Error(`Row ${index + 1} contains an invalid value.`);
    rows.push({ minutes, flowLpm, conductivity, loads });
  }
  if (!rows.length) throw new Error("No valid data rows were found.");
  return rows;
}

export function computeRinseLog({ rows, alertConductivity }) {
  positive(alertConductivity, "Conductivity alert value");
  if (!Array.isArray(rows) || !rows.length) throw new Error("At least one log row is required.");
  const totalWaterL = rows.reduce((sum, row) => sum + row.minutes * row.flowLpm, 0);
  const totalLoads = rows.reduce((sum, row) => sum + row.loads, 0);
  if (totalLoads <= 0) throw new Error("The log must contain at least one processed load.");
  const idleWaterL = rows.filter((row) => row.loads === 0).reduce((sum, row) => sum + row.minutes * row.flowLpm, 0);
  const excursions = rows.filter((row) => row.conductivity > alertConductivity).length;
  return { rows: rows.length, totalWaterL, totalLoads, litresPerLoad: totalWaterL / totalLoads, idleWaterL, excursions, peakConductivity: Math.max(...rows.map((row) => row.conductivity)) };
}

export function computeRinseSavings({ baselineLh, proposedLh, hoursPerDay, daysPerYear, waterTariff, sewerTariff, treatmentCost, annualOperatingCost, installedCost }) {
  [baselineLh, hoursPerDay].forEach((n, i) => positive(n, ["Baseline flow", "Operating hours per day"][i]));
  nonnegative(proposedLh, "Proposed flow");
  if (proposedLh > baselineLh) throw new Error("Proposed flow cannot exceed baseline flow in a savings comparison.");
  if (hoursPerDay > 24) throw new Error("Operating hours per day cannot exceed 24.");
  if (!Number.isInteger(daysPerYear) || daysPerYear < 1 || daysPerYear > 366) throw new Error("Operating days must be a whole number from 1 to 366.");
  [waterTariff, sewerTariff, treatmentCost, annualOperatingCost, installedCost].forEach((n, i) => nonnegative(n, ["Water tariff", "Sewer tariff", "Treatment cost", "Annual operating cost", "Installed cost"][i]));
  const annualSavedM3 = (baselineLh - proposedLh) * hoursPerDay * daysPerYear / 1000;
  const grossAnnualSavings = annualSavedM3 * (waterTariff + sewerTariff + treatmentCost);
  const netAnnualSavings = grossAnnualSavings - annualOperatingCost;
  return { annualSavedM3, grossAnnualSavings, netAnnualSavings, paybackYears: installedCost > 0 && netAnnualSavings > 0 ? installedCost / netAnnualSavings : null };
}

if (typeof document !== "undefined") for (const form of document.querySelectorAll('[data-tool-form^="metal-finishing-"]')) {
  setupUnitSystem(form);
  const file = form.querySelector('[name="logFile"]');
  if (file) file.addEventListener("change", async () => { if (file.files?.[0]) form.elements.logText.value = await file.files[0].text(); });
  setupForm(form, (current) => {
    const system = current.elements.unitSystem?.value || "SI";
    const volume = (name, options = {}) => toSI(value(current, name, options), "volume", system);
    const showVolume = (n, digits = 1) => `${formatNumber(fromSI(n, "volume", system), digits)} ${system === "US" ? "US gal" : "L"}`;
    const report = (label, primary, supporting, interpretation, warning) => renderResult(current, { label, primary, supporting, interpretation, warning });
    const type = current.dataset.toolForm;
    if (type === "metal-finishing-audit") {
      const r = computeRinseAudit({ startMeterL: volume("startMeter"), endMeterL: volume("endMeter"), intervalHours: value(current, "intervalHours", { allowZero: false }), loads: value(current, "loads", { allowZero: false }), hoursPerDay: value(current, "hoursPerDay", { allowZero: false }), daysPerYear: value(current, "days", { allowZero: false }), combinedTariff: value(current, "tariff") });
      report("Rinse water per load", `${showVolume(r.litresPerLoad)}<span class="reading-unit"> /load</span>`, [`Interval water: ${showVolume(r.intervalL, 0)}`, `Average flow: ${showVolume(r.litresPerHour, 0)}/h`, `Projected annual water: ${formatNumber(r.annualM3, 1)} m³`, `Projected utility cost: ${formatNumber(r.annualUtilityCost, 2)} currency/year`], "Repeat comparable intervals before and after changes.", "A shared meter, leak or unmatched production count invalidates the result.");
    } else if (type === "metal-finishing-dragout") {
      const r = computeDragOut({ retainedMlPerLoad: value(current, "retained", { allowZero: false }), loadsPerHour: value(current, "loadsPerHour", { allowZero: false }), concentrationGPerL: value(current, "concentration"), valuePerKg: value(current, "valuePerKg"), shiftHours: value(current, "shiftHours", { allowZero: false }) });
      report("Measured drag-out rate", `${showVolume(r.dragOutLh)}<span class="reading-unit"> /h</span>`, [`Solution per shift: ${showVolume(r.solutionPerShiftL)}`, `Active mass per shift: ${formatNumber(r.massPerShiftKg, 3)} kg`, `Entered material value per shift: ${formatNumber(r.valuePerShift, 2)} currency`], "Use repeated drain-time measurements for each rack or barrel family.", "Do not use this quantity estimate to select chemistry or handling controls.");
    } else if (type === "metal-finishing-countercurrent") {
      const r = computeCountercurrentRinse({ dragOutLh: volume("dragOut", { allowZero: false }), dilutionRatio: value(current, "dilution", { allowZero: false }), stages: value(current, "stages", { allowZero: false }) });
      report("Ideal countercurrent flow", `${showVolume(r.requiredFlowLh)}<span class="reading-unit"> /h</span>`, [`One-stage screen: ${showVolume(r.oneStageFlowLh)}/h`, `Modeled reduction: ${showVolume(r.reductionLh)}/h (${formatNumber(r.reductionPercent, 1)}%)`], "Use this as a stage-comparison screen and verify with operating conductivity or chemistry data.", "Ideal mixing and equal drag-out are assumptions; the result never certifies rinse quality.");
    } else if (type === "metal-finishing-log") {
      const rows = parseRinseLog(current.elements.logText.value);
      if (system === "US") rows.forEach((row) => { row.flowLpm = toSI(row.flowLpm, "volume", "US"); });
      const r = computeRinseLog({ rows, alertConductivity: value(current, "alert", { allowZero: false }) });
      report("Logged water per load", `${showVolume(r.litresPerLoad)}<span class="reading-unit"> /load</span>`, [`Rows analyzed: ${r.rows}`, `Total water: ${showVolume(r.totalWaterL, 0)}`, `Idle-flow water: ${showVolume(r.idleWaterL, 0)}`, `Alert excursions: ${r.excursions}; peak: ${formatNumber(r.peakConductivity, 0)} µS/cm`], "Compare similar products, bath conditions and production states.", "Conductivity is a user-defined control signal, not a universal discharge or product-quality limit.");
    } else if (type === "metal-finishing-savings") {
      const r = computeRinseSavings({ baselineLh: volume("baseline", { allowZero: false }), proposedLh: volume("proposed"), hoursPerDay: value(current, "hoursPerDay", { allowZero: false }), daysPerYear: value(current, "days", { allowZero: false }), waterTariff: value(current, "waterTariff"), sewerTariff: value(current, "sewerTariff"), treatmentCost: value(current, "treatmentCost"), annualOperatingCost: value(current, "operatingCost"), installedCost: value(current, "installedCost") });
      report("Net annual savings", `${formatNumber(r.netAnnualSavings, 2)}<span class="reading-unit"> currency/year</span>`, [`Water saved: ${formatNumber(r.annualSavedM3, 1)} m³/year`, `Gross savings: ${formatNumber(r.grossAnnualSavings, 2)} currency/year`, r.paybackYears == null ? "Simple payback unavailable." : `Simple payback: ${formatNumber(r.paybackYears, 1)} years`], "Test lower production and higher maintenance cases.", "Simple payback excludes financing, tax, downtime and compliance value.");
    }
  });
}
