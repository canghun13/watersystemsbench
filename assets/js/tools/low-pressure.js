import { renderResult, setupForm } from "../form-utils.js";

export function diagnoseLowPressure(input) {
  const causes = [];
  const checks = [];
  if (input.scope === "single") { causes.push("A local fixture, valve, aerator or branch restriction"); checks.push("Compare flow at an adjacent outlet and inspect only accessible strainers/aerators."); }
  if (input.scope === "all" && input.dynamicDrop === "large") { causes.push("A supply restriction, undersized path, clogged treatment device or weak source under flow"); checks.push("Measure pressure before and after accessible filters/softeners while water is flowing."); }
  if (input.prv === "yes") { causes.push("A pressure-reducing valve setting or performance issue"); checks.push("Compare upstream and downstream static and dynamic pressure without dismantling the PRV."); }
  if (input.filter === "yes") { causes.push("Filter or treatment pressure drop"); checks.push("Use manufacturer-approved bypass/testing steps and compare pressure drop."); }
  if (input.pump === "yes") { causes.push("Pump, controls or pressure-tank operating issue"); checks.push("Record cut-in/cut-out pressure and cycling behavior; do not open electrical equipment or a pressurized tank."); }
  if (input.leak === "yes" || input.sudden === "yes") { causes.unshift("A leak, failed component or sudden supply change"); checks.unshift("Stop if there is active flooding, electrical exposure or structural damage and contact the appropriate professional or utility."); }
  if (input.time === "yes") { causes.push("Time-dependent utility/source demand or scheduled equipment behavior"); checks.push("Repeat static/dynamic measurements at affected and unaffected times."); }
  if (!causes.length) { causes.push("Insufficient measurement evidence to narrow the cause"); checks.push("Measure static pressure, dynamic pressure, flow and elevation before selecting equipment."); }
  return { causes: [...new Set(causes)].slice(0, 4), checks: [...new Set(checks)].slice(0, 5) };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='troubleshooter']");
if (form) {
  setupForm(form, (current) => {
    const input = Object.fromEntries(new FormData(current));
    const result = diagnoseLowPressure(input);
    renderResult(current, {
      label: "Most likely cause group",
      primary: `${result.causes[0]}`,
      supporting: [`Other plausible groups: ${result.causes.slice(1).join("; ") || "none from the selected answers"}`, `<strong>Next checks</strong><ol>${result.checks.map((item) => `<li>${item}</li>`).join("")}</ol>`],
      interpretation: "This result prioritizes safe measurements and cause groups; it is not a confirmed diagnosis.",
      warning: "Contact the utility or a qualified professional for sudden whole-property changes, suspected leaks, unsafe pressure, electrical hazards, gas appliances, or sealed pressure-vessel work."
    });
  });
}
