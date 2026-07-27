import { numberValue, renderResult, setupForm } from "../form-utils.js";
import { formatNumber } from "../unit-conversions.js";

export function computeOperatingCost({ powerKW, hoursPerDay, daysPerYear, tariff, maintenance = 0 }) {
  const dailyEnergy = powerKW * hoursPerDay;
  const annualEnergy = dailyEnergy * daysPerYear;
  const electricityCost = annualEnergy * tariff;
  const annualTotal = electricityCost + maintenance;
  return { dailyEnergy, annualEnergy, electricityCost, annualTotal, fiveYear: annualTotal * 5 };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='cost']");
if (form) {
  setupForm(form, (current) => {
    const currency = current.elements.currency.value.trim().replace(/[<>]/g, "") || "currency units";
    const rows = [];
    for (let index = 1; index <= 3; index += 1) {
      const powerRaw = current.elements[`power${index}`].value.trim();
      if (!powerRaw && index > 1) continue;
      const name = current.elements[`name${index}`].value.trim();
      if (!name) throw new Error(`Scenario ${index} needs a name.`);
      const result = computeOperatingCost({ powerKW: numberValue(current, `power${index}`, { allowZero: false, max: 100000 }), hoursPerDay: numberValue(current, `hours${index}`, { min: 0, max: 24 }), daysPerYear: numberValue(current, `days${index}`, { min: 0, max: 366 }), tariff: numberValue(current, `tariff${index}`, { min: 0, max: 10000 }), maintenance: numberValue(current, `maintenance${index}`, { min: 0, max: 1000000000 }) });
      rows.push({ name: name.replace(/[<>]/g, ""), ...result });
    }
    rows.sort((a, b) => a.annualTotal - b.annualTotal);
    const base = rows[0];
    const table = `<table class="comparison-table"><thead><tr><th>Scenario</th><th>Daily kWh</th><th>Annual kWh</th><th>Electricity</th><th>Annual total</th><th>5-year total</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${row.name}</td><td>${formatNumber(row.dailyEnergy, 1)}</td><td>${formatNumber(row.annualEnergy, 0)}</td><td>${formatNumber(row.electricityCost, 2)}</td><td>${formatNumber(row.annualTotal, 2)}</td><td>${formatNumber(row.fiveYear, 2)}</td></tr>`).join("")}</tbody></table>`;
    renderResult(current, {
      label: "Lowest annual operating cost",
      primary: `${base.name}`,
      supporting: [table, `Lowest annual total: ${formatNumber(base.annualTotal, 2)} ${currency}`, ...rows.slice(1).map((row) => `${row.name} difference: ${formatNumber(row.annualTotal - base.annualTotal, 2)} ${currency}/year`)],
      interpretation: "The comparison uses entered electrical demand, operating schedule, tariff and optional maintenance cost without assuming a national tariff.",
      warning: "Exclude purchase price only if you are intentionally comparing operating cost. Escalation, demand charges, part-load efficiency and replacement timing may change lifecycle results."
    });
  });
}
