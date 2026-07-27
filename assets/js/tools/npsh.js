import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { fromSI, pressureToHead, toSI, waterProperties, formatNumber } from "../unit-conversions.js";

export function computeNPSHA({ absoluteSurfaceKPa, staticSuctionM, frictionM, additionalM, tempC }) {
  const props = waterProperties(tempC);
  const absoluteHeadM = pressureToHead(absoluteSurfaceKPa, props.density);
  const vaporHeadM = pressureToHead(props.vaporPressureKPa, props.density);
  const npshaM = absoluteHeadM + staticSuctionM - frictionM - additionalM - vaporHeadM;
  return { npshaM, absoluteHeadM, vaporHeadM, vaporPressureKPa: props.vaporPressureKPa };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='npsh']");
if (form) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const temperature = numberValue(current, "temperature", { min: system === "US" ? 32 : 0, max: system === "US" ? 212 : 100 });
    const tempC = system === "US" ? (temperature - 32) * 5 / 9 : temperature;
    const result = computeNPSHA({
      absoluteSurfaceKPa: toSI(numberValue(current, "absolutePressure", { allowZero: false, max: 5000 }), "pressure", system),
      staticSuctionM: toSI(numberValue(current, "staticSuction", { min: -100, max: 1000 }), "head", system),
      frictionM: toSI(numberValue(current, "friction", { max: 1000 }), "head", system),
      additionalM: toSI(numberValue(current, "additional", { max: 1000 }), "head", system),
      tempC
    });
    const npshrRaw = current.elements.npshr.value.trim();
    const npshrM = npshrRaw ? toSI(numberValue(current, "npshr", { min: 0, max: 1000 }), "head", system) : null;
    const marginM = npshrM == null ? null : result.npshaM - npshrM;
    renderResult(current, {
      label: "NPSH available",
      primary: `${formatNumber(fromSI(result.npshaM, "head", system), 2)} <span class="reading-unit">${system === "US" ? "ft" : "m"}</span>`,
      supporting: [`Absolute surface pressure head: ${formatNumber(fromSI(result.absoluteHeadM, "head", system), 2)} ${system === "US" ? "ft" : "m"}`, `Water vapor pressure: ${formatNumber(fromSI(result.vaporPressureKPa, "pressure", system), 3)} ${system === "US" ? "psi" : "kPa"}`, `Vapor pressure head: ${formatNumber(fromSI(result.vaporHeadM, "head", system), 3)} ${system === "US" ? "ft" : "m"}`, marginM == null ? "NPSHR comparison: not entered" : `NPSHA − entered NPSHR: ${formatNumber(fromSI(marginM, "head", system), 2)} ${system === "US" ? "ft" : "m"}`],
      interpretation: marginM == null ? "Compare NPSHA with the manufacturer’s NPSHR and required application-specific margin." : marginM > 0 ? "NPSHA exceeds the entered NPSHR, but the required reliability margin still needs manufacturer and application review." : "NPSHA does not exceed the entered NPSHR; review suction conditions and pump selection.",
      warning: "Surface pressure must be absolute, not gauge pressure. NPSHR is not itself a universal safe operating threshold."
    });
  });
}
