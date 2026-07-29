import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, toSI } from "../unit-conversions.js";

const gal = 3.785411784;
const value = (form, name, options = {}) => numberValue(form, name, options);
const optional = (form, name) => {
  const raw = form.elements.namedItem(name)?.value?.trim();
  return raw === "" || raw == null ? null : value(form, name);
};
const report = (form, label, primary, supporting, interpretation, warning = "") => renderResult(form, { label, primary, supporting, interpretation, warning });

export function computeFlowTest({ volumeL, seconds, trials = [] }) {
  if (!(volumeL > 0) || !(seconds > 0)) throw new Error("Volume and measurement time must be greater than zero.");
  const values = [seconds, ...trials.filter((trial) => trial != null)].map((time) => {
    if (!(time > 0)) throw new Error("Each repeat measurement time must be greater than zero.");
    return volumeL * 60 / time;
  });
  const averageLpm = values.reduce((sum, item) => sum + item, 0) / values.length;
  const spreadPercent = values.length > 1 ? (Math.max(...values) - Math.min(...values)) / averageLpm * 100 : 0;
  return { values, averageLpm, spreadPercent };
}

export function computeZoneCapacity({ availableLpm, reservePercent, perHeadLpm, proposedHeads = null, dynamicKPa = null, requiredKPa = null, lossKPa = null, riseM = 0 }) {
  if (reservePercent < 0 || reservePercent > 50) throw new Error("Flow reserve must be between 0% and 50%.");
  const usableLpm = availableLpm * (1 - reservePercent / 100);
  const maxHeads = Math.floor(usableLpm / perHeadLpm);
  const demandLpm = (proposedHeads ?? maxHeads) * perHeadLpm;
  const flowMarginLpm = usableLpm - demandLpm;
  const pressureAssessed = [dynamicKPa, requiredKPa, lossKPa].every(Number.isFinite);
  const pressureMarginKPa = pressureAssessed ? dynamicKPa - requiredKPa - lossKPa - riseM * 9.80665 : null;
  const status = flowMarginLpm < -1e-9 || (pressureAssessed && pressureMarginKPa < 0) ? "Insufficient" : pressureAssessed ? "Pass" : "Review";
  return { usableLpm, maxHeads, demandLpm, flowMarginLpm, pressureAssessed, pressureMarginKPa, status, feasibleHeads: status === "Insufficient" && pressureAssessed && pressureMarginKPa < 0 ? 0 : maxHeads };
}

export function computePrecipitation({ flowLpm, areaM2 = null, xM = null, yM = null, layout = "rect", runtimeMin = null }) {
  const effectiveArea = areaM2 ?? (xM * yM * (layout === "tri" ? 0.866025403784 : 1));
  if (!(flowLpm > 0) || !(effectiveArea > 0)) throw new Error("Flow and irrigated area or spacing must be greater than zero.");
  const mmh = flowLpm * 60 / effectiveArea;
  return { effectiveArea, mmh, inchh: mmh / 25.4, appliedMm: runtimeMin == null ? null : mmh * runtimeMin / 60 };
}

export function computeRuntime({ targetMm, rateMmh, efficiencyPercent, areaM2 = null, events = 1, cycles = 1, intakeMmh = null }) {
  if (targetMm < 0 || rateMmh < 0 || !(efficiencyPercent > 0 && efficiencyPercent <= 100) || !(events >= 1) || !(cycles >= 1)) throw new Error("Check target depth, rate, efficiency, events and cycles.");
  if (targetMm > 0 && rateMmh === 0) throw new Error("Precipitation rate must be greater than zero for a positive target depth.");
  const grossMm = targetMm / (efficiencyPercent / 100);
  const totalMinutes = rateMmh === 0 ? 0 : grossMm / rateMmh * 60;
  return { grossMm, totalMinutes, eventMinutes: totalMinutes / events, cycleMinutes: totalMinutes / events / cycles, grossVolumeL: areaM2 == null ? null : grossMm * areaM2, netVolumeL: areaM2 == null ? null : targetMm * areaM2, intakeWarning: intakeMmh != null && intakeMmh < rateMmh };
}

export function computeDrip({ mode, emitters, emitterLph, rowLengthM, spacingM, rows, availableLpm = null, reservePercent = 0, hours = 1 }) {
  if (!(emitterLph > 0) || !(hours >= 0) || reservePercent < 0 || reservePercent > 50) throw new Error("Check emitter flow, event duration and reserve.");
  let totalEmitters = emitters;
  let emittersPerRow = null;
  if (mode === "rows") {
    if (!(rowLengthM > 0) || !(spacingM > 0) || !Number.isInteger(rows) || rows < 1) throw new Error("Row length, spacing and whole row count are required for row geometry.");
    emittersPerRow = Math.floor(rowLengthM / spacingM) + 1;
    totalEmitters = emittersPerRow * rows;
  }
  if (!Number.isInteger(totalEmitters) || totalEmitters < 1) throw new Error("Emitter count must be a whole number greater than zero.");
  const totalLph = totalEmitters * emitterLph;
  const out = { totalEmitters, emittersPerRow, totalLph, flowLpm: totalLph / 60, eventL: totalLph * hours };
  if (availableLpm != null) {
    const usableLph = availableLpm * 60 * (1 - reservePercent / 100);
    out.usableLph = usableLph;
    out.maxEmitters = Math.floor(usableLph / emitterLph);
    if (mode === "rows") {
      out.rowsPerZone = Math.floor(out.maxEmitters / emittersPerRow);
      out.requiredZones = out.rowsPerZone > 0 ? Math.ceil(rows / out.rowsPerZone) : null;
    }
  }
  return out;
}

export function computePumpZone({ pumpFlowLpm, pumpHeadM, zoneFlowLpm, operatingKPa, riseM, lossM, reservePercent }) {
  if (reservePercent < 0 || reservePercent > 50) throw new Error("Safety margin must be between 0% and 50%.");
  const baseHeadM = operatingKPa / 9.80665 + riseM + lossM;
  const adjustedFlowLpm = zoneFlowLpm * (1 + reservePercent / 100);
  const adjustedHeadM = baseHeadM * (1 + reservePercent / 100);
  const flowMarginLpm = pumpFlowLpm - adjustedFlowLpm;
  const headMarginM = pumpHeadM - adjustedHeadM;
  const basePass = pumpFlowLpm >= zoneFlowLpm && pumpHeadM >= baseHeadM;
  return { baseHeadM, adjustedFlowLpm, adjustedHeadM, flowMarginLpm, headMarginM, status: !basePass ? "Insufficient" : flowMarginLpm >= 0 && headMarginM >= 0 ? "Match" : "Marginal" };
}

export function diagnoseIrrigation(input) {
  if (input.pump === "yes" && input.scope === "all") return { cause: "Pump/source behavior", level: "Urgent", next: "Prevent dry running and obtain qualified pump/electrical service." };
  if (input.leak === "yes") return { cause: "Active leak/lateral problem", level: "High", next: "Stop the zone if safe and locate/repair the leak before pressure changes." };
  if (input.scope === "one") return { cause: "Individual head/nozzle obstruction", level: "High", next: "Inspect the head, riser and nozzle safely; compare with adjacent heads." };
  if (input.nozzle === "yes") return { cause: "Excess zone demand", level: "High", next: "Total installed nozzle demand and compare with measured usable flow." };
  if (input.filter === "yes" && input.scope === "zone") return { cause: "Zone valve/filter restriction", level: "High", next: "Clean or verify the filter safely, confirm valve opening, then measure dynamic pressure." };
  if (input.scope === "all" && input.dynamic === "yes") return { cause: "Source-wide flow/pressure limitation", level: "High", next: "Repeat comparable dynamic pressure and flow tests before zone changes." };
  return { cause: "Mixed or incomplete evidence", level: "Review", next: "Measure flow and dynamic pressure, then compare near/far heads and installed nozzle demand." };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form]");
if (form) {
  const type = form.dataset.toolForm;
  if (form.elements.unitSystem) setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem?.value || "SI";
    if (type === "irrigation-flow") {
      const result = computeFlowTest({ volumeL: toSI(value(current, "volume", { allowZero: false }), "volume", system), seconds: value(current, "seconds", { allowZero: false }), trials: [optional(current, "trial2"), optional(current, "trial3")] });
      report(current, "Measured available flow", `${formatNumber(fromSI(result.averageLpm, "flow", system), 2)}<span class="reading-unit"> ${system === "US" ? "GPM" : "L/min"}</span>`, [`L/s: ${formatNumber(result.averageLpm / 60, 3)}`, `m³/h: ${formatNumber(result.averageLpm * .06, 3)}`, `Trials: ${result.values.map((v) => formatNumber(v, 2)).join(", ")} L/min`, `Repeat-test spread: ${formatNumber(result.spreadPercent, 2)}%`], result.spreadPercent > 15 ? "Trials vary materially; repeat under comparable conditions before using a design flow." : "Record dynamic pressure separately at the same flow condition.");
    } else if (type === "irrigation-zone") {
      const result = computeZoneCapacity({ availableLpm: toSI(value(current, "available", { allowZero: false }), "flow", system), reservePercent: value(current, "reserve", { max: 50 }), perHeadLpm: toSI(value(current, "perHead", { allowZero: false }), "flow", system), proposedHeads: optional(current, "heads"), dynamicKPa: toSI(value(current, "dynamic", { allowZero: false }), "pressure", system), requiredKPa: toSI(value(current, "required", { allowZero: false }), "pressure", system), lossKPa: toSI(value(current, "loss"), "pressure", system), riseM: toSI(value(current, "rise"), "head", system) });
      report(current, "Zone screen", `${result.status}<span class="reading-unit"> / ${result.feasibleHeads} feasible heads</span>`, [`Usable design flow: ${formatNumber(fromSI(result.usableLpm, "flow", system), 2)} ${system === "US" ? "GPM" : "L/min"}`, `Zone demand: ${formatNumber(fromSI(result.demandLpm, "flow", system), 2)} ${system === "US" ? "GPM" : "L/min"}`, `Flow margin: ${formatNumber(fromSI(result.flowMarginLpm, "flow", system), 2)} ${system === "US" ? "GPM" : "L/min"}`, `Pressure margin: ${formatNumber(fromSI(result.pressureMarginKPa, "pressure", system), 2)} ${system === "US" ? "psi" : "kPa"}`], result.status === "Pass" ? "Flow and entered pressure budget both pass this screen." : "Review measured dynamic pressure, product data and actual pipe losses before changing a zone.");
    } else if (type === "irrigation-precipitation") {
      const mode = current.elements.mode.value; const flow = toSI(value(current, "flow", { allowZero: false }), "flow", system); const runtime = optional(current, "runtime");
      const result = computePrecipitation({ flowLpm: flow, areaM2: mode === "total" ? toSI(value(current, "area", { allowZero: false }), "area", system) : null, xM: mode === "spacing" ? toSI(value(current, "x", { allowZero: false }), "length", system) : null, yM: mode === "spacing" ? toSI(value(current, "y", { allowZero: false }), "length", system) : null, layout: current.elements.layout.value, runtimeMin: runtime });
      report(current, "Theoretical precipitation rate", `${formatNumber(fromSI(result.mmh, "rainfall", system), 2)}<span class="reading-unit"> ${system === "US" ? "in/h" : "mm/h"}</span>`, [`Internal rate: ${formatNumber(result.mmh, 3)} mm/h`, `Effective area: ${formatNumber(fromSI(result.effectiveArea, "area", system), 2)} ${system === "US" ? "ft²" : "m²"}`, runtime == null ? "No runtime entered." : `Applied depth: ${formatNumber(fromSI(result.appliedMm, "rainfall", system), 2)} ${system === "US" ? "in" : "mm"}`], "Layout geometry estimates application depth; use actual product layout and audit coverage for distribution quality.");
    } else if (type === "irrigation-runtime") {
      const result = computeRuntime({ targetMm: toSI(value(current, "depth"), "rainfall", system), rateMmh: toSI(value(current, "rate"), "rainfall", system), efficiencyPercent: value(current, "efficiency", { allowZero: false, max: 100 }), areaM2: optional(current, "area") == null ? null : toSI(value(current, "area", { allowZero: false }), "area", system), events: value(current, "events", { allowZero: false, min: 1 }), cycles: value(current, "cycles", { allowZero: false, min: 1 }), intakeMmh: optional(current, "intake") == null ? null : toSI(value(current, "intake"), "rainfall", system) });
      report(current, "Total runtime", `${formatNumber(result.totalMinutes, 2)}<span class="reading-unit"> min</span>`, [`Gross depth: ${formatNumber(fromSI(result.grossMm, "rainfall", system), 2)} ${system === "US" ? "in" : "mm"}`, `Runtime per event: ${formatNumber(result.eventMinutes, 2)} min`, `Runtime per cycle: ${formatNumber(result.cycleMinutes, 2)} min`, result.grossVolumeL == null ? "Area not entered." : `Gross applied volume: ${formatNumber(fromSI(result.grossVolumeL, "volume", system), 1)} ${system === "US" ? "US gal" : "L"}`], result.intakeWarning ? "Application rate exceeds the entered soil intake rate; use shorter cycles and observe runoff." : result.totalMinutes === 0 ? "No irrigation is scheduled because target depth is zero." : "Observe runoff and adjust cycle-and-soak timing to actual soil intake.");
    } else if (type === "irrigation-drip") {
      const mode = current.elements.mode.value; const result = computeDrip({ mode, emitters: value(current, "emitters", { allowZero: false, min: 1 }), emitterLph: value(current, "emitter", { allowZero: false }), rowLengthM: toSI(value(current, "rowLength", { allowZero: false }), "length", system), spacingM: toSI(value(current, "spacing", { allowZero: false }), "length", system), rows: value(current, "rows", { allowZero: false, min: 1 }), availableLpm: optional(current, "available") == null ? null : toSI(value(current, "available", { allowZero: false }), "flow", system), reservePercent: value(current, "reserve", { max: 50 }), hours: value(current, "hours") });
      report(current, "Total drip flow", `${formatNumber(fromSI(result.flowLpm, "flow", system), 2)}<span class="reading-unit"> ${system === "US" ? "GPM" : "L/min"}</span>`, [`Emitters: ${formatNumber(result.totalEmitters, 0)}`, result.emittersPerRow == null ? "Direct-count mode." : `Emitters per row: ${result.emittersPerRow}`, `Event volume: ${formatNumber(fromSI(result.eventL, "volume", system), 2)} ${system === "US" ? "US gal" : "L"}`, result.maxEmitters == null ? "No source-flow limit entered." : `Maximum emitters per zone: ${result.maxEmitters}`, result.rowsPerZone == null ? "Rows-per-zone not applicable." : `Rows per zone: ${result.rowsPerZone}; minimum zones: ${result.requiredZones ?? "no whole row"}`], "Direct and geometry modes are deliberately separate to avoid double-counting emitters.");
    } else if (type === "irrigation-pump") {
      const result = computePumpZone({ pumpFlowLpm: toSI(value(current, "pumpFlow", { allowZero: false }), "flow", system), pumpHeadM: toSI(value(current, "pumpHead", { allowZero: false }), "head", system), zoneFlowLpm: toSI(value(current, "zoneFlow", { allowZero: false }), "flow", system), operatingKPa: toSI(value(current, "pressure", { allowZero: false }), "pressure", system), riseM: toSI(value(current, "rise"), "head", system), lossM: toSI(value(current, "loss"), "head", system), reservePercent: value(current, "reserve", { max: 50 }) });
      report(current, "Pump / zone screen", `${result.status}`, [`Required zone duty: ${formatNumber(fromSI(result.adjustedFlowLpm, "flow", system), 2)} ${system === "US" ? "GPM" : "L/min"} at ${formatNumber(fromSI(result.adjustedHeadM, "head", system), 2)} ${system === "US" ? "ft" : "m"}`, `Base required head: ${formatNumber(fromSI(result.baseHeadM, "head", system), 2)} ${system === "US" ? "ft" : "m"}`, `Flow margin: ${formatNumber(fromSI(result.flowMarginLpm, "flow", system), 2)} ${system === "US" ? "GPM" : "L/min"}`, `Head margin: ${formatNumber(fromSI(result.headMarginM, "head", system), 2)} ${system === "US" ? "ft" : "m"}`], "This compares one entered duty condition only. Use total dynamic head and the exact current pump curve before selecting or changing equipment.");
    } else if (type === "irrigation-troubleshoot") {
      const result = diagnoseIrrigation(Object.fromEntries(["scope", "filter", "leak", "nozzle", "pump", "dynamic"].map((key) => [key, current.elements[key].value])));
      report(current, "Priority cause group", `${result.cause}<span class="reading-unit"> / ${result.level}</span>`, [`Next measurement or action: ${result.next}`, "Rules are triage only; conflicting or missing evidence remains uncertain."], "Do not treat this result as a confirmed diagnosis.", "Stop for flooding, electrical hazards, damaged pressure equipment or dry-running signs; obtain qualified service where required.");
    }
  });
}
