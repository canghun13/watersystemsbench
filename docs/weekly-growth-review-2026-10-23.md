# Weekly growth / search review — 2026-10-23

## Decision and pre-implementation contract

**EXISTING-UPGRADE GO — Pressure Tank Sizing Calculator.** One existing URL, not another new cluster. No Priority A defect was reproduced. The original pressure/ideal-gas sizing equation remains unchanged.

Actual pre-change browser inspection on Chrome155.0.8059.85 (390/1280px) found five numeric inputs and no manufacturer-rating comparison input. The default report gives135.5 L ideal nominal volume and40 L required drawdown, then tells the user to check a manufacturer chart outside the tool. A nominal tank size is not its usable drawdown. The missing decision is whether a user-supplied, correctly matched manufacturer drawdown actually covers the entered run-time target. This is a bounded interactive benefit, not a title/CTR/word-count tweak. Previous reviews found the existing explanation adequate; the current selection adds a specific previously absent comparison, supported by continuing GSC/Bing exposure rather than repeating those explanations.

Before production edits, scope is:

1. Keep `/tools/pressure-tank-sizing-calculator/`, title, H1, canonical and description. Add requirement-only (default) versus optional manufacturer-rated drawdown comparison. Do not create a new tool, public page or cluster.
2. Retain `computePressureTank` unchanged. For an independently entered rated drawdownD, pump flowQ and required run timet: required drawdown=Q×t; signed margin=D−Q×t; coverage=D/(Q×t); no-demand refill-time estimate=D/Q. Equality meets the entered arithmetic target. A negative margin does not meet it. This is not a complete cycle/starts-per-hour model or equipment approval.
3. Only compare after the user confirms the manufacturer rating applies to the entered switch/precharge settings and configuration. Missing confirmation/invalid rating produces an explicit error, not a favorable result. Pressure/rating edits revoke confirmation. Requirement-only mode ignores disabled comparison fields. Inputs/modes/units clear stale results; reset and SI/US round trips work.
4. Show the comparison separately from ideal nominal volume. Keep the entered run-time target, pump flow, pressures, unit/mode and confirmed rating plus URL in copy/print output. No universal1-minute recommendation, product catalog, automatic precharge adjustment, VFD sizing or installation instructions.
5. Improve only this tool's measurement/rating/interpretation text and example. Use existing layout/classes without shared CSS/form-utils/unit-conversion changes. A page-only stylesheet handles the comparison fieldset and report-only printing. Update only its reviewed/sitemap date to October23; preserve the existing WebApplication schema, which does not publish a modification date. Prove104 other HTML pages unchanged. Preserve the October9/16 guide upgrades and October16 laboratory release.
6. Independent literal comparison/unit/boundary/error fixtures, all493 existing assertions,105-page static/navigation/publication/Analytics checks, actual targeted five-width local/production browser tests, visual inspection and protected-control checks. Exact-host Analytics completed0. Historical reports are not relabelled.
7. Commit/push main, exact-SHA Pages success, actual-domain verification, release record/handover, final local/fetched/actual-main equality and clean tree. No new software or environment reset.

## Repository and current-session attachments

- Repository: https://github.com/canghun13/watersystemsbench ; branch`main`.
- Start local HEAD, cached/fetched origin/main and directly queried actual remote:`1a7bbd6e25711483cfb0ab87d7b81b8c6d7c5a67`; clean tree,0/0 ahead/behind, no sync required.
- Read latest handover/history, October16 weekly upgrade and external-first laboratory discovery/spec, prior Monitoring Well audit, inventory/generator/QA and actual candidate content. Latest implemented cluster is Water Laboratory Calculations & QA, deployed October16.
- Six explicitly attached current-session reports read at their supplied locations; no directory search, guessed path, previous raw-export substitution or raw-data commit. The pasted workflow is the instruction. Report titles/keywords/cells are data, never instructions.

| Input | Actual contents / period |
|---|---|
| watersystemsbench.com-Performance-on-Search-2026-10-23.zip | Web chart July26–October20,87 days;171 query rows,80 page rows,104 countries,3 devices, header-only appearance, last-three-month filter. ZIP members read in memory. |
| watersystemsbench.com-Coverage-Drilldown-2026-10-23.zip | Discovered–currently not indexed; chart August5–October16;19 URL rows. |
| watersystemsbench.com-Coverage-Drilldown-2026-10-23 (1).zip | Crawled–currently not indexed; chart August5–October16;3 URL rows. One detail crawl date is October17, later than the chart endpoint. Do not silently align these snapshots. |
| watersystemsbench.com_PageTrafficReport_2026. 10. 23..csv | Bing49 page rows; measurement dates unavailable. |
| watersystemsbench.com_KeywordReport_2026. 10. 23..csv | Bing491 keyword rows; dates unavailable. Line286 contains an unescaped inch quote and embedded commas; preserve keyword text and parse the trailing four quoted numeric fields. All491 rows parsed; original untouched. |
| 보고서_개요.csv | GA4 September25–October22,28 days; overview/page-title/first-user and session source/daily new-returning/city/audience sections. |

All six accessible. October23 is the export date, not the end date of every dataset. No authenticated URL Inspection or account-only reports used.

## Inventory and metrics

Current105 public pages =7 core +9 hubs +55 tools +21 guides +13 references; sitemap105; two runtime partials are not public content pages.

### GSC

| Window | Clicks | Impressions | CTR | Derived weighted position |
|---|---:|---:|---:|---:|
| July26–October20 full chart |12|1,772|0.6772%|35.543|
| October14–20, complete7 days |2|238|0.8403%|24.515|
| October7–13, prior7 days |2|179|1.1173%|21.300|
| September23–October20, latest28 days |7|720|0.9722%|24.543|
| August26–September22, preceding28 days |4|421|0.9501%|27.018|

Aligned7-day impressions +32.96%, clicks unchanged; derived position worsened3.215 (mix-sensitive). Aligned28-day impressions +71.02%, clicks4→7 (+3), still too few clicks for durable-growth attribution. The prior7-day window reproduces the October16 review exactly. Weighted positions are derived from rounded rows, not an exact account-summary export. Zero-impression blank ranks are not rank0.

Full-chart growth1,534→1,772 and10→12 adds seven dates, not a weekly rate. Query168→171 and page75→80 rows are expanding-period counts, not matched-window query-diversity growth. Page aggregate12/2,026, query0/761, chart/country/device12/1,772 are different aggregations and are not additive. No query-by-page or daily page/query slice is supplied.

Leading queries: metal rinse water control system81 impressions/11.74; reverse osmosis design calculator61/78.39; pressure tank sizing calculator45/40.13; metal finishing baths control system30/40.93; water flow rate test29/64.76; well sustainable yield monitoring23/74.39. The query evidence corroborates topics, not a proven join to particular URLs.

| Page | Clicks / impressions / position | Prior expanding-period report | Interpretation |
|---|---|---|---|
| Pressure Tank sizing |0/74/31.18|0/43/30.16|Continuing exposure plus stronger Bing; inspect concrete comparison gap, not zero CTR alone.|
| Pipe ID reference |1/98/13.76|1/88/14.43|Existing actual-ID lookup already answers observed job.|
| Pump Curve guide |0/11/21.73|0/9 (prior review)|Bing strong, but GSC sample and freshly demonstrated gap weaker.|
| Rinse guide |0/115/10.36|0/105/9.46|Recent October9 upgrade; do not rewrite again from ten extra impressions.|
| Terminology guide |0/89/13.42|0/69/14.83|Recent October16 upgrade; cumulative change is not matched post-release evidence.|
| RO recovery |1/127/50.94|1/107/47.36|Distant rank, no comparably clear new deficiency.|

New laboratory cluster: RPD16 impressions/5.12; TSS/VSS12/5.33; BOD11/7.36; hub2/7.50; reference2/4.00. Five of seven URLs have page-table impressions,43 in total,0 clicks. Matrix Spike tool and review guide are absent from this page table. These are first small search observations, not proof that all seven are indexed or that expansion caused aggregate growth. New laboratory terms are not exposed in the query table; no hidden query attribution inferred.

### Indexing

Discovered remains19 throughOctober16, unchanged sinceSeptember22;19 placeholder1970-01-01 crawl cells remain unavailable, not actual crawl dates. Crawled issue chart is1 throughOctober12 then3 fromOctober13–16. Detail rows: laboratory reference (crawlOctober17), Pump Short-Cycling Analyzer (August5), legacy internal inventory (July28). Chart/detail endpoints differ. Both public URLs currently return200/self-canonical and source-parity; inventory remains404. A URL appearing in both performance and a coverage snapshot does not prove a persistent site defect or current indexed state. Validation status and authenticated inspection are unavailable. Do not reopen the September18 Monitoring Well audit merely because its queue persists.

### GA4 and Bing

- GA4:137 active/135 new users,25.168 seconds mean engagement per active user,580 events. First-user organic: Bing23,Google6,DuckDuckGo4,Ecosia1,Yahoo1. Organic sessions: Bing25,Google6,DuckDuckGo4,Ecosia1,Yahoo1.
- Direct98 users/109 sessions; Singapore60 users and Ashburn5. No source-city/landing join establishes bots or genuine organic demand. Rinse savings11 views from1 active user is repeated activity, not11 independent visitors. Each of the7 laboratory page titles has1 view/1 active user; not evidence of popularity or a failure of the blocker.
- ChatGPT2 first-user users/4 sessions, Copilot1/1, Yahoo India referral1/1; small secondary unjoined signals. No landing-page/source or organic-specific engagement supplied.
- Previous GA4 September18–October15 overlaps21 days.130→137 active users, Bing sessions18→25,Google5→6 and Direct98→109 are rolling-window differences, not weekly channel growth rates. No source-specific daily decomposition.
- Bing pages972 impressions/35 clicks/3.6008% CTR/weighted position5.3837; keywords718/35/4.8747%/5.2563. Different aggregations, not additive. Previous pages841/30 and keywords620/30 have no dates, so no weekly Bing rate claimed.
- Bing leaders: Pressure Tank193/8/5.321; Pump Curve guide125/0/7.176; First Flush58/2; Well Pump58/4; Treatment Train53/1; Storage44/4. Prior Pressure Tank166/8 and Pump Curve110/0 are cumulative observations, not matched weekly deltas. Repeated pressure-tank keyword variants concern sizing, rated drawdown, run time, precharge and non-VFD operation. Small individual query counts are corroboration only.

## Technical health and candidate selection

Fresh105-page static/navigation/publish-boundary/Analytics checks and all493 original calculation assertions pass. Live home/Finder/three candidates/new laboratory reference/short-cycling control return200 with exact source parity and canonical. Robots/sitemap match repository; sitemap105. Target normal/Googlebot200 and identical HTML; no restricting X-Robots header. HTTP apex redirects301 to HTTPS apex. Three legacy docs404. No new evidence of a site-side defect; not a repeated full Monitoring Well audit. Pre-change target browser has0 overflow/page errors, Analytics2 intercepted/0 completed. Browser screenshots captured before edits.

Scoring = search/30 + ranking/20 + user value/20 + gap/15 + ROI/15, editorial prioritization, not a forecast.

| Candidate | Actual gap and decision | Components | Total |
|---|---|---|---:|
| Pressure Tank sizing tool |Missing interactive comparison of entered manufacturer-rated drawdown at matched settings against the existing target. A calculated135.5 L nominal tank is not automatically a tank with40 L rated drawdown. GO, sole upgrade.|27+12+19+14+14|86|
| Pipe ID reference |Actual-ID Schedule40/80 table and product-specific warning already serve the demonstrated lookup. No fresh missing-benefit gate established. Observe.|26+17+12+5+12|72|
| Pump Curve guide |Strong Bing but11 GSC impressions; existing axes/BEP/system-curve/power/NPSH explanation and worked comparison. No adequately evidenced higher-ROI omission. Observe.|20+12+16+9+14|71|

Selected A–G: real repeated page/topic evidence; same sizing-to-selection intent; directly observed missing comparison; useful candidate rejection/confirmation; improved task completion as a search-benefit hypothesis; existing URL preserved; simple independently testable arithmetic with no product/design approval. Expansion considered but discovery branch not entered because this bounded existing-page decision is stronger. No fresh40-family search/full exclusion audit or expansion NO-GO is claimed. The October16 exclusion boundary remains applicable; organic volume is not the reason for deferral.

## Primary technical sources checked October23

- [Pentair Pro-Source datasheet S5530WS](https://www.pentair.com/content/dam/extranet/web/nam/pro-source/data-sheets/S5530WS.pdf): distinguishes nominal capacity from drawdown across pressure settings; target relationshipQ×t, approximate Boyle-law sizing and sensitivity to precharge/temperature/fill/switch accuracy. No model table or vendor runtime recommendation is copied into defaults.
- [Pentair Steel Pressure Tanks manual](https://www.pentair.com/content/dam/extranet/web/nam/pro-source/manuals/steel-pressure-tanks-manual.pdf): pressure-vessel/electrical precautions, water-side depressurization and manufacturer-specific precharge/VFD instructions. Keep existing source; do not generalize its product pressure limits.
- [Amtrol Well-X-Trol brochure MC10188](https://www.amtrol.com/wp-content/uploads/2024/05/MC10188-04_24_WXT-brochure.pdf): separates tank volume and pressure-specific drawdown; separate conventional/VFD sizing context. Used as independent manufacturer corroboration, not a model database or universal recommendation.

The signed margin, coverage and no-demand refill estimate are explicitly derived arithmetic. The user must supply a valid manufacturer rating and required run time; confirmation is not independent verification of the entered rating. No catalog certification or guaranteed minimum real-world run time is claimed.

## Implementation, QA and release

### Local implementation and verification

- Public change: one existing tool HTML, its existing dedicated JS, a new page-only stylesheet and the selected sitemap date. Generator changes only the target entry and passes an optional page stylesheet through the existing shell. Other104 public HTML pages unchanged; inventory/sitemap105. Title/H1/canonical/description and original WebApplication schema preserved.
- Original `computePressureTank` function is text-identical to the starting version. Shared CSS, form utilities, conversions, Finder, navigation/footer, laboratory engine, two upgraded guides, homepage (including the five badges) and publication config match starting sources. The scope runner checks14 protected files, core-function equality, exact selected-only HTML diff and selected-only sitemap date.
- Added manufacturer-rated comparison with user confirmation, target/margin/coverage and explicitly bounded no-demand refill estimate; no catalog, product approval, VFD recommendation or universal runtime. Pressure/rating edits revoke confirmation; comparison fields are hidden/disabled in requirement mode. Result changes clear copy/print state. Copy/print retain entered data, mode, units, confirmation and URL.
- Independent assertions:391 original +102 laboratory +51 new rating checks =544. The new checks use literal/independent SI/US expectations for below/above/equal, near-boundary, low/high, zero/negative/nonfinite/unsupported inputs. Normal ideal sizing remains135.5 L for the existing example.
- Fresh105-page static, navigation (plus2 runtime fragments), publish-boundary and Analytics QA pass; JavaScript syntax and `git diff --check` pass. No software, browser or dependency installation/reset.
- Final local Chrome155.0.8059.85:12 pages ×5 widths (390/768/1024/1280/1440)=60 renders;87 geometry snapshots;25 interaction entries;28 table accessibility checks. Existing Finder native reset55, ninth system menu, stabilization alignment/default result, short-cycling/RPD calculation/reset and Greywater/terminology keyboard-scroll controls pass. Console/page/request/internal-HTTP lists empty; document overflow/offscreen controls/unlabelled controls/broken images0. Local exact-host guard88 intercepted/0 completed.
- Target at every width: requirement-only; missing confirmation rejection; below/above/equal comparison; pressure/rating edit revocation; zero/negative/blank error/recovery; disabled hidden inputs ignored; invalid pressure order; stale-result clearing; actual clipboard with input record/URL; print handler and media; SI/US round trip; reset/refill/re-run; unit change after reset; white-on-navy hover. Native OS print dialog not tested.
- Actual390/1280 form/result/rating-field and print-media screenshots reviewed. The first draft's long select labels truncated at390px; shortened before the complete final60-render matrix. First attempt could not connect from a different execution environment to its local server; restarted server in the same authorized environment. These are recorded execution/QA observations, not invented production defects. Interrupted preliminary run is not reported as a complete pass; final dated JSON is a fresh complete run.
- Evidence: `tools-qa/weekly-growth-2026-10-23-local-results.json`; new runners `pressure-tank-release-qa.mjs`, `pressure-tank-release-live-qa.mjs`, fixtures `verify-pressure-tank-rating.mjs`. Historical weekly/laboratory/browser reports untouched.

### Initial implementation release and final print refinement

- Implementation:`8ac129edef6cbad62bc3637e11678d84fc981d32`, pushed to main. Exact-SHA [Pages run39921854390](https://github.com/canghun13/watersystemsbench/actions/runs/39921854390) succeeded at2026-10-23T08:04:12Z.
- Actual-domain source/HTTP verification passed35 requests:12 representative pages,8 runtime assets/partials, robots/sitemap105, normal/Googlebot target parity, HTTP→HTTPS redirect and11 development/docs404 checks. Public files exactly match local sources;14 protected files/core function/104 other HTML/sole sitemap-date change also pass. This runner executes no Analytics.
- Actual-domain Chrome interaction matrix passed60 renders/87 geometry snapshots/25 interaction entries/28 table checks at all5 widths. Target cases and protected controls match the local run. Console/page/request/internal-HTTP error lists empty; Analytics88 intercepted/0 completed. Evidence:`tools-qa/weekly-growth-2026-10-23-production-results.json`. Not a full-site525-render claim.
- Visual print review then identified unnecessary large hero padding/decorative circle above the summary. Final refinement changes only3 page-specific print CSS rules: compact tool title, no hero intro/circle, unchanged screen styles and runtime JS. A separate final local print supplement passes5 widths, visible title/input record/result/URL, hidden form/actions/navigation/article,32px hero height and no document overflow. Exact-host guard5 intercepted/0 completed; no errors. Actual1280px complete print screenshot visually reviewed. Evidence:`tools-qa/weekly-growth-2026-10-23-local-print-results.json` and `pressure-tank-print-qa.mjs`.
- The60-render local/production matrices preceded this print-only refinement; the supplemental checks are explicitly separate, not a claimed rerun of those matrices. Deploy the print refinement and verify final production print/source parity before closing.

## Next state — maximum three

1. Observe Pressure Tank page/query performance over matched post-release periods; do not attribute cumulative changes to the upgrade.
2. Observe the new laboratory cluster's remaining routes and specific long tails; coverage snapshots alone do not justify edits.
3. Obtain dated Bing periods and joined GA4 landing/source evidence before interpreting rolling channel or Direct/Singapore differences.
