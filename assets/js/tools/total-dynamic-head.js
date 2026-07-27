import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { fromSI, headToPressure, pressureToHead, toSI, formatNumber } from "../unit-conversions.js";

export function computeTDH({ elevationM, deliveryKPa, inletKPa, frictionM, minorM, equipmentM, density = 998.2 }) {
  const pressureHead = pressureToHead(deliveryKPa, density);
  const inletHead = pressureToHead(inletKPa, density);
  const totalM = elevationM + pressureHead + frictionM + minorM + equipmentM - inletHead;
  return { totalM, pressureHead, inletHead, equivalentKPa: headToPressure(totalM, density) };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='tdh']");
if (form) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const values = {
      elevationM: toSI(numberValue(current, "elevation", { min: -500, max: 3000 }), "head", system),
      deliveryKPa: toSI(numberValue(current, "deliveryPressure", { max: 5000 }), "pressure", system),
      inletKPa: toSI(numberValue(current, "inletPressure", { max: 5000 }), "pressure", system),
      frictionM: toSI(numberValue(current, "friction", { max: 2000 }), "head", system),
      minorM: toSI(numberValue(current, "minor", { max: 1000 }), "head", system),
      equipmentM: toSI(numberValue(current, "equipment", { max: 1000 }), "head", system)
    };
    const result = computeTDH(values);
    const displayHead = fromSI(result.totalM, "head", system);
    const displayPressure = fromSI(result.equivalentKPa, "pressure", system);
    const components = [
      ["Elevation", values.elevationM], ["Delivery pressure", result.pressureHead], ["Pipe friction", values.frictionM],
      ["Minor loss", values.minorM], ["Equipment loss", values.equipmentM], ["Available inlet pressure", -result.inletHead]
    ];
    const largest = components.reduce((a, b) => Math.abs(b[1]) > Math.abs(a[1]) ? b : a);
    renderResult(current, {
      label: "Total dynamic head",
      primary: `${formatNumber(displayHead)} <span class="reading-unit">${system === "US" ? "ft" : "m"}</span>`,
      supporting: components.map(([name, value]) => `${name}: ${formatNumber(fromSI(value, "head", system))} ${system === "US" ? "ft" : "m"}`).concat(`Equivalent pressure: ${formatNumber(displayPressure)} ${system === "US" ? "psi" : "kPa"}`, `Largest influence: ${largest[0]}`),
      interpretation: result.totalM > 0 ? "Use this head with the required flow to define a preliminary pump duty point." : "Available inlet pressure and elevation already exceed the stated delivery requirement; confirm the inputs before adding a pump.",
      warning: "TDH is gauge-based system head. Do not mix absolute pressure with gauge pressure, and confirm transient, control-valve and manufacturer requirements separately."
    });
  });
}
