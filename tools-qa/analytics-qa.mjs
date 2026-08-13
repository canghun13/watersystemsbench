import { readFile } from "node:fs/promises";
import { analyticsHosts, createQaAnalyticsGuard, isAnalyticsUrl } from "./analytics-blocker.mjs";
import { isPublicRouteHtml, root, walk } from "./public-boundary.mjs";

const errors = [];
for (const host of analyticsHosts) if (!isAnalyticsUrl(`https://${host}/g/collect`)) errors.push(`${host} is not blocked.`);
for (const safe of ["https://www.google.com/search?q=water", "https://docs.google.com/", "https://example.org/"]) {
  if (isAnalyticsUrl(safe)) errors.push(`Non-analytics URL is overblocked: ${safe}`);
}

const guard = createQaAnalyticsGuard();
const publicHtml = (await walk()).filter(isPublicRouteHtml);
let rewrittenPages = 0;
for (const file of publicHtml) {
  const source = await readFile(file, "utf8");
  if (!source.includes("https://www.googletagmanager.com/gtag/js?id=G-7FB08YPX7C")) errors.push(`${file}: production GA4 loader missing.`);
  const guarded = guard.rewriteHtml(source);
  if (guarded.includes("https://www.googletagmanager.com/gtag/js?id=G-7FB08YPX7C")) errors.push(`${file}: QA rewrite left the GA4 loader reachable.`);
  if (!guarded.includes("/__qa__/analytics-blocked.js?target=")) errors.push(`${file}: QA blocker route missing.`);
  else rewrittenPages += 1;
}

if (errors.length) {
  console.error(`Analytics QA failed with ${errors.length} issue(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`Analytics QA passed: ${rewrittenPages} production pages retain GA4 in source while the QA server rewrites only the six approved analytics hosts.`);
