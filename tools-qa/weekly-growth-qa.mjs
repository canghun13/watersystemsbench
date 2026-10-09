// Targeted release QA; does not replace or relabel the historical full-site report.
// Uses an already installed Playwright runtime and Chrome; installs nothing.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { installPlaywrightAnalyticsBlock, isAnalyticsUrl } from "./analytics-blocker.mjs";
import { computeRinseAudit, computeRinseLog, parseRinseLog } from "../assets/js/tools/metal-finishing-tools.js";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = fileURLToPath(new URL("..", import.meta.url));
const base = process.env.WSB_QA_BASE || "http://127.0.0.1:4187";
const production = new URL(base).hostname === "watersystemsbench.com";
const output = resolve(process.env.WSB_QA_REPORT || join(root, "tools-qa/weekly-growth-local-results.json"));
const imageDir = process.env.WSB_QA_IMAGES;
const guide = "/guides/reduce-metal-finishing-rinse-water/";
const widths = [390, 768, 1024, 1280, 1440];
const paths = [guide, "/reference/metal-finishing-rinse-control-methods/",
  "/tools/rinse-conductivity-log-analyzer/", "/tools/countercurrent-rinse-flow-planner/",
  "/tools/metal-finishing-rinse-water-audit-calculator/",
  "/tools/groundwater-stabilization-log-analyzer/", "/tools/available-water-flow-test-calculator/",
  "/tools/", "/guides/plan-home-greywater-reuse-system/", "/",
  "/systems/metal-finishing-rinse-water/", "/reference/greywater-source-use-screening/",
  "/reference/water-pipe-internal-diameters/", "/guides/build-water-treatment-train/",
  "/guides/well-borehole-tube-well-terminology/"];
const report = { date: process.env.WSB_QA_DATE || "2026-10-09", base, production, widths, paths, renderChecks: 0,
  interactions: [], geometry: [], screenshots: [], consoleErrors: [], pageErrors: [],
  assetFailures: [], internalHttpFailures: [], unexpectedRequestFailures: [], analytics: { intercepted: 0, completed: 0 },
  decisionFixtures: 0, contentAssertions: 0, tableChecks: 0 };

// Verify the example with actual unchanged calculation functions, not just arithmetic in prose.
const input = { startMeterL: 0, intervalHours: 8, loads: 200, hoursPerDay: 8, daysPerYear: 250, combinedTariff: 0 };
const baseline = computeRinseAudit({ ...input, endMeterL: 8000 });
const proposed = computeRinseAudit({ ...input, endMeterL: 1440 });
assert.equal(baseline.litresPerLoad, 40);
assert.equal(proposed.litresPerLoad, 7.2);
assert.equal(baseline.litresPerHour - proposed.litresPerHour, 820);
assert.equal((8000 - 1440) * 250 / 1000, 1640); // Independent annual-volume example.
assert.equal(computeRinseAudit({ ...input, endMeterL: 1440, loads: 100 }).litresPerLoad, 14.4);
assert.throws(() => computeRinseAudit({ ...input, endMeterL: 1440, loads: 0 }));
const log = computeRinseLog({ rows: parseRinseLog(await readFile(join(root, "tools-qa/fixtures/rinse-log.csv"), "utf8")), alertConductivity: 600 });
assert.equal(log.totalWaterL, 450); assert.equal(log.idleWaterL, 150); assert.equal(log.excursions, 1);
report.decisionFixtures = 9;

if (imageDir) await mkdir(imageDir, { recursive: true });
const browser = await chromium.launch({ channel: process.env.WSB_QA_BROWSER || "chrome", headless: true });
report.browser = `Chrome ${browser.version()}`;
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block" });
await installPlaywrightAnalyticsBlock(context, report.analytics);
await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: base });
await context.addInitScript(() => { window.__qaPrintCalls = 0; window.print = () => { window.__qaPrintCalls++; }; });
const page = await context.newPage();
page.on("console", message => { if (message.type() === "error" && !/ERR_BLOCKED_BY_CLIENT/.test(message.text())) report.consoleErrors.push(message.text()); });
page.on("pageerror", error => report.pageErrors.push(error.message));
page.on("response", response => {
  if (response.status() >= 400 && new URL(response.url()).origin === new URL(base).origin) report.internalHttpFailures.push({ url: response.url(), status: response.status() });
});
page.on("requestfailed", request => {
  if (!isAnalyticsUrl(request.url())) report.unexpectedRequestFailures.push({ url: request.url(), error: request.failure()?.errorText });
});

async function open(path, width) {
  await page.setViewportSize({ width, height: 900 });
  const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, path);
  await page.locator(".site-header").waitFor();
  await page.locator(".site-footer").waitFor();
}
async function geometry(path, width, state) {
  const result = await page.evaluate(() => {
    const visible = element => element.getClientRects().length && getComputedStyle(element).visibility !== "hidden";
    const box = element => { const b = element.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height, right: b.right, bottom: b.bottom }; };
    const offenders = [...document.querySelectorAll("main h1, main h2, main p, main input, main select, main textarea, main button, .tool-finder-controls, .related-grid a")]
      .filter(visible).filter(element => { const b = box(element); return b.x < -1 || b.right > innerWidth + 1; })
      .map(element => ({ tag: element.tagName, text: (element.textContent || element.id).slice(0, 70), box: box(element) }));
    const labels = [...document.querySelectorAll("label, legend")].filter(visible).map(element => ({ text: element.textContent.trim(), box: box(element) }));
    const controls = [...document.querySelectorAll(".stabilization-criteria-grid input")].map(element => ({ id: element.id, box: box(element) }));
    const header = box(document.querySelector(".site-header")); const h1 = box(document.querySelector("h1"));
    const brokenImages = [...document.images].filter(element => !element.complete || element.naturalWidth === 0).map(element => element.currentSrc || element.src);
    const tables = [...document.querySelectorAll("main table")].map(element => {
      const wrapper = element.closest(".table-scroll");
      const owner = wrapper || (["auto", "scroll"].includes(getComputedStyle(element).overflowX) ? element : element.parentElement);
      const last = element.querySelector("tr:last-child > :last-child");
      const before = owner.scrollLeft;
      owner.scrollLeft = owner.scrollWidth;
      const bounds = owner.getBoundingClientRect(); const lastBounds = last?.getBoundingClientRect();
      const lastColumnAccessible = !!lastBounds && lastBounds.right <= bounds.right + 2 && lastBounds.right > bounds.left;
      const clippedCells = [...element.querySelectorAll("th,td")].filter(cell => {
        const style = getComputedStyle(cell);
        return (["hidden", "clip"].includes(style.overflowX) && cell.scrollWidth > cell.clientWidth + 1)
          || (["hidden", "clip"].includes(style.overflowY) && cell.scrollHeight > cell.clientHeight + 1);
      }).length;
      const result = { width: element.scrollWidth, tableClientWidth: element.clientWidth,
        parentWidth: owner.clientWidth, ownerScrollWidth: owner.scrollWidth, overflow: getComputedStyle(owner).overflowX,
        labelled: !!wrapper?.getAttribute("aria-label"), lastColumnAccessible, clippedCells,
        ownerWithinPage: bounds.left >= -1 && bounds.right <= innerWidth + 1 };
      owner.scrollLeft = before; return result;
    });
    return { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, offenders, labels, controls, header, h1, tables, brokenImages };
  });
  assert.ok(result.scrollWidth <= result.clientWidth + 1, `${path} ${width} document overflow`);
  assert.deepEqual(result.offenders, [], `${path} ${width} off-screen text/control`);
  assert.deepEqual(result.brokenImages, [], `${path} ${width} broken images`);
  // Once a tool scrolls to its controls/results, an off-screen H1 is expected.
  if (state === "initial") assert.ok(result.h1.y >= result.header.bottom - 1, `${path} header/H1 overlap`);
  for (const table of result.tables) {
    if (table.width > table.parentWidth + 1) assert.ok(["auto", "scroll"].includes(table.overflow), "table must remain scroll-accessible");
    assert.ok(table.ownerWithinPage, `${path} table scroll surface outside page`);
    assert.ok(table.lastColumnAccessible, `${path} rightmost column cannot be reached`);
    assert.equal(table.clippedCells, 0, `${path} clipped table cells`);
    report.tableChecks++;
  }
  if (path.includes("groundwater-stabilization")) {
    const quality = result.controls.filter(item => ["phCriterion", "temperatureCriterion", "conductivityCriterion", "doCriterion", "orpCriterion", "turbidityCriterion"].includes(item.id));
    if (width > 900) {
      for (let index = 0; index < quality.length; index += 2) assert.ok(Math.abs(quality[index].box.y - quality[index + 1].box.y) < 2, "paired criterion inputs align");
    } else assert.ok(quality.every(item => Math.abs(item.box.x - quality[0].box.x) < 2), "mobile criteria single column");
  }
  report.geometry.push({ path, width, state, ...result });
}
async function shot(name, fullPage = false) {
  if (!imageDir) return;
  const path = join(imageDir, `${production ? "production" : "local"}-${name}.png`);
  await page.screenshot({ path, fullPage }); report.screenshots.push({ path, name });
}
async function runTool(path, width) {
  const submit = page.locator('button[type="submit"]');
  await submit.click();
  await page.locator(".result-report:not([hidden])").waitFor();
  assert.equal((await page.locator("[data-form-error]").innerText()).trim(), "");
  const text = await page.locator(".result-report").innerText();
  assert.ok(!/NaN|Infinity/.test(text));
  if (path.includes("rinse-conductivity")) { assert.match(text, /45/); assert.match(text, /450/); assert.match(text, /150/); }
  if (path.includes("countercurrent")) assert.match(text, /63\.2/);
  if (path.includes("rinse-water-audit")) assert.match(text, /50/);
  await geometry(path, width, "result");
  await page.locator("[data-copy-result]").click();
  await page.waitForFunction(() => document.querySelector("[data-copy-result]").textContent === "Copied");
  assert.ok((await page.evaluate(() => navigator.clipboard.readText())).length > 20);
  const printCallsBefore = await page.evaluate(() => window.__qaPrintCalls);
  await page.locator("[data-print-result]").click();
  assert.equal(await page.evaluate(() => window.__qaPrintCalls), printCallsBefore + 1);
  await page.emulateMedia({ media: "print" }); assert.ok(await page.locator(".result-report").isVisible()); await page.emulateMedia({ media: "screen" });
  await page.locator('button[type="reset"]').click();
  await page.locator(".result-report[hidden]").waitFor({ state: "attached" });
  assert.equal(await page.locator("[data-copy-result]").isDisabled(), true);
  if (path.includes("rinse-conductivity")) {
    await page.locator("#logFile").setInputFiles(join(root, "tools-qa/fixtures/rinse-log.csv"));
    await page.waitForFunction(() => document.querySelector("#logText").value.includes("60,5,400,10"));
    await page.locator("#alert").fill("0"); await submit.click();
    assert.ok((await page.locator("[data-form-error]").innerText()).length > 0);
    await page.locator("#alert").fill("600");
  }
  await submit.click(); await page.locator(".result-report:not([hidden])").waitFor();
  const before = await page.locator(".reading-value").innerText();
  await page.locator("#unitSystem").selectOption("US"); await submit.click();
  await page.locator(".result-report:not([hidden])").waitFor();
  assert.equal((await page.locator("[data-form-error]").innerText()).trim(), "");
  await page.locator("#unitSystem").selectOption("SI"); await submit.click();
  assert.equal((await page.locator(".reading-value").innerText()).trim(), before.trim());
  // Protect common button contrast/focus without mutating shared CSS.
  await submit.hover();
  const style = await submit.evaluate(element => { const s = getComputedStyle(element); return { color: s.color, background: s.backgroundColor }; });
  assert.equal(style.color, "rgb(255, 255, 255)"); assert.equal(style.background, "rgb(18, 62, 80)");
  await submit.focus(); await page.keyboard.press("Shift+Tab"); await page.keyboard.press("Tab");
  const focus = await submit.evaluate(element => { const s = getComputedStyle(element); return { visible: element.matches(":focus-visible"), outline: s.outlineStyle, width: s.outlineWidth }; });
  assert.equal(focus.visible, true); assert.notEqual(focus.outline, "none"); assert.ok(parseFloat(focus.width) >= 2);
  if ([390, 1280].includes(width) && path.includes("rinse-conductivity")) await shot(`button-focus-${width}`);
  if ([390, 1280].includes(width) && path.includes("groundwater-stabilization")) { await page.locator(".stabilization-criteria-group").nth(1).scrollIntoViewIfNeeded(); await shot(`stabilization-${width}`); }
  report.interactions.push({ path, width, run: "pass", copy: "pass", reset: "pass", refillRerun: "pass", printHookAndMedia: "pass", unitRoundTrip: "pass", buttonHover: style, buttonFocus: focus });
}

try {
  if (!production) await fetch(`${base}/__qa__/analytics-reset`, { method: "POST" });
  for (const path of paths) for (const width of widths) {
    await open(path, width); await geometry(path, width, "initial"); report.renderChecks++;
    if (path === guide) {
      assert.equal(await page.locator("h1").innerText(), "How to Reduce Metal Finishing Rinse Water");
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), `https://watersystemsbench.com${guide}`);
      const content = await page.locator("article").innerText();
      for (const marker of ["Control flow to production", "Verify with logs", "40 L/load", "7.2 L/load", "820 L/h"]) { assert.ok(content.includes(marker), marker); report.contentAssertions++; }
      for (const marker of ["Understand the conductivity control loop", "deadband or hysteresis", "Check signal quality and failure response",
        "duration, not cumulative clock time", "Excursion count is not excursion duration", "14.4 L/load", "1,640 m³/year"]) {
        assert.ok(content.includes(marker), marker); report.contentAssertions++;
      }
      if (imageDir) {
        await shot(`rinse-guide-top-${width}`, true);
        await page.getByRole("heading", { name: "5. Control flow to production", exact: true }).scrollIntoViewIfNeeded();
        await shot(`rinse-guide-controls-${width}`);
      }
      if (width === 390) {
        const toggle = page.locator(".menu-toggle"); await toggle.click(); assert.equal(await toggle.getAttribute("aria-expanded"), "true"); await page.locator('#primary-nav a[href="/tools/"]').waitFor({ state: "visible" }); await toggle.click();
        report.interactions.push({ path, width, mobileMenu: "pass" });
      }
    }
    if (path === "/reference/greywater-source-use-screening/" && imageDir && width === 390) {
      for (const label of ["Source screening table", "End-use screening table"]) {
        const tableRegion = page.getByRole("region", { name: label });
        await tableRegion.scrollIntoViewIfNeeded(); await tableRegion.evaluate(element => { element.scrollLeft = element.scrollWidth; });
        await shot(`greywater-${label.split(" ")[0].toLowerCase()}-rightmost-390`);
      }
    }
    if (path.startsWith("/tools/") && path !== "/tools/") await runTool(path, width);
    if (path === "/tools/") {
      await page.locator("#toolSystem").selectOption("metal-finishing");
      assert.equal(await page.locator("[data-tool-card]:visible").count(), 5);
      await page.locator("#toolSearch").fill("conductivity"); assert.equal(await page.locator("[data-tool-card]:visible").count(), 1);
      await page.locator('button[type="reset"]').click(); await page.waitForFunction(() => [...document.querySelectorAll("[data-tool-card]")].filter(element => !element.hidden).length === 51);
      assert.equal(await page.locator("[data-tool-count]").textContent(), "Showing all 51 tools.");
      assert.equal(await page.locator("#toolSearch").inputValue(), "");
      assert.equal(await page.locator("#toolSystem").inputValue(), "all");
      await page.locator("#toolSearch").fill("unmatched-workflow-qa");
      await page.locator("[data-tool-empty]").waitFor({ state: "visible" });
      assert.equal(await page.locator("[data-tool-card]:visible").count(), 0);
      await page.locator('button[type="reset"]').focus(); await page.keyboard.press("Enter");
      await page.waitForFunction(() => document.querySelector("[data-tool-count]").textContent === "Showing all 51 tools.");
      assert.equal(await page.locator("[data-tool-empty]").isHidden(), true);
      await page.locator("#toolType").selectOption("analyzer");
      assert.equal(await page.locator("[data-tool-card]:visible").count(), 3);
      await page.evaluate(() => document.querySelector("[data-tool-filters]").reset());
      await page.waitForFunction(() => document.querySelector("[data-tool-count]").textContent === "Showing all 51 tools.");
      await geometry(path, width, "filters-reset");
      if ([390, 1280].includes(width)) { await page.locator(".tool-finder-controls").scrollIntoViewIfNeeded(); await shot(`finder-${width}`); }
      report.interactions.push({ path, width, filters: "pass", nativeClickReset: "pass", keyboardNoMatchReset: "pass", programmaticTypeReset: "pass", restoredCards: 51 });
    }
  }
  if (!production) report.serverAnalytics = await (await fetch(`${base}/__qa__/analytics-report.json`)).json();
  assert.equal(report.analytics.completed, 0);
  if (production) assert.ok(report.analytics.intercepted >= report.renderChecks);
  else { assert.equal(report.serverAnalytics.analyticsRequestsCompleted, 0); assert.ok(report.serverAnalytics.analyticsRequestsIntercepted >= report.renderChecks); }
  for (const key of ["consoleErrors", "pageErrors", "assetFailures", "internalHttpFailures", "unexpectedRequestFailures"]) assert.deepEqual(report[key], [], key);
  report.result = "passed";
} catch (error) { report.result = "failed"; report.failure = error.stack; process.exitCode = 1; }
finally { await browser.close(); await writeFile(output, `${JSON.stringify(report, null, 2)}\n`); }
console.log(JSON.stringify({ result: report.result, renders: report.renderChecks, interactions: report.interactions.length, contentAssertions: report.contentAssertions, decisionFixtures: report.decisionFixtures, tableChecks: report.tableChecks, analytics: report.analytics, serverAnalytics: report.serverAnalytics, failure: report.failure, output }, null, 2));
