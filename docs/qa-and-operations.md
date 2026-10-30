# QA and Operations

## Current release evidence — 2026-10-30

Inventory112:7 core,10 hubs,59 tools,22 guides,14 references; sitemap112. Rainfall Records & Gauge Networks adds four independent tools and seven routes. Static/publication/Analytics/navigation checks pass; calculation regression702 =391 original +102 laboratory +51 pressure rating +158 rainfall.

Current `npm run qa:browser` uses `tools-qa/rainfall-records-browser-qa.mjs`:112 pages ×5 widths=560 renders,59 defaults/resets,46 applicable unit switches,615 geometry snapshots,39 interaction entries,165 table checks and83 screenshots. Final local run passed after print refinement, Chrome156.0.8078.74;157 source fingerprints remained stable. All error lists empty; local server intercepted617 Analytics requests/completed0. Actual five-width new-page galleries, readable desktop reports and complete print-media screenshots were inspected; geometry alone is not a visual pass.

Set `WSB_QA_BASE`, dated `WSB_QA_REPORT` and `WSB_QA_IMAGES`; `WSB_QA_FULL=0` selects15 new/protected pages ×5 widths for production smoke. `WSB_QA_INTERACTIONS_ONLY=1` is development-only, never full-release evidence. Existing runtime/Chrome only, no install. Exact-six-host blocker precedes navigation, service workers blocked. Tests cover copy/download, reset/stale outputs, malformed/oversize files, concurrent reads, script-off submission protection, initial-gap transfer coverage,500/501 plotting boundaries and print input previews/error hiding. Native OS print dialogs/PDF pagination are not claimed.

`rainfall-records-release-qa.mjs --scope-only` protects101 unchanged existing public pages, all old titles/H1/canonicals,38 old assets/configuration files, exact five-badge block, old detail sitemap dates and append-only navigation. Its normal mode passed55 actual production HTTP/source checks, including Googlebot parity and14 docs/development404 paths. Production Chrome passed75 focused renders/130 geometry snapshots/39 interactions/80 tables, Analytics132 intercepted/0 completed, source157 stable and no errors. This is not a full-site560-render production claim. Implementation1cd117e deployed through exact-SHA Pages run41022944464. Dated final reports and deployment evidence are in `docs/weekly-growth-review-2026-10-30.md`. Historical reports below retain their original scope; descriptions of the then-current runner are not today's default.

## Historical release evidence — 2026-08-10

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
- Tools hub finder: 25 checks across all five widths covering search, system, type, combined filters, empty state and reset
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
- Tools hub search, system/type filters, live result count, empty state and reset
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
6. Confirm `sitemap.xml` exposes exactly 112 URLs.

Do not report deployment success for a skipped or failed production check.

## Historical October 16 laboratory release QA

Current runner: `tools-qa/water-laboratory-browser-qa.mjs` (`npm run qa:browser`). It performs a fresh105-page ×390/768/1024/1280/1440 render matrix, all55 default tool results/resets, and the new four-tool interaction matrix. Historical `browser-results.json` and October weekly reports are not relabelled as this release. New numerical/basis fixtures are in `verify-water-laboratory.mjs`; `verify:calculations` runs the original391 plus these new assertions. Use existing bundled Node/Playwright and installed Chrome, with no installation. Set `WSB_QA_BASE` for a nondefault local port or production and dated `WSB_QA_REPORT` / `WSB_QA_IMAGES` locations. The exact-host Analytics blocker is installed before browser navigation. Native print dialogs are not claimed: the runner verifies the handler and print media. Publication excludes remain unchanged; laboratory docs and QA must return404 in production.

Completed evidence on October16: local full525 renders/55 default results/55 resets, followed by final laboratory-only35 renders after lab-only polish; production smoke35 renders/4 defaults/4 resets/25 interaction entries/37 table checks. Five widths throughout. Production Analytics69 intercepted/0 completed; no recorded console/page/request/internal-HTTP errors. Independent laboratory assertions102; original391 retained. Non-executing production source/boundary verification passed41 requests. See the four dated `water-laboratory-2026-10-16-*-results.json` reports and the discovery record for exact scope and deployment SHA; do not merge local and production counts into a fictitious full production run. Use `WSB_QA_SMOKE=1` to select only the7 new routes for render checks while retaining protected interaction controls.

## Historical October 23 pressure-tank upgrade QA

`verify:calculations` now includes51 independent rated-drawdown assertions, in addition to391 original and102 laboratory assertions (544 total). The original pressure-tank ideal sizing engine remains unchanged. `pressure-tank-release-qa.mjs` is the separate targeted browser runner:12 pages ×5 widths=60 renders,87 geometry snapshots,25 interaction entries and28 table checks. It checks matched-rating confirmation/revocation, below/above/equal, errors/hidden fields/stale output, units/reset/refill, actual clipboard, print handler/media and protected controls. Default local base is port4197; set `WSB_QA_BASE`, dated `WSB_QA_REPORT` and optional `WSB_QA_IMAGES`. Use existing runtime/Chrome, no install.

The full targeted local and production matrices passed before final print-only header compaction. `pressure-tank-print-qa.mjs` separately verifies the final compact print title, hidden form/navigation/article, input record/result/URL and overflow at all5 widths. Preserve scope distinctions between60-render matrices and5-print supplements. `pressure-tank-release-live-qa.mjs` checks35 HTTP/source/boundary requests and the protected104-page/14-file/original-engine scope; `--scope-only` checks local boundaries without pretending to check production. All automation uses the exact-six-host Analytics guard before navigation. Native print dialog is not claimed. Current research/release evidence is in `docs/weekly-growth-review-2026-10-23.md`; do not overwrite historical reports.

Final local and production print supplements both passed5/5; production blocked5 Analytics requests/completed0. Final post-refinement HTTP/source checks35/35 passed. Actual390/1280 production form and complete compact-print screenshots were inspected. Screen styles/JS were unchanged by the print refinement; no fresh full-site525-render or native print-dialog/PDF-pagination claim is made.
