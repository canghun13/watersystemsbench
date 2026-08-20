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

## Greywater screening-table mobile fix — 2026-08-08

This section is the authoritative handover for the responsive-table correction.

- Starting branch and commit: `main` at `e1efc3464e8242142e9b4b0c1a32e06626284021`; the local tree was clean and equal to `origin/main` after `fetch` and `pull --ff-only`.
- Reported production defect: at a 390px-class viewport, the Source screening and End-use screening tables on `/reference/greywater-source-use-screening/` could compress long cells and make the rightmost column difficult to reach or appear clipped.
- Cause: the generated page used bare tables. The mobile rule made the table itself a scroll container, but did not preserve a content minimum width or expose a dedicated, labelled scroll region. Existing browser QA checked only document-level horizontal overflow, so an internally constrained table could pass while remaining hard to read.
- Fix: the generator now wraps only the two affected tables in keyboard-focusable `role="region"` table wrappers with descriptive labels. The wrapper is constrained to the article width and owns `overflow-x: auto`; the Source table keeps a 760px readable width and the End-use table keeps a 700px readable width. The contained table remains a real table, and the rest of the Hydraulic Field Bench layout is unchanged.
- Regression guard: static QA now requires both generated labelled wrappers and the CSS contract. Browser-report QA now requires 19 responsive-table checks, explicit internal-scroll access and zero table-clipping failures. The check permits intentional wrapper scrolling but fails clipping, hidden/unscrollable columns and page-level overflow.
- Local browser QA: Source and End-use screening passed at 390, 768, 1024, 1280 and 1440px. At 390px the page had zero horizontal overflow; both wrappers stayed within the main content area; cells and headers had zero clipping; the Source and End-use rightmost headers became fully visible after internal horizontal scroll. Representative table pages were also checked at mobile and desktop widths with no regression.
- Local runtime QA: console errors, page errors and failed page assets were zero for the corrected page.
- Implementation commit: `27b61d6623d587f7b4e1765ce29743a66c0068ed` (`Fix responsive greywater screening tables`).
- Remote and deployment verification: local `HEAD` and `origin/main` matched this SHA after push. GitHub Pages run `https://github.com/canghun13/watersystemsbench/actions/runs/31243752925` (`pages-build-deployment #23`) completed successfully in 37 seconds.
- Production 390px verification: `/reference/greywater-source-use-screening/` served both labelled wrappers. The Source table was 760px inside a 333px scrollable wrapper; the End-use table was 700px inside a 333px scrollable wrapper. Both rightmost headers were fully visible after internal scroll, page horizontal overflow was zero, cell/header clipping was zero and the browser reported zero console warnings or errors.

## Second expansion review — 2026-08-08

This section records the strict GO/NO-GO review for a second cluster after Greywater Reuse Planning.

- Repository and starting state: `https://github.com/canghun13/watersystemsbench`, clean `main` at `753fa8c0b5426f38b8c1ad1b9e8555c2929adee3`, equal to `origin/main` after fetch and fast-forward check.
- Starting inventory: 74 public pages — 7 core, 5 system hubs, 37 tools, 16 guides and 9 references; sitemap count 74.
- Purpose: determine whether a second strong cluster exists that does not overlap Greywater Reuse Planning or the four earlier system clusters. Insufficient long-term analytics was not treated as a blocker, but the GO gates were not lowered.
- Protected area: the complete user-managed homepage badge block containing KittyLaunch, SellWithBoost, Twelve Tools, Findly and BoostDomainRating remained untouched.

Nine candidates were checked against live search results, current free tools, the current page/tool inventory and the required scoring model:

| Candidate | Monetization /40 | Demand /35 | Gap /25 | Total | Gate result |
| --- | ---: | ---: | ---: | ---: | --- |
| Water loss / leakage | 35 | 31 | 8 | 74 | FAIL D and E |
| Commercial building water demand / distribution | 38 | 31 | 4 | 73 | FAIL D, E and F |
| Stormwater / site drainage | 37 | 32 | 4 | 73 | FAIL D, E and F |
| Septic systems | 35 | 30 | 6 | 71 | FAIL D and F |
| Cooling-tower water management | 36 | 29 | 4 | 69 | FAIL B, D and F |
| Construction dewatering | 35 | 26 | 7 | 68 | FAIL D, E and F |
| Livestock / stockwater systems | 32 | 27 | 8 | 67 | FAIL B, D, E and F |
| Wastewater pump stations | 33 | 25 | 7 | 65 | FAIL B, D, E and F |
| Pond / small-reservoir management | 31 | 25 | 7 | 63 | FAIL B, D, E and F |

Demand signals were real: repeated water-audit, fixture-unit, runoff/detention, septic sizing, cooling-tower balance, dewatering, stockwater, lift-station and pond equipment queries were found. The decisive competition evidence included AWWA's free Water Audit Software, EPA's National Stormwater Calculator and SWMM, USDA/NRCS stockwater workbooks, integrated septic/dewatering/cooling-tower calculators, and mature WSFU, lift-station and pond calculators.

The closest candidate was Water Loss / Leakage. It has strong utility demand and monetization adjacency, but AWWA already provides the authoritative free audit workflow. Removing that duplicate leaves a household cluster that materially repackages the site's existing flow, pressure, cost and troubleshooting tools. Livestock / stockwater had a plausible new audience, but its apparent tools mostly reassemble existing demand, storage, pipe, TDH and pump logic around local standards.

Final decision: **NO-GO**. No candidate passed all mandatory gates A–G. No sufficiently strong non-overlapping second cluster was found, so no implementation contract or production cluster was created.

- New public pages: 0
- Production HTML/CSS/JavaScript/generator changes: none
- Sitemap changed: no; remains 74 URLs
- Public page inventory changed: no; remains 74 pages
- Responsive table implementation and `.table-scroll` contract: unchanged
- Detailed research, competitor URLs, candidate reasoning, gates and revisit conditions: `docs/second-expansion-review.md`
- Revisit only after query/user evidence exposes four independent non-overlapping tools, a demonstrable gap against current free tools, stable source methods and a full A–G gate pass.

Documentation-only verification passed after the review: all existing calculation suites passed (including 46 greywater checks); static QA passed for 74 public pages; navigation QA passed for 76 repository HTML documents; and the recorded browser report passed 370 renders, 37 tool interactions and 19 responsive-table checks with zero console, page, asset, 404, overflow or table-clipping failures. Production artifact hashes, public-page count and sitemap count remained unchanged. The exact documentation commit is the commit containing this section and must be verified against `origin/main` in the final delivery.

## Tools hub discovery improvement — 2026-08-10

This section is the authoritative record for the latest-state reassessment and the one selected maintenance task.

### Current state and evidence

- Repository: `https://github.com/canghun13/watersystemsbench`
- Starting branch and commit: clean `main` at `b4823c61f2994ca7a9dfb81c4660eec28b0a6f6e`, equal to `origin/main` after fetch and `pull --ff-only`
- Starting inventory: 74 public pages — 7 core, 5 system hubs, 37 tools, 16 guides and 9 references; sitemap count 74
- Live evidence before implementation: the homepage and `/tools/` served current canonical metadata and GA4. The Tools hub exposed all 37 cards in one sequence with zero search or filter controls and no system headings. At 390px its document height was approximately 10,417px.
- Repository evidence: every tool already had a valid route and short task description, but `hubBody("Tools")` rendered the complete `toolLinks` array as one undifferentiated card grid.
- QA evidence: all calculation suites passed; after the documented generate step, static QA passed for 74 pages, navigation QA passed for 76 HTML documents and the existing browser report passed. No calculation, broken-link, metadata, table or runtime defect outranked the discovery gap.
- GSC and GA4 reporting data were not accessible in this environment. No traffic, query, impression, CTR or engagement numbers were invented or used. SERP evidence was not needed for the selected UX task.
- Protected area: the complete user-managed homepage badge block containing KittyLaunch, SellWithBoost, Twelve Tools, Findly and BoostDomainRating was not changed, moved, restyled or copied.

### Candidate work

| Candidate | Impact /30 | Evidence /25 | User value /20 | Search value /15 | Efficiency /10 | Total /100 | Gate result |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Add task, system and type filtering to the 37-tool hub | 27 | 25 | 19 | 7 | 9 | 87 | PASS A–F; selected |
| Align homepage H1 and entry copy more literally with all five workflows | 20 | 16 | 14 | 11 | 9 | 70 | FAIL B/C; current cards and description already expose all workflows, with no query evidence for a rewrite |
| Reinforce Greywater search intent and internal links | 23 | 9 | 16 | 13 | 7 | 68 | FAIL B/F; the cluster was only two days old and already has connected hub, tool, guide and reference links |
| Add more cross-tool next-step links | 18 | 17 | 14 | 7 | 8 | 64 | FAIL A/F; all tool, guide and reference detail pages already expose a related workflow section |
| Revise calculator results or formulas | 23 | 12 | 18 | 4 | 6 | 63 | FAIL A/B; all independent numeric, validation and troubleshooting suites passed and no incorrect result was reproduced |
| Revisit a second new production cluster | 22 | 13 | 15 | 10 | 3 | 63 | FAIL B/F; the immediately preceding nine-candidate review was NO-GO and no new contradictory evidence exists |
| Make the badge-block static check line-ending independent | 11 | 22 | 4 | 1 | 9 | 47 | FAIL C; the documented generate-first workflow produces the expected byte contract and production output is unaffected |

### Decision and gates

Final decision: **GO — add task, system and tool-type discovery controls to `/tools/`.**

- Gate A — real opportunity: passed; 37 live cards formed a 10,417px mobile catalogue with no way to narrow it.
- Gate B — evidence: passed; live DOM/viewport evidence and generator structure independently showed the same gap.
- Gate C — material benefit: passed; one search or filter reduces the choice set from 37 to a relevant subset, with a visible count and recoverable empty state.
- Gate D — non-trivial: passed; the task adds accessible interaction, classification, responsive layout, state handling and regression coverage rather than decorative copy.
- Gate E — safe scope: passed; one existing hub and dedicated assets change, with no formulas, public routes, sitemap count, shared navigation or user-managed integrations changed.
- Gate F — not already done: passed; neither live HTML nor source contained equivalent discovery controls.

### Implementation and verification

- The generator now classifies all 37 tools into the five implemented systems and nine existing tool types. The Irrigation Pump & Zone Matcher remains part of the existing Comparator category.
- `/tools/` now has an accessible search field, System selector, Tool type selector, clear action, live result count and explicit no-results recovery message. Static HTML still contains all cards and links when JavaScript is unavailable.
- Dedicated `assets/js/tool-finder.js` and `assets/css/tool-finder.css` are loaded only by `/tools/`; common site CSS and JavaScript are unchanged.
- Static QA now requires the finder assets, accessible status/empty-state contract, exactly 37 classified cards, one known system and one known type per card. Browser-report QA requires at least 20 finder checks.
- Calculation verification passed unchanged: 30 Phase 1 numeric/conversion cases, 6 general troubleshooting scenarios, 30 Phase 2 numeric/decision cases, 6 rainwater simulator scenarios, 49 irrigation numeric/validation checks, 6 irrigation troubleshooting scenarios, 65 treatment numeric/validation checks, 15 selector scenarios and 46 greywater checks.
- Static QA passed for 74 public pages. Navigation QA passed for 76 repository HTML documents. Sitemap remains exactly 74 URLs.
- Actual local browser regression passed: 74 pages × 5 widths = 370 renders at 390, 768, 1024, 1280 and 1440px, with zero H1, horizontal-overflow, broken-image or unlabelled-control failures and zero browser warnings/errors.
- Finder QA passed 25 state checks across the five widths: initial 37, `pressure` search 13, Treatment system 8, Treatment + Planner 2 and reset 37. A zero-result combination exposed the recovery message. Mobile and desktop visual inspection passed.
- Implementation commit: `190a194087562edf5b8c10f64e740393abe72b26` (`Improve tools hub discovery`). Local `HEAD`, `origin/main` and `git ls-remote` matched this SHA after the implementation push.
- GitHub Pages deployment succeeded for the implementation commit in run `https://github.com/canghun13/watersystemsbench/actions/runs/31348431801` (`pages-build-deployment #26`, 43 seconds).
- Production verification passed after deployment: `/tools/` returned HTTP 200 with the exact canonical and GA4, 37 classified cards, the dedicated finder CSS/JavaScript and no horizontal overflow or browser warnings/errors at 390px.
- Live finder interaction matched local evidence: initial 37, `pressure` search 13, Treatment system 8, Treatment + Planner 2 and reset 37.
- Production `sitemap.xml` returned HTTP 200 with exactly 74 URLs and `/tools/` last modified on `2026-08-10`; no route was added or removed.
- The five user-managed homepage badges remained in the original order with the original destinations, alternative text and 36px heights. The homepage retained one KittyLaunch marker, exact canonical, exact GA4 and zero horizontal overflow.
- The documentation verification commit is the commit containing this release-state update; its exact SHA must be matched to `origin/main` in the final delivery.

## Tool Finder and workflow visual regression fix — 2026-08-10

This section is the authoritative local implementation record for the two UI regressions reproduced on the production site.

- Starting state: clean `main` at `3933e23b8b6496123c05eb044271b5e65b5faf0e`, equal to `origin/main` after fetch.
- Reproduced Tool Finder defect: at 1440px and 390px, the search control on `/tools/` rendered as a visually empty rectangle because its only usage example sat below the field. That extra hint row also made the search column taller than both selects and the clear button.
- Reproduced workflow defect: the shared `.flow-line span:not(:last-child)::after` rule added an arrow glyph to every non-final step. At wrapped row ends this became an especially conspicuous repeated arrowhead on the homepage, Water Treatment hub and Greywater hub.
- Source fix: `toolFinder()` now places `Search pressure, rainwater, cost...` inside the search input. The dedicated finder CSS uses one 44px control height, a larger desktop search column, equal medium select columns, an intrinsic-width desktop action, two tablet columns and one mobile column. The obsolete external hint was removed.
- Shared workflow fix: the single common arrow pseudo-element rule was removed from `assets/css/main.css`. Numbered circles, connector lines, labels, order and responsive wrapping remain unchanged across every `.flow-line` user.
- QA guard: static QA now requires the visible search prompt while continuing to reject actual temporary content markers. Browser-report QA requires the responsive finder toolbar to pass and the workflow arrow-glyph count to remain zero.
- Generated output: 74 public pages were regenerated from `tools-qa/generate-site.mjs`; only `/tools/index.html` changed. Sitemap URLs, dates, formulas, tools, metadata, navigation, homepage design, colors and badges did not change.
- Local automated verification passed: static QA for 74 pages, navigation QA for 76 HTML documents and every calculation/validation suite passed unchanged.
- Actual browser regression passed at 390, 768, 1024, 1280 and 1440px: 74 pages × 5 widths = 370 renders, with zero horizontal overflow, broken images, unlabelled controls, missing H1s, console errors or workflow arrow glyphs.
- Finder geometry: all four controls measured exactly 44px high. Desktop controls shared one baseline with search wider than two equal selects and the button sized to content; 768px used two equal columns; 390px used one 293px column with no clipping.
- Finder behavior: initial 37; `pressure` search 13; Greywater system 5; Planner type 8; Greywater + Planner 2; combined `laundry` search 1; explicit zero-result state 0; reset restored all 37.
- Greywater table regression stayed intact at all five widths. At 390px, the Source table remained 760px inside a 333px labelled scroll wrapper and the End-use table remained 700px inside a 333px labelled scroll wrapper, with no document overflow.
- Direct before/after browser screenshots were recorded at 1440px and 390px for `/tools/`, the homepage workflow, the Water Treatment sequence and the Greywater workflow.
- Protected area: the five user-managed homepage badges (KittyLaunch, SellWithBoost, Twelve Tools, Findly and BoostDomainRating) and the greywater screening-table implementation were not changed.
- The implementation commit is the commit containing this section with message `Fix tool finder and workflow visuals`; deployment and production verification are recorded in the follow-up release-state entry after GitHub Pages completes.

### Deployment and production verification

- Implementation commit: `b24576d7313deb082139594210bcabf5b3a2123f` (`Fix tool finder and workflow visuals`). Local `HEAD` and `origin/main` matched after push.
- GitHub Pages deployment succeeded for that exact SHA in `pages-build-deployment #28`: `https://github.com/canghun13/watersystemsbench/actions/runs/31351364660` (1 minute 6 seconds; build, status report and deploy all successful).
- Production Tool Finder passed at 390px and 1440px. The prompt text was present, all controls were 44px high, desktop controls shared the same top baseline, the 390px toolbar used one full-width column and neither viewport had horizontal overflow.
- Production finder behavior matched local verification: search 13, Greywater system 5, Greywater + Planner 2, explicit zero-result state 0 and reset 37.
- Production workflow verification returned zero generated arrow glyphs for the homepage 6-step flow, Water Treatment 9-step sequence and Greywater 7-step workflow at 390px; 1440px visual and computed-style checks also passed.
- Production greywater screening-table regression remained intact at 390px: labelled 333px wrappers retained 760px and 700px internal table widths with zero document overflow.
- Production after screenshots at 390px and 1440px replaced the local after captures for all four affected pages. The final documentation commit is the commit containing this release-state entry and must match `origin/main` in the final delivery.

## Vehicle Wash Water Reclaim cluster — 2026-08-11

This section is the authoritative implementation and QA record for the latest strict new-cluster discovery cycle.

### Discovery decision

- Starting state: clean `main` at `2d5130e679b4467da5ab9f1471c51db40fd24727`, equal to fetched `origin/main` and the remote `main` ref.
- Starting inventory: 74 public pages — 7 core, 5 system hubs, 37 tools, 16 guides and 9 references.
- Thirteen new families were investigated against current search results, free tools, primary sources, the repository inventory and mandatory gates A–I: professional vehicle-wash reclaim, hydronic heating, RV water systems, domestic hot-water recirculation, aquarium water management, pool/spa circulation, hydroponic nutrient water, boiler make-up/blowdown/condensate, water-heater performance, pressure-washer hydraulics, brewing water chemistry, mobile-food water/wastewater and seasonal winterization.
- Full candidate scoring, intent bundles, competitor evidence, failure reasons and source URLs are in `docs/new-cluster-discovery-2026-08-11.md`.
- Final decision: **GO — Vehicle Wash Water Reclaim Planning**. It passed every gate with a distinct professional process-water user, more than seven connected intent bundles, five independent repeat-use tools, an authoritative-method/open-workflow gap, a coherent meter-to-monitor sequence, user-entered data only and a clearly bounded quantity/economics scope.
- The main opening is not an absence of published data. EPA, DOE and the International Carwash Association publish useful estimating ranges, balances and study evidence, while current free results are fragmented among PDFs, equipment sales material and single-purpose consumer calculators. The implemented cluster connects those decisions without selecting treatment or approving reuse/discharge.

### Public implementation

- New system hub: `/systems/vehicle-wash-water-reclaim/`.
- New tools: `/tools/vehicle-wash-water-use-audit-calculator/`, `/tools/wash-water-reclaim-balance-planner/`, `/tools/reclaim-buffer-tank-simulator/`, `/tools/spot-free-rinse-ro-production-planner/` and `/tools/vehicle-wash-reclaim-savings-calculator/`.
- New guides: `/guides/meter-vehicle-wash-water-use/` and `/guides/plan-vehicle-wash-water-reclaim-retrofit/`.
- New reference: `/reference/vehicle-wash-water-stream-map/`, with a labelled, keyboard-focusable 760px internal table surface for narrow screens.
- The five calculation engines live in `assets/js/tools/vehicle-wash-tools.js`. They cover metered per-vehicle use, fresh/reclaim/discharge mass balance, a minute-step peak buffer simulation with return delay/reserve/overflow/shortfall, spot-free RO production/feed/reject/peak storage and water/sewer/operating-cost savings with simple payback.
- The Tools Finder now classifies 42 cards across six systems. The homepage, shared system navigation, Tools/Guides/Reference hubs, sitemap, `llms.txt`, metadata and inventory documentation expose the new workflow.
- The exact five-tool implementation contract, formulas, inputs, units, validation, worked examples, sources, boundaries and QA matrix are in `docs/vehicle-wash-water-reclaim-expansion.md`.
- Safety boundary: the cluster estimates quantities and economics only. It never selects treatment, declares reclaimed-water quality, approves cross-connections/exposure or authorizes wastewater, RO reject, backwash, purge or sludge routing.
- Protected area: the complete homepage badge block containing KittyLaunch, SellWithBoost, Twelve Tools, Findly and BoostDomainRating remains present in its original order and markup contract.

### Local verification

- Generated inventory: 83 public pages — 7 core, 6 system hubs, 42 tools, 18 guides and 10 references; sitemap parity 83.
- Static QA passed unique metadata, canonical/robots/Open Graph, JSON-LD, exact GA4, sitemap parity, tool contracts, responsive tables, JavaScript syntax and repository string scans.
- Navigation QA passed 85 repository HTML documents with all local links and assets resolved.
- Calculation QA passed all prior suites plus 65 independent vehicle-wash numeric, conservation, unit-equivalence, boundary and invalid-state checks.
- Actual in-app browser QA passed 83 pages at 390, 768, 1024, 1280 and 1440px (415 renders), all 42 tool calculations, five vehicle-wash invalid-input/stale-result checks, shared SI/US conversion, reset, copy feedback and print action, mobile navigation and 25 Tool Finder checks.
- Vehicle-wash Finder evidence: `reclaim` search 5, Vehicle Wash system 5, Simulator type 2, Vehicle Wash + Simulator 1, explicit empty state 0 and reset 42.
- Responsive-table evidence: 15 checks across the five widths; at 390px the new stream map retained a 760px table inside a 333px labelled internal-scroll region. Document overflow, table clipping, broken images, console errors, page errors, failed assets and internal 404s were all zero.
- Representative 390px vehicle-wash hub and normal desktop stream-map layouts passed direct visual inspection.

### Deployment record

- Implementation commit: `44c66b2db2b939424e61072b17edf8bc757c5474` (`Build vehicle wash water reclaim cluster`). Local `HEAD` and `origin/main` matched after push.
- GitHub Pages deployment succeeded for that exact SHA in `pages build and deployment` run `https://github.com/canghun13/watersystemsbench/actions/runs/31454323861`; the run completed at `2026-08-11T03:05:47Z`.
- Production HTTP verification passed for the homepage, system hub, all five new tools, retrofit guide, stream-map reference and Tools hub. Every checked page returned 200 with its exact canonical, exact GA4 and a release-specific marker.
- Production `sitemap.xml` returned 200 with exactly 83 URLs and the new system hub.
- Live 390px browser verification passed all five new tool calculations, Vehicle Wash Finder filtering (5 of 42), the hub and the stream map. The stream map retained a 760px table inside a 333px labelled wrapper; document overflow and console errors were zero.
- The production homepage retained exactly one instance of each protected KittyLaunch, SellWithBoost, Twelve Tools, Findly and BoostDomainRating badge and had zero horizontal overflow.
- The final documentation commit is the commit containing this completed deployment record; it must match `origin/main` in the final delivery.

## Production documentation boundary and QA analytics isolation — 2026-08-13

This section is the authoritative implementation, QA and release record for preventing repository-only documentation from being published and preventing automated browser QA from contaminating GA4.

### Starting evidence and root cause

- Starting state: clean `main` at `129628268982be886f086259aefdfc135f1912e5`, equal to fetched `origin/main` and the remote `main` ref.
- The repository still contains 83 public pages: 7 core pages, 6 system hubs, 42 tools, 18 guides and 10 references. The sitemap also contained exactly 83 public URLs and no `/docs/` URL.
- User-provided Search Console evidence showed repository planning pages receiving search impressions, including the page inventory with up to 39 impressions in the reported period. Treat those figures as externally supplied evidence rather than repository-generated telemetry.
- Before the fix, `/docs/page-inventory.html`, `/docs/information-architecture.html` and `/docs/project-plan.html` each returned HTTP 200 from production and exposed internal planning content.
- Root cause: GitHub Pages built directly from `main` with Jekyll defaults and no explicit publication boundary. Markdown under the tracked `docs/` directory was therefore converted and published even though those routes were absent from the sitemap and public navigation. A `robots.txt` rule alone would not remove the content or change its HTTP status.
- Previous automated browser QA loaded the production GA4 script on every local page render. Existing GA data may therefore include QA traffic and must not be treated as a clean historical baseline.

### Production and QA boundaries

- `_config.yml` now excludes `docs`, `tools-qa`, repository metadata, package metadata, `README.md` and `handover.md` from the GitHub Pages artifact. The tracked documentation and full Git history remain intact.
- The publication-boundary QA verifies the explicit Jekyll excludes, exactly 83 allowlisted public HTML routes, no public link to `/docs/`, no docs entry in `sitemap.xml` or `llms.txt`, and no repository-only file in the simulated production artifact.
- The production pages retain the exact GA4 property `G-7FB08YPX7C`. No analytics tag, site content, visual design, tool, formula, system cluster or badge block was removed or changed.
- The local QA server rewrites only analytics script requests whose hostname exactly matches one of six approved hosts: `www.googletagmanager.com`, `googletagmanager.com`, `www.google-analytics.com`, `google-analytics.com`, `analytics.google.com` or `stats.g.doubleclick.net`.
- Analytics requests are replaced by a local no-op response and counted. Ordinary Google, documentation and unrelated network hosts are not blocked. A shared standard-Playwright route helper uses the same exact-host classifier for future runners.
- The clean GA observation baseline starts on `2026-08-13` after this boundary is deployed. Pre-baseline analytics remain potentially contaminated by automated QA.

### Local verification

- Generation retained exactly 83 public pages. Publication-boundary, analytics-isolation, static and navigation QA passed; navigation now checks 83 public route documents plus the two runtime HTML partials rather than treating repository docs as public pages.
- Calculation QA passed unchanged, including all 65 vehicle-wash numeric, conservation, unit-equivalence, boundary and invalid-state checks.
- Actual in-app browser regression passed 83 pages at 390, 768, 1024, 1280 and 1440px: 415 renders with zero navigation, missing-H1, overflow, broken-image, workflow-arrow or responsive-table failures.
- During the 415-render matrix, 415 analytics loader requests were intercepted and zero completed. During interaction QA, 56 additional analytics loader requests were intercepted and zero completed.
- All 42 tool calculations passed. The five vehicle-wash tools passed invalid-input blocking and stale-result removal; shared SI/US conversion, reset, copy feedback and print action passed.
- Tool Finder passed `reclaim` search 5, Vehicle Wash system 5, Simulator type 2, Vehicle Wash + Simulator 1, explicit zero-result state 0 and reset 42. At 390px all four controls were 44px high with no horizontal overflow. Mobile navigation opened and exposed all public system links.
- The three responsive table surfaces passed at all five widths. At 390px the greywater tables remained 760px and 700px inside 333px labelled scroll regions; the vehicle-wash stream map remained 760px inside a 333px labelled scroll region.
- The homepage retained visible KittyLaunch, SellWithBoost, Twelve Tools, Findly and BoostDomainRating badges. Browser console errors, page errors, asset failures, internal 404s, document overflows and table-clipping failures were zero.

### Deployment record

- Implementation commit: `e54a765292b5588262b235c02cea65117c343671` (`Block production docs and isolate QA analytics`). It was pushed to `main` and matched the remote `main` ref.
- GitHub Pages deployment succeeded for that exact SHA in `pages build and deployment` run `https://github.com/canghun13/watersystemsbench/actions/runs/31676098842`; the run completed successfully at `2026-08-13T07:02:39Z`.
- Production verification used cache-bypassing HTTP source requests without executing client JavaScript, so the verification itself did not send GA events.
- `/docs/page-inventory.html`, `/docs/information-architecture.html` and `/docs/project-plan.html` each returned HTTP 404 both with and without a cache-busting query. No internal planning marker was present in any returned body.
- The homepage, `/tools/` and `/systems/vehicle-wash-water-reclaim/` returned HTTP 200 and retained exact GA4 `G-7FB08YPX7C`. The Tools page retained 42 classified cards and no `/docs/` link.
- Production `sitemap.xml` returned HTTP 200 with exactly 83 URLs and zero `/docs/` URLs.
- The homepage retained exactly one link for each protected KittyLaunch, SellWithBoost, Twelve Tools, Findly and BoostDomainRating badge destination.
- The final documentation commit is the commit containing this completed release record; it must match `origin/main` after the follow-up deployment succeeds.

## New Workflow Cluster Discovery — 2026-08-20

This section is the authoritative handover for the strict post–Vehicle Wash expansion search. Full candidate contracts, scores, long-tail groups, competitor URLs, Tool-independence tables and Gate A–I evidence are in `docs/workflow-cluster-discovery-2026-08-20.md`.

### Start state and exclusion boundary

- Repository: https://github.com/canghun13/watersystemsbench
- Starting state: clean `main` at `6cf4e45368ddb0ddbe0101149cd0bc99bb6353c2`, equal to fetched `origin/main` and the remote `main` ref.
- Starting inventory: 83 public pages — 7 core pages, 6 system hubs, 42 tools, 18 guides and 10 references; sitemap count 83.
- All previous discovery/review documents were read in full before research. The exclusion list contained Greywater and Vehicle Wash plus 21 prior NO-GO families: water loss/leakage, commercial building distribution, stormwater/site drainage, septic, cooling tower, construction dewatering, livestock/stockwater, wastewater pump stations, pond/reservoir, hydronics, RV water, domestic hot-water recirculation, aquarium, pool/spa, hydroponics, steam boiler/condensate, water heaters, pressure washers, brewing water, mobile food units and winterization/drain-down.
- No excluded family was renamed, narrowed or counted as new. No RECONSIDERATION was opened because current external evidence did not overturn a prior conclusion.

### New candidates and external evidence

Thirteen genuinely new families were researched through calculator, sizing, planner, audit, capacity, water-use, storage, cost, performance, maintenance and troubleshooting query groups. No search-volume, CPC, keyword-difficulty, GSC or GA4 numbers were available or invented.

| Candidate | Monetization /40 | Demand /35 | Gap /25 | Total | Gate result |
| --- | ---: | ---: | ---: | ---: | --- |
| Commercial ice-machine water and capacity planning | 36 | 30 | 10 | 76 | FAIL G |
| Dust-suppression water logistics | 36 | 28 | 8 | 72 | FAIL G, H, I |
| Maple sap concentration and sugarhouse water balance | 30 | 23 | 17 | 70 | FAIL E, G |
| Resort/backyard snowmaking water supply | 34 | 25 | 10 | 69 | FAIL E, H, I |
| Commercial laundry process-water efficiency | 35 | 27 | 6 | 68 | FAIL F, G |
| Pure-water window/solar-panel cleaning | 35 | 29 | 4 | 68 | FAIL A, F, G |
| Concrete batching and wash-water control | 37 | 26 | 4 | 67 | FAIL G, H, I |
| Winery process-water and seasonal wastewater | 34 | 24 | 8 | 66 | FAIL H, I |
| Abrasive-waterjet utilities and consumables | 37 | 27 | 2 | 66 | FAIL G, H |
| Laboratory purified-water demand/distribution | 35 | 26 | 4 | 65 | FAIL F, G, I |
| Commercial warewashing water/booster planning | 36 | 28 | 1 | 65 | FAIL G, H, I |
| Hydro-vac water and spoil logistics | 35 | 22 | 6 | 63 | FAIL A, H, I |
| Pottery/ceramics studio wash-water capture | 24 | 18 | 18 | 60 | FAIL C, E, H, I |

The strongest SERP evidence included DOE, ENERGY STAR and EPA commercial ice-machine methods; interactive ice demand/bin competitors; connected dust-control water/truck/ROI calculators; WSU, USU and the North American Maple Manual; Cornell's authoritative Maple calculator suite; free snowmaking nozzle/pressure calculators; EPA commercial-laundry methods; current RO/DI window-cleaning selectors; FHWA concrete moisture worksheets; winery water/wastewater production calculators; OEM waterjet calculators; lab DI planners; public warewashing hot-water worksheets; and a current hydro-vac slurry calculator.

### Top-three deep validation and decision

- **Commercial ice machines (76):** real workflow and seven long-tail groups; four plausible tools exist for measured demand, production/bin simulation, water-use audit and operating-cost comparison. Mandatory Gate G failed because current free calculators already connect demand, operating-condition correction and bin sizing, while DOE/EPA publish the remaining audit/replacement equations. WSB would improve presentation, not fill a missing decision.
- **Dust suppression (72):** real area → application → tanker → refill → cost workflow with seven intent groups. Integrated free vendor tools already cover water, trucks, labour and ROI; safe application rates/additives remain site- and permit-specific. Gates G, H and I failed.
- **Maple sap processing (70):** real Brix → RO → evaporation → storage workflow with eight intent groups. Yield and RO concentration merge into one mass balance, evaporator water-off is too thin, and only three robust tools remain. Cornell already supplies authoritative density/pricing/business calculators. Gates E and G failed.
- Independent-site reasons—vendor neutrality, no login, SI/US support, transparent interpretation and connected next actions—were explicitly tested. None overcame the blocking competition, Tool-depth, maintenance or safety evidence.

Final decision: **NO-GO — no genuinely new workflow cluster clears the expansion bar.**

### Change and verification boundary

- Allowed documentation changes only: `docs/workflow-cluster-discovery-2026-08-20.md` and this handover section.
- Production HTML/CSS/JavaScript/generator changes: 0. New public pages: 0. Sitemap change: 0; it remains 83 URLs.
- Existing GA4, QA analytics blocking, production `/docs/` exclusion, Tool Finder, workflow arrow removal, Greywater tables, Vehicle Wash cluster and all five protected homepage badges are untouched.
- No full calculation or browser regression was run because production artifacts did not change. Documentation consistency, production-diff boundary, sitemap count and Git synchronization are the required checks for this NO-GO cycle.
- Next observation point: reopen Commercial Ice only if measured search/user evidence reveals a missing repeat decision beyond current demand/bin calculators and DOE/EPA audit methods; reopen Maple only if four independent operational decisions emerge without splitting one mass balance or duplicating Cornell.
- The final documentation commit is the commit containing this section and the discovery document; verify it against `origin/main` in final delivery.

## Search-signal existing-page upgrade — 2026-08-20

This section is the authoritative implementation and local-QA record for the search-led maintenance task. No new workflow cluster or public URL was created.

### Start state and data boundary

- Repository: `https://github.com/canghun13/watersystemsbench`
- Starting state: clean `main` at `413fb8ff57af0b5579c092d204c053f4c9b9f23c`, equal to fetched `origin/main` and the remote main ref after a safe fast-forward.
- Starting inventory: 83 public pages — 7 core pages, 6 system hubs, 42 tools, 18 guides and 10 references; sitemap count 83.
- The complete current `handover.md`, recent discovery/expansion records, public inventory, generator, QA contracts, sitemap and the two priority pages were reviewed before selection.
- Search Console was not signed in within the available browser, and no GA4 or Bing reporting connector was available. No click, impression, position, CTR or engagement number was invented. Candidate priority used the user-provided latest search observations plus a fresh SERP review on 2026-08-20.
- User-provided signal: `/tools/available-water-flow-test-calculator/` had the site's strongest recent impression signal across `water flow rate test`, `bucket flow test`, `water flow test`, `irrigation flow test`, `reticulation flow test` and `water flow rate calculator`. `/guides/well-borehole-tube-well-terminology/` had exact `tube well borehole` variants approaching first-page positions.
- Protected boundaries retained: production `/docs/` exclusion, QA analytics isolation, production GA4 `G-7FB08YPX7C`, Tool Finder, workflow-arrow removal, Greywater responsive tables, Vehicle Wash, and the complete KittyLaunch, SellWithBoost, Twelve Tools, Findly and BoostDomainRating homepage badge block.

### Candidate comparison

Scores use Search evidence 30 + Ranking opportunity 20 + User-value improvement 20 + Intent gap 15 + Implementation ROI 15.

| Candidate | Existing URL | Search evidence /30 | Ranking opportunity /20 | User value /20 | Intent gap /15 | ROI /15 | Total | Gate result |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Available Water Flow Test intent and measurement workflow | `/tools/available-water-flow-test-calculator/` | 30 | 16 | 20 | 14 | 15 | **95** | PASS A–G; selected |
| Well / borehole / tube-well terminology distinctions | `/guides/well-borehole-tube-well-terminology/` | 27 | 19 | 17 | 13 | 14 | **90** | PASS A–G; valuable, but lower immediate task completion than the selected tool |
| Irrigation flow and dynamic-pressure field guide | `/guides/measure-irrigation-flow-pressure/` | 16 | 10 | 15 | 4 | 10 | **55** | FAIL A/C; no URL-specific signal was available and its eight-step method already answers the practical sequence |
| Sprinkler Zone Capacity Planner alignment | `/tools/sprinkler-zone-capacity-planner/` | 14 | 10 | 17 | 4 | 9 | **54** | FAIL A/C; related external intent exists, but no page-specific signal or material current-page deficiency was demonstrated |

The terminology guide remains a strong observation candidate because live results were mainly government FAQs, broad technology explanations, encyclopedic definitions and technical PDFs. A direct construction/usage comparison could help, but the selected tool had the stronger site signal and a more immediate measurement-to-decision gap.

For flow-test queries, the current SERP included dedicated bucket-test calculators, irrigation retailers, video instructions and field questions. The strongest competitor combined a container picker, stopwatch, step sequence, repeat advice, flow/pressure distinction and zone next step in one interaction. Water Systems Bench already had the more transparent raw-flow calculation and repeat-test spread, but the page exposed only generic field labels and generic result guidance. It did not tell the user which test point represents the project, how bucket and meter modes differ, why every repeat must use the same volume/condition, why very short fills magnify timing error, or how the raw number differs from a design allowance.

### Decision and implementation

Final decision: **GO — upgrade the existing Available Water Flow Test Calculator.** All mandatory gates A–G passed. The URL, title, H1, canonical, calculation formula and unit conversions remain unchanged.

- The description now matches both bucket/container and meter-test intent without keyword repetition.
- Measurement-method choices now say `Bucket / container fill test` and `Water meter volume difference`.
- Inline help explains container volume versus meter difference, one common volume for repeat trials and comparable test conditions.
- The article now provides a four-step bucket procedure, meter start/end procedure, actual-connection-point guidance, faucet/hose/takeoff limitations, short-fill timing guidance, repeat-spread interpretation, dynamic-pressure separation and the explicit raw-flow → deliberate reserve → zone-planning handoff.
- The worked example now carries three comparable times instead of ending at one arithmetic result.
- The related workflow now leads first to the measurement guide, then the zone planner, Irrigation hub and pressure troubleshooter.
- Formula changes: none. `Flow = volume / time`, SI/US conversion and repeat-spread calculation are unchanged.
- New public pages: 0. Public count remains 83. Sitemap count remains 83; only the selected URL's legitimate `lastmod` changed to `2026-08-20`.

Files changed for the implementation and evidence contract:

- `tools-qa/generate-site.mjs`
- `tools/available-water-flow-test-calculator/index.html`
- `sitemap.xml`
- `tools-qa/qa.mjs`
- `tools-qa/browser-results.json`
- `tools-qa/browser-qa.mjs`
- `handover.md`

### Local verification

- Calculation regression passed unchanged: all pump/pressure/pipe, well/storage/rainwater, irrigation, treatment, greywater and vehicle-wash suites, including 49 irrigation numeric/validation checks and 6 irrigation troubleshooting scenarios.
- Static QA passed for 83 pages, including the selected page's unchanged H1/canonical and eight new measurement-workflow markers. Navigation QA passed 83 public pages plus 2 runtime fragments.
- Publish-boundary QA passed with 83 allowlisted public routes and repository `docs/`, `tools-qa` and planning files excluded. Sitemap contains 83 URLs and zero `/docs/` URLs.
- Analytics QA passed. Production source retains `G-7FB08YPX7C`; the final full local browser regression intercepted 415 analytics loader requests and completed 0.
- The final post-change full browser regression reran 415 real renders (83 pages × 390, 768, 1024, 1280 and 1440px). Every viewport completed 83/83 pages with zero document overflow, critical-element clipping, inaccessible table overflow, broken images or browser warnings/errors. The established 42-tool interaction report also remained passing.
- New targeted real-browser QA passed the selected page at 390, 768, 1024, 1280 and 1440px. Each width had zero document, H1, header, result-panel or primary-reading clipping/overflow. Form, result, long help text, article, related links, sidebar, footer and responsive navigation were visually inspected.
- Eight targeted interaction scenarios passed: normal three-trial SI result (`30.05 L/min`), equivalent US result (`7.94 GPM`), zero-time validation, valid → invalid stale-result clearing, invalid → valid recovery, reset, copy and print. The mobile menu opened; controls remained labelled; broken images and browser warnings/errors were zero.
- Related local pages returned HTTP 200: homepage, Tools hub, Irrigation hub, measurement guide and Sprinkler Zone Capacity Planner.

### Release and live verification

- Implementation commit: `4e60b13d49bf83626d6e8d29f5f4b1da0d41a0a0` (`Improve available water flow test guidance`). It was pushed to `main`; `git ls-remote origin refs/heads/main`, local `HEAD` and fetched `origin/main` all matched that SHA before this follow-up documentation commit.
- GitHub Pages run `32369496319` deployed the exact implementation SHA successfully on 2026-08-20: `https://github.com/canghun13/watersystemsbench/actions/runs/32369496319`.
- A cache-bypassing live HTTP check returned 200 for the selected tool, Tools hub, Irrigation hub, measurement guide, homepage and sitemap. The selected live HTML contained `Run a reliable bucket flow test`, the established canonical, production GA4 and the upgraded content.
- Live `sitemap.xml` contained 83 URLs, zero public `/docs/` routes and the selected route's `2026-08-20` last-modified date. `/docs/page-inventory.html`, `/docs/information-architecture.html` and `/docs/project-plan.html` each returned 404.
- The live homepage retained the exact KittyLaunch, SellWithBoost, Twelve Tools, Findly and BoostDomainRating badge targets/assets.
- Mobile and visual behavior was verified in the real browser against the exact deployed artifacts locally at 390, 768, 1024, 1280 and 1440px; the live-domain verification used non-executing HTTP retrieval so automated production verification did not create GA4 traffic. Combined evidence was exact deployed SHA + successful Pages run + live updated source + five-width browser render of that same source revision.
- Browser-automation analytics completed requests: 0. Console warnings/errors, page errors, asset failures, internal 404s, overflow and clipping on the targeted browser run: 0.
- Final public count: 83. Final sitemap count: 83. New URLs: 0.
- The final documentation commit is the commit containing this release entry. Verify it against `origin/main` and a clean working tree in the final delivery.
