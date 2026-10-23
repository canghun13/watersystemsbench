import { numberValue, renderResult, clearResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, toSI } from "../unit-conversions.js";

const ATM_KPA = 101.325;

export function computePressureTank({ pumpLpm, minimumRunMinutes, prechargeKPa, cutInKPa, cutOutKPa }) {
  if (!(prechargeKPa < cutInKPa && cutInKPa < cutOutKPa)) throw new Error("Use precharge < cut-in < cut-out.");
  const requiredDrawdownL = pumpLpm * minimumRunMinutes;
  const prechargeAbs = prechargeKPa + ATM_KPA;
  const cutInAbs = cutInKPa + ATM_KPA;
  const cutOutAbs = cutOutKPa + ATM_KPA;
  const drawdownFraction = prechargeAbs * (1 / cutInAbs - 1 / cutOutAbs);
  if (!(drawdownFraction > 0 && drawdownFraction < 1)) throw new Error("The pressure settings do not produce a valid drawdown fraction.");
  return { requiredDrawdownL, drawdownFraction, minimumTankVolumeL: requiredDrawdownL / drawdownFraction };
}

export function compareRatedDrawdown({ pumpLpm, minimumRunMinutes, ratedDrawdownL }) {
  for (const [label, value] of [["Pump flow", pumpLpm], ["Run time", minimumRunMinutes], ["Rated drawdown", ratedDrawdownL]]) {
    if (!Number.isFinite(value) || value < 1e-9 || value > 1e9) throw new Error(`${label} must be at least 1e-9 and no more than 1e9 in internal L/min, minutes or L units.`);
  }
  const requiredDrawdownL = pumpLpm * minimumRunMinutes;
  const marginL = ratedDrawdownL - requiredDrawdownL;
  return { requiredDrawdownL, marginL, coveragePercent: 100 * ratedDrawdownL / requiredDrawdownL, refillMinutes: ratedDrawdownL / pumpLpm, meetsTarget: marginL >= 0 };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='pressure-tank']");
if (form) {
  const syncComparison = () => {
    const active = form.elements.compareMode.value === "rated";
    const fields = form.querySelector("[data-rating-fields]");
    fields.hidden = !active;
    fields.disabled = !active;
  };
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const pumpLpm = toSI(numberValue(current, "pumpFlow", { allowZero: false, max: 100000 }), "flow", system);
    const minimumRunMinutes = numberValue(current, "runTime", { allowZero: false, max: 120 });
    const result = computePressureTank({
      pumpLpm,
      minimumRunMinutes,
      prechargeKPa: toSI(numberValue(current, "precharge", { max: 5000 }), "pressure", system),
      cutInKPa: toSI(numberValue(current, "cutIn", { allowZero: false, max: 5000 }), "pressure", system),
      cutOutKPa: toSI(numberValue(current, "cutOut", { allowZero: false, max: 5000 }), "pressure", system)
    });
    const vu = system === "US" ? "US gal" : "L";
    const pu = system === "US" ? "psi" : "kPa";
    const fu = system === "US" ? "GPM" : "L/min";
    const volume = value => `${formatNumber(fromSI(value, "volume", system), 3)} ${vu}`;
    let comparison = null;
    let ratedDrawdownL = null;
    if (current.elements.compareMode.value === "rated") {
      if (current.elements.ratingBasis.value !== "confirmed") throw new Error("Confirm that the manufacturer-rated drawdown applies to these cut-in, cut-out, precharge and tank configuration conditions. Do not use nominal tank capacity.");
      ratedDrawdownL = toSI(numberValue(current, "ratedDrawdown", { min: 1e-9, max: 1e9, allowZero: false }), "volume", system);
      comparison = compareRatedDrawdown({ pumpLpm, minimumRunMinutes, ratedDrawdownL });
    }
    const supporting = [
      `Required drawdown: ${volume(result.requiredDrawdownL)}`,
      `Calculated drawdown fraction: ${formatNumber(result.drawdownFraction * 100, 1)}% — ideal model, not a manufacturer rating.`,
      "Pressures are converted from gauge to absolute before applying the ideal-gas drawdown relationship."
    ];
    if (comparison) supporting.push(
      `<strong>Rated drawdown comparison: ${comparison.meetsTarget ? "Meets entered drawdown target" : "Below entered drawdown target"}.</strong> This is not equipment approval.`,
      `Entered manufacturer-rated drawdown: ${volume(ratedDrawdownL)}; coverage: ${formatNumber(comparison.coveragePercent, 2)}%.`,
      `${comparison.meetsTarget ? "Surplus" : "Shortfall"}: ${volume(Math.abs(comparison.marginL))}. Comparison uses unrounded inputs.`,
      `No-demand refill-time estimate: ${formatNumber(comparison.refillMinutes, 4)} minutes at the entered constant pump flow; target: ${formatNumber(minimumRunMinutes, 4)} minutes.`
    );
    else supporting.push("Manufacturer-rated drawdown comparison: not requested. Select by rated drawdown, not nominal capacity alone.");
    supporting.push(
      `<strong>Input record — ${system}:</strong> Pump flow ${formatNumber(Number(current.elements.pumpFlow.value), 6)} ${fu}; entered minimum run time ${formatNumber(minimumRunMinutes, 6)} minutes.`,
      `Gauge pressures: precharge ${formatNumber(Number(current.elements.precharge.value), 6)} ${pu}; cut-in ${formatNumber(Number(current.elements.cutIn.value), 6)} ${pu}; cut-out ${formatNumber(Number(current.elements.cutOut.value), 6)} ${pu}.`,
      `Mode: ${comparison ? "manufacturer-rated comparison; rating conditions confirmed by user" : "requirement only"}.`,
      '<span style="overflow-wrap:anywhere">URL: https://watersystemsbench.com/tools/pressure-tank-sizing-calculator/</span>'
    );
    renderResult(current, {
      label: "Minimum nominal tank volume",
      primary: `${formatNumber(fromSI(result.minimumTankVolumeL, "volume", system), 1)} <span class="reading-unit">${vu}</span>`,
      supporting,
      interpretation: comparison ? "The comparison checks only your entered drawdown requirement and matched rating. The refill estimate assumes constant pump inflow and no simultaneous outlet demand; it is not a guaranteed operating run time or a complete cycling analysis. Verify current manufacturer selection, pressure/temperature ratings, motor start limits and controls separately." : "Select a listed tank whose manufacturer-rated drawdown at the actual pressure settings meets or exceeds the required drawdown. The ideal nominal volume alone does not confirm a particular tank. Use the optional comparison after checking its rating conditions.",
      warning: "For conventional on/off systems only, not VFD/constant-pressure or thermal-expansion sizing. The run-time target is your input, not a universal recommendation. Isolate power and release water pressure before checking a tank. Follow the tank and pump instructions."
    });
  }, { afterReset: syncComparison });
  form.addEventListener("input", event => {
    if (["precharge", "cutIn", "cutOut", "ratedDrawdown"].includes(event.target.name)) form.elements.ratingBasis.value = "unverified";
    clearResult(form);
  });
  form.addEventListener("change", event => {
    if (event.target.name === "compareMode") {
      form.elements.ratingBasis.value = "unverified";
      syncComparison();
    }
    clearResult(form);
  });
  syncComparison();
}
