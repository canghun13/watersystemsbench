import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { flowToM3s, fromSI, G, headToPressure, toSI, waterProperties, formatNumber } from "../unit-conversions.js";

export function computePipeFriction({ method, flowLpm, diameterMm, lengthM, c = 140, roughnessMm = 0.0015, tempC = 20, minorK = 0 }) {
  const q = flowToM3s(flowLpm);
  const d = diameterMm / 1000;
  const area = Math.PI * d * d / 4;
  const velocity = q / area;
  const props = waterProperties(tempC);
  const reynolds = velocity * d / props.kinematicViscosity;
  let frictionFactor = null;
  let majorHeadM;
  if (method === "hazen") {
    majorHeadM = 10.67 * lengthM * Math.pow(q, 1.852) / (Math.pow(c, 1.852) * Math.pow(d, 4.87));
  } else {
    frictionFactor = reynolds > 0 && reynolds < 2300
      ? 64 / reynolds
      : 0.25 / Math.pow(Math.log10((roughnessMm / 1000) / (3.7 * d) + 5.74 / Math.pow(reynolds, 0.9)), 2);
    majorHeadM = frictionFactor * (lengthM / d) * (velocity * velocity / (2 * G));
  }
  const minorHeadM = minorK * velocity * velocity / (2 * G);
  const totalHeadM = majorHeadM + minorHeadM;
  return { velocity, reynolds, regime: reynolds < 2300 ? "Laminar" : reynolds < 4000 ? "Transitional" : "Turbulent", frictionFactor, majorHeadM, minorHeadM, totalHeadM, pressureKPa: headToPressure(totalHeadM, props.density), props };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='friction']");
if (form) {
  const syncMethod = () => {
    const hazen = form.elements.method.value === "hazen";
    form.querySelector("[data-hazen-fields]").hidden = !hazen;
    form.querySelector("[data-darcy-fields]").hidden = hazen;
  };
  form.elements.method.addEventListener("change", syncMethod);
  syncMethod();
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const method = current.elements.method.value;
    const tempEntered = numberValue(current, "temperature", { min: system === "US" ? 32 : 0, max: system === "US" ? 212 : 100 });
    const input = {
      method,
      flowLpm: toSI(numberValue(current, "flow", { allowZero: false, max: 1000000 }), "flow", system),
      diameterMm: toSI(numberValue(current, "diameter", { allowZero: false, max: 5000 }), "diameter", system),
      lengthM: toSI(numberValue(current, "length", { allowZero: false, max: 100000 }), "length", system),
      c: method === "hazen" ? numberValue(current, "cValue", { min: 50, max: 160 }) : 140,
      roughnessMm: method === "darcy" ? toSI(numberValue(current, "roughness", { min: 0, max: system === "US" ? 0.8 : 20 }), "diameter", system) : 0.0015,
      tempC: system === "US" ? (tempEntered - 32) * 5 / 9 : tempEntered,
      minorK: numberValue(current, "minorK", { min: 0, max: 10000 })
    };
    const result = computePipeFriction(input);
    renderResult(current, {
      label: "Total head loss",
      primary: `${formatNumber(fromSI(result.totalHeadM, "head", system), 3)} <span class="reading-unit">${system === "US" ? "ft" : "m"}</span>`,
      supporting: [
        `Velocity: ${formatNumber(system === "US" ? result.velocity * 3.28084 : result.velocity, 3)} ${system === "US" ? "ft/s" : "m/s"}`,
        `Reynolds number: ${formatNumber(result.reynolds, 0)} (${result.regime})`,
        `Friction factor: ${result.frictionFactor == null ? "Not used by Hazen–Williams" : formatNumber(result.frictionFactor, 5)}`,
        `Major head loss: ${formatNumber(fromSI(result.majorHeadM, "head", system), 3)} ${system === "US" ? "ft" : "m"}`,
        `Minor head loss: ${formatNumber(fromSI(result.minorHeadM, "head", system), 3)} ${system === "US" ? "ft" : "m"}`,
        `Total pressure loss: ${formatNumber(fromSI(result.pressureKPa, "pressure", system), 2)} ${system === "US" ? "psi" : "kPa"}`,
        `Loss per 100 ${system === "US" ? "ft" : "m"}: ${formatNumber(fromSI(result.totalHeadM / input.lengthM * 100, "head", system), 3)} ${system === "US" ? "ft" : "m"}`
      ],
      interpretation: method === "hazen" ? "Hazen–Williams provides an empirical water-flow estimate using the selected C value." : "Darcy–Weisbach uses Reynolds number, relative roughness and water properties at the entered temperature.",
      warning: result.regime === "Transitional" ? "Flow is transitional; friction-factor estimates are less certain. Check the operating range and measured conditions." : "Confirm actual internal diameter, roughness, fittings and manufacturer data before design use."
    });
  });
}
