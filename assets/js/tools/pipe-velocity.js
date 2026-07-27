import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { flowToM3s, fromSI, toSI, formatNumber } from "../unit-conversions.js";
import { computePipeFriction } from "./pipe-friction-loss.js";

export function computeVelocity({ flowLpm, diameterMm }) {
  const q = flowToM3s(flowLpm);
  const d = diameterMm / 1000;
  return q / (Math.PI * d * d / 4);
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='velocity']");
if (form) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const flowLpm = toSI(numberValue(current, "flow", { allowZero: false, max: 1000000 }), "flow", system);
    const diameterMm = toSI(numberValue(current, "diameter", { allowZero: false, max: 5000 }), "diameter", system);
    const velocity = computeVelocity({ flowLpm, diameterMm });
    const lengthRaw = current.elements.namedItem("length").value.trim();
    let friction = null;
    if (lengthRaw !== "") {
      friction = computePipeFriction({ method: "hazen", flowLpm, diameterMm, lengthM: toSI(numberValue(current, "length", { allowZero: false, max: 100000 }), "length", system), c: numberValue(current, "cValue", { min: 50, max: 160 }) });
    }
    const status = velocity < 0.3 ? "Low velocity—check whether sediment or long residence time matters." : velocity > 3 ? "High velocity—review noise, surge, erosion and project criteria." : "Moderate velocity for preliminary review; confirm the project-specific criterion.";
    renderResult(current, {
      label: "Water velocity",
      primary: `${formatNumber(system === "US" ? velocity * 3.28084 : velocity, 3)} <span class="reading-unit">${system === "US" ? "ft/s" : "m/s"}</span>`,
      supporting: [`Status: ${status}`, friction ? `Estimated Hazen–Williams loss: ${formatNumber(fromSI(friction.totalHeadM, "head", system), 3)} ${system === "US" ? "ft" : "m"}` : "Friction loss: not requested"],
      interpretation: "Velocity is a screening value based on actual internal diameter, not nominal pipe size.",
      warning: "There is no single worldwide legal velocity limit. Apply the criteria, material data and transient analysis required for your project and jurisdiction."
    });
  });
}
