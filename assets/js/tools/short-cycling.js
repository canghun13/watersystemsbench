import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, toSI } from "../unit-conversions.js";

export function analyzeShortCycling({ starts, observationMinutes, drawdownL, demandLpm, pumpLpm }) {
  const startsPerHour = starts * 60 / observationMinutes;
  const offMinutes = demandLpm > 0 ? drawdownL / demandLpm : null;
  const netFillLpm = pumpLpm - demandLpm;
  const onMinutes = netFillLpm > 0 ? drawdownL / netFillLpm : null;
  const modeledCycleMinutes = offMinutes == null || onMinutes == null ? null : offMinutes + onMinutes;
  const modeledStartsPerHour = modeledCycleMinutes && modeledCycleMinutes > 0 ? 60 / modeledCycleMinutes : null;
  let status = "Measured cycle rate recorded.";
  if (demandLpm >= pumpLpm) status = "Demand equals or exceeds pump flow, so this simple tank refill model cannot complete an on-cycle.";
  else if (demandLpm === 0) status = "With zero entered demand, a normal pressure-tank cycle should not repeat; investigate leakage, check-valve or control behavior.";
  else if (startsPerHour > 12) status = "The observed rate is high enough to prioritize a tank, leak, check-valve and control review.";
  return { startsPerHour, offMinutes, onMinutes, modeledCycleMinutes, modeledStartsPerHour, status };
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='short-cycling']");
if (form) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem.value;
    const result = analyzeShortCycling({
      starts: numberValue(current, "starts", { max: 10000 }),
      observationMinutes: numberValue(current, "observation", { allowZero: false, max: 1440 }),
      drawdownL: toSI(numberValue(current, "drawdown", { allowZero: false, max: 1000000 }), "volume", system),
      demandLpm: toSI(numberValue(current, "demand", { max: 100000 }), "flow", system),
      pumpLpm: toSI(numberValue(current, "pumpFlow", { allowZero: false, max: 100000 }), "flow", system)
    });
    renderResult(current, {
      label: "Observed starts per hour",
      primary: `${formatNumber(result.startsPerHour, 1)} <span class="reading-unit">starts/h</span>`,
      supporting: [`Modeled off-time: ${result.offMinutes == null ? "not defined at zero demand" : `${formatNumber(result.offMinutes, 2)} min`}`, `Modeled on-time: ${result.onMinutes == null ? "not defined when demand ≥ pump flow" : `${formatNumber(result.onMinutes, 2)} min`}`, `Modeled starts per hour: ${result.modeledStartsPerHour == null ? "not available" : formatNumber(result.modeledStartsPerHour, 1)}`],
      interpretation: result.status,
      warning: "A cycle count is a symptom screen, not a diagnosis. Isolate electrical power and depressurize before inspection; use manufacturer limits for allowable starts."
    });
  });
}
