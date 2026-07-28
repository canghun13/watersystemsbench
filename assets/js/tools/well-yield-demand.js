import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, toSI } from "../unit-conversions.js";

export function computeWellYieldDemand({ yieldLpm, pumpingHoursPerDay, dailyDemandL, peakDemandLpm, peakMinutes, existingStorageL = 0, reservePercent = 0 }) {
  const dailyProductionL = yieldLpm * pumpingHoursPerDay * 60;
  const dailyBalanceL = dailyProductionL - dailyDemandL;
  const averageCoverage = dailyDemandL === 0 ? 1 : dailyProductionL / dailyDemandL;
  const peakDemandL = peakDemandLpm * peakMinutes;
  const peakWellSupplyL = yieldLpm * peakMinutes;
  const peakStorageGapL = Math.max(0, peakDemandL - peakWellSupplyL);
  const reserveL = dailyDemandL * reservePercent / 100;
  const storageGapL = Math.max(0, peakStorageGapL + reserveL - existingStorageL);
  return { dailyProductionL, dailyBalanceL, averageCoverage, peakDemandL, peakWellSupplyL, peakStorageGapL, reserveL, storageGapL };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='well-yield']");
if (form) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const result = computeWellYieldDemand({
      yieldLpm: toSI(numberValue(current, "wellYield", { allowZero: false, max: 100000 }), "flow", system),
      pumpingHoursPerDay: numberValue(current, "pumpingHours", { allowZero: false, max: 24 }),
      dailyDemandL: toSI(numberValue(current, "dailyDemand", { allowZero: false, max: 100000000 }), "volume", system),
      peakDemandLpm: toSI(numberValue(current, "peakDemand", { allowZero: false, max: 100000 }), "flow", system),
      peakMinutes: numberValue(current, "peakMinutes", { allowZero: false, max: 1440 }),
      existingStorageL: toSI(numberValue(current, "existingStorage", { max: 100000000 }), "volume", system),
      reservePercent: numberValue(current, "reserve", { max: 200 })
    });
    const vu = system === "US" ? "US gal" : "L";
    renderResult(current, {
      label: "Daily source coverage",
      primary: `${formatNumber(result.averageCoverage * 100, 1)}<span class="reading-unit">%</span>`,
      supporting: [`Daily production: ${formatNumber(fromSI(result.dailyProductionL, "volume", system), 1)} ${vu}`, `Daily balance: ${formatNumber(fromSI(result.dailyBalanceL, "volume", system), 1)} ${vu}`, `Peak-period storage gap: ${formatNumber(fromSI(result.peakStorageGapL, "volume", system), 1)} ${vu}`, `Additional storage after reserve and existing storage: ${formatNumber(fromSI(result.storageGapL, "volume", system), 1)} ${vu}`],
      interpretation: result.dailyBalanceL >= 0 ? "The entered pumping schedule covers average daily volume, but peak-period storage and seasonal yield still require review." : "The entered source schedule does not cover average daily demand; storage alone cannot correct a sustained daily deficit.",
      warning: "A short yield test is not a guarantee of drought-season output. Confirm a defensible sustained yield and protect the pump from low water."
    });
  });
}
