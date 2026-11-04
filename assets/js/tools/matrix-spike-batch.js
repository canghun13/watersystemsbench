import { computeSpike, parseLabCsv } from "./water-laboratory-tools.js";

export const batchHeaders = {
  basis: ["record", "native", "spiked", "added", "lower", "upper"],
  volume: ["record", "native", "spiked", "sampleMl", "spikeMl", "stock", "lower", "upper"]
};
export const batchExamples = {
  basis: "record,native,spiked,added,lower,upper\nSample-A nitrate,5,14.6,10,80,120\nSample-B nitrate,2,6,10,70,130\nSample-C nitrate,ND,14.6,10,80,120",
  volume: "record,native,spiked,sampleMl,spikeMl,stock,lower,upper\nSample-A nitrate,2,10.90909090909091,100,10,100,80,120\nSample-B nitrate,2,12,100,20,50,80,120\nSample-C nitrate,NA,12,100,20,50,80,120"
};
const numeric = (value, field) => {
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) throw new Error(`${field}: enter a nonnegative measurement, not a missing/censored value.`);
  const n = Number(value), mantissa = value.split(/e/i)[0];
  if (!Number.isFinite(n) || n > 1e12 || (n !== 0 && n < 1e-9) || (n === 0 && /[1-9]/.test(mantissa))) throw new Error(`${field}: supported values are zero or 1e-9 through 1e12.`);
  return n;
};
const safeId = value => value.length <= 80 && !/^[=+@-]/.test(value) && !/[\u0000-\u001f\u007f]/.test(value);
export function reviewSpikeBatch(csv, mode = "basis", unit = "mg/L") {
  if (!Object.hasOwn(batchHeaders, mode)) throw new Error("Choose a supported record basis.");
  if (!["mg/L", "µg/L"].includes(unit)) throw new Error("Choose mg/L or µg/L for all concentration cells.");
  if (typeof csv !== "string" || new TextEncoder().encode(csv).length > 262144) throw new Error("Use a CSV no larger than 256 KiB.");
  const source = parseLabCsv(csv, batchHeaders[mode]), ids = new Set();
  for (const row of source) {
    if (!safeId(row.record)) throw new Error("Record IDs must be 1–80 characters without control characters or a spreadsheet-formula prefix.");
    if (ids.has(row.record)) throw new Error(`Duplicate record ID: ${row.record}. Include sample and analyte identity.`);
    ids.add(row.record);
  }
  const rows = source.map(input => {
    try {
      const data = Object.fromEntries(Object.entries(input).filter(([key]) => key !== "record").map(([key, value]) => [key, numeric(value, key)]));
      const result = computeSpike({ ...data, mode });
      if (!Number.isFinite(result.volumeIncrease)) throw new Error("Physical volume ratio exceeds finite precision.");
      return { input, ...result, status: result.within ? "Within entered range" : "Outside entered range", reason: "" };
    } catch (error) {
      return { input, recovery: null, nativeFinal: null, addedFinal: null, expected: null, within: null, status: "Not calculated", reason: error.message };
    }
  });
  const within = rows.filter(row => row.within === true).length, outside = rows.filter(row => row.within === false).length;
  const uncomputed = rows.length - within - outside;
  return { mode, unit, csv, rows, total: rows.length, calculated: within + outside, within, outside, uncomputed, complete: uncomputed === 0 };
}
const textNumber = n => n == null ? "Not calculated" : Number(n.toPrecision(10)).toString();
const quote = value => {
  const text = typeof value === "string" && /^[=+@-]/.test(value) ? "'" + value : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
};
export function spikeBatchCsv(review) {
  const inputs = batchHeaders[review.mode];
  const headers = [...inputs, "basis", "concentrationUnit", "volumeUnit", "nativeContribution", "addedContribution", "expectedSpiked", "recoveryPercent", "review", "reason"];
  return [headers, ...review.rows.map(row => [...inputs.map(key => row.input[key]), review.mode, review.unit, review.mode === "volume" ? "mL" : "not applicable", row.nativeFinal, row.addedFinal, row.expected, row.recovery, row.status, row.reason])].map(row => row.map(quote).join(",")).join("\r\n");
}
export function spikeBatchPacket(review, url) {
  return `Matrix Spike Recovery Calculator — batch arithmetic review\n${review.calculated}/${review.total} records calculated; ${review.within} within entered range; ${review.outside} outside; ${review.uncomputed} not calculated.\n${review.complete ? "All rows calculated, not an analytical acceptance decision." : "Review incomplete: resolve every not-calculated record."}\nBasis: ${review.mode}; concentration unit: ${review.unit}; physical volumes: mL. Unit selection did not convert CSV numbers.\nNo automatic sample-result correction or reporting authorization.\n${url}\n\nFull entered CSV\n${review.csv}\n\nFull audit CSV\n${spikeBatchCsv(review)}`;
}
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
function mount(root) {
  const form = root.querySelector("form");
  const fields = Object.fromEntries(["mode", "unit", "records", "file"].map(name => [name, form.querySelector(`#spike-batch-${name}`)]));
  const report = root.querySelector("[data-spike-report]"), run = root.querySelector("[data-spike-run]");
  const error = root.querySelector("[data-spike-error]"), fileStatus = root.querySelector("[data-spike-file-status]");
  const actions = [...root.querySelectorAll(".spike-actions button")];
  let review = null, generation = 0, pending = false;
  const url = window.location.href.split(/[?#]/)[0];
  function clear() {
    generation++; if (pending) fields.file.value = ""; pending = false; review = null; report.hidden = true; report.removeAttribute("data-spike-printable"); error.textContent = "";
    actions.forEach(button => { button.disabled = true; });
    root.querySelector("[data-spike-copy]").textContent = "Copy full review";
    run.disabled = false;
    root.querySelector("[data-spike-schema]").textContent = batchHeaders[fields.mode.value]?.join(",") || "Choose a supported basis";
  }
  function render(value) {
    review = value;
    root.querySelector("[data-spike-count]").textContent = `${value.calculated} / ${value.total}`;
    root.querySelector("[data-spike-summary]").textContent = `${value.within} within entered range; ${value.outside} outside entered range; ${value.uncomputed} not calculated. ${value.complete ? "All rows calculated. This is not an analytical-batch acceptance decision." : "Review incomplete: resolve every not-calculated record."}`;
    root.querySelector("[data-spike-context]").textContent = `Basis: ${value.mode === "basis" ? "matched concentration" : "aqueous sample + spike volume"}; source concentration unit: ${value.unit}; physical volumes: mL. Unit selection did not convert numbers. ${url}`;
    root.querySelector("[data-spike-preview-note]").textContent = value.total > 100 ? `Showing the first 100 of ${value.total} records. Copy and audit CSV retain all ${value.total}, including failures.` : `All ${value.total} records shown. Copy and audit CSV retain original inputs and failures.`;
    root.querySelector("[data-spike-rows]").innerHTML = value.rows.slice(0, 100).map(row => `<tr>${[row.input.record, textNumber(row.nativeFinal), textNumber(row.addedFinal), textNumber(row.expected), textNumber(row.recovery), `${row.input.lower} to ${row.input.upper}`, row.status, row.reason || "—"].map((cell, index) => `<td${row.within === null && index === 6 ? ' data-spike-uncomputed' : ""}>${esc(cell)}</td>`).join("")}</tr>`).join("");
    root.querySelector("[data-spike-print-input]").textContent = value.csv.replace(/^\uFEFF/, "").trim().split(/\r?\n/).slice(0, 101).join("\n");
    report.hidden = false; report.toggleAttribute("data-spike-printable", value.calculated > 0);
    actions.forEach(button => { button.disabled = false; }); root.querySelector("[data-spike-print]").disabled = value.calculated === 0;
  }
  form.addEventListener("submit", event => {
    event.preventDefault(); if (pending) return; clear();
    try { render(reviewSpikeBatch(fields.records.value, fields.mode.value, fields.unit.value)); }
    catch (problem) { error.textContent = problem.message; }
  });
  form.addEventListener("input", event => { if (event.target.type !== "file") { clear(); fileStatus.textContent = "Inputs changed. Review the text and run again."; } });
  for (const field of [fields.mode, fields.unit]) field.addEventListener("change", () => { clear(); fileStatus.textContent = "Basis or unit changed; CSV numbers were not converted. Review before running."; });
  form.addEventListener("reset", () => { clear(); fileStatus.textContent = "Demonstration restored. Replace with your approved records and criteria."; requestAnimationFrame(clear); });
  root.querySelector("[data-spike-example]").addEventListener("click", () => { clear(); fields.records.value = batchExamples[fields.mode.value]; fields.file.value = ""; fileStatus.textContent = "Example CSV replaced the text. Values are not method limits."; });
  fields.file.addEventListener("change", async () => {
    const file = fields.file.files?.[0]; if (!file) return;
    clear(); const token = generation; pending = true; run.disabled = true; fileStatus.textContent = "Reading the selected file locally…";
    try {
      if (file.size > 262144) throw new Error("Use a CSV no larger than 256 KiB.");
      const text = await file.text(); if (token !== generation) return;
      reviewSpikeBatch(text, fields.mode.value, fields.unit.value);
      fields.records.value = text; fileStatus.textContent = "Local CSV loaded. Inspect the text, basis and units, then review records.";
    } catch (problem) {
      if (token === generation) { error.textContent = problem.message; fileStatus.textContent = "File not loaded; previous text retained, previous report cleared."; }
    } finally { if (token === generation) { pending = false; run.disabled = false; fields.file.value = ""; } }
  });
  root.querySelector("[data-spike-copy]").addEventListener("click", async event => {
    if (!review) return; const token = generation;
    try { await navigator.clipboard.writeText(spikeBatchPacket(review, url)); if (token === generation) event.target.textContent = "Copied"; }
    catch { if (token === generation) error.textContent = "Clipboard unavailable. Download the audit CSV and retain your original input file."; }
  });
  root.querySelector("[data-spike-download]").addEventListener("click", () => {
    if (!review) return;
    const link = document.createElement("a"), blobUrl = URL.createObjectURL(new Blob(["\uFEFF", spikeBatchCsv(review)], { type: "text/csv;charset=utf-8" }));
    link.href = blobUrl; link.download = "matrix-spike-batch-audit.csv"; link.click(); setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  });
  root.querySelector("[data-spike-print]").addEventListener("click", () => { if (review?.calculated > 0) window.print(); });
  clear();
}
if (typeof document !== "undefined") document.querySelectorAll("[data-spike-batch]").forEach(mount);
