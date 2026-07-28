import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, toSI } from "../unit-conversions.js";

export function computeStorageTank({ dailyDemandL, outageDays, refillLpm = 0, refillHoursPerDay = 0, reservePercent = 0, usableFraction = 1, existingVolumeL = 0 }) {
  if (!(usableFraction > 0 && usableFraction <= 1)) throw new Error("Usable fraction must be greater than 0 and no more than 100%.");
  const grossDemandL = dailyDemandL * outageDays;
  const refillContributionL = refillLpm * 60 * refillHoursPerDay * outageDays;
  const netDemandL = Math.max(0, grossDemandL - refillContributionL);
  const reserveL = netDemandL * reservePercent / 100;
  const requiredUsableL = netDemandL + reserveL;
  const requiredNominalL = requiredUsableL / usableFraction;
  const additionalNominalL = Math.max(0, requiredNominalL - existingVolumeL);
  return { grossDemandL, refillContributionL, netDemandL, reserveL, requiredUsableL, requiredNominalL, additionalNominalL };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='storage-tank']");
if (form) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const result = computeStorageTank({
      dailyDemandL: toSI(numberValue(current, "dailyDemand", { allowZero: false, max: 100000000 }), "volume", system),
      outageDays: numberValue(current, "outageDays", { allowZero: false, max: 365 }),
      refillLpm: toSI(numberValue(current, "refillFlow", { max: 100000 }), "flow", system),
      refillHoursPerDay: numberValue(current, "refillHours", { max: 24 }),
      reservePercent: numberValue(current, "reserve", { max: 200 }),
      usableFraction: numberValue(current, "usablePercent", { allowZero: false, max: 100 }) / 100,
      existingVolumeL: toSI(numberValue(current, "existingVolume", { max: 100000000 }), "volume", system)
    });
    const vu = system === "US" ? "US gal" : "L";
    renderResult(current, {
      label: "Required nominal storage",
      primary: `${formatNumber(fromSI(result.requiredNominalL, "volume", system), 1)} <span class="reading-unit">${vu}</span>`,
      supporting: [`No-refill demand: ${formatNumber(fromSI(result.grossDemandL, "volume", system), 1)} ${vu}`, `Refill contribution: ${formatNumber(fromSI(result.refillContributionL, "volume", system), 1)} ${vu}`, `Required usable volume with reserve: ${formatNumber(fromSI(result.requiredUsableL, "volume", system), 1)} ${vu}`, `Additional nominal capacity after existing volume: ${formatNumber(fromSI(result.additionalNominalL, "volume", system), 1)} ${vu}`],
      interpretation: result.refillContributionL >= result.grossDemandL ? "Entered refill covers the average outage-period volume, but peak demand, timing and source reliability may still require storage." : "The nominal volume converts the net outage demand and reserve through the entered usable fraction.",
      warning: "Separate potable-water safety, fire storage, dead storage, turnover, structural loads and local requirements from this volume balance."
    });
  });
}
