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
if (report.pages !== 74) issues.push(`pages=${report.pages}`);
if (report.renderChecks !== 370) issues.push(`renderChecks=${report.renderChecks}`);
if (JSON.stringify(report.widths) !== JSON.stringify(expectedWidths)) issues.push(`widths=${JSON.stringify(report.widths)}`);
if (report.toolInteractions !== 37) issues.push(`toolInteractions=${report.toolInteractions}`);
if (report.phase2ToolInteractions !== 15) issues.push(`phase2ToolInteractions=${report.phase2ToolInteractions}`);
if (report.treatmentToolInteractions !== 8) issues.push(`treatmentToolInteractions=${report.treatmentToolInteractions}`);
if (report.greywaterToolInteractions !== 5) issues.push(`greywaterToolInteractions=${report.greywaterToolInteractions}`);
if (report.toolFinderChecks < 20) issues.push(`toolFinderChecks=${report.toolFinderChecks}`);
if (report.responsiveTableChecks < 19) issues.push(`responsiveTableChecks=${report.responsiveTableChecks}`);
for (const key of ["mobileMenu", "calculateAnalyze", "reset", "copy", "print", "unitSwitch"]) if (report[key] !== "passed") issues.push(`${key}=${report[key]}`);
for (const key of ["consoleErrors", "pageErrors", "assetFailures", "internal404s", "horizontalOverflows", "tableClippingFailures"]) if (report[key] !== 0) issues.push(`${key}=${report[key]}`);
if (report.tableScrollAccess !== "passed") issues.push(`tableScrollAccess=${report.tableScrollAccess}`);

if (issues.length) {
  console.error(`Browser QA report failed: ${issues.join(", ")}`);
  process.exit(1);
}
console.log(`Browser QA report passed: ${report.renderChecks} renders across ${report.widths.join(", ")} px; 37 tool interactions including 5 greywater tools; ${report.toolFinderChecks} tool-finder checks; ${report.responsiveTableChecks} responsive-table checks; no console, page, asset, 404, overflow or table-clipping failures.`);
