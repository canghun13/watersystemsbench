import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, toSI } from "../unit-conversions.js";

const value = (form, name, options = {}) => numberValue(form, name, options);
const positive = (n, label) => { if (!Number.isFinite(n) || n <= 0) throw new Error(`${label} must be greater than zero.`); };
const nonnegative = (n, label) => { if (!Number.isFinite(n) || n < 0) throw new Error(`${label} must be zero or greater.`); };

export function computePurgeVolume({ internalDiameterMm, totalDepthM, depthToWaterM, purgeMultiplier, flowLpm, containerCapacityL }) {
  [internalDiameterMm, totalDepthM, purgeMultiplier, flowLpm, containerCapacityL].forEach((n, i) => positive(n, ["Well internal diameter", "Total well depth", "Purge multiplier", "Pumping rate", "Usable container capacity"][i]));
  nonnegative(depthToWaterM, "Depth to water");
  if (depthToWaterM >= totalDepthM) throw new Error("Depth to water must be less than total well depth.");
  const waterColumnM = totalDepthM - depthToWaterM;
  const wellVolumeL = Math.PI * Math.pow(internalDiameterMm / 2000, 2) * waterColumnM * 1000;
  const targetVolumeL = wellVolumeL * purgeMultiplier;
  return {
    waterColumnM,
    wellVolumeL,
    targetVolumeL,
    purgeTimeMinutes: targetVolumeL / flowLpm,
    containers: Math.ceil(targetVolumeL / containerCapacityL)
  };
}

export function checkLowFlowSetup({ screenTopM, screenBottomM, intakeDepthM, initialWaterDepthM, stabilizedWaterDepthM, flowLpm, maximumDrawdownM, maximumFlowLpm }) {
  [screenTopM, screenBottomM, intakeDepthM, initialWaterDepthM, stabilizedWaterDepthM, flowLpm, maximumDrawdownM, maximumFlowLpm].forEach((n, i) => nonnegative(n, ["Screen top", "Screen bottom", "Pump intake depth", "Initial water depth", "Stabilized water depth", "Measured flow", "Entered maximum drawdown", "Entered maximum flow"][i]));
  if (screenTopM >= screenBottomM) throw new Error("Screen bottom depth must be greater than screen top depth.");
  if (flowLpm === 0 || maximumDrawdownM === 0 || maximumFlowLpm === 0) throw new Error("Flow and entered maximum criteria must be greater than zero.");
  if (stabilizedWaterDepthM < initialWaterDepthM) throw new Error("Stabilized depth to water cannot be shallower than the initial depth in this pumping check.");
  const drawdownM = stabilizedWaterDepthM - initialWaterDepthM;
  const intakeInsideScreen = intakeDepthM >= screenTopM && intakeDepthM <= screenBottomM;
  const waterAboveScreenTop = stabilizedWaterDepthM < screenTopM;
  const intakeSubmerged = intakeDepthM > stabilizedWaterDepthM;
  const drawdownWithinEnteredLimit = drawdownM <= maximumDrawdownM;
  const flowWithinEnteredLimit = flowLpm <= maximumFlowLpm;
  return {
    drawdownM,
    submergedHeadM: intakeDepthM - stabilizedWaterDepthM,
    intakeInsideScreen,
    waterAboveScreenTop,
    intakeSubmerged,
    drawdownWithinEnteredLimit,
    flowWithinEnteredLimit,
    criteriaMet: intakeInsideScreen && waterAboveScreenTop && intakeSubmerged && drawdownWithinEnteredLimit && flowWithinEnteredLimit
  };
}

export function computeEquipmentInterval({ tubingInternalDiameterMm, tubingLengthM, pumpVolumeMl, flowCellVolumeMl, otherVolumeMl, exchanges, flowLpm, plannedIntervalMinutes }) {
  [tubingInternalDiameterMm, tubingLengthM, exchanges, flowLpm, plannedIntervalMinutes].forEach((n, i) => positive(n, ["Tubing internal diameter", "Tubing length", "Volume exchanges", "Flow rate", "Planned reading interval"][i]));
  [pumpVolumeMl, flowCellVolumeMl, otherVolumeMl].forEach((n, i) => nonnegative(n, ["Pump or chamber volume", "Flow-cell volume", "Other equipment volume"][i]));
  const tubingVolumeL = Math.PI * Math.pow(tubingInternalDiameterMm / 2000, 2) * tubingLengthM * 1000;
  const totalEquipmentVolumeL = tubingVolumeL + (pumpVolumeMl + flowCellVolumeMl + otherVolumeMl) / 1000;
  const displacementVolumeL = totalEquipmentVolumeL * exchanges;
  const minimumIntervalMinutes = displacementVolumeL / flowLpm;
  return {
    tubingVolumeL,
    totalEquipmentVolumeL,
    displacementVolumeL,
    minimumIntervalMinutes,
    intervalMarginMinutes: plannedIntervalMinutes - minimumIntervalMinutes,
    intervalMeetsEnteredExchange: plannedIntervalMinutes >= minimumIntervalMinutes
  };
}

const logColumns = ["minutes", "pH", "temperature", "conductivity", "do", "orp", "turbidity", "depthToWater", "flow"];

export function parseStabilizationLog(text) {
  if (typeof text !== "string" || !text.trim()) throw new Error("Paste log rows or choose a local CSV file.");
  const parsed = [];
  for (const [index, raw] of text.trim().split(/\r?\n/).entries()) {
    if (!raw.trim()) throw new Error(`Row ${index + 1} is blank; remove it or enter all nine values.`);
    const cells = raw.split(/[,\t]/).map((cell) => cell.trim());
    if (index === 0 && cells.some((cell) => /[a-z]/i.test(cell))) {
      if (cells.length !== logColumns.length || cells.some((cell, i) => cell.toLowerCase() !== logColumns[i].toLowerCase())) throw new Error(`Header must be ${logColumns.join(",")}.`);
      continue;
    }
    if (cells.length !== logColumns.length || cells.some((cell) => cell === "")) throw new Error(`Row ${index + 1} must contain all nine values.`);
    const numbers = cells.map(Number);
    if (!numbers.every(Number.isFinite)) throw new Error(`Row ${index + 1} contains a non-numeric value.`);
    const [minutes, pH, temperature, conductivity, dissolvedOxygen, orp, turbidity, depthToWater, flow] = numbers;
    if (minutes < 0 || pH < 0 || pH > 14 || conductivity < 0 || dissolvedOxygen < 0 || turbidity < 0 || depthToWater < 0 || flow < 0) throw new Error(`Row ${index + 1} contains a value outside the accepted input range.`);
    if (parsed.length && minutes <= parsed.at(-1).minutes) throw new Error(`Row ${index + 1} time must be greater than the preceding row time.`);
    parsed.push({ minutes, pH, temperature, conductivity, dissolvedOxygen, orp, turbidity, depthToWater, flow });
  }
  if (!parsed.length) throw new Error("No data rows were found.");
  return parsed;
}

const absoluteRange = (values) => Math.max(...values) - Math.min(...values);
const relativeRange = (values) => {
  const range = absoluteRange(values);
  const mean = values.reduce((sum, n) => sum + n, 0) / values.length;
  if (mean === 0) return range === 0 ? 0 : Number.POSITIVE_INFINITY;
  return range / Math.abs(mean) * 100;
};

export function analyzeStabilization({ rows, consecutiveReadings, criteria }) {
  if (!Array.isArray(rows) || !rows.length) throw new Error("At least one log row is required.");
  if (!Number.isInteger(consecutiveReadings) || consecutiveReadings < 3) throw new Error("Consecutive readings must be a whole number of at least 3.");
  if (rows.length < consecutiveReadings) throw new Error(`At least ${consecutiveReadings} data rows are required.`);
  const keys = ["pH", "temperature", "conductivity", "dissolvedOxygen", "orp", "turbidity", "depthToWater", "flow"];
  for (const key of keys) nonnegative(criteria[key], `${key} criterion`);
  const windowRows = rows.slice(-consecutiveReadings);
  const metrics = {
    pH: absoluteRange(windowRows.map((row) => row.pH)),
    temperature: relativeRange(windowRows.map((row) => row.temperature)),
    conductivity: relativeRange(windowRows.map((row) => row.conductivity)),
    dissolvedOxygen: relativeRange(windowRows.map((row) => row.dissolvedOxygen)),
    orp: absoluteRange(windowRows.map((row) => row.orp)),
    turbidity: relativeRange(windowRows.map((row) => row.turbidity)),
    depthToWater: absoluteRange(windowRows.map((row) => row.depthToWater)),
    flow: absoluteRange(windowRows.map((row) => row.flow))
  };
  const checks = Object.fromEntries(keys.map((key) => [key, metrics[key] <= criteria[key]]));
  let purgeVolumeL = 0;
  for (let i = 1; i < rows.length; i += 1) purgeVolumeL += (rows[i].minutes - rows[i - 1].minutes) * rows[i - 1].flow;
  return { windowStartMinute: windowRows[0].minutes, windowEndMinute: windowRows.at(-1).minutes, metrics, checks, criteriaMet: Object.values(checks).every(Boolean), purgeVolumeL };
}

if (typeof document !== "undefined") for (const form of document.querySelectorAll('[data-tool-form^="monitoring-well-"]')) {
  setupUnitSystem(form);
  const file = form.querySelector('[name="logFile"]');
  if (file) file.addEventListener("change", async () => { if (file.files?.[0]) form.elements.logText.value = await file.files[0].text(); });
  setupForm(form, (current) => {
    const system = current.elements.unitSystem?.value || "SI";
    const length = (name, options = {}) => toSI(value(current, name, options), "length", system);
    const diameter = (name, options = {}) => toSI(value(current, name, options), "diameter", system);
    const flow = (name, options = {}) => toSI(value(current, name, options), "flow", system);
    const volume = (name, options = {}) => toSI(value(current, name, options), "volume", system);
    const showLength = (n, digits = 2) => `${formatNumber(fromSI(n, "length", system), digits)} ${system === "US" ? "ft" : "m"}`;
    const showVolume = (n, digits = 2) => `${formatNumber(fromSI(n, "volume", system), digits)} ${system === "US" ? "US gal" : "L"}`;
    const showFlow = (n, digits = 2) => `${formatNumber(fromSI(n, "flow", system), digits)} ${system === "US" ? "GPM" : "L/min"}`;
    const report = (label, primary, supporting, interpretation, warning) => renderResult(current, { label, primary, supporting, interpretation, warning });
    const type = current.dataset.toolForm;
    if (type === "monitoring-well-purge") {
      const r = computePurgeVolume({ internalDiameterMm: diameter("internalDiameter", { allowZero: false }), totalDepthM: length("totalDepth", { allowZero: false }), depthToWaterM: length("depthToWater"), purgeMultiplier: value(current, "multiplier", { allowZero: false }), flowLpm: flow("flow", { allowZero: false }), containerCapacityL: volume("container", { allowZero: false }) });
      report("Entered purge target", showVolume(r.targetVolumeL), [`Water column: ${showLength(r.waterColumnM)}`, `One well volume: ${showVolume(r.wellVolumeL)}`, `Time at entered rate: ${formatNumber(r.purgeTimeMinutes, 1)} minutes`, `Whole usable containers: ${r.containers}`], "Use the target only when the governing field plan calls for the entered well-volume multiplier.", "This volume calculation does not select a purging method, establish stabilization or authorize wastewater disposal.");
    } else if (type === "monitoring-well-setup") {
      const r = checkLowFlowSetup({ screenTopM: length("screenTop"), screenBottomM: length("screenBottom", { allowZero: false }), intakeDepthM: length("intakeDepth", { allowZero: false }), initialWaterDepthM: length("initialWater"), stabilizedWaterDepthM: length("stabilizedWater"), flowLpm: flow("flow", { allowZero: false }), maximumDrawdownM: length("maxDrawdown", { allowZero: false }), maximumFlowLpm: flow("maxFlow", { allowZero: false }) });
      const status = (pass) => pass ? "PASS" : "CHECK";
      report("Entered setup criteria", r.criteriaMet ? "MET" : "NOT YET MET", [`Drawdown: ${showLength(r.drawdownM)} — ${status(r.drawdownWithinEnteredLimit)}`, `Pump intake inside screen: ${status(r.intakeInsideScreen)}`, `Stabilized water above screen top: ${status(r.waterAboveScreenTop)}`, `Submerged head over intake: ${showLength(r.submergedHeadM)} — ${status(r.intakeSubmerged)}`, `Measured flow ${showFlow(flow("flow"))} — ${status(r.flowWithinEnteredLimit)}`], "Resolve each CHECK against the approved site plan before sampling.", "Passing user-entered limits does not prove representative sampling or authorize collection.");
    } else if (type === "monitoring-well-equipment") {
      const r = computeEquipmentInterval({ tubingInternalDiameterMm: diameter("tubingDiameter", { allowZero: false }), tubingLengthM: length("tubingLength", { allowZero: false }), pumpVolumeMl: value(current, "pumpVolume"), flowCellVolumeMl: value(current, "flowCellVolume"), otherVolumeMl: value(current, "otherVolume"), exchanges: value(current, "exchanges", { allowZero: false }), flowLpm: flow("flow", { allowZero: false }), plannedIntervalMinutes: value(current, "plannedInterval", { allowZero: false }) });
      report("Minimum entered exchange interval", `${formatNumber(r.minimumIntervalMinutes, 2)}<span class="reading-unit"> minutes</span>`, [`Tubing volume: ${showVolume(r.tubingVolumeL)}`, `Total equipment volume: ${showVolume(r.totalEquipmentVolumeL)}`, `Displacement for entered exchanges: ${showVolume(r.displacementVolumeL)}`, `Planned interval margin: ${formatNumber(r.intervalMarginMinutes, 2)} minutes`], r.intervalMeetsEnteredExchange ? "The planned interval covers the entered number of equipment-volume exchanges." : "Increase the interval, increase verified flow within the field plan, or revise the entered equipment volume.", "The exchange count is user-entered; this planner does not prescribe a universal reading interval.");
    } else if (type === "monitoring-well-stabilization") {
      const rows = parseStabilizationLog(current.elements.logText.value);
      if (system === "US") rows.forEach((row) => { row.depthToWater = toSI(row.depthToWater, "length", "US"); row.flow = toSI(row.flow, "flow", "US"); row.temperature = toSI(row.temperature, "temperature", "US"); });
      const result = analyzeStabilization({ rows, consecutiveReadings: value(current, "readings", { allowZero: false }), criteria: { pH: value(current, "phCriterion"), temperature: value(current, "temperatureCriterion"), conductivity: value(current, "conductivityCriterion"), dissolvedOxygen: value(current, "doCriterion"), orp: value(current, "orpCriterion"), turbidity: value(current, "turbidityCriterion"), depthToWater: length("drawdownCriterion"), flow: flow("flowCriterion") } });
      const metric = (name, unit, key, digits = 2) => `${name}: ${formatNumber(result.metrics[key], digits)}${unit} — ${result.checks[key] ? "PASS" : "CHECK"}`;
      report("Entered stabilization criteria", result.criteriaMet ? "MET" : "NOT YET MET", [metric("pH range", "", "pH"), metric("Temperature range", "%", "temperature"), metric("Conductivity range", "%", "conductivity"), metric("DO range", "%", "dissolvedOxygen"), metric("ORP range", " mV", "orp"), metric("Turbidity range", "%", "turbidity"), `Depth-to-water range: ${showLength(result.metrics.depthToWater)} — ${result.checks.depthToWater ? "PASS" : "CHECK"}`, `Flow range: ${showFlow(result.metrics.flow)} — ${result.checks.flow ? "PASS" : "CHECK"}`, `Integrated purge volume: ${showVolume(result.purgeVolumeL)}`], `Compared the last ${value(current, "readings")} readings from minute ${formatNumber(result.windowStartMinute, 1)} through ${formatNumber(result.windowEndMinute, 1)}.`, "This result says only whether all entered numeric criteria were met; it does not authorize sampling or establish representativeness.");
    }
  });
}
