import { numberValue, setupForm, renderResult, clearResult } from "../form-utils.js";

// Pure record-reduction functions are exported for independently specified fixtures.
export const rainLimits = Object.freeze({ bytes: 5 * 1024 * 1024, rows: 100000, cells: 400000, stations: 30 });
const fail = message => { throw new Error(message); };
const finite = (value, label, min = 0, max = 1e9) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) fail(`${label} must be a finite number from ${min} to ${max}.`);
  return value;
};
const integer = (value, label, min, max) => {
  finite(value, label, min, max);
  if (!Number.isInteger(value)) fail(`${label} must be a whole number.`);
  return value;
};
const factor = unit => unit === "mm" ? 1 : unit === "in" ? 25.4 : fail("Choose mm or in as the source depth unit.");
const cellNumber = (value, label, allowMissing = true) => {
  if (value === "" || value === "NA") return allowMissing ? null : fail(`${label} is required; missing is not zero.`);
  if (!/^\+?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) fail(`${label} must be a nonnegative decimal number, blank or NA.`);
  const number = finite(Number(value), label);
  if ((number > 0 && number < 1e-12) || (number === 0 && /[1-9]/.test(value.split(/[eE]/)[0]))) fail(`${label}: nonzero values below 1e-12 are outside supported precision.`);
  return number;
};

export function parseRainCsv(text, expectedHeaders) {
  if (typeof text !== "string") fail("CSV must be text.");
  if (new TextEncoder().encode(text).length > rainLimits.bytes) fail("CSV exceeds the 5 MiB local limit.");
  const lines = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").replace(/\n+$/, "").split("\n");
  if (lines.length < 2 || !lines[0].trim()) fail("CSV needs a header and at least one data row.");
  if (lines.length - 1 > rainLimits.rows) fail("CSV exceeds 100,000 data rows.");
  const split = (line, row) => {
    if (!line.trim()) fail(`CSV row ${row} is blank; no interior row is skipped.`);
    if (line.includes('"')) fail(`CSV row ${row}: quoted fields are not supported; use plain comma-separated fields.`);
    return line.split(",").map(value => value.trim());
  };
  const headers = split(lines[0], 1);
  if (headers.length > 31 || new Set(headers).size !== headers.length || headers.some(x => !x)) fail("CSV has too many, empty or duplicate headers.");
  if (expectedHeaders && (headers.length !== expectedHeaders.length || headers.some((h, i) => h !== expectedHeaders[i]))) fail(`Use the exact header: ${expectedHeaders.join(",")}.`);
  if ((lines.length - 1) * headers.length > rainLimits.cells) fail("CSV exceeds 400,000 data cells.");
  const rows = lines.slice(1).map((line, i) => {
    const values = split(line, i + 2);
    if (values.length !== headers.length) fail(`CSV row ${i + 2} has ${values.length} cells; expected ${headers.length}.`);
    return values;
  });
  return { headers, rows };
}

export function parseRainTime(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(value);
  if (!m) fail(`Time ${value}: use YYYY-MM-DD HH:mm in one fixed-offset clock.`);
  const [year, month, day, hour, minute] = m.slice(1).map(Number);
  if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) fail(`Time ${value} is not a supported calendar minute.`);
  const stamp = Date.UTC(year, month - 1, day, hour, minute);
  const check = new Date(stamp);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) fail(`Time ${value} is not a real calendar date.`);
  return stamp / 60000;
}
const timeLabel = minute => new Date(minute * 60000).toISOString().slice(0, 16).replace("T", " ");
function series(csv, valueHeader, stepMinutes, unit) {
  integer(stepMinutes, "Expected step in minutes", 1, 1440);
  const toMm = factor(unit);
  const { rows } = parseRainCsv(csv, ["time", valueHeader]);
  let first, previous;
  return rows.map(([time, raw], i) => {
    const stamp = parseRainTime(time);
    if (i && stamp <= previous) fail(`CSV row ${i + 2}: times must increase strictly without duplicates.`);
    if (!i) first = stamp;
    if ((stamp - first) % stepMinutes !== 0) fail(`CSV row ${i + 2}: time is off the entered step grid.`);
    const value = cellNumber(raw, `CSV row ${i + 2} ${valueHeader}`);
    const record = { time, stamp, value: value === null ? null : value * toMm, elapsed: i ? stamp - previous : null };
    previous = stamp;
    return record;
  });
}

export function analyzeRainCounter({ csv, stepMinutes, unit }) {
  const source = series(csv, "counter", stepMinutes, unit);
  const minimumIncrementMm = 1e-12 * factor(unit);
  if (source.length < 2) fail("Provide a baseline and at least one later counter reading.");
  let acceptedMm = 0, valid = 0, validMinutes = 0, excludedMinutes = 0;
  const rows = source.slice(1).map((current, index) => {
    const previous = source[index];
    const rawDeltaMm = current.value === null || previous.value === null ? null : current.value - previous.value;
    let status;
    if (rawDeltaMm === null) status = "Missing endpoint";
    else if (rawDeltaMm < 0) status = "Unresolved reset/decrease";
    else if (current.elapsed !== stepMinutes) status = "Unallocated gap delta";
    else status = "Valid interval";
    if (status === "Valid interval" && rawDeltaMm > 0 && rawDeltaMm < minimumIncrementMm * (1 - 1e-12)) fail(`Interval ending ${current.time}: derived increment is below supported precision; review the original counter resolution.`);
    const rainfallMm = status === "Valid interval" ? rawDeltaMm : null;
    if (rainfallMm !== null) { acceptedMm += rainfallMm; valid++; validMinutes += current.elapsed; }
    else excludedMinutes += current.elapsed;
    return { time: current.time, counterMm: current.value, elapsed: current.elapsed, rawDeltaMm, rainfallMm, status };
  });
  return { sourceRows: source.length, first: source[0].time, last: source.at(-1).time, expectedIntervals: (source.at(-1).stamp - source[0].stamp) / stepMinutes, acceptedMm: valid ? acceptedMm : null, valid, validMinutes, excludedMinutes, rows, partial: valid !== rows.length };
}

export function counterIntervalRows(result, stepMinutes) {
  integer(stepMinutes, "Expected step in minutes", 1, 1440);
  const rows = result.rows.map(row => ({ time: row.time, rainfallMm: row.rainfallMm }));
  // Without this unknown anchor, a first-pair gap would silently shorten the
  // transferred observation window. Interior skipped times remain unexpanded.
  if (result.rows[0].elapsed > stepMinutes) rows.unshift({ time: timeLabel(parseRainTime(result.first) + stepMinutes), rainfallMm: null });
  return rows;
}

export function separateRainEvents({ csv, stepMinutes, dryGapMinutes, unit }) {
  integer(dryGapMinutes, "Chosen dry gap in minutes", stepMinutes, 10080);
  const source = series(csv, "rainfall", stepMinutes, unit);
  let active = null, dryMinutes = 0, observedMm = 0, valid = 0, missing = 0, skipped = 0;
  const events = [];
  const finish = rightUnknown => {
    if (!active) return;
    const duration = active.lastEnd - active.start;
    events.push({ ...active, id: events.length + 1, startTime: timeLabel(active.start), endTime: timeLabel(active.lastEnd), duration, meanMmHour: active.depthMm * 60 / duration, peakMmHour: active.peakMm * 60 / stepMinutes, rightUnknown });
    active = null;
  };
  for (const row of source) {
    if (row.elapsed !== null && row.elapsed > stepMinutes) {
      skipped += row.elapsed / stepMinutes - 1;
      finish(true); dryMinutes = 0;
    }
    if (row.value === null) { missing++; finish(true); dryMinutes = 0; continue; }
    valid++; observedMm += row.value;
    if (row.value === 0) {
      dryMinutes += stepMinutes;
      if (active && dryMinutes >= dryGapMinutes) finish(false);
      continue;
    }
    if (!active) active = { start: row.stamp - stepMinutes, lastEnd: row.stamp, depthMm: 0, peakMm: 0, wetIntervals: 0, leftUnknown: dryMinutes < dryGapMinutes };
    active.lastEnd = row.stamp;
    active.depthMm += row.value;
    active.peakMm = Math.max(active.peakMm, row.value);
    active.wetIntervals++;
    dryMinutes = 0;
  }
  finish(true);
  return { sourceRows: source.length, first: source[0].time, last: source.at(-1).time, observedMm: valid ? observedMm : null, valid, missing, skipped, expectedIntervals: source.length + skipped, events, bounded: events.filter(e => !e.leftUnknown && !e.rightUnknown).length };
}

const safePeriod = (value, row) => {
  if (!/^[A-Za-z0-9][A-Za-z0-9 _.:\-]{0,63}$/.test(value)) fail(`CSV row ${row}: period must be a safe nonempty label, at most 64 characters.`);
  return value;
};
const stationId = value => {
  if (!/^[A-Za-z][A-Za-z0-9_\-]{0,31}$/.test(value)) fail(`Station ${value}: use a letter followed by letters, digits, underscore or hyphen; maximum 32 characters.`);
  return value;
};
function uniquePeriods(rows) {
  const seen = new Set();
  rows.forEach((r, i) => { safePeriod(r[0], i + 2); if (seen.has(r[0])) fail(`CSV row ${i + 2}: duplicate period ${r[0]}.`); seen.add(r[0]); });
}

export function checkRainDoubleMass({ csv, splitAfter, unit }) {
  const toMm = factor(unit);
  const { rows: raw } = parseRainCsv(csv, ["period", "target", "reference"]);
  if (raw.length < 4) fail("Double-mass review needs at least four period rows.");
  integer(splitAfter, "Rows before selected split", 2, raw.length - 2);
  uniquePeriods(raw);
  let targetMm = 0, referenceMm = 0, paired = 0;
  const segments = [{ targetMm: 0, referenceMm: 0, count: 0 }, { targetMm: 0, referenceMm: 0, count: 0 }];
  const rows = raw.map(([period, a, b], i) => {
    const t = cellNumber(a, `Row ${i + 2} target`), r = cellNumber(b, `Row ${i + 2} reference`);
    const usable = t !== null && r !== null;
    const segment = segments[i < splitAfter ? 0 : 1];
    if (usable) {
      targetMm += t * toMm; referenceMm += r * toMm; paired++;
      segment.targetMm += t * toMm; segment.referenceMm += r * toMm; segment.count++;
    }
    return { period, targetMm: t === null ? null : t * toMm, referenceMm: r === null ? null : r * toMm, usable, segment: i < splitAfter ? 1 : 2, cumulativeTargetMm: targetMm, cumulativeReferenceMm: referenceMm };
  });
  segments.forEach(s => { s.ratio = s.count >= 2 && s.referenceMm > 0 ? s.targetMm / s.referenceMm : null; });
  const [early, late] = segments;
  const relativeChange = early.ratio !== null && late.ratio !== null && early.ratio > 0 ? 100 * (late.ratio / early.ratio - 1) : null;
  return { sourceRows: raw.length, first: raw[0][0], last: raw.at(-1)[0], targetMm, referenceMm, paired, excluded: raw.length - paired, segments, relativeChange, rows };
}

export function calculateArealRainfall({ weightsCsv, csv, unit }) {
  const toMm = factor(unit);
  const { rows: weightsRaw } = parseRainCsv(weightsCsv, ["station", "weightPercent"]);
  if (weightsRaw.length < 2 || weightsRaw.length > rainLimits.stations) fail("Use 2–30 stations in the fixed network.");
  const ids = new Set();
  let weightSum = 0;
  const weights = weightsRaw.map(([id, text], i) => {
    stationId(id);
    if (ids.has(id)) fail(`Duplicate station ${id}.`);
    ids.add(id);
    const weightPercent = cellNumber(text, `Weight row ${i + 2}`, false);
    if (!(weightPercent > 0)) fail(`Station ${id} weight must be greater than zero.`);
    weightSum += weightPercent;
    return { id, weightPercent };
  });
  if (Math.abs(weightSum - 100) > 0.000001) fail("Fixed-network weights must sum to 100% within 0.000001 percentage point. Do not normalize an incomplete network.");
  weights.forEach(w => { w.fraction = w.weightPercent / weightSum; });
  const { headers, rows: raw } = parseRainCsv(csv);
  if (headers[0] !== "period" || headers.length !== ids.size + 1 || headers.slice(1).some(id => !ids.has(id))) fail("Use period followed by exactly the same station IDs as the weight table.");
  uniquePeriods(raw);
  const indices = new Map(headers.map((id, i) => [id, i]));
  let complete = 0, empty = 0;
  const rows = raw.map((values, rowIndex) => {
    let fraction = 0, contributionMm = 0, observedStations = 0;
    const missingStations = [];
    for (const w of weights) {
      const value = cellNumber(values[indices.get(w.id)], `Row ${rowIndex + 2} ${w.id}`);
      if (value === null) { missingStations.push(w.id); continue; }
      observedStations++;
      fraction += w.fraction; contributionMm += w.fraction * value * toMm;
    }
    const isComplete = missingStations.length === 0;
    if (isComplete) complete++;
    if (observedStations === 0) empty++;
    return { period: values[0], complete: isComplete, meanMm: isComplete ? contributionMm : null, coveragePercent: fraction * 100, contributionMm: observedStations ? contributionMm : null, missingStations, observedStations };
  });
  return { sourceRows: raw.length, first: raw[0][0], last: raw.at(-1)[0], weights, weightSum, complete, incomplete: raw.length - complete, empty, rows };
}

export const rainExamples = Object.freeze({
  counter: "time,counter\n2026-10-01 00:00,0\n2026-10-01 01:00,1\n2026-10-01 02:00,3\n2026-10-01 03:00,0\n2026-10-01 04:00,2",
  events: "time,rainfall\n2026-10-01 00:00,0\n2026-10-01 01:00,0\n2026-10-01 02:00,2\n2026-10-01 03:00,1\n2026-10-01 04:00,0\n2026-10-01 05:00,0\n2026-10-01 06:00,4\n2026-10-01 07:00,0\n2026-10-01 08:00,0",
  mass: "period,target,reference\n2020,10,10\n2021,20,20\n2022,30,30\n2023,15,10\n2024,30,20\n2025,45,30",
  weights: "station,weightPercent\nA,20\nB,30\nC,50",
  areal: "period,A,B,C\nEvent-1,10,20,30\nEvent-2,0,0,0\nEvent-3,NA,5,NA"
});

// UI is mounted below; the scientific functions above do not depend on the DOM.
const esc = text => String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const fmt = value => value === null ? "Not observed" : value === 0 ? "0" : Math.abs(value) < 0.00001 || Math.abs(value) >= 1e7 ? value.toExponential(5) : String(Number(value.toPrecision(9)));
const coverage = value => value < 100 && fmt(value) === "100" ? "<100" : fmt(value);
const csvCell = value => value === null || value === undefined ? "NA" : /[,"\r\n]/.test(String(value)) ? `"${String(value).replaceAll('"', '""')}"` : String(value);
const toCsv = (headers, rows) => [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
const resultTable = (headers, rows, label) => `<p class="hint">${rows.length > 100 ? `Preview: first 100 of ${rows.length} rows. Download CSV for every row; calculations use the full input.` : `All ${rows.length} output rows are shown.`}</p><div class="table-scroll" role="region" aria-label="${esc(label)}" tabindex="0" style="--table-min-width:760px"><table><thead><tr>${headers.map(h => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.slice(0, 100).map(row => `<tr>${row.map(v => `<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

export function sampleRainPlotRows(rows, limit = 500) {
  if (!Array.isArray(rows)) fail("Plot rows must be an array.");
  integer(limit, "Plot point cap", 2, 500);
  if (rows.length <= limit) return rows;
  return Array.from({ length: limit }, (_, i) => rows[Math.round(i * (rows.length - 1) / (limit - 1))]);
}

function massPlot(result, unit) {
  if (!result.paired) return "<p>No paired observations to plot.</p>";
  const usable = result.rows.filter(r => r.usable);
  const selected = sampleRainPlotRows(usable);
  const maxX = result.referenceMm || 1, maxY = result.targetMm || 1;
  const point = (x, y) => `${(72 + x / maxX * 518).toFixed(2)},${(262 - y / maxY * 220).toFixed(2)}`;
  const split = result.segments[0];
  const [cx, cy] = point(split.referenceMm, split.targetMm).split(",");
  return `<figure class="rain-figure"><div class="rain-chart-region" role="region" aria-label="Double-mass cumulative relation chart" tabindex="0"><svg data-rain-plotted-pairs="${selected.length}" viewBox="0 0 640 320" role="img" aria-labelledby="rain-chart-title rain-chart-description"><title id="rain-chart-title">Paired-period double-mass relation</title><desc id="rain-chart-description">Reference accumulation on x, target accumulation on y. The circle marks the entered split. Only usable pairs are accumulated; no missing observation is replaced.</desc><path d="M72 38V262H598" fill="none" stroke="#627b85" stroke-width="2"/><polyline points="${point(0, 0)} ${selected.map(r => point(r.cumulativeReferenceMm, r.cumulativeTargetMm)).join(" ")}" fill="none" stroke="#123e50" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="6" fill="#b45a2b"/><text x="70" y="281">0</text><text x="548" y="281">${esc(fmt(result.referenceMm / factor(unit)))}</text><text x="36" y="43">${esc(fmt(result.targetMm / factor(unit)))}</text><text x="220" y="309">Cumulative reference (${unit})</text><text transform="translate(18 240) rotate(-90)">Cumulative target (${unit})</text></svg></div><figcaption>Descriptive paired-only accumulation; circle = chosen split. ${usable.length > 500 ? "Chart thinned to at most 500 points; all rows remain in calculations/export." : "All paired points are plotted."} No correction or statistical-change test is applied.</figcaption></figure>`;
}

function mountRain(form) {
  const kind = form.dataset.toolForm;
  const error = form.querySelector("[data-form-error]");
  const fileStatus = form.querySelector("[data-rain-file-status]");
  const runButton = form.querySelector('[type="submit"]');
  let generation = 0, fileSerial = 0, exports = [];
  const pendingFiles = new Map();
  const invalidate = () => {
    generation++; pendingFiles.clear(); exports = []; clearResult(form);
    runButton.disabled = false;
    fileStatus.textContent = "";
    error.textContent = "";
  };
  const finish = (result, report, headers, tableRows, exportRows, extra = "", secondary = null) => {
    const unit = form.elements.depthUnit.value;
    const settings = [
      `Source depth unit: ${unit} (values were not auto-converted on selection).`,
      `Source rows: ${result.sourceRows}; first: ${result.first}; last: ${result.last}.`,
      form.elements.stepMinutes ? `Interval ends; step: ${form.elements.stepMinutes.value} min; clock: one supplied fixed offset, no timezone/DST inference.` : "Periods remain in supplied order; matching period durations/reference/network are the operator's responsibility.",
      form.elements.dryGapMinutes ? `Chosen observed dry gap: ${form.elements.dryGapMinutes.value} min; all positive depths retained.` : "",
      form.elements.splitAfter ? `Split after original input row: ${form.elements.splitAfter.value}, including excluded rows.` : "",
      kind === "rain-counter" ? "An initial transfer gap is anchored with NA at the first expected interval end; this is not a measured reading." : "",
      result.weights ? `Fixed weights: ${result.weights.map(w => `${w.id}=${w.weightPercent}%`).join("; ")}. Entered sum ${result.weightSum}%; only sub-tolerance rounding normalized.` : "",
      "Print contains bounded input/result previews. Copy includes the full entered CSV. CSV downloads retain every output row.",
      `Tool: ${form.ownerDocument.querySelector('link[rel="canonical"]').href}`
    ].filter(Boolean).join("\n");
    exports = [{ name: `wsb-${kind}-audit.csv`, text: toCsv(headers, exportRows) }];
    if (secondary) exports.push(secondary);
    renderResult(form, { ...report, warning: "Data review only: no automatic rainfall correction, gauge certification, universal event definition, forecast or drainage-design approval. Retain original observations and field context." });
    const reportNode = form.closest(".tool-layout").querySelector(".result-report");
    reportNode.querySelector("[data-rain-extra]")?.remove();
    const block = document.createElement("section");
    block.className = "rain-result-extra";
    block.dataset.rainExtra = "";
    block.innerHTML = `<h3>Input record & review basis</h3><pre class="rain-input-record">${esc(settings)}</pre>${extra}<h3>Period / interval review</h3>${resultTable(headers, tableRows, "Rainfall record review output")}<div class="button-row rain-downloads">${exports.map((item, i) => `<button type="button" class="button secondary small" data-result-action data-rain-export="${i}">${i === 0 ? "Download audit CSV" : "Download interval input CSV"}</button>`).join("")}</div>`;
    reportNode.append(block);
    const printInputs = document.createElement("section");
    printInputs.className = "rain-print-inputs";
    printInputs.innerHTML = `<h3>Entered input values — bounded CSV previews</h3><p>Headers and at most100 entered data rows per field are printed below. This is not a complete large-file record; keep the original source and full copied/exported packet.</p>${[...form.querySelectorAll("textarea")].map(field => `<h4>${esc(field.labels?.[0]?.textContent || field.id)}</h4><pre>${esc(field.value.replace(/\r\n?/g, "\n").split("\n").slice(0, 101).join("\n"))}</pre>`).join("")}`;
    block.append(printInputs);
    fileStatus.textContent = `Review ready below: ${result.sourceRows} source rows. Keep the input basis and unknown-data flags with the result.`;
    const entered = [...form.querySelectorAll("textarea")].map(field => `${field.id}:\n${field.value}`).join("\n\n");
    form.dataset.lastResult = `${form.ownerDocument.title}\n${settings}\n\n${reportNode.innerText}\n\nFull entered CSV (local record):\n${entered}`;
  };

  setupForm(form, () => {
    generation++; pendingFiles.clear(); runButton.disabled = false; exports = []; fileStatus.textContent = "";
    const unit = form.elements.depthUnit.value, divisor = factor(unit);
    const d = value => value === null ? null : value / divisor;
    const depth = value => fmt(d(value));
    const input = form.elements.records.value;
    const n = name => numberValue(form, name, { max: name === "splitAfter" ? rainLimits.rows : 10080 });
    if (kind === "rain-counter") {
      const r = analyzeRainCounter({ csv: input, stepMinutes: n("stepMinutes"), unit });
      const headers = ["Interval end", `Counter (${unit})`, "Elapsed min", `Raw delta (${unit})`, `Accepted depth (${unit})`, "Status"];
      const rows = r.rows.map(x => [x.time, depth(x.counterMm), x.elapsed, depth(x.rawDeltaMm), depth(x.rainfallMm), x.status]);
      const raw = r.rows.map(x => [x.time, d(x.counterMm), x.elapsed, d(x.rawDeltaMm), d(x.rainfallMm), x.status]);
      finish(r, { label: "Accepted interval depth — not reconstructed total", primary: `${depth(r.acceptedMm)}${r.acceptedMm === null ? "" : `<span class="reading-unit"> ${unit}</span>`}`, supporting: [`Valid intervals: ${r.valid} / ${r.expectedIntervals} expected intervals across the source window.`, `Valid interval time: ${r.validMinutes} min; unresolved time: ${r.excludedMinutes} min.`, r.partial ? "Partial record: excluded depth remains unknown, not zero." : "Every post-baseline pair has a valid interval delta."], interpretation: "Review decreases, missing endpoints and skipped steps with the original logger/maintenance record. Never assume the new counter value is the rain that fell during a reset." }, headers, rows, raw, "", { name: "wsb-rainfall-interval-input.csv", text: toCsv(["time", "rainfall"], counterIntervalRows(r, n("stepMinutes")).map(x => [x.time, d(x.rainfallMm)])) });
    } else if (kind === "rain-events") {
      const r = separateRainEvents({ csv: input, stepMinutes: n("stepMinutes"), dryGapMinutes: n("dryGapMinutes"), unit });
      const headers = ["Fragment", "Wet start", "Last wet end", `Observed depth (${unit})`, "Duration min", `Mean (${unit}/h)`, `Peak interval (${unit}/h)`, "Boundary evidence"];
      const state = x => `${x.leftUnknown ? "Left unknown" : "Left dry gap observed"}; ${x.rightUnknown ? "right unknown" : "right dry gap observed"}`;
      const rows = r.events.map(x => [x.id, x.startTime, x.endTime, depth(x.depthMm), x.duration, depth(x.meanMmHour), depth(x.peakMmHour), state(x)]);
      const raw = r.events.map(x => [x.id, x.startTime, x.endTime, d(x.depthMm), x.duration, d(x.meanMmHour), d(x.peakMmHour), state(x)]);
      finish(r, { label: "Identified wet fragments / events", primary: `${r.events.length}<span class="reading-unit"> (${r.bounded} bounded)</span>`, supporting: [`Observed depth across known intervals: ${depth(r.observedMm)}${r.observedMm === null ? "" : ` ${unit}`}.`, `Known intervals: ${r.valid}; missing rows: ${r.missing}; skipped intervals: ${r.skipped}.`, `Observed interval coverage: ${fmt(100 * r.valid / r.expectedIntervals)}%. Unknown intervals do not count as dry.`], interpretation: "Only fragments bounded on both sides have the chosen observed dry gap at each edge. Compare dry-gap scenarios without interpreting unknown fragments as complete independent storms." }, headers, rows, raw);
    } else if (kind === "rain-mass") {
      const r = checkRainDoubleMass({ csv: input, splitAfter: n("splitAfter"), unit });
      const headers = ["Period", `Target (${unit})`, `Reference (${unit})`, "Segment", "Pair", `Cum reference (${unit})`, `Cum target (${unit})`];
      const rows = r.rows.map(x => [x.period, depth(x.targetMm), depth(x.referenceMm), x.segment, x.usable ? "Used" : "Excluded: missing member", depth(x.cumulativeReferenceMm), depth(x.cumulativeTargetMm)]);
      const raw = r.rows.map(x => [x.period, d(x.targetMm), d(x.referenceMm), x.segment, x.usable ? "Used" : "Excluded: missing member", d(x.cumulativeReferenceMm), d(x.cumulativeTargetMm)]);
      finish(r, { label: "Segment ratio change — descriptive only", primary: r.relativeChange === null ? "Not assessed" : `${r.relativeChange > 0 ? "+" : ""}${fmt(r.relativeChange)}<span class="reading-unit"> %</span>`, supporting: [`Early ratio: ${r.segments[0].ratio === null ? "Not assessed" : fmt(r.segments[0].ratio)} (${r.segments[0].count} usable pairs).`, `Late ratio: ${r.segments[1].ratio === null ? "Not assessed" : fmt(r.segments[1].ratio)} (${r.segments[1].count} usable pairs).`, `Paired-only totals: target ${r.paired ? depth(r.targetMm) : "Not observed"}, reference ${r.paired ? depth(r.referenceMm) : "Not observed"} ${unit}. Used ${r.paired}; excluded ${r.excluded}.`], interpretation: "Reference quality, chronology and the selected split control interpretation. A descriptive ratio change is not a significant change test, a cause diagnosis or an instruction to correct either series." }, headers, rows, raw, massPlot(r, unit));
    } else if (kind === "rain-areal") {
      const r = calculateArealRainfall({ weightsCsv: form.elements.weights.value, csv: input, unit });
      const headers = ["Period", `Full-basin mean (${unit})`, "Available weight (%)", `Known contribution (${unit})`, "Missing stations", "Status"];
      const state = x => x.complete ? "Complete entered network" : x.observedStations ? "Incomplete: no basin mean" : "No observations";
      const rows = r.rows.map(x => [x.period, depth(x.meanMm), coverage(x.coveragePercent), depth(x.contributionMm), x.missingStations.join(", ") || "None", state(x)]);
      const raw = r.rows.map(x => [x.period, d(x.meanMm), x.coveragePercent, d(x.contributionMm), x.missingStations.join("; ") || "None", state(x)]);
      finish(r, { label: "Periods with a full-network areal mean", primary: `${r.complete}<span class="reading-unit"> / ${r.sourceRows}</span>`, supporting: [`Incomplete periods: ${r.incomplete}; periods with no observations: ${r.empty}.`, `Fixed network: ${r.weights.length} stations. Missing weights are not reassigned.`, "A known weighted contribution is not an estimate for the missing part of the basin."], interpretation: "Verify the physical basin/station weights and matched observation periods. No network mean is reported for an incomplete period, even if the displayed available percentage is very close to 100%." }, headers, rows, raw);
    } else fail("Unknown rainfall tool.");
  }, { afterReset: invalidate });

  form.addEventListener("reset", invalidate);
  form.addEventListener("input", event => { if (event.target.type !== "file") invalidate(); });
  form.addEventListener("change", event => { if (event.target.type !== "file") invalidate(); });
  form.querySelectorAll("[data-rain-file]").forEach(field => field.addEventListener("change", async () => {
    const file = field.files?.[0];
    field.value = ""; // A later selection of the same file must still fire change.
    exports = []; clearResult(form); error.textContent = "";
    if (!file) return;
    const thisGeneration = generation;
    const serial = ++fileSerial;
    pendingFiles.set(field, serial);
    const current = () => generation === thisGeneration && pendingFiles.get(field) === serial;
    runButton.disabled = true;
    fileStatus.textContent = "Reading locally. No file is uploaded.";
    try {
      if (file.size > rainLimits.bytes) fail("Choose a local CSV no larger than 5 MiB.");
      const text = await file.text();
      if (!current()) return;
      form.elements[field.dataset.rainFile].value = text;
      clearResult(form); exports = [];
      fileStatus.textContent = "File read locally. Review the text, then analyze.";
    } catch (problem) {
      if (current()) { error.textContent = problem.message; fileStatus.textContent = "File not loaded; previous input text is unchanged. No result remains exportable."; }
    } finally {
      if (current()) { pendingFiles.delete(field); runButton.disabled = pendingFiles.size > 0; if (pendingFiles.size) fileStatus.textContent = "Another file is still being read locally. No file is uploaded."; }
    }
  }));
  form.closest(".tool-layout").addEventListener("click", event => {
    const button = event.target.closest("[data-rain-export]");
    if (!button || button.disabled || !form.dataset.lastResult) return;
    const file = exports[Number(button.dataset.rainExport)];
    if (!file) return;
    const url = URL.createObjectURL(new Blob([file.text], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = file.name; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  // Native HTML has no successful named controls and keeps Analyze disabled.
  // Enable only after the local handlers are installed; script-off/failure
  // cannot turn a CSV or configuration into a normal form submission.
  runButton.disabled = false;
  fileStatus.textContent = "Ready for local analysis. No input is submitted to a server.";
}

if (typeof document !== "undefined") document.querySelectorAll('[data-tool-form^="rain-"]').forEach(mountRain);
