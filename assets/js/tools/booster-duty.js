import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { fromSI, headToPressure, pressureToHead, toSI, formatNumber } from "../unit-conversions.js";

export function computeBooster({ inletKPa, outletKPa, elevationM, pipeLossM, equipmentLossM, safetyPercent = 0, density = 998.2 }) {
  const baseKPa = outletKPa + headToPressure(elevationM + pipeLossM + equipmentLossM, density) - inletKPa;
  const requiredKPa = Math.max(0, baseKPa) * (1 + safetyPercent / 100);
  return { baseKPa, requiredKPa, requiredHeadM: pressureToHead(requiredKPa, density) };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='booster']");
if (form) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const input = {
      inletKPa: toSI(numberValue(current, "inletPressure", { max: 5000 }), "pressure", system),
      outletKPa: toSI(numberValue(current, "outletPressure", { max: 5000 }), "pressure", system),
      elevationM: toSI(numberValue(current, "elevation", { min: -500, max: 3000 }), "head", system),
      pipeLossM: toSI(numberValue(current, "pipeLoss", { max: 2000 }), "head", system),
      equipmentLossM: toSI(numberValue(current, "equipmentLoss", { max: 1000 }), "head", system),
      safetyPercent: numberValue(current, "safety", { min: 0, max: 50 })
    };
    const flow = numberValue(current, "flow", { allowZero: false, max: 1000000 });
    const result = computeBooster(input);
    renderResult(current, {
      label: "Required boost pressure",
      primary: `${formatNumber(fromSI(result.requiredKPa, "pressure", system), 2)} <span class="reading-unit">${system === "US" ? "psi" : "kPa"}</span>`,
      supporting: [`Required head: ${formatNumber(fromSI(result.requiredHeadM, "head", system), 2)} ${system === "US" ? "ft" : "m"}`, `Duty flow: ${formatNumber(flow, 2)} ${system === "US" ? "GPM" : "L/min"}`, `Safety allowance: ${formatNumber(input.safetyPercent, 1)}%`, `Minimum duty point: ${formatNumber(flow, 2)} ${system === "US" ? "GPM" : "L/min"} at ${formatNumber(fromSI(result.requiredHeadM, "head", system), 2)} ${system === "US" ? "ft" : "m"}`],
      interpretation: result.baseKPa <= 0 ? "The stated inlet pressure is already sufficient for the target after the listed losses; a booster may not be required." : "Use the stated flow and boost head as a preliminary duty point for manufacturer curve review.",
      warning: input.safetyPercent > 25 ? "A safety allowance above 25% can promote oversizing. Justify it from measured uncertainty and control requirements." : "Check minimum and maximum inlet pressure, controls, transients and the full operating range before selection."
    });
  });
}
