import { conversions } from "./unit-conversions.js";

export function numberValue(form, name, { min = 0, max = Number.POSITIVE_INFINITY, allowZero = true } = {}) {
  const field = form.elements.namedItem(name);
  const raw = field?.value?.trim();
  if (raw === "" || raw == null) throw new Error(`${field?.dataset.label || name} is required.`);
  const value = Number(raw);
  if (!Number.isFinite(value)) throw new Error(`${field?.dataset.label || name} must be a valid number.`);
  if (value < min || (!allowZero && value === 0)) throw new Error(`${field?.dataset.label || name} must be ${allowZero ? `at least ${min}` : `greater than ${min}`}.`);
  if (value > max) throw new Error(`${field?.dataset.label || name} is outside the supported range.`);
  return value;
}

export function renderResult(form, report) {
  const panel = form.closest(".tool-layout")?.querySelector(".result-panel");
  if (!panel) return;
  panel.querySelector(".result-empty")?.setAttribute("hidden", "");
  const result = panel.querySelector(".result-report");
  result.hidden = false;
  result.querySelector(".reading-label").textContent = report.label;
  result.querySelector(".reading-value").innerHTML = report.primary;
  result.querySelector("[data-supporting]").innerHTML = report.supporting.map((item) => `<li>${item}</li>`).join("");
  result.querySelector("[data-interpretation]").textContent = report.interpretation;
  result.querySelector("[data-warning]").textContent = report.warning;
  result.querySelector("[data-warning]").hidden = !report.warning;
  panel.querySelectorAll("[data-result-action]").forEach((button) => { button.disabled = false; });
  form.dataset.lastResult = [report.label, result.innerText].join("\n");
}

export function clearResult(form) {
  const panel = form.closest(".tool-layout")?.querySelector(".result-panel");
  if (!panel) return;
  panel.querySelector(".result-empty")?.removeAttribute("hidden");
  const report = panel.querySelector(".result-report");
  if (report) report.hidden = true;
  panel.querySelectorAll("[data-result-action]").forEach((button) => { button.disabled = true; });
  form.dataset.lastResult = "";
}

export function setupForm(form, calculate, { afterReset } = {}) {
  form.noValidate = true;
  const error = form.querySelector("[data-form-error]");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    clearResult(form);
    try { calculate(form); } catch (problem) { error.textContent = problem.message || "Check the input values and try again."; }
  });
  form.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      error.textContent = "";
      clearResult(form);
      afterReset?.(form);
      applyUnitLabels(form, form.querySelector("[data-unit-system]")?.value || "SI");
    });
  });
  const copy = form.closest(".tool-layout")?.querySelector("[data-copy-result]");
  copy?.addEventListener("click", async () => {
    try {
      const text = form.dataset.lastResult || "";
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const transfer = document.createElement("textarea");
        transfer.value = text;
        transfer.setAttribute("readonly", "");
        transfer.style.position = "fixed";
        transfer.style.opacity = "0";
        document.body.append(transfer);
        transfer.select();
        if (!document.execCommand("copy")) throw new Error("Copy command was rejected.");
        transfer.remove();
      }
      copy.textContent = "Copied";
      setTimeout(() => { copy.textContent = "Copy result"; }, 1600);
    } catch { error.textContent = "Copy was unavailable. Select the result text and copy it manually."; }
  });
  form.closest(".tool-layout")?.querySelector("[data-print-result]")?.addEventListener("click", () => window.print());
}

export function applyUnitLabels(form, system) {
  form.querySelectorAll("[data-unit-label]").forEach((node) => {
    const kind = node.dataset.unitLabel;
    node.textContent = conversions[kind]?.[system === "US" ? "us" : "si"] || "";
  });
}

export function setupUnitSystem(form) {
  const select = form.querySelector("[data-unit-system]");
  if (!select) return;
  let current = select.value;
  applyUnitLabels(form, current);
  select.addEventListener("change", () => {
    const next = select.value;
    form.querySelectorAll("[data-unit-kind]").forEach((field) => {
      if (field.value === "" || !Number.isFinite(Number(field.value))) return;
      const converter = conversions[field.dataset.unitKind];
      if (!converter) return;
      const converted = current === "SI" && next === "US" ? converter.toUS(Number(field.value)) : converter.toSI(Number(field.value));
      field.value = Number(converted.toPrecision(7)).toString();
    });
    current = next;
    applyUnitLabels(form, current);
    clearResult(form);
  });
}
