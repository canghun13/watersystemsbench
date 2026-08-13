import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createQaAnalyticsGuard } from "./analytics-blocker.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT || 4173);
const analyticsGuard = createQaAnalyticsGuard();
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    if (pathname === "/__qa__/analytics-report.json") {
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      response.end(JSON.stringify(analyticsGuard.report()));
      return;
    }
    if (pathname === "/__qa__/analytics-reset" && request.method === "POST") {
      analyticsGuard.reset();
      response.writeHead(204, { "Cache-Control": "no-store" });
      response.end();
      return;
    }
    if (pathname === "/__qa__/analytics-blocked.js") {
      const target = new URL(request.url, `http://${request.headers.host}`).searchParams.get("target") || "";
      if (!analyticsGuard.record(target)) throw new Error("Invalid analytics target");
      response.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-store", "X-QA-Analytics-Guard": "blocked" });
      response.end("window.dataLayer = window.dataLayer || [];\n");
      return;
    }
    let candidate = normalize(join(root, pathname));
    if (!candidate.startsWith(root)) throw new Error("Path outside site root");
    const info = await stat(candidate).catch(() => null);
    if (info?.isDirectory()) candidate = join(candidate, "index.html");
    let data = await readFile(candidate);
    if (extname(candidate) === ".html") data = Buffer.from(analyticsGuard.rewriteHtml(data.toString("utf8")));
    response.writeHead(200, { "Content-Type": types[extname(candidate)] || "application/octet-stream", "Cache-Control": "no-store" });
    response.end(data);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`Water Systems Bench QA URL: http://127.0.0.1:${port}/ (analytics guard active)`));
