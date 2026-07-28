import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, toSI } from "../unit-conversions.js";

export function computeRainwaterYield({ areaM2, rainfallMm, runoffCoefficient, collectionEfficiency, fixedLossL = 0 }) {
  const grossL = areaM2 * rainfallMm;
  const afterRunoffL = grossL * runoffCoefficient;
  const harvestedL = Math.max(0, afterRunoffL * collectionEfficiency - fixedLossL);
  return { grossL, afterRunoffL, harvestedL, lostL: grossL - harvestedL };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='rain-yield']");
if (form) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const result = computeRainwaterYield({
      areaM2: toSI(numberValue(current, "area", { allowZero: false, max: 10000000 }), "area", system),
      rainfallMm: toSI(numberValue(current, "rainfall", { max: 100000 }), "rainfall", system),
      runoffCoefficient: numberValue(current, "runoff", { max: 100 }) / 100,
      collectionEfficiency: numberValue(current, "efficiency", { max: 100 }) / 100,
      fixedLossL: toSI(numberValue(current, "fixedLoss", { max: 100000000 }), "volume", system)
    });
    const vu = system === "US" ? "US gal" : "L";
    renderResult(current, {
      label: "Estimated harvested volume",
      primary: `${formatNumber(fromSI(result.harvestedL, "volume", system), 1)} <span class="reading-unit">${vu}</span>`,
      supporting: [`Gross roof rainfall: ${formatNumber(fromSI(result.grossL, "volume", system), 1)} ${vu}`, `After runoff coefficient: ${formatNumber(fromSI(result.afterRunoffL, "volume", system), 1)} ${vu}`, `Combined losses: ${formatNumber(fromSI(result.lostL, "volume", system), 1)} ${vu}`],
      interpretation: "This is a water-balance estimate for the entered rainfall period; it does not show whether storage is available when rain occurs.",
      warning: "Use local historical rainfall, measure horizontal catchment area, and verify roof materials, first flush, treatment and legal requirements for the intended end use."
    });
  });
}
