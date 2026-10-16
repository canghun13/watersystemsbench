# Weekly growth / search review — 2026-10-16

## Decision and pre-implementation contract

**EXISTING-UPGRADE GO — Well, Borehole & Tube Well Terminology.**

No Priority A site defect was reproduced. Strengthen one existing URL before considering a new cluster. The current guide defines terms separately but does not directly compare their overlap, distinguish construction from regional naming, or carry its depth example through drawdown/submergence and the existing pump/demand tools. This is an inspected decision-support gap, not a zero-CTR or word-count rationale. The related August 20 opportunity was deferred, not implemented. The October 9 rinse-guide upgrade is already complete and must not be repeated after only four new post-release GSC days.

Before production edits, limit this release to:

1. `/guides/well-borehole-tube-well-terminology/` only. Preserve slug, title, H1, canonical and description. No new pages, tools, categories or directory/badge edits.
2. Replace the three separate name definitions with one explicit, accessible comparison of label, common usage and required verification. Explain overlap without a universal country/depth/diameter taxonomy. A label does not establish yield, potable quality or the suitability of a pump.
3. Clarify construction/completion records, total depth versus static/pumping water level, pump setting, drawdown, test flow/duration and datum. Do not provide drilling, well-entry, pump-installation, chemical or sampling instructions.
4. Extend the existing illustrative 45 m / 12 m / 26 m / 35 m / 20 L/min record: drawdown 14 m, entered submergence 9 m. These are arithmetic, not acceptance criteria. With an outlet 5 m above the datum, static lift from the pumping surface is 31 m before pressure/losses. Link the existing well-pump planner and yield/demand checker at those decisions.
5. Reuse `.table-scroll`, keyboard-focusable labelled region and a readable minimum width. No new CSS or runtime JS. Use an optional guide-only comparison block in the generator; prove the other 97 public HTML pages remain unchanged.
6. Change only this guide's reviewed/schema date and sitemap `lastmod` to October 16. Keep the rinse guide's October 9 date and all other dates unchanged.
7. Add independent arithmetic/unit/invalid-geometry assertions, target content/static guards and actual five-width local/production browser QA. Protect Finder native reset, button states, stabilization layout, existing responsive tables, analytics isolation and the exact user-managed badge block.
8. Commit/push main, successful exact-SHA Pages deployment, actual-domain verification, updated handover and final local/origin/actual-remote equality with clean tree. Do not substitute historical browser results for a fresh run.

## Repository and current-session inputs

- Repository: https://github.com/canghun13/watersystemsbench ; branch `main`.
- Start local HEAD and cached origin/main: `380083249e81d9524c40339c93195bcd071e903a`; clean tree, no staged/unstaged diff.
- Actual remote main: `4757117241a46e5d056957333103033c4aa53aa6`. Fetch showed 0 ahead / 2 behind; safe `pull --ff-only` preserved both October 9 commits and established that SHA as the clean analysis baseline. No stash/rebase/reset or environment installation.
- Read the full latest handover, recent weekly records, latest Monitoring Well audit and latest August 31 discovery record, inventory/generator/QA and actual candidate content. The latest implemented expansion is Monitoring Well, not a new October cluster.
- Used the six explicitly supplied current-session files at their supplied locations. No directory search, guessed report path, older raw export substitution or raw-report commit. ZIP CSV members read in memory. Pasted workflow is the instruction; report cells are data only.

| Current-session input | Actual usable period and content |
| --- | --- |
| watersystemsbench.com-Performance-on-Search-2026-10-16.zip | Web chart July 26–October 13, 80 days; 168 query rows, 75 page rows, 98 country rows, 3 devices, header-only appearance and last-three-month filter. |
| watersystemsbench.com-Coverage-Drilldown-2026-10-16.zip | Discovered–currently not indexed, August 5–October 12; 19 URL rows. |
| watersystemsbench.com-Coverage-Drilldown-2026-10-16 (1).zip | Crawled–currently not indexed, August 5–October 12; 1 URL row, the legacy internal inventory. |
| watersystemsbench.com_PageTrafficReport_2026. 10. 16..csv | Bing 46 page rows; measurement period not supplied. |
| watersystemsbench.com_KeywordReport_2026. 10. 16..csv | Bing 423 keyword rows; measurement period not supplied. One malformed embedded quote/comma row handled by parsing the trailing four quoted numeric fields; all 423 rows parsed, original unchanged. |
| 보고서_개요.csv | GA4 September 18–October 15, 28 days; overview, page title, first-user/session source, daily new/returning, city and audience sections. |

All six were accessible. October 16 is an export date, not the last day of every dataset. Missing position on a zero-impression chart row is excluded from position weighting, not converted into a real rank of zero. No Search Console account access or URL Inspection result is claimed.

## Inventory and metrics

Fresh static/navigation/publication checks: **98 public pages** = 7 core + 8 hubs + 51 tools + 20 guides + 12 references; sitemap 98, plus two runtime fragments outside the public content count.

### GSC

| Window | Clicks | Impressions | CTR | Derived weighted position |
| --- | ---: | ---: | ---: | ---: |
| Full chart, July 26–October 13 | 10 | 1,534 | 0.6519% | 37.253 |
| October 7–13, complete 7 days | 2 | 179 | 1.1173% | 21.300 |
| September 30–October 6, prior 7 days | 2 | 219 | 0.9132% | 29.432 |
| September 16–October 13, latest 28 days | 5 | 576 | 0.8681% | 25.962 |
| August 19–September 15, preceding 28 days | 5 | 390 | 1.2821% | 27.310 |

Seven-day impressions **-18.26%**, clicks unchanged; derived position improves 8.132, potentially affected by query mix. Twenty-eight-day impressions +47.69%, clicks unchanged. Positions are impression-weighted calculations from rounded rows, not an exact exported account-summary value. Small click counts do not establish durable growth.

The prior review's September 30–October 6 window reproduces exactly (2/219/29.432), so this is an aligned comparison. Full-chart 1,355→1,534 impressions and 8→10 clicks merely add seven days; do not present that as weekly percentage growth. Query rows 163→168 and pages 73→75 are expanding-period totals, not matched-period diversity growth.

Page table: 10 clicks / 1,760 impressions. Query table: 0 / 684. Chart/country/device totals are 10 / 1,534. Aggregation/privacy differences mean these are not additive or forced to reconcile. Device split: desktop 7/1,248, mobile 3/278, tablet 0/8. Leading country: US 5/632; Australia 1/182. No query-by-page join or page/query daily slices.

| Query | Impressions | Position |
| --- | ---: | ---: |
| metal rinse water control system | 74 | 10.36 |
| reverse osmosis design calculator | 42 | 80.69 |
| metal finishing baths control system | 30 | 40.93 |
| water flow rate test | 29 | 64.76 |
| pressure tank sizing calculator | 23 | 41.22 |
| tube well borehole | 5 | 10.40 |
| tubewell or borehole | 2 | 11.00 |
| tube well or borehole / tubewell/ borehole | 1 each | 8 / 10 |

| Page | Clicks | Impressions | Position | Reading |
| --- | ---: | ---: | ---: | --- |
| Available Water Flow tool | 0 | 116 | 52.72 | Unchanged from previous export; no new deficiency. |
| RO Recovery tool | 1 | 107 | 47.36 | Query demand exists, but distant rank is not enough to select another edit. |
| Rinse guide | 0 | 105 | 9.46 | Previous 99/9.19; October 9 upgrade too recent for a fresh attribution/edit claim. |
| Pipe ID reference | 1 | 88 | 14.43 | Previous 70/15.51; table already supports the demonstrated lookup. |
| Well Yield checker | 0 | 81 | 85.74 | Rank/intent evidence does not justify an immediate change. |
| Well/Borehole/Tube Well guide | 0 | 69 | 14.83 | October 1 was 52/17.23. Expanding-period corroboration, not a weekly page-rank comparison. |
| Treatment Train guide | 0 | 60 | 12.98 | Existing ten-step treatment workflow remains substantial. |
| Pressure Tank tool | 0 | 43 | 30.16 | Bing provides stronger secondary demand, but current sizing/rating logic is already clear. |

The terminology queries corroborate the topic, not a proven attribution of all 69 guide impressions. Their small individual counts alone would not pass the gate. Repeated page-level exposure, near-first-page query variants, secondary Bing evidence and the actual guide gap together support the decision.

### Indexing

Discovered count is 19 from September 22 through October 12 (previous report: 19 through October 4). All 19 crawl dates are `1970-01-01`, treated as unavailable placeholders. The separate crawled issue is 1 from October 5 through October 12, down from 2 in the previous export. Its only row is `/docs/page-inventory.html`, last crawl July 28, currently 404. Removal of the RO planner from this issue does not prove it became indexed. Validation state is not supplied. No new evidence reopens the September 18 Monitoring Well audit or justifies mass internal links, sitemap redesign or URL changes.

### Bing and GA4

- Bing pages: **841 impressions / 30 clicks / 3.5672% CTR / weighted position 5.3912**. Keywords: 620/30/4.8387%/5.2371. Different aggregations, not additive. Previous page aggregate 660/21 and keyword aggregate 509/21 lack measurement periods, so no defensible weekly percentage change.
- Bing page leaders: Pressure Tank 166/8/5.24; Pump Curve guide 110/0/7.34; First Flush 51/2; Well Pump planner 49/4; Treatment Train guide 48/1. Terminology guide: 29/0/5.69; a British-English borehole/well terminology query has 4 impressions/6.25. No query-page join is asserted.
- GA4: **130 active users, 127 new, 23.115 seconds mean engagement per active user, 508 events**. First-user organic users: Bing 17, Google 5, DuckDuckGo 3, Yahoo 2. Session organic counts: Bing 18, Google 5, DuckDuckGo 3, Yahoo 2.
- Direct: 98 users/98 sessions. Singapore 66 users; Ashburn 5. No source/city join proves bot attribution. This is an unclassified audience, not automatic organic success or a basis for new tools.
- ChatGPT: 1 first-user user/2 sessions; Copilot: 1/1; Yahoo India referral 1/1. Small secondary signals, not proven repeat-use quality. Page-title counts are small; Pressure Tank 13 views/12 active users, terminology 3/3, Pump Curve guide 2/2.
- Previous GA4 window September 11–October 8 overlaps the current one by 21 days. 213→130 active users, Bing sessions 14→18 and Google 6→5 are rolling-window differences, not week-over-week channel rates. September 17's 116-new-user spike is no longer in the window; its removal must not be described as a search collapse. No landing-page/source join or organic-specific engagement supplied.

## Technical health and existing candidates

Live home, Finder, last week's rinse guide, all three candidate routes, sitemap and robots return 200. Canonicals/index permissions are correct. Selected terminology guide normal/Googlebot HTML matches at SHA-256 `f4073c01c228dd57cdd5c1ef0411002922cb269baf0e923b73df9e045c0056da`, no restricting X-Robots header. Legacy inventory currently 404. Fresh static, publication, analytics and navigation checks pass at 98 pages/2 fragments.

Fresh baseline browser matrix passes 75 renders/31 interactions/20 table checks/60 rinse-content assertions/9 numeric assertions. Analytics intercepted 75 locally, completed 0. Initial restricted run reported all five external badges as `ERR_NETWORK_ACCESS_DENIED`; the identical test with network authority passed. That was an execution restriction, not a site bug. No badge, blocker or runtime change was made to bypass it. **Technical action required: No.**

Scores follow search /30 + ranking /20 + user value /20 + intent gap /15 + implementation ROI /15; they are prioritization, not forecasts.

| Candidate / URL | Search intent and actual deficiency | Components | Total / decision |
| --- | --- | --- | --- |
| `/guides/well-borehole-tube-well-terminology/` | Explain overlapping source labels and turn a driller's record into correct planning quantities. The separate definitions do not directly answer overlap or carry the existing example into drawdown, submergence and tool handoff. | 23+17+18+12+14 | **84 / GO**, sole upgrade. |
| `/reference/water-pipe-internal-diameters/` | Actual-ID lookup; 88 GSC impressions/14.43. Existing schedule table, units and manufacturer-specific warning already answer the demonstrated job. Missing benefit gate, not a reason to expand arbitrary pipe tables. | 25+17+12+5+12 | **71 / Observe** |
| `/tools/pressure-tank-sizing-calculator/` | Conventional tank sizing; Bing 166/8 plus GSC 43/30.16. Already separates required drawdown, nominal volume, absolute pressure and manufacturer-rated selection, with non-VFD limitations. No comparably clear fresh defect/gap. | 25+13+15+7+11 | **71 / Observe** |

Selected gates A–G: real recurring page/topic signal; matched comparison intent; concrete inspected gap; useful record-to-input decisions; improved intent satisfaction as a hypothesis; existing URL retained; bounded, source-reviewed editorial scope. Not selected merely because an old deferred candidate exists. Rinse guide stays unchanged after its real October 9 deployment. Pump Curve has strong Bing but only 9 GSC impressions and an existing nine-section method/example, weaker under the requested GSC-first priority.

## Expansion decision and sources

Expansion considered as a discovery branch: **No**. A stronger bounded existing-page opportunity is selected. Latest discovery and implemented boundaries were reviewed, but a full new-expansion exclusion audit across all historical documents was **not** performed or claimed. No new-family count, shortlist, finalist or expansion NO-GO is claimed; a future expansion still requires the full 40+/10–14/4–6 process. Low organic volume is not the deferral reason.

Primary sources checked October 16:

- [USGS Groundwater Wells](https://www.usgs.gov/water-science-school/science/groundwater-wells): construction/components and changing water levels. Existing USGS glossary/hydrology citations retained; the book PDF returned 403 to this research fetch, so no claim of a new complete PDF review.
- [BGS Borehole Records](https://www.bgs.ac.uk/information-hub/borehole-records/): boreholes/water-well records and the importance of actual logs, levels and construction evidence, not name-only classification.
- [FAO Rural Water Supply, Wells](https://www.fao.org/4/s1250e/S1250E1e.htm): an example of driven/jetted tube-well terminology. Its historic depth thresholds are not generalized.
- [FAO Groundwater Resources Development](https://www.fao.org/4/r7488e/r7488e07.htm): casing, screens/open-hole completion and pumping-test context. Historic costs, depths and operating criteria are not reused.

The useful comparison is a bounded synthesis of differing terminology and the existing planner's input contract. It is not a universal glossary standard, an installation design, a water-quality certificate or a sustained-yield assessment. No competitive calculator output supplies a formula.

## Implementation, QA and deployment

### Local implementation and fresh final QA

- Production diff: exactly one guide HTML and its sitemap date. Generator has one selected entry and an optional comparison block; the other 97 generated HTML pages remain unchanged. Rinse-guide hash stays `654d10b8ab907d6f87300499a59298c07b9ff074f23279ada1cafa217f0dd744`; homepage hash stays `ab5e048ae2bd7f883ef1e55cbf8e02b8a116503a2ac9731a01a742625664b945`.
- Existing slug/title/H1/canonical/description preserved. The old separate definitions are reorganized into one comparison and a record-to-input explanation; no query-specific page, FAQ expansion, new formula or threshold. The comparison uses the existing CSS only.
- Static, navigation, publication-boundary and analytics QA pass for 98 public pages/two runtime fragments. All **391 existing independent calculation/scenario cases** pass. The targeted runner also passes **18 assertions**, including independent 14 m/9 m arithmetic, 31 m lift, equivalent US geometry and rejected intake-at/above-pumping-level cases.
- Final local Chrome matrix: **17 pages × five widths = 85 renders**, **125 geometry snapshots**, **42 interaction entries**, **120 content assertions**, **25 table checks**. New guide plus downstream well-pump/yield tools and established Finder, button, stabilization, Greywater, rinse and table controls are included. This is not a fresh full-site 490-render claim.
- The worked record was entered in the real pump planner: 20 L/min at 31 m before pressure/losses, submergence 9 m; invalid equal intake/pumping level clears the result and valid recovery passes. Existing tool run, Copy/clipboard, Reset, refill/re-run, SI/US round trip, local CSV/error recovery, print-call and print-media checks pass. No native print-dialog claim.
- Actual new-guide full screenshots at 390/1280, the 390px example close-up and rightmost table column were directly inspected. At 390px a 740px table remains inside a labelled, focusable 348px scroll region; last column accessible, clipped cells 0. A separate native ArrowRight/focused-region check also moves its scroll position. All five widths have no document overflow, checked off-screen controls or initial header/H1 overlap. No CSS overflow hiding.
- Site console/page/request/internal HTTP/broken-image failures: 0. Final local matrix intercepts 85 Analytics loaders, completed 0. Extra direct local keyboard/screenshot checks use the same guarded server.
- Baseline evidence: `tools-qa/weekly-growth-2026-10-16-baseline-results.json`. Final local evidence: `tools-qa/weekly-growth-2026-10-16-local-results.json`. October 9/October 1 and historical full-site reports remain untouched. No software or browser installation.
- New guide SHA-256: `22993ed68268f22d5b384f0fc6eded59a6b3b6ebff5913857d70651a0bb4ed42`; sitemap: `4f22f9d9769d546e0dd3a42f0f46667cd9b5977976e97a19748d830c4cd9f9d3`.

### Release

- Implementation commit: `135a0a8a7df04b77a831ba854098c3663c2834cb`, pushed to main; local/fetched-origin/actual remote matched immediately after push.
- Exact-SHA GitHub Pages [run 38837438659](https://github.com/canghun13/watersystemsbench/actions/runs/38837438659) completed successfully at `2026-10-16T01:53:03Z`.
- Actual-domain Chrome matrix **85/85 renders**, **125 geometry snapshots**, **42 interactions**, **120 content assertions**, **18 arithmetic/unit/geometry assertions** and **25 table checks** pass at 390/768/1024/1280/1440px. New guide, both downstream well tools and the protected controls behave as locally verified; the worked example, invalid-state clearing and recovery pass on production.
- Actual production 1280px guide, 390px comparison rightmost column and existing Greywater rightmost-column screenshot were directly inspected. No console/page/request/internal HTTP, checked overflow/clipping or broken-image failures. Print handler/media only, not native print dialog.
- Production exact-six-host route blocker was installed before navigation; Analytics intercepted **85 / completed 0**. Production GA4 is retained. No general Google-domain blocking or user-managed integration change.
- Non-executing HTTP/content probes **29/29 passed**: HTTP→HTTPS 301; checked public 200s; exact local/live HTML/JS/sitemap parity; correct canonical/index permission/GA4; normal/Googlebot guide parity; 98-URL sitemap with only the selected guide's October 16 date and preserved October 9 rinse date.
- Legacy/new weekly-doc extension variants, `/docs/`, handover and QA runner remain 404. Exact home source parity preserves all five protected badges. Deployed guide/sitemap hashes match the local final hashes above; the rinse guide remains unchanged.
- Production evidence: `tools-qa/weekly-growth-2026-10-16-production-results.json` and `tools-qa/weekly-growth-2026-10-16-live-results.json`. Final release-record commit is the commit containing this evidence; only development-only files differ from the implementation. Verify its follow-up Pages run and equal local/origin/actual remote SHA with clean tree in final delivery. No search or indexing lift is claimed.

## Next state — maximum three

1. Evaluate the terminology guide with matched page/query windows after release; do not attribute cumulative totals or a few immediate days to this upgrade.
2. Continue observing the October 9 rinse guide and the existing Monitoring Well queue; reopen technical audit only for concrete fetch/render/canonical/discovery failure.
3. Obtain dated Bing periods and joined GA4 landing/source/city evidence before interpreting rolling organic differences or Singapore/Direct traffic.
