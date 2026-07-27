import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { flowToM3s, toSI, waterProperties, formatNumber } from "../unit-conversions.js";

export function computePumpPower({ flowLpm, headM, pumpEfficiency, motorEfficiency, density = 998.2 }) {
  const hydraulicKW = density * 9.80665 * flowToM3s(flowLpm) * headM / 1000;
  const shaftKW = hydraulicKW / pumpEfficiency;
  const electricalKW = shaftKW / motorEfficiency;
  return { hydraulicKW, shaftKW, electricalKW, overallEfficiency: pumpEfficiency * motorEfficiency };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='power']");
if (form) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const temperature = numberValue(current, "temperature", { min: system === "US" ? 32 : 0, max: system === "US" ? 212 : 100 });
    const tempC = system === "US" ? (temperature - 32) * 5 / 9 : temperature;
    const input = {
      flowLpm: toSI(numberValue(current, "flow", { allowZero: false, max: 1000000 }), "flow", system),
      headM: toSI(numberValue(current, "head", { allowZero: false, max: 3000 }), "head", system),
      pumpEfficiency: numberValue(current, "pumpEfficiency", { allowZero: false, max: 99.9 }) / 100,
      motorEfficiency: numberValue(current, "motorEfficiency", { allowZero: false, max: 99.9 }) / 100,
      density: waterProperties(tempC).density
    };
    const result = computePumpPower(input);
    const unit = system === "US" ? "hp" : "kW";
    const factor = system === "US" ? 1 / 0.745699872 : 1;
    renderResult(current, {
      label: "Electrical input power",
      primary: `${formatNumber(result.electricalKW * factor, 3)} <span class="reading-unit">${unit}</span>`,
      supporting: [`Hydraulic power: ${formatNumber(result.hydraulicKW * factor, 3)} ${unit}`, `Pump shaft power: ${formatNumber(result.shaftKW * factor, 3)} ${unit}`, `Electrical input: ${formatNumber(result.electricalKW, 3)} kW / ${formatNumber(result.electricalKW / .745699872, 3)} hp`, `Overall pump × motor efficiency: ${formatNumber(result.overallEfficiency * 100, 1)}%`],
      interpretation: "Electrical input is the estimated steady operating demand at the entered duty point and efficiencies.",
      warning: "Allow separately for drive losses, motor service factor, part-load performance, starting conditions and the complete manufacturer curve."
    });
  });
}
