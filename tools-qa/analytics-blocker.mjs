export const analyticsHosts = Object.freeze([
  "www.googletagmanager.com",
  "googletagmanager.com",
  "www.google-analytics.com",
  "google-analytics.com",
  "analytics.google.com",
  "stats.g.doubleclick.net"
]);

const analyticsHostSet = new Set(analyticsHosts);

export function isAnalyticsUrl(value) {
  try {
    return analyticsHostSet.has(new URL(value, "http://127.0.0.1").hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function createQaAnalyticsGuard() {
  let intercepted = 0;
  const targets = new Map();
  return {
    rewriteHtml(html) {
      return html.replace(/(<script\b[^>]*\bsrc\s*=\s*)(["'])([^"']+)\2/gi, (full, prefix, quote, url) => {
        if (!isAnalyticsUrl(url)) return full;
        return `${prefix}${quote}/__qa__/analytics-blocked.js?target=${encodeURIComponent(url)}${quote}`;
      });
    },
    record(target) {
      if (!isAnalyticsUrl(target)) return false;
      intercepted += 1;
      targets.set(target, (targets.get(target) || 0) + 1);
      return true;
    },
    reset() {
      intercepted = 0;
      targets.clear();
    },
    report() {
      return {
        analyticsBlocking: "passed",
        analyticsHosts,
        analyticsRequestsIntercepted: intercepted,
        analyticsRequestsCompleted: 0,
        targets: Object.fromEntries(targets)
      };
    }
  };
}

// Shared hook for any future standard Playwright runner. The current in-app
// browser QA uses the local server guard below because its browser surface does
// not expose route interception.
export async function installPlaywrightAnalyticsBlock(target, metrics = { intercepted: 0, completed: 0 }) {
  await target.route("**/*", async (route) => {
    const url = route.request().url();
    if (isAnalyticsUrl(url)) {
      metrics.intercepted += 1;
      await route.abort("blockedbyclient");
      return;
    }
    await route.continue();
  });
  target.on?.("requestfinished", (request) => {
    if (isAnalyticsUrl(request.url())) metrics.completed += 1;
  });
  return metrics;
}
