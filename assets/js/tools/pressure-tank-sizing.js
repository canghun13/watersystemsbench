import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
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

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='pressure-tank']");
if (form) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const result = computePressureTank({
      pumpLpm: toSI(numberValue(current, "pumpFlow", { allowZero: false, max: 100000 }), "flow", system),
      minimumRunMinutes: numberValue(current, "runTime", { allowZero: false, max: 120 }),
      prechargeKPa: toSI(numberValue(current, "precharge", { max: 5000 }), "pressure", system),
      cutInKPa: toSI(numberValue(current, "cutIn", { allowZero: false, max: 5000 }), "pressure", system),
      cutOutKPa: toSI(numberValue(current, "cutOut", { allowZero: false, max: 5000 }), "pressure", system)
    });
    const vu = system === "US" ? "US gal" : "L";
    renderResult(current, {
      label: "Minimum nominal tank volume",
      primary: `${formatNumber(fromSI(result.minimumTankVolumeL, "volume", system), 1)} <span class="reading-unit">${vu}</span>`,
      supporting: [`Required drawdown: ${formatNumber(fromSI(result.requiredDrawdownL, "volume", system), 1)} ${vu}`, `Calculated drawdown fraction: ${formatNumber(result.drawdownFraction * 100, 1)}%`, "Pressures are converted from gauge to absolute before applying the ideal-gas drawdown relationship."],
      interpretation: "Select a listed tank whose manufacturer-rated drawdown at the actual pressure settings meets or exceeds the required drawdown.",
      warning: "Isolate power and release water pressure before checking a tank. Set precharge only with the tank drained, following the tank and pump instructions."
    });
  });
}
