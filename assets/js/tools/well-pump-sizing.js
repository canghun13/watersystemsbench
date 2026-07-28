import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, pressureToHead, toSI } from "../unit-conversions.js";

export function computeWellPumpDuty({ demandLpm, pumpingLevelM, dischargeElevationM, deliveryKPa, frictionM, equipmentM = 0, pumpSettingM }) {
  if (pumpSettingM <= pumpingLevelM) throw new Error("Pump setting depth must be below the pumping water level.");
  const submergenceM = pumpSettingM - pumpingLevelM;
  const staticLiftM = dischargeElevationM + pumpingLevelM;
  const pressureHeadM = pressureToHead(deliveryKPa);
  const totalHeadM = staticLiftM + pressureHeadM + frictionM + equipmentM;
  return { flowLpm: demandLpm, staticLiftM, pressureHeadM, totalHeadM, submergenceM };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='well-pump']");
if (form) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const result = computeWellPumpDuty({
      demandLpm: toSI(numberValue(current, "demand", { allowZero: false, max: 100000 }), "flow", system),
      pumpingLevelM: toSI(numberValue(current, "pumpingLevel", { max: 2000 }), "head", system),
      dischargeElevationM: toSI(numberValue(current, "dischargeElevation", { min: -500, max: 3000 }), "head", system),
      deliveryKPa: toSI(numberValue(current, "deliveryPressure", { max: 5000 }), "pressure", system),
      frictionM: toSI(numberValue(current, "friction", { max: 2000 }), "head", system),
      equipmentM: toSI(numberValue(current, "equipment", { max: 1000 }), "head", system),
      pumpSettingM: toSI(numberValue(current, "pumpSetting", { allowZero: false, max: 3000 }), "head", system)
    });
    renderResult(current, {
      label: "Preliminary well-pump duty",
      primary: `${formatNumber(fromSI(result.flowLpm, "flow", system), 2)} <span class="reading-unit">${system === "US" ? "GPM" : "L/min"}</span> at ${formatNumber(fromSI(result.totalHeadM, "head", system), 2)} <span class="reading-unit">${system === "US" ? "ft" : "m"}</span>`,
      supporting: [`Static lift from pumping level: ${formatNumber(fromSI(result.staticLiftM, "head", system), 2)} ${system === "US" ? "ft" : "m"}`, `Delivery pressure head: ${formatNumber(fromSI(result.pressureHeadM, "head", system), 2)} ${system === "US" ? "ft" : "m"}`, `Pump submergence below pumping level: ${formatNumber(fromSI(result.submergenceM, "head", system), 2)} ${system === "US" ? "ft" : "m"}`],
      interpretation: "Compare this flow-and-head duty with the exact manufacturer curve, then check power, operating range and changing water levels.",
      warning: result.submergenceM < 3 ? "Entered submergence is small. Confirm minimum motor/pump submergence and seasonal drawdown with the manufacturer and well professional." : "Pump setting depth validates submergence; it is not added to TDH. Confirm seasonal low water level and well yield."
    });
  });
}
