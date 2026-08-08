# Water Systems Bench Handover

## Fixed Project Information

- Project: Water Systems Bench
- Domain: watersystemsbench.com
- Repository: https://github.com/canghun13/watersystemsbench
- Default branch: main
- Contact: [canghun13@naver.com](mailto:canghun13@naver.com)
- GA4 measurement ID: `G-7FB08YPX7C`
- Current phase: Greywater Reuse Planning expansion implemented and QA complete; production verification follows the final `main` push
- Language and audience: English; global
- Stack and deployment: static HTML/CSS/vanilla JavaScript; GitHub Pages plus Cloudflare
- Phase 2 starting commit: `3c2b450e361a8a8ea0d351059bdef0e121b95071`

## Current Repository State

The repository contains a deployable static site with 40 public HTML pages, two connected system hubs, 17 working tools, eight guides, six references, shared design and conversion modules, repeatable QA, current planning documents, social preview, favicons and `CNAME`.

The current public implementation is unchanged. The future Irrigation & Sprinkler Systems cluster is specified in `docs/irrigation-sprinkler-spec.md`; none of its 11 routes exists yet.

## Irrigation Specification Task Record

- Starting branch: `main`
- Starting commit: `a7408f57b944358232d01d3eb4c85fdca1043a5f`
- Repository at start: 40 public HTML pages, 17 tools, eight guides and six references
- Specification outcome: one hub, seven tools and three guides confirmed; implementation not started
- Duplicate review: all 11 candidates have independent user tasks and search intent; zero removed and zero merged
- Planning correction: the hub route is `/systems/irrigation-sprinklers/`, replacing the earlier planning-only route `/tools/irrigation-sprinkler/`
- Future verification design: 36 numeric/validation cases plus six rules-based troubleshooting scenarios, 42 total
- Future browser design: 51 pages × five widths = 255 render checks, plus the seven-tool interaction matrix
- Source research: USDA NRCS, FAO, US EPA WaterSense, public university Extension material and official Hunter/Rain Bird technical manuals; at least two sources assigned per tool and guide

Confirmed future pages:

1. `/systems/irrigation-sprinklers/`
2. `/tools/available-water-flow-test-calculator/`
3. `/tools/sprinkler-zone-capacity-planner/`
4. `/tools/sprinkler-precipitation-rate-calculator/`
5. `/tools/irrigation-runtime-water-depth-planner/`
6. `/tools/drip-irrigation-flow-zone-calculator/`
7. `/tools/irrigation-pump-zone-matcher/`
8. `/tools/sprinkler-low-pressure-troubleshooter/`
9. `/guides/measure-irrigation-flow-pressure/`
10. `/guides/split-sprinkler-zones/`
11. `/guides/troubleshoot-low-pressure-sprinkler-zone/`

Documentation created or updated:

- Created `docs/irrigation-sprinkler-spec.md`.
- Updated `docs/page-inventory.md`, `docs/information-architecture.md`, `docs/content-and-tool-spec.md`, `docs/qa-and-operations.md` and `handover.md`.

## Completed Work

- Preserved the Hydraulic Field Bench design, responsive structure, Phase 1 routes and nine Phase 1 tool modules.
- Added the `/systems/wells-storage-rainwater/` source-to-use system hub.
- Added eight functional tools for well-pump duty, well yield versus demand, pressure-tank sizing, short cycling, bulk storage, rainwater yield, annual tank simulation and first flush.
- Added five substantial guides and the Water Demand Planning Factors reference.
- Expanded shared unit conversions for litres/US gallons, square metres/square feet and millimetres/inches of rainfall.
- Updated home, indexes, two-system navigation, footer, internal linking, canonical metadata, JSON-LD, sitemap and `llms.txt`.
- Preserved the exact GA4 measurement ID once per public page.
- Expanded static, calculation and browser-result QA to the Phase 2 totals.
- Completed the pre-implementation specification for the Irrigation & Sprinkler Systems hub, seven tools and three guides, including source mapping, duplicate-intent review, exact formulas, 42 independent future verification cases and the 51-page browser QA contract.

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

### Irrigation specification projection

| Category | After future irrigation implementation | Remaining then |
| --- | ---: | ---: |
| Core pages | 7 | 0 |
| System hubs | 3 | 1 |
| Tools | 24 | 8 |
| Guides | 11 | 3 |
| Reference pages | 6 | 2 |
| Total public HTML | 51 | 14 |

These are projections, not current implemented counts.

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

- Documentation-only specification task rerun: static QA passed for the unchanged 40 public pages, including unique metadata, valid JSON-LD, exact GA4, sitemap parity, clean JavaScript and repository string scan.
- Documentation-only specification task rerun: navigation QA passed for all 42 HTML documents examined by the existing script, with local links and assets resolved.
- Documentation-only specification task rerun: calculation verification passed for 30 Phase 1 numeric/conversion cases, six Phase 1 troubleshooting scenarios, 30 Phase 2 numeric/decision cases and six rainwater simulator scenarios.
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
- Irrigation supply tests must distinguish static pressure, dynamic pressure and measured flow.
- Sprinkler product flow and operating pressure must come from current manufacturer data; theoretical precipitation rate is not distribution uniformity.
- The planned pump matcher is a single-duty-condition screen, not a pump/system curve operating-point calculation.
- Backflow protection, cross-connections, buried utilities, controller wiring, pump service and local irrigation restrictions require applicable local and qualified review.

## Next Recommended Task

Implement the Irrigation & Sprinkler Systems cluster from docs/irrigation-sprinkler-spec.md, then run full calculation, static and browser QA.

## Latest Commit

The Irrigation & Sprinkler Systems specification commit is the final `git rev-parse HEAD` value reported after commit and push; a Git commit cannot contain its own final hash.

## Irrigation & Sprinkler Systems Implementation — 2026-07-29

- Starting branch and commit: `main` at `277415cee32718021b209a1fbb829e0018a1cefe`; no pre-existing working-tree changes.
- The user-managed KittyLaunch footer area was preserved: it remains untouched, in place, and without markup, asset, alt-text or whitespace changes.
- Added the published hub `/systems/irrigation-sprinklers/`, seven working tools, and three guides. Existing header/footer navigation exposes the third system hub.
- Actual public HTML: 51 (7 core, 3 system hubs, 24 tools, 11 guides and 6 references). Planned total remains 65; 14 pages remain unimplemented.
- Irrigation tools: Available Water Flow Test Calculator; Sprinkler Zone Capacity Planner; Sprinkler Precipitation Rate Calculator; Irrigation Runtime & Water Depth Planner; Drip Irrigation Flow & Zone Calculator; Irrigation Pump & Zone Matcher; Sprinkler Low-Pressure Troubleshooter.
- Added common irrigation calculation logic, SI/US conversion behavior, validation, reset/copy/print pattern, safety limits and primary technical sources. The pump matcher is explicitly a single-duty-condition screen and the troubleshooter is explicitly triage, not diagnosis.
- QA: static and navigation QA passed for 51 public pages; 49 irrigation numeric/validation checks and six irrigation troubleshooting scenarios passed; existing Phase 1/2 checks passed. Browser QA recorded 255 renders (51 pages × 390, 768, 1024, 1280 and 1440 px), zero horizontal overflows and zero console errors. The available-flow calculator’s 30 L/min worked example was exercised in the browser.
- Sitemap, robots, llms.txt, home, hubs, tools/guides indexes and shared system navigation now include the implemented cluster. GA4 remains exactly `G-7FB08YPX7C`; official contact remains `canghun13@naver.com`.
- Remaining risk: local browser verification cannot prove GitHub Pages/Cloudflare propagation before push. Verify production URLs and current manufacturer/local-requirement conditions after deployment.
## Water Treatment & Water Quality Implementation — 2026-07-29

This section is the authoritative current-state handover. Earlier phase and projection sections above are retained as release history.

- Starting branch and commit: `main` at `060ebcc9789ee2bd16c57b998893e86d08099068`.
- Repository at start: clean, with local `HEAD` equal to `origin/main`.
- Added the fourth hub at `/systems/water-treatment-quality/`, eight working tools, three guides and two references.
- Corrected the earlier planning-only treatment hub route `/tools/water-treatment-quality/` to the system-hub convention `/systems/water-treatment-quality/`.
- Resolved request-draft route variants to the pre-existing `docs/page-inventory.md` contract, as the request explicitly gave that inventory precedence: `/guides/how-to-read-a-water-test-report/` → `/guides/read-water-test-report/`; `/guides/water-treatment-technology-comparison/` → `/guides/filter-softener-ro-uv-comparison/`; `/guides/build-a-water-treatment-train/` → `/guides/build-water-treatment-train/`; `/reference/water-quality-parameter-glossary/` → `/reference/water-quality-glossary/`; and `/reference/water-treatment-technology-comparison-matrix/` → `/reference/water-treatment-comparison-matrix/`.
- Current public inventory: 65 pages — 7 core, 4 system hubs, 32 tools, 14 guides and 8 references. Remaining initial planned pages: 0.
- Updated home, system navigation, footer, indexes, cross-cluster links, canonical metadata, JSON-LD, sitemap and `llms.txt`.
- Preserved the user-managed KittyLaunch homepage badge exactly in its original location and did not copy it to other pages.
- Added treatment calculation/decision logic for softener capacity, salt/regeneration planning, RO water balance, RO production/demand, media loading, user-entered chlorine-dose arithmetic, user-entered CT comparison and test-led treatment-train selection.
- Chemical dose and CT tools do not choose a target. All treatment pages state that results do not establish potable safety, certified performance, regulatory compliance or an approved design.
- Added official source mapping from EPA, CDC, NSF, WHO and USGS material.
- Calculation QA passed: existing regressions plus 65 treatment numeric/validation checks and 15 selector scenarios.
- Static QA passed for 65 public pages; navigation QA passed for 67 repository HTML documents.
- Actual local browser QA passed: 65 pages × five widths = 325 render checks at 390, 768, 1024, 1280 and 1440 px.
- All eight treatment tools passed default calculation/selection, invalid input where applicable, reset, relevant SI/US switching, copy and print checks. The positive-microbiology selector path produced urgent safe-source/public-authority guidance.
- Local browser failures after verification: zero console errors, page errors, asset failures, internal 404s and horizontal overflows.
- `tools-qa/browser-results.json` records the actual current browser run.
- Implementation commit: `f0b9cf2f0fffed80c73bc2152fe708e0c59ab420` (`Build water treatment and quality cluster`).
- GitHub Pages deployment completed successfully for that exact commit: `https://github.com/canghun13/watersystemsbench/actions/runs/30423579476`.
- Production verification passed after a Cloudflare cache-bypass request: homepage, treatment hub, representative softener/RO/chlorine/selector tools, water-test guide, glossary and sitemap returned HTTP 200 with current canonical/GA4/content.
- Production sitemap contained 65 unique URLs and included the treatment hub and final glossary route.
- Live interaction checks passed: the default softener case returned 22,190 grains; the user-entered chlorine case returned 0.1636 L with its chemical warning; the positive-microbiology selector returned an urgent validated-barrier path with alternate-safe-source and health-authority guidance.

### Next maintenance direction

The initial 65-page scope is complete. Prefer evidence-led maintenance, indexing and usability improvements over publishing empty expansion pages. Any future cluster requires its own distinct route inventory, source/formula contract, safety boundaries and complete regression/browser QA.

## 2026-07-29

- 메인 페이지 푸터 아래의 디렉토리 뱃지 영역은 사용자가 직접 관리하는 영역이므로 수정·삭제·리팩터링하지 않는다.- https://kittylaunch.com, https://sellwithboost.com/에 등록 (내가 직접함)


## 2026-07-30

- 메인 페이지 푸터 아래의 디렉토리 뱃지 영역은 사용자가 직접 관리하는 영역이므로 수정·삭제·리팩터링하지 않는다.- https://twelve.tools/,https://findly.tools/에 등록 (내가 직접함)


## 2026-08-06

- 메인 페이지 푸터 아래의 디렉토리 뱃지 영역은 사용자가 직접 관리하는 영역이므로 수정·삭제·리팩터링하지 않는다.- https://boostdomainrating.com/ 에 등록 (내가 직접함)

## Greywater Reuse Planning Expansion — 2026-08-08

This section is the authoritative current-state handover. Earlier planning and release sections are retained as history.

### Repository and starting state

- Repository: https://github.com/canghun13/watersystemsbench
- Starting branch: `main`
- Starting commit: `afd187a310a4f1e0ebdc4a9c9ef17684a5601fd1`
- Starting status: clean; local `HEAD` equal to `origin/main`
- Starting inventory: 65 public pages — 7 core, 4 system hubs, 32 tools, 14 guides and 8 references
- Protected user-managed area: the complete homepage directory-badge block below the footer, containing KittyLaunch, SellWithBoost, Twelve Tools, Findly and BoostDomainRating

### Candidate research and final decision

Seven substantive candidates were compared using public search results, repeated calculator/how-to intent, free-tool quality, site overlap and the required 40/35/25 scoring model:

| Candidate | Monetization / 40 | Demand / 35 | Gap / 25 | Total | Decision |
| --- | ---: | ---: | ---: | ---: | --- |
| Greywater reuse planning | 34 | 29 | 21 | 84 | Selected |
| Water loss and leakage | 36 | 31 | 16 | 83 | Rejected for this release: household and utility users split the workflow; AWWA provides a strong free audit tool |
| Septic systems | 35 | 30 | 14 | 79 | Rejected: strong jurisdiction dependence and current free calculator competition |
| Stormwater drainage | 37 | 31 | 10 | 78 | Rejected: dense engineering-tool competition and high permit-design misuse risk |
| Commercial building water systems | 34 | 28 | 10 | 72 | Rejected: licensed code-table dependence and strong current competition |
| Pond / reservoir management | 31 | 25 | 15 | 71 | Rejected: weaker connected workflow and topical fit |
| Wastewater pump stations | 29 | 21 | 17 | 67 | Rejected: narrower professional demand and overlap with existing pump/TDH/friction tools |

Greywater was selected because it fills the missing household wastewater → allowed non-potable reuse bridge between the existing rainwater, irrigation and treatment clusters. Searches exposed independent intent for source-volume estimation, ET-based irrigation matching, laundry-to-landscape distribution, surge/infiltration checking and savings/payback. Current competing calculators generally combine assumptions into one broad estimate or serve one regional scenario; Water Systems Bench now provides a product-neutral, connected and transparent workflow.

Primary research and technical sources include San Francisco Public Utilities Commission, Washington State Department of Health, US EPA WaterSense, US EPA's non-potable reuse calculator methods and the Australian Guidelines for Water Recycling. Regional examples are not presented as global rules.

The detailed candidate record, competitor review and tool contracts are in `docs/greywater-reuse-expansion.md`.

Operational principle retained: `Insufficient long-term analytics is not currently a blocker for validated aggressive expansion.`

### Implemented cluster

- Hub: `/systems/greywater-reuse/`
- Tools:
  1. `/tools/greywater-supply-calculator/` — Calculator
  2. `/tools/greywater-irrigation-demand-planner/` — Planner
  3. `/tools/laundry-to-landscape-zone-planner/` — Planner
  4. `/tools/greywater-surge-basin-checker/` — Checker
  5. `/tools/greywater-reuse-savings-calculator/` — Calculator
- Guides:
  1. `/guides/plan-home-greywater-reuse-system/`
  2. `/guides/troubleshoot-greywater-irrigation/`
- Reference: `/reference/greywater-source-use-screening/`

The cluster adds nine public pages. Final inventory is 74 public pages — 7 core, 5 system hubs, 37 tools, 16 guides and 9 references. Tool distribution is 17 calculators, 8 planners, 3 checkers, 3 comparators, 2 troubleshooters, 1 selector, 1 estimator, 1 analyzer and 1 simulator.

Home, Tools, Guides, Reference, shared Systems navigation, related workflows, sitemap, `llms.txt`, generator registry, calculation/static/browser QA and project documentation include the new routes. The existing Hydraulic Field Bench design is reused without a new design system.

### Calculation and decision verification

- New greywater verification: 46 independent numeric, SI/US-equivalence, boundary and invalid-state checks passed.
- Existing regression passed unchanged: 30 Phase 1 numeric/conversion cases, 6 general troubleshooting scenarios, 30 Phase 2 numeric/decision cases, 6 rainwater simulator scenarios, 49 irrigation numeric/validation checks, 6 irrigation troubleshooting scenarios, 65 treatment numeric/validation checks and 15 treatment selector scenarios.
- New browser interactions passed for all five tools: default result, invalid input, stale-result removal, invalid → valid recovery, reset, copy, print, SI/US switch and repeated switch after reset.

### Static and browser QA

- Static QA: passed for 74 public pages with unique metadata, exact canonical, robots, one H1, exact GA4, valid JSON-LD/BreadcrumbList, sitemap parity, clean JavaScript and repository string scan.
- Navigation QA: passed for 76 repository HTML documents with all local links and assets resolved.
- Sitemap: 74 unique public URLs; exact parity with public HTML.
- Actual browser render matrix: 74 pages × 5 widths = 370 checks at 390, 768, 1024, 1280 and 1440 px.
- Browser results: zero console errors, page errors, asset failures, internal 404s, horizontal overflows, unlabelled controls and broken images.
- Mobile menu and the fifth Systems entry passed; representative desktop result layout passed visual inspection.

### Problems found and fixed

- The shared unit-system closure did not resynchronize after native form reset. A later second unit switch could apply the wrong conversion direction. Reset now synchronizes the internal unit state; repeated SI → US → reset → US behavior passed.
- Shared numeric validation combined minimum and non-zero wording, producing an inaccurate boundary message. Minimum and greater-than-zero errors are now separated and browser-verified.
- Port 4173 was occupied by another local project during QA. A unique local port was used; this was an environment conflict, not a site defect.

### Safety and remaining risks

- Greywater is treated as non-potable wastewater. No page approves a source, use, treatment, storage method, setback, edible-crop contact, spray, indoor reuse, potable connection or local compliance.
- Source definitions and requirements vary materially by jurisdiction. Users must preserve potable separation and the locally required sewer/septic diversion path.
- ET, rainfall, plant factor, soil infiltration, receiving-basin volume, tariff and sewer-offset values are user inputs and require local evidence.
- Production propagation was verified after push against the exact implementation commit, including the new routes, representative live calculations, sitemap and protected badge block.
- The complete user-managed homepage badge block was preserved exactly in its original location and is now protected by generator output and static QA.

### Release state

- Browser evidence is recorded in `tools-qa/browser-results.json`.
- Implementation commit: `8ce9a59380ed95a7f0d7919316d5e916b0edcbd8` (`Add greywater reuse planning cluster`). Local `HEAD`, `origin/main` and the GitHub Pages workflow were matched to this SHA before live verification.
- GitHub Pages deployment succeeded for that exact commit in run `https://github.com/canghun13/watersystemsbench/actions/runs/31242771928` (`pages-build-deployment #21`, 47 seconds).
- Production verification passed for the homepage and all nine new pages: current canonical, exact GA4, expected H1/content, no broken images and no horizontal overflow.
- Production sitemap returned HTTP 200 with 74 URLs and every new route.
- Live default interactions matched the independently verified values: greywater supply `121.9 L/day`, irrigation demand coverage `70%`, and net annual savings `104 currency/year`.
- The five homepage directory badges remained present in the original order with their original destinations, images, alternative text, height and inline-style values.

### Next recommended work

Monitor indexing and query evidence for the greywater routes, then compare Water Loss & Leakage against the remaining rejected candidates before another expansion. Do not publish a new cluster without repeating duplicate review, source/formula contracts and complete regression/browser QA.
