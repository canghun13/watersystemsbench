import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, toSI } from "../unit-conversions.js";

export function computeFirstFlush({ areaM2, mode, diversionDepthMm = 0, litresPerM2 = 0 }) {
  const volumeL = mode === "depth" ? areaM2 * diversionDepthMm : areaM2 * litresPerM2;
  return { volumeL, equivalentDepthMm: areaM2 > 0 ? volumeL / areaM2 : 0 };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='first-flush']");
if (form) {
  setupUnitSystem(form);
  const updateMode = () => {
    const depth = form.elements.mode.value === "depth";
    form.querySelector("[data-depth-field]").hidden = !depth;
    form.querySelector("[data-rate-field]").hidden = depth;
  };
  form.elements.mode.addEventListener("change", updateMode);
  updateMode();
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const areaM2 = toSI(numberValue(current, "area", { allowZero: false, max: 10000000 }), "area", system);
    const mode = current.elements.mode.value;
    const result = computeFirstFlush({
      areaM2,
      mode,
      diversionDepthMm: mode === "depth" ? toSI(numberValue(current, "depth", { allowZero: false, max: 1000 }), "rainfall", system) : 0,
      litresPerM2: mode === "rate" ? numberValue(current, "rate", { allowZero: false, max: 1000 }) : 0
    });
    const vu = system === "US" ? "US gal" : "L";
    renderResult(current, {
      label: "First-flush diversion volume",
      primary: `${formatNumber(fromSI(result.volumeL, "volume", system), 1)} <span class="reading-unit">${vu}</span>`,
      supporting: [`Equivalent diverted depth: ${formatNumber(fromSI(result.equivalentDepthMm, "rainfall", system), 3)} ${system === "US" ? "in" : "mm"}`, `Method: ${mode === "depth" ? "catchment area × diversion depth" : "catchment area × entered volume-per-area rule"}`],
      interpretation: "Choose a practical installed diverter at or above the entered project rule, then account for drainage and maintenance.",
      warning: "No universal first-flush volume applies. Use local guidance, roof conditions and intended water use; diversion reduces harvest and does not by itself make rainwater potable."
    });
  }, { afterReset: updateMode });
}
