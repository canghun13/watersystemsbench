import { numberValue, renderResult, clearResult, setupForm } from "../form-utils.js";
import { formatNumber } from "../unit-conversions.js";

const finite = (n, label, positive = false) => {
  if (!Number.isFinite(n) || n < 0 || n > 1e12 || (positive && n < 1e-9)) throw new Error(`${label} must be ${positive ? "at least 1e-9" : "zero or greater"} and no more than 1e12.`);
  return n;
};
const numeric = (s, label) => {
  if (typeof s !== "string" || !/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(s.trim())) throw new Error(`${label} must be a nonnegative number.`);
  return finite(Number(s), label);
};
const esc = s => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const fmt = n => n == null ? "Not calculated" : formatNumber(n, 4);

export function parseLabCsv(text, columns) {
  if (typeof text !== "string" || !text.trim()) throw new Error("Paste CSV rows or choose a local CSV file.");
  if (text.length > 262144) throw new Error("Use a CSV no larger than 256 KiB.");
  const lines = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  if (lines.length > 251) throw new Error("Use at most 250 data rows per review.");
  if (lines[0].split(",").map(s => s.trim()).join(",") !== columns.join(",")) throw new Error(`Use this exact CSV header: ${columns.join(",")}`);
  if (lines.length < 2) throw new Error("Enter at least one data row after the header.");
  return lines.slice(1).map((line, i) => {
    const cells = line.split(",").map(s => s.trim());
    if (cells.length !== columns.length || cells.some(s => !s) || cells.some(s => /["\r\n]/.test(s))) throw new Error(`CSV row ${i + 2}: enter all ${columns.length} cells; quoted/comma-containing labels are not supported.`);
    if (cells[0].length > 80) throw new Error(`CSV row ${i + 2}: labels must be at most 80 characters.`);
    return Object.fromEntries(columns.map((key, j) => [key, cells[j]]));
  });
}

export function analyzeBod({ mode, bottleMl, minimumDepletion, minimumFinalDo, samples, controls = [], waterInitial = 0, waterFinal = 0 }) {
  if (!["none", "direct", "water"].includes(mode)) throw new Error("Choose a supported seeding mode.");
  finite(bottleMl, "Bottle volume", true); finite(minimumDepletion, "Minimum depletion"); finite(minimumFinalDo, "Minimum final DO");
  if (!Array.isArray(samples) || !samples.length || samples.length > 250) throw new Error("Enter 1–250 sample bottles.");
  const depletion = (row, label) => {
    finite(row.initialDo, `${label} initial DO`); finite(row.finalDo, `${label} final DO`);
    if (row.finalDo > row.initialDo) throw new Error(`${label}: final DO cannot exceed initial DO in this depletion model.`);
    return row.initialDo - row.finalDo;
  };
  const eligible = (d, final) => d >= minimumDepletion && final >= minimumFinalDo;
  let unitDemand = null;
  let seedRows = [];
  let waterDepletion = 0;
  if (mode === "direct") {
    if (!Array.isArray(controls) || !controls.length || controls.length > 250) throw new Error("Direct seeding requires 1–250 seed-control bottles.");
    seedRows = controls.map((r, i) => {
      const d = depletion(r, `Seed control ${i + 1}`);
      finite(r.seedMl, "Control seed volume", true);
      if (r.seedMl > bottleMl) throw new Error(`Seed control ${i + 1}: seed volume exceeds bottle volume.`);
      return { ...r, depletion: d, used: eligible(d, r.finalDo), perMl: d / r.seedMl };
    });
    const used = seedRows.filter(r => r.used);
    if (used.length) unitDemand = used.reduce((s, r) => s + r.perMl, 0) / used.length;
  } else if (mode === "water") {
    waterDepletion = depletion({ initialDo: waterInitial, finalDo: waterFinal }, "Seeded-water control");
    if (!eligible(waterDepletion, waterFinal)) unitDemand = null;
    else unitDemand = waterDepletion / bottleMl;
  }
  const rows = samples.map((r, i) => {
    finite(r.sampleMl, `Bottle ${i + 1} sample volume`, true); finite(r.seedMl, `Bottle ${i + 1} seed volume`);
    if (r.sampleMl > bottleMl || (mode === "direct" && r.sampleMl + r.seedMl > bottleMl)) throw new Error(`Bottle ${i + 1}: sample plus applicable seed must fit the bottle.`);
    if (mode === "direct" && r.seedMl === 0) throw new Error(`Bottle ${i + 1}: direct seeding requires positive seed volume.`);
    if (mode !== "direct" && r.seedMl !== 0) throw new Error(`Bottle ${i + 1}: enter zero direct seed in unseeded or seeded-water mode.`);
    const d = depletion(r, `Bottle ${i + 1}`);
    const correction = mode === "none" ? 0 : unitDemand == null ? null : mode === "direct" ? unitDemand * r.seedMl : unitDemand * (bottleMl - r.sampleMl);
    const reasons = [];
    if (d < minimumDepletion) reasons.push("Depletion below entered minimum");
    if (r.finalDo < minimumFinalDo) reasons.push("Final DO below entered minimum");
    if (correction == null) reasons.push("No qualifying seed control");
    else if (correction > d + 1e-12) reasons.push("Seed correction exceeds sample depletion");
    const used = reasons.length === 0;
    return { ...r, depletion: d, correction, fraction: r.sampleMl / bottleMl, used, reason: used ? "Entered numeric checks met" : reasons.join("; "), bod: used ? Math.max(0, d - correction) * bottleMl / r.sampleMl : null };
  });
  return { rows, seedRows, unitDemand, eligible: rows.filter(r => r.used).length };
}

export function computeSolids({ tareMg, dryMg, ashMg, blankLossMg, volumeMl, minimumResidueMg }) {
  [tareMg, dryMg, ashMg, blankLossMg, minimumResidueMg].forEach(n => finite(n, "Mass")); finite(volumeMl, "Filtered volume", true);
  if (dryMg < tareMg || ashMg < tareMg || ashMg > dryMg) throw new Error("Mass order must be tare ≤ ignited filter + ash ≤ dried filter + residue.");
  const dryMass = dryMg - tareMg;
  const volatileMass = dryMg - ashMg - blankLossMg;
  if (volatileMass < -1e-9 || volatileMass > dryMass + 1e-9) throw new Error("Blank-corrected volatile mass must be between zero and the dry residue mass.");
  const volatile = Math.max(0, Math.min(dryMass, volatileMass));
  return { dryMass, volatileMass: volatile, fixedMass: dryMass - volatile, tss: dryMass * 1000 / volumeMl, vss: volatile * 1000 / volumeMl, fixed: (dryMass - volatile) * 1000 / volumeMl, fraction: dryMass === 0 ? null : 100 * volatile / dryMass, massMet: dryMass + 1e-9 >= minimumResidueMg };
}

export function checkDuplicates({ rows, maximumRpd, minimumRlMultiple, absoluteLimit }) {
  finite(maximumRpd, "RPD limit"); finite(minimumRlMultiple, "RL multiplier"); finite(absoluteLimit, "Absolute difference limit");
  if (!Array.isArray(rows) || !rows.length || rows.length > 250) throw new Error("Enter 1–250 duplicate rows.");
  return rows.map((row, i) => {
    const rl = numeric(String(row.reportingLimit), `Row ${i + 2} reporting limit`);
    const parse = s => {
      const raw = String(s).trim();
      return { censored: raw.startsWith("<"), value: numeric(raw.replace(/^</, ""), `Row ${i + 2} result`) };
    };
    const a = parse(row.result), b = parse(row.duplicate);
    if (a.censored || b.censored) return { ...row, mean: null, difference: null, rpd: null, mode: "Censored — no substitution", status: "Not assessed" };
    const mean = (a.value + b.value) / 2, difference = Math.abs(a.value - b.value);
    const rpd = mean === 0 ? null : difference / mean * 100;
    const low = minimumRlMultiple > 0 && (a.value < rl * minimumRlMultiple || b.value < rl * minimumRlMultiple || mean === 0);
    if (!low && rpd == null) return { ...row, mean, difference, rpd, mode: "Zero mean", status: "Not assessed" };
    return { ...row, mean, difference, rpd, mode: low ? "Absolute difference" : "RPD", status: (low ? difference <= absoluteLimit + 1e-12 : rpd <= maximumRpd + 1e-12) ? "Within entered limit" : "Exceeds entered limit" };
  });
}

export function computeSpike({ mode, native, spiked, added, sampleMl, spikeMl, stock, lower, upper }) {
  finite(native, "Native concentration"); finite(spiked, "Spiked concentration"); finite(lower, "Lower recovery limit"); finite(upper, "Upper recovery limit");
  if (lower > upper) throw new Error("Lower recovery limit cannot exceed upper limit.");
  let nativeFinal = native, addedFinal, volumeIncrease = 0;
  if (mode === "basis") addedFinal = finite(added, "Added concentration", true);
  else if (mode === "volume") {
    finite(sampleMl, "Sample volume", true); finite(spikeMl, "Spike volume", true); finite(stock, "Stock concentration", true);
    const total = sampleMl + spikeMl;
    nativeFinal = native * sampleMl / total;
    addedFinal = stock * spikeMl / total;
    volumeIncrease = 100 * spikeMl / sampleMl;
  } else throw new Error("Choose a supported spike basis.");
  const recovery = 100 * (spiked - nativeFinal) / addedFinal;
  const expected = nativeFinal + addedFinal;
  if (![recovery, expected, nativeFinal, addedFinal].every(Number.isFinite)) throw new Error("The inputs exceed finite numerical precision; use a better-scaled basis.");
  return { recovery, expected, nativeFinal, addedFinal, volumeIncrease, within: recovery >= lower - 1e-10 && recovery <= upper + 1e-10 };
}

function table(headers, rows, label) {
  return `<p class="hint">Scroll sideways for all columns. Keyboard: focus the table region, then use the left/right arrow keys.</p><div class="table-scroll" role="region" tabindex="0" aria-label="${esc(label)}" style="--table-min-width: 690px;"><table><thead><tr>${headers.map(h => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function report(form, data, detail = "") {
  renderResult(form, data);
  const panel = form.closest(".tool-layout").querySelector(".result-report");
  panel.querySelector("[data-lab-details]")?.remove();
  const block = document.createElement("div");
  block.className = "result-block"; block.dataset.labDetails = "";
  const record = Array.from(form.elements).filter(e => e.name && !e.disabled && e.type !== "file" && !e.closest("[hidden]")).map(e => [e.labels?.[0]?.textContent?.trim() || e.name, e.tagName === "SELECT" ? e.selectedOptions[0]?.textContent : e.value]);
  block.innerHTML = `${detail}<h3>Input record</h3><dl class="lab-record-grid">${record.map(([key, value]) => { const wide = value.includes("\n") ? "lab-record-wide" : ""; return `<dt class="${wide}">${esc(key)}</dt><dd class="lab-input-record ${wide}">${esc(value)}</dd>`; }).join("")}</dl><p>${esc(window.location.href.split("?")[0])}</p>`;
  panel.querySelector("[data-interpretation]").closest(".result-block").before(block);
  form.dataset.lastResult = `${document.title}\n${panel.innerText}`;
}

function syncModes(form) {
  const mode = form.elements.mode?.value;
  form.querySelectorAll("[data-lab-mode]").forEach(group => {
    const shown = group.dataset.labMode.split(" ").includes(mode);
    group.hidden = !shown;
    group.querySelectorAll("input,select,textarea").forEach(field => { field.disabled = !shown; });
  });
}

function mount(form) {
  const kind = form.dataset.toolForm;
  const n = name => numberValue(form, name, { max: 1e12 });
  const warning = "Arithmetic review only. Follow your current approved method, SOP and qualified laboratory review. This is not a valid-analysis, potable-safety or regulatory-reporting decision.";
  let fileGeneration = 0;
  form.addEventListener("reset", () => { fileGeneration++; });
  setupForm(form, () => {
    if (kind === "lab-bod") {
      const mode = form.elements.mode.value;
      const samples = parseLabCsv(form.elements.samples.value, ["bottle", "sampleMl", "initialDo", "finalDo", "seedMl"]).map((r, i) => ({ bottle: r.bottle, ...Object.fromEntries(["sampleMl", "initialDo", "finalDo", "seedMl"].map(k => [k, numeric(r[k], `Sample row ${i + 2} ${k}`)])) }));
      const controls = mode === "direct" ? parseLabCsv(form.elements.controls.value, ["control", "initialDo", "finalDo", "seedMl"]).map((r, i) => ({ control: r.control, ...Object.fromEntries(["initialDo", "finalDo", "seedMl"].map(k => [k, numeric(r[k], `Control row ${i + 2} ${k}`)])) })) : [];
      const r = analyzeBod({ mode, bottleMl: n("bottleMl"), minimumDepletion: n("minimumDepletion"), minimumFinalDo: n("minimumFinalDo"), samples, controls, waterInitial: mode === "water" ? n("waterInitial") : 0, waterFinal: mode === "water" ? n("waterFinal") : 0 });
      report(form, { label: "Bottles meeting entered numeric checks", primary: `${r.eligible}<span class="reading-unit"> / ${r.rows.length}</span>`, supporting: [`Label: ${esc(form.elements.methodLabel.value)}; seeding mode: ${esc(mode)}.`, `Seed-control unit demand: ${fmt(r.unitDemand)}${mode === "direct" ? " mg/L per mL seed" : mode === "water" ? " mg/L per mL seeded water" : " (not used)"}.`, "No automatic average: bottle labels may represent different samples."], interpretation: "Retain every excluded row and review the full method controls, sample identity and dilution basis before using any concentration.", warning }, (r.seedRows.length ? `<h3>Seed-control review</h3>${table(["Control", "Depletion mg/L", "Per mL seed", "Used in average"], r.seedRows.map(x => [x.control, fmt(x.depletion), fmt(x.perMl), x.used ? "Yes" : "No — entered DO check not met"]), "Seed control results")}` : "") + `<h3>Sample-bottle review</h3>${table(["Bottle", "Calculated mg/L", "Numeric review", "Depletion mg/L", "Seed correction mg/L", "Sample fraction"], r.rows.map(x => [x.bottle, fmt(x.bod), x.reason, fmt(x.depletion), fmt(x.correction), fmt(x.fraction)]), "BOD sample bottle results")}`);
    } else if (kind === "lab-solids") {
      const massFactor = form.elements.massUnit.value === "g" ? 1000 : 1;
      const volumeFactor = form.elements.volumeUnit.value === "L" ? 1000 : 1;
      const r = computeSolids({ tareMg: n("tare") * massFactor, dryMg: n("dry") * massFactor, ashMg: n("ash") * massFactor, blankLossMg: n("blank") * massFactor, volumeMl: n("volume") * volumeFactor, minimumResidueMg: n("minimumResidue") * massFactor });
      report(form, { label: "TSS concentration", primary: `${fmt(r.tss)}<span class="reading-unit"> mg/L</span>`, supporting: [`VSS: ${fmt(r.vss)} mg/L; fixed suspended fraction: ${fmt(r.fixed)} mg/L.`, `Dry residue: ${fmt(r.dryMass)} mg; corrected ignition loss: ${fmt(r.volatileMass)} mg; fixed mass: ${fmt(r.fixedMass)} mg.`, `VSS / TSS: ${fmt(r.fraction)}${r.fraction == null ? " — zero dry residue" : "%"}.`, `Entered minimum residue mass: ${r.massMet ? "Met" : "Not met"}.`], interpretation: "Net captured mass and method-specific weighing/blank evidence matter independently of the calculated mg/L. Ignition loss is not a direct biomass or organic-carbon measurement.", warning });
    } else if (kind === "lab-rpd") {
      const r = checkDuplicates({ rows: parseLabCsv(form.elements.pairs.value, ["analyte", "result", "duplicate", "reportingLimit"]), maximumRpd: n("maximumRpd"), minimumRlMultiple: n("minimumRlMultiple"), absoluteLimit: n("absoluteLimit") });
      const assessed = r.filter(x => x.status !== "Not assessed"), exceeds = r.filter(x => x.status === "Exceeds entered limit");
      report(form, { label: "Pairs exceeding entered comparison limit", primary: `${exceeds.length}<span class="reading-unit"> / ${assessed.length} assessed</span>`, supporting: [`Total pairs: ${r.length}; not assessed: ${r.length - assessed.length}.`, "Censored values are never replaced with zero or half a detection limit.", "RPD is undefined at zero mean. Low-level absolute checks use only your entered criteria."], interpretation: "Precision does not establish accuracy. Check matching units, method, sample pairing, qualifiers and the project's actual low-level policy.", warning }, `<h3>Duplicate review</h3>${table(["Analyte", "RPD %", "Comparison", "Abs difference", "Result", "Duplicate", "RL", "Mode"], r.map(x => [x.analyte, fmt(x.rpd), x.status, fmt(x.difference), x.result, x.duplicate, x.reportingLimit, x.mode]), "Duplicate precision results")}`);
    } else if (kind === "lab-spike") {
      const mode = form.elements.mode.value;
      const r = computeSpike({ mode, native: n("native"), spiked: n("spiked"), added: mode === "basis" ? n("added") : undefined, sampleMl: mode === "volume" ? n("sampleMl") : undefined, spikeMl: mode === "volume" ? n("spikeMl") : undefined, stock: mode === "volume" ? n("stock") : undefined, lower: n("lower"), upper: n("upper") });
      report(form, { label: "Matrix-spike recovery", primary: `${fmt(r.recovery)}<span class="reading-unit"> %</span>`, supporting: [`Entered recovery range: ${r.within ? "Within" : "Outside"}.`, `Expected spiked concentration at 100% recovery: ${fmt(r.expected)} mg/L.`, `Native contribution on comparison basis: ${fmt(r.nativeFinal)} mg/L; added analyte: ${fmt(r.addedFinal)} mg/L.`, mode === "volume" ? `Added volume / original sample: ${fmt(r.volumeIncrease)}%. Volume correction does not reverse changes in matrix behavior.` : "All three concentrations must already share the original-sample-equivalent basis."], interpretation: "Investigate low, negative or high recovery with method-specific QC. Do not automatically correct official sample results by dividing by recovery.", warning });
    }
  }, { afterReset: () => { fileGeneration++; syncModes(form); } });
  form.addEventListener("input", event => { if (event.target.type !== "file") fileGeneration++; clearResult(form); });
  form.addEventListener("change", () => clearResult(form));
  form.elements.mode?.addEventListener("change", () => syncModes(form));
  form.querySelector("[data-lab-example]")?.addEventListener("click", () => {
    fileGeneration++;
    const mode = form.elements.mode.value;
    form.elements.samples.value = mode === "direct" ? "bottle,sampleMl,initialDo,finalDo,seedMl\nA-15,15,8.5,3.5,2\nA-30,30,8.8,1.3,2\nA-low-depletion,6,8.2,7.2,2" : mode === "water" ? "bottle,sampleMl,initialDo,finalDo,seedMl\nWater-150,150,8.5,1.1,0\nWater-100,100,8.4,2.6,0\nWater-50,50,8.4,3.9,0" : "bottle,sampleMl,initialDo,finalDo,seedMl\nUnseeded,15,8.5,3.5,0";
    clearResult(form);
  });
  for (const [name, selector, factor] of [["massUnit", "[data-lab-mass]", 1000], ["volumeUnit", "[data-lab-volume]", 1000]]) {
    const unit = form.elements[name];
    if (!unit) continue;
    let current = unit.value;
    unit.addEventListener("change", () => {
      const multiplier = unit.value === "mg" || unit.value === "mL" ? factor : 1 / factor;
      if (unit.value !== current) form.querySelectorAll(selector).forEach(field => { if (field.value.trim() && Number.isFinite(Number(field.value))) field.value = Number((Number(field.value) * multiplier).toPrecision(12)).toString(); });
      current = unit.value;
    });
    form.addEventListener("reset", () => requestAnimationFrame(() => { current = unit.value; }));
  }
  form.querySelectorAll("[data-lab-file]").forEach(field => field.addEventListener("change", async () => {
    const file = field.files?.[0];
    if (!file) return;
    const generation = ++fileGeneration;
    try {
      if (file.size > 262144) throw new Error("Choose a CSV no larger than 256 KiB.");
      const text = await file.text();
      if (generation !== fileGeneration) return;
      form.elements[field.dataset.labFile].value = text;
      form.querySelector("[data-form-error]").textContent = "File read locally. Review the text, then analyze.";
    } catch (error) { if (generation === fileGeneration) form.querySelector("[data-form-error]").textContent = error.message; }
  }));
  syncModes(form);
}

if (typeof document !== "undefined") document.querySelectorAll('[data-tool-form^="lab-"]').forEach(mount);
