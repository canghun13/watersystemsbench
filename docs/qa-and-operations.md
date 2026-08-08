# QA and Operations

## Current release evidence — 2026-08-08

- Public pages: 74
- Category counts: 7 core, 5 hubs, 37 tools, 16 guides and 9 references
- Sitemap: exact 74-route parity
- Static and navigation QA: passed
- Calculation regression: 30 Phase 1 numeric/conversion cases, 6 general troubleshooting cases, 30 Phase 2 numeric/decision cases, 6 rainwater simulator cases, 49 irrigation numeric/validation cases and 6 irrigation troubleshooting cases
- Treatment verification: 65 numeric/validation checks and 15 selector scenarios
- Greywater verification: 46 independent numeric, unit-equivalence, boundary and validation checks
- Browser render matrix: 74 pages × 5 widths = 370 checks
- Viewports: 390, 768, 1024, 1280 and 1440 px
- Tool interactions: 37 tools covered by regression; all 5 new greywater tools exercised for normal, invalid, recovery, reset, copy, print and unit-switch behavior
- Browser failures after verification: 0 console errors, page errors, asset failures, internal 404s and horizontal overflows

The actual browser run is recorded in `tools-qa/browser-results.json`. Update that file only after a complete real-browser run.

## Start every task

1. Confirm the repository root, remote, active branch and latest commit.
2. Inspect `git status` and preserve existing or unrelated work.
3. Read `handover.md` and relevant specifications.
4. Fetch remote state when needed and understand divergence before editing.
5. Do not use routine force-push, destructive reset, clean or rebase.

## QA commands

```bash
npm run generate
npm run verify:calculations
npm run qa
npm run qa:browser
npm run serve
```

`npm run qa` includes static and navigation checks.

## Required release checks

- Exact category and sitemap counts
- Unique titles and descriptions
- One canonical, robots directive, H1, GA4 snippet and valid JSON-LD per public page
- Breadcrumbs and resolved internal links/assets
- JavaScript syntax and runtime behavior
- Formula expectations independent of implementation logic
- Invalid, reset, mode, unit, copy and print behavior
- Mobile navigation and all implemented system links
- Horizontal overflow and visible clipping at all five widths
- Console errors, page errors, broken images, missing styles/assets and internal 404s
- Contact email, `mailto:` and fixed domain/repository values
- Safety, potable-water, chemical and regulatory boundaries
- Exact preservation of user-managed homepage integrations

## Production verification

After pushing `main`:

1. Confirm local `HEAD` equals `origin/main`.
2. Allow GitHub Pages/Cloudflare propagation where necessary.
3. Check representative core, hub, tool, guide and reference URLs over HTTPS.
4. Confirm HTTP 200, canonical domain, GA4 and current content.
5. Exercise representative live calculations and the treatment selector.
6. Confirm `sitemap.xml` exposes exactly 74 URLs.

Do not report deployment success for a skipped or failed production check.
