# Water Systems Bench Handover

## Fixed Project Information

- Project: Water Systems Bench
- Domain: watersystemsbench.com
- Repository: https://github.com/canghun13/watersystemsbench
- Default branch: main
- Contact: [canghun13@naver.com](mailto:canghun13@naver.com)
- GA4 measurement ID: `G-7FB08YPX7C`
- Current phase: Phase 2: Wells, Boreholes, Storage & Rainwater cluster implemented
- Language and audience: English; global
- Stack and deployment: static HTML/CSS/vanilla JavaScript; GitHub Pages plus Cloudflare
- Phase 2 starting commit: `3c2b450e361a8a8ea0d351059bdef0e121b95071`

## Current Repository State

The repository contains a deployable static site with 40 public HTML pages, two connected system hubs, 17 working tools, eight guides, six references, shared design and conversion modules, repeatable QA, current planning documents, social preview, favicons and `CNAME`.

## Completed Work

- Preserved the Hydraulic Field Bench design, responsive structure, Phase 1 routes and nine Phase 1 tool modules.
- Added the `/systems/wells-storage-rainwater/` source-to-use system hub.
- Added eight functional tools for well-pump duty, well yield versus demand, pressure-tank sizing, short cycling, bulk storage, rainwater yield, annual tank simulation and first flush.
- Added five substantial guides and the Water Demand Planning Factors reference.
- Expanded shared unit conversions for litres/US gallons, square metres/square feet and millimetres/inches of rainfall.
- Updated home, indexes, two-system navigation, footer, internal linking, canonical metadata, JSON-LD, sitemap and `llms.txt`.
- Preserved the exact GA4 measurement ID once per public page.
- Expanded static, calculation and browser-result QA to the Phase 2 totals.

## Created and Modified Files

- Added eight calculation modules under `assets/js/tools/`.
- Added 15 routed `index.html` files: one system hub, eight tools, five guides and one reference.
- Updated generated core, index and Phase 1 HTML where shared metadata, navigation and cross-cluster links changed.
- Updated `assets/js/unit-conversions.js`, `assets/js/main.js`, shared CSS and header/footer partials.
- Updated the site generator and all static, calculation and browser-result QA files under `tools-qa/`.
- Updated `README.md`, `handover.md` and all six planning/operations documents under `docs/`.
- Updated `sitemap.xml` and `llms.txt`.

## Planning Status

| Category | Planned | Implemented | Remaining |
| --- | ---: | ---: | ---: |
| Core pages | 7 | 7 | 0 |
| System hubs | 4 | 2 | 2 |
| Tools | 32 | 17 | 15 |
| Guides | 14 | 8 | 6 |
| Reference pages | 8 | 6 | 2 |
| Total public HTML | 65 | 40 | 25 |

Empty or inactive future pages created: 0.

## Tool Counts by Type

| Type | Implemented |
| --- | ---: |
| Calculator | 7 |
| Planner | 2 |
| Checker | 2 |
| Comparator | 2 |
| Estimator | 1 |
| Troubleshooter | 1 |
| Analyzer | 1 |
| Simulator | 1 |
| Total | 17 |

## Calculation Boundaries

- Well-pump TDH starts at the pumping water surface; pump setting depth is used only to check entered submergence.
- Well yield and demand separate daily volume coverage from the peak-period storage gap.
- Pressure-tank sizing converts gauge values to absolute pressure and requires `precharge < cut-in < cut-out`; actual selection uses manufacturer-rated drawdown.
- The short-cycling model explicitly handles zero demand and demand at or above pump flow without returning invalid numbers.
- Bulk storage reports no-refill and partial-refill balances, reserve, usable volume and nominal volume.
- Rainwater yield uses horizontal catchment area and explicit proportional and fixed losses.
- The tank simulator runs 365 sequential daily steps with monthly rainfall distributed evenly within each month.
- First-flush sizing supports diversion-depth and entered-volume-per-area rules without claiming a universal default.

## Test and QA Results

- Static and navigation QA: passed for 40 public pages
- Category counts: 7 core, 2 hubs, 17 tools, 8 guides and 6 references
- Metadata titles and descriptions: unique across all 40 pages
- Canonical, robots meta, one H1, exact GA4, JSON-LD and breadcrumbs: passed on all 40 pages
- Sitemap URLs: 40; exact parity with public HTML
- Calculation verification: 30 Phase 1 numeric/conversion cases and 6 troubleshooting scenarios passed
- Phase 2 calculation verification: 30 numeric/decision cases and 6 rainwater simulator scenarios passed
- Actual browser renders: 200 (40 pages × 390, 768, 1024, 1280 and 1440 px)
- Tool interactions: 17 of 17 passed, including all eight Phase 2 tools
- Calculate/analyze/simulate, invalid input, reset, copy, print and relevant unit switching: passed
- Mobile navigation and two-system menu behavior: passed
- Browser console errors, page errors, asset failures, internal 404s and horizontal overflows: 0

The latest browser result is recorded in `tools-qa/browser-results.json`.

## Issues Found and Fixed

- Phase 2 browser QA found no layout or runtime defect requiring a site-code fix.
- During verification, the pressure-tank worked example was aligned with the independently checked absolute-pressure result.
- The simulator result report was completed with the required minimum-storage and end-storage outputs.
- A duplicate simulator source citation was removed.

## Safety and Remaining Risks

- All outputs remain preliminary and require actual measurements, current manufacturer data, local requirements and qualified review.
- Well yield can change with pumping duration, season, recharge and nearby withdrawals.
- Pressure vessels and pump controls require safe isolation and depressurization.
- Monthly rainfall smoothing can overstate storage reliability compared with daily historical rainfall.
- Rainwater is not automatically potable; source protection, separation, testing, treatment and local public-health requirements remain outside a quantity calculator.
- Live GitHub Pages and Cloudflare propagation can occur after the `main` push.

## Next Recommended Task

Plan and implement the Irrigation & Sprinkler Systems cluster using the two completed system workflows and the established source, storage, pump and pipe links.

## Latest Commit

The Phase 2 completion commit is the final `git rev-parse HEAD` value reported after commit and push; a Git commit cannot contain its own final hash.
