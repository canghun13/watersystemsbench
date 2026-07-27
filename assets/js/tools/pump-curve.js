import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber } from "../unit-conversions.js";

export function parseCurve(text) {
  const points = text.split(/[;\n]+/).map((pair) => pair.trim()).filter(Boolean).map((pair) => {
    const [flow, head] = pair.split(",").map(Number);
    if (!Number.isFinite(flow) || !Number.isFinite(head) || flow < 0 || head < 0) throw new Error("Curve points must use non-negative flow,head pairs.");
    return { flow, head };
  }).sort((a, b) => a.flow - b.flow);
  if (points.length < 3) throw new Error("Enter at least three flow,head points for each candidate.");
  for (let i = 1; i < points.length; i += 1) if (points[i].flow === points[i - 1].flow) throw new Error("Each curve point needs a unique flow value.");
  return points;
}

export function interpolateCurve(points, dutyFlow) {
  if (dutyFlow < points[0].flow || dutyFlow > points.at(-1).flow) return null;
  const exact = points.find((point) => point.flow === dutyFlow);
  if (exact) return exact.head;
  for (let i = 1; i < points.length; i += 1) {
    if (dutyFlow < points[i].flow) {
      const low = points[i - 1]; const high = points[i];
      return low.head + (high.head - low.head) * ((dutyFlow - low.flow) / (high.flow - low.flow));
    }
  }
  return null;
}

const form = typeof document === "undefined" ? null : document.querySelector("[data-tool-form='curve']");
if (form) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const dutyFlow = numberValue(current, "dutyFlow", { allowZero: false, max: 1000000 });
    const dutyHead = numberValue(current, "dutyHead", { allowZero: false, max: 10000 });
    const rows = [];
    for (let index = 1; index <= 3; index += 1) {
      const text = current.elements[`points${index}`].value.trim();
      const name = current.elements[`name${index}`].value.trim();
      if (!text && index > 1) continue;
      if (!name) throw new Error(`Candidate ${index} needs a name.`);
      const head = interpolateCurve(parseCurve(text), dutyFlow);
      if (head == null) rows.push({ name, head: null, margin: null, status: "Duty flow outside entered curve—no extrapolation" });
      else {
        const margin = (head - dutyHead) / dutyHead * 100;
        const status = margin < 0 ? "Does not meet duty head" : margin > 25 ? "High head margin—review oversizing" : margin < 5 ? "Narrow positive margin" : "Preliminary match";
        rows.push({ name, head, margin, status });
      }
    }
    const table = `<table class="comparison-table"><thead><tr><th>Candidate</th><th>Head at duty flow</th><th>Margin</th><th>Screening result</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${row.name.replace(/[<>]/g, "")}</td><td>${row.head == null ? "—" : formatNumber(row.head, 2)}</td><td>${row.margin == null ? "—" : `${formatNumber(row.margin, 1)}%`}</td><td>${row.status}</td></tr>`).join("")}</tbody></table>`;
    const valid = rows.filter((row) => row.margin != null).sort((a, b) => Math.abs(a.margin - 10) - Math.abs(b.margin - 10));
    renderResult(current, {
      label: "Curve comparison",
      primary: `${valid.length ? valid[0].name.replace(/[<>]/g, "") : "No in-range candidate"}`,
      supporting: [table, `Duty point: ${formatNumber(dutyFlow, 2)} ${current.elements.unitSystem.value === "US" ? "GPM" : "L/min"} at ${formatNumber(dutyHead, 2)} ${current.elements.unitSystem.value === "US" ? "ft" : "m"}`],
      interpretation: "The table linearly interpolates only between user-entered manufacturer points; it does not create or fit a pump curve.",
      warning: "This is a preliminary comparison. Verify the exact impeller, speed, operating region, efficiency, power and NPSH on the current manufacturer curve."
    });
  });
}
