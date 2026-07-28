import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, toSI } from "../unit-conversions.js";

export function simulateRainwater({ capacityL, initialL = 0, areaM2, monthlyRainMm, coefficient, dailyDemandL }) {
  if (!Array.isArray(monthlyRainMm) || monthlyRainMm.length !== 12) throw new Error("Provide 12 monthly rainfall values.");
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let storage = Math.min(capacityL, Math.max(0, initialL));
  let totalCollectionL = 0, totalDemandL = 0, overflowL = 0, unmetL = 0, metDays = 0, minStorageL = storage, emptyPeriods = 0, wasEmpty = storage === 0;
  const monthly = [];
  for (let month = 0; month < 12; month += 1) {
    let monthCollected = 0, monthOverflow = 0, monthUnmet = 0;
    const dailyInflow = areaM2 * monthlyRainMm[month] * coefficient / monthDays[month];
    for (let day = 0; day < monthDays[month]; day += 1) {
      totalCollectionL += dailyInflow;
      monthCollected += dailyInflow;
      storage += dailyInflow;
      const overflow = Math.max(0, storage - capacityL);
      storage -= overflow;
      overflowL += overflow;
      monthOverflow += overflow;
      totalDemandL += dailyDemandL;
      const supplied = Math.min(storage, dailyDemandL);
      storage -= supplied;
      const unmet = dailyDemandL - supplied;
      unmetL += unmet;
      monthUnmet += unmet;
      if (unmet <= 1e-9) metDays += 1;
      const empty = storage <= 1e-9;
      if (empty && !wasEmpty) emptyPeriods += 1;
      wasEmpty = empty;
      minStorageL = Math.min(minStorageL, storage);
    }
    monthly.push({ month: month + 1, collectedL: monthCollected, overflowL: monthOverflow, unmetL: monthUnmet, endStorageL: storage });
  }
  return { reliability: metDays / 365, totalCollectionL, totalDemandL, overflowL, unmetL, minStorageL, endStorageL: storage, emptyPeriods, monthly };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='rain-simulator']");
if (form) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const rainfall = Array.from({ length: 12 }, (_, i) => toSI(numberValue(current, `rain${i + 1}`, { max: 5000 }), "rainfall", system));
    const result = simulateRainwater({
      capacityL: toSI(numberValue(current, "capacity", { allowZero: false, max: 100000000 }), "volume", system),
      initialL: toSI(numberValue(current, "initial", { max: 100000000 }), "volume", system),
      areaM2: toSI(numberValue(current, "area", { allowZero: false, max: 10000000 }), "area", system),
      monthlyRainMm: rainfall,
      coefficient: numberValue(current, "coefficient", { max: 100 }) / 100,
      dailyDemandL: toSI(numberValue(current, "dailyDemand", { max: 10000000 }), "volume", system)
    });
    const vu = system === "US" ? "US gal" : "L";
    const table = `<table class="comparison-table"><thead><tr><th>Month</th><th>Collected</th><th>Overflow</th><th>Unmet</th><th>End storage</th></tr></thead><tbody>${result.monthly.map((row) => `<tr><td>${row.month}</td><td>${formatNumber(fromSI(row.collectedL, "volume", system), 0)}</td><td>${formatNumber(fromSI(row.overflowL, "volume", system), 0)}</td><td>${formatNumber(fromSI(row.unmetL, "volume", system), 0)}</td><td>${formatNumber(fromSI(row.endStorageL, "volume", system), 0)}</td></tr>`).join("")}</tbody></table>`;
    renderResult(current, {
      label: "Daily demand reliability",
      primary: `${formatNumber(result.reliability * 100, 1)}<span class="reading-unit">%</span>`,
      supporting: [`Total collection: ${formatNumber(fromSI(result.totalCollectionL, "volume", system), 0)} ${vu}`, `Total demand: ${formatNumber(fromSI(result.totalDemandL, "volume", system), 0)} ${vu}`, `Overflow: ${formatNumber(fromSI(result.overflowL, "volume", system), 0)} ${vu}`, `Unmet demand: ${formatNumber(fromSI(result.unmetL, "volume", system), 0)} ${vu}`, `Minimum storage: ${formatNumber(fromSI(result.minStorageL, "volume", system), 0)} ${vu}`, `End storage: ${formatNumber(fromSI(result.endStorageL, "volume", system), 0)} ${vu}`, `Empty periods: ${result.emptyPeriods}`, table],
      interpretation: "Rainfall is spread evenly within each month, then each daily step applies inflow, overflow and demand in that order.",
      warning: "Monthly averages hide storm timing and dry spells. Use daily historical data and sensitivity cases for detailed storage selection."
    });
  });
}
