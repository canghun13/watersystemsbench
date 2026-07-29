import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = join(root, "tools-qa", "browser-results.json");
let report;
try {
  report = JSON.parse(await readFile(reportPath, "utf8"));
} catch {
  console.error("Browser QA report is missing or invalid. Run the documented in-app browser capture before this report check.");
  process.exit(1);
}

const expectedWidths = [390, 768, 1024, 1280, 1440];
const issues = [];
if (report.pages !== 65) issues.push(`pages=${report.pages}`);
if (report.renderChecks !== 325) issues.push(`renderChecks=${report.renderChecks}`);
if (JSON.stringify(report.widths) !== JSON.stringify(expectedWidths)) issues.push(`widths=${JSON.stringify(report.widths)}`);
if (report.toolInteractions !== 32) issues.push(`toolInteractions=${report.toolInteractions}`);
if (report.phase2ToolInteractions !== 15) issues.push(`phase2ToolInteractions=${report.phase2ToolInteractions}`);
if (report.treatmentToolInteractions !== 8) issues.push(`treatmentToolInteractions=${report.treatmentToolInteractions}`);
for (const key of ["mobileMenu", "calculateAnalyze", "reset", "copy", "print", "unitSwitch"]) if (report[key] !== "passed") issues.push(`${key}=${report[key]}`);
for (const key of ["consoleErrors", "pageErrors", "assetFailures", "internal404s", "horizontalOverflows"]) if (report[key] !== 0) issues.push(`${key}=${report[key]}`);

if (issues.length) {
  console.error(`Browser QA report failed: ${issues.join(", ")}`);
  process.exit(1);
}
console.log(`Browser QA report passed: ${report.renderChecks} renders across ${report.widths.join(", ")} px; 32 tool interactions including 8 treatment tools; no console, page, asset, 404 or overflow failures.`);
