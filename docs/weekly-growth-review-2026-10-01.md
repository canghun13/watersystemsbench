# Weekly growth / search review — 2026-10-01

## Decision

**FIX — Tool Finder native Clear filters restored fields but left stale cards/count.**

Fresh browser regression exposed an actual existing technical defect, which takes Priority A over growth changes. The earlier provisional choice was the Metal Finishing rinse guide, based on a first-page rinse-control signal and an inspected content gap. Its local draft was reverted before any commit/push/deployment. This week's only production change is the Finder reset correction. Small organic traffic is not the reason to defer expansion or the guide opportunity.

## Repository and provenance

- Repository: https://github.com/canghun13/watersystemsbench ; branch `main`.
- Start local HEAD, fetched `origin/main` and actual remote main: `5ae45dfca4aac3e480f5454955d51f6cfafca13b`.
- Start ahead/behind: 0/0; working tree clean; no synchronization or existing-work preservation action needed.
- Used only the five reports explicitly attached in this session. No older attachment was substituted and no Downloads directory was searched. The pasted workflow is the user's instruction; report cells are data, not executable instructions.
- Raw user reports are not committed. ZIP CSV members were read without extracting them into the public site. The malformed Bing row described below was parsed in memory; the source was not modified.

| Current-session attachment | Actual usable range / limitation |
| --- | --- |
| watersystemsbench.com-Performance-on-Search-2026-10-01.zip | Daily GSC Web data: July 26–September 28, 2026, 65 days. Filter says last three months; October 1 is the export date, not the latest measurement date. |
| watersystemsbench.com-Coverage-Drilldown-2026-10-01.zip | August 5–September 21, 2026; one Discovered–currently not indexed issue, 33 URL rows. |
| watersystemsbench.com_PageTrafficReport_2026. 10. 1..csv | 37 Bing page rows. Measurement period absent from the export; unavailable, not assumed to be weekly. |
| watersystemsbench.com_KeywordReport_2026. 10. 1..csv | 259 Bing keyword rows. Measurement period absent. One keyword contains an unescaped inch quote and embedded commas; parse the final four quoted numeric cells, preserving the keyword. |
| 보고서_개요.csv | GA4 overview: September 3–30, 2026, 28 days; several independently aggregated sections. |

All five attachments were accessible. No account access, GSC inspection or recrawl submission is claimed.

## Current inventory

Fresh publication-boundary/static/navigation checks confirm **98 public HTML pages**: 7 core, 8 system hubs, 51 tools, 20 guides, 12 references. Sitemap URLs: 98. The two runtime partials are not public content pages. Development documentation and `tools-qa` remain excluded by `_config.yml`.

## Search and audience metrics

### GSC

- Daily chart: 6 clicks, 1,110 impressions, 0.541% CTR.
- Impression-weighted daily position: 41.703. This is calculated from rounded daily positions, not presented as an exported exact account-summary metric.
- Latest seven days, September 22–28: 1 click, 75 impressions, 1.333% CTR, weighted position 22.933.
- Prior seven days, September 15–21: 1 click, 90 impressions, 1.111% CTR, weighted position 29.138.
- Seven-day impressions: -16.67%; clicks unchanged; weighted position improves 6.205 positions. Changing query mix and very few clicks prevent a strong growth conclusion.
- Latest 28 days, September 1–28: 4 clicks / 364 impressions / 1.099% CTR / position 21.612.
- Prior 28 days, August 4–31: 2 clicks / 539 impressions / 0.371% CTR / position 46.171. Impressions -32.47%; two extra clicks are a small sample, not proof of durable growth.
- Query table: 130 rows, 541 reported impressions, no reported query clicks. Page table: 68 rows, 1,308 impressions and 6 clicks. These differently aggregated/filtered tables must not be added together or forced to match the daily chart; missing query clicks do not invalidate chart/page clicks.

| Query | Impressions | Average position |
| --- | ---: | ---: |
| metal rinse water control system | 64 | 8.80 |
| metal finishing baths control system | 30 | 40.93 |
| water flow rate test | 29 | 64.76 |
| bucket flow test | 20 | 50.80 |
| water flow test | 18 | 43.33 |
| irrigation flow test | 16 | 32.69 |
| reverse osmosis design calculator | 16 | 81.56 |
| well yield testing | 16 | 83.62 |

| Page | Clicks | Impressions | Average position |
| --- | ---: | ---: | ---: |
| /tools/available-water-flow-test-calculator/ | 0 | 116 | 52.72 |
| /guides/reduce-metal-finishing-rinse-water/ | 0 | 90 | 7.84 |
| /reference/metal-finishing-rinse-control-methods/ | 0 | 74 | 38.08 |
| /tools/ro-recovery-reject-water-calculator/ | 1 | 70 | 41.44 |
| /tools/well-yield-demand-checker/ | 0 | 70 | 87.26 |
| /systems/metal-finishing-rinse-water/ | 0 | 68 | 28.26 |
| /guides/water-system-terminology/ | 0 | 52 | 17.23 |
| /reference/water-pipe-internal-diameters/ | 1 | 47 | 19.21 |
| /guides/build-water-treatment-train/ | 0 | 38 | 16.82 |

The query/page exports do not include a joined query-by-page table. Related rinse queries corroborate the topic opportunity; they are not asserted to have generated the selected guide's exact 90 impressions. The broader bath-control query does not justify promising bath chemistry automation.

Coverage's affected count increased from 22 on August 5 to 24 on August 8, 25 on August 11 and 33 on August 29; it remains 33 through September 21. Every URL's `1970-01-01` last-crawl value is treated as an unavailable/placeholder crawl date, not an actual 1970 crawl. Crawled–currently not indexed counts and validation state are unavailable. Older coverage and later performance can disagree as snapshots; that alone is not a defect. The six already-audited Monitoring Well Group A URLs remain in this queue; no repeat audit or broad SEO linking change is justified without new failure evidence.

### Bing

- Page report: 486 impressions / 16 clicks / 3.292% CTR / weighted position 5.267.
- Keyword report: 389 impressions / 16 clicks / weighted position 5.257. Different aggregation; do not add to the page totals.
- Leading page examples: Pressure Tank Sizing 90/4, Pump Curve guide 81/0, First Flush 31/2, Well Pump planner 28/4, Treatment Train guide 28/1, Irrigation Measurement guide 25/0 (impressions/clicks).
- Most keyword rows have only 1–4 impressions. No matched prior period is attached, so Bing week-over-week changes are unavailable.

### GA4

- 213 active users in the overview. First-user-source rows are not equivalent to current-session attribution.
- First-user active users: Direct 186; Bing organic 11; DuckDuckGo organic 5; Google organic 3; ChatGPT referral 2; small Yahoo/KittyLaunch/Twelve Tools rows of 1 each.
- Session-source rows: Bing organic 14 sessions, Google organic 3, DuckDuckGo 5, ChatGPT 3, Twelve Tools 2, KittyLaunch 1, and Yahoo variants 3 in total. Direct 186 sessions dominates this independently aggregated section.
- September 17 has 116 new users. This Direct/new-user spike is unclassified; the export cannot prove bot activity, campaign value or QA origin. It is not a reason to expand or rename pages.
- Page views are very small except home (30), Pressure Tank tool (13) and Treatment Train guide (11). No landing-page/source join, geography or meaningful engagement-duration evidence is supplied. Bounce-rate rows with tiny samples do not establish intent quality.
- No comparable prior GA4 export; channel-level organic movement is unavailable. The post-August-13 analytics-isolation baseline remains relevant, but it cannot retrospectively classify every Direct user.

## Week-over-week limits

The within-export GSC equal-seven-day comparison is the only defensible weekly numeric comparison. No fresh previous weekly aggregate is available in repository records. Page/query tables lack daily splits, so important page movement and query movement are unavailable. Coverage is flat at 33 from August 29 through September 21, not necessarily through October 1. GA4 and Bing organic weekly changes are unavailable. Avoid attributing ranking movement to a recent deployment without comparable page-level windows.

## Technical health and browser-discovered defect

- Fresh static, navigation, publish-boundary and analytics checks passed for 98 public pages; no broken local links, orphan-page or metadata defect found.
- Live home, selected guide, sitemap and robots return HTTPS 200.
- Selected guide returns the same HTML SHA-256 under normal and Googlebot agents: `6799a221fb91d6c54ebf50a5c2efae244e28b80a91944abc867039178b5cbd9a`. Self-canonical, `index,follow`, no `X-Robots-Tag` restriction.
- Production `/docs/metal-finishing-rinse-water-expansion.md` returns 404. Historical `/docs/` impressions in the July–September performance window include the pre-boundary period and do not establish renewed publication.
- Analytics QA still uses the existing exact-six-host classifier and local-server guard. All subsequent browser automation must use these blockers; no global Google-domain blocking and no production GA removal.
- No new evidence reopens the September 18 Monitoring Well indexability audit. Shared button, stabilization form, Finder, tables and irrigation measurement corrections are protected controls.
- HTTP apex returns 301 with `Location: https://watersystemsbench.com/`.
- Initial static/HTTP checks did not expose a hard defect. Fresh browser interaction did: on `/tools/`, select Metal Finishing and search `conductivity`; one card and `Showing 1 of 51 tools.` appear. Native Clear filters sets the input to empty and System to `all`, but the count and card set incorrectly remain at 1. Dispatching a subsequent input event changes the count/cards to all 51. An independent native-click reproduction confirmed this is not a report-parser or content-assertion error.
- Root cause: the reset listener queues a microtask; in the native reset event path it recomputes against the old field values before the browser finishes the reset default action. Programmatic reset may hide that timing issue, so the new test explicitly includes native click and keyboard activation.
- Fix: schedule the same existing `update` function with `requestAnimationFrame` after the reset default action, consistent with the site's existing form reset pattern. No filter algorithm, catalog, CSS or markup changes.
- **Technical action required: Yes — corrected as this week's sole production action.** The September 18 Monitoring Well audit remains closed; this is a separately evidenced Finder defect.

## Existing growth candidates — maximum three

Scores are qualitative prioritization, not traffic forecasts. Order of components: Search evidence /30, Ranking opportunity /20, User value /20, Intent gap /15, Implementation ROI /15.

| Candidate | Evidence and intent | Actual deficiency / assessment | Score | Decision |
| --- | --- | --- | --- | --- |
| /guides/reduce-metal-finishing-rinse-water/ | GSC 90 impressions, 0 clicks, position 7.84; related rinse-control query 64 impressions, position 8.8. Measurement-led rinse reduction/control selection. | Current control and verification sections are each one generic paragraph. No choice criteria, controller loop/deadband distinction, signal placement check, paired quality/production evidence or limits of the linked log analyzer. | 25+17+18+13+14 = **87** | Strongest growth candidate, **deferred** because the browser-discovered hard defect takes priority. No guide changes released. |
| /reference/water-pipe-internal-diameters/ | GSC 47 impressions, 1 click, position 19.21. Practical ID lookup. | Existing size/schedule table, sample-data warning and hydraulic links already satisfy the observed intent. No specific fresh missing decision support demonstrated. | 19+13+10+5+10 = **57** | Observe; deficiency gate not met. |
| /guides/build-water-treatment-train/ | GSC 38 impressions, position 16.82; Bing 28 impressions/1 click, period unknown. Treatment ordering. | Existing ten-step source/test/contaminant/treatment/monitoring workflow and worked example are already meaningful. No newly evidenced treatment-selection gap justifies a simultaneous upgrade. | 20+14+13+6+11 = **64** | Observe; insufficient specific gap this week. |

Available Water Flow Test was already upgraded August 20. Its 116 impressions at position 52.72 do not expose a fresh deficiency, so it is not selected again. Zero CTR alone is not the winning reason, and the strongest rinse-control evidence is not used to change unrelated bath-control pages.

The guide's content-upgrade gates A–G pass: real topic/page search signal; matched rinse-control intent; inspected concrete deficiency; useful field decisions; better intent coverage as a testable search-benefit hypothesis; existing URL can retain its authority; and safe, content-only scope with qualified-review boundaries. That does not override Priority A. Its score is retained for next week's reassessment, not treated as a released GO. No guaranteed ranking, compliance or savings result is promised.

## Expansion decision

- Expansion discovery branch entered: **No**. An actual Priority A defect needs correction first.
- Full historical exclusion set reviewed for a new expansion: **No**, not required for this branch. Latest handover and relevant existing-cluster records were read for duplication/scope context; this is not represented as a full exclusion audit.
- No genuinely-new family count, shortlist, finalists or new-cluster score is claimed. This is not an expansion NO-GO based on a shallow candidate sample. After technical health is confirmed, if next week's stronger existing opportunity disappears, the requested 40+ family / 10–14 shortlist / 4–6 finalist discovery process still applies.

## Bounded fix contract

1. Sole production file: `assets/js/tool-finder.js`; replace the reset scheduling primitive and explain the ordering. Preserve all matching logic, 51 catalog entries and current filter controls.
2. Restore all local draft guide/generator/sitemap changes made in this session. Confirm no diff in any public HTML page, sitemap, shared CSS, analytics code, publication configuration or user-managed badge/footer.
3. Explicit native-click, keyboard and programmatic reset scenarios after combined filters, no matches and type filtering. Assert restored fields, all 51 visible cards, exact count and hidden empty-state notice at all five widths.
4. Fresh static/navigation/calculation QA and a clearly separate targeted browser report: nine relevant/control pages × 390/768/1024/1280/1440px. Inspect actual Finder and protected control screenshots/bounding boxes; no new 490-render claim.
5. Block analytics before every automated browser navigation. Commit/push main, verify successful exact-SHA Pages deployment, live JS/HTML/sitemap/docs and native production interactions. Update handover and finish with equal local/origin/actual remote SHA and clean tree.

## Source verification

Primary sources checked October 1, 2026:

- [U.S. EPA, Guides to Pollution Prevention: The Metal Finishing Industry (1992), flow controls and inspection](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30004KLA.TXT): restriction, timed/manual demand control and conductivity feedback are different control choices; inspect actual operations and equipment. Historic prices are not reused.
- [U.S. EPA, Conductivity Control for Rinse Water (1996)](https://archive.epa.gov/region9/waste/archive/web/pdf/metal-condcs.pdf): sensor/analyzer/valve loop, hysteresis, representative placement, process-specific commissioning and maintenance. Same document is already linked in the public guide through EPA NEPIS. Historical case-study savings and calibration intervals are not generalized.

A current topic search also found first-party vendor conductivity-controller/rinse-system pages; the broader system intent exists, but those results do not establish a free-tool gap or a new-cluster GO. Field evidence-packet/fault-screening recommendations are a bounded synthesis, not a regulatory standard or a controller commissioning specification.

## Implementation, QA and deployment

### Local implementation and fresh QA

- Production diff: only `assets/js/tool-finder.js`. Public HTML, all 98 URLs, generator, sitemap, CSS, GA4 source, `_config.yml`, partials and badge block are unchanged. The unreleased guide draft is restored; its hash again matches the starting production hash above.
- Static and navigation QA passed after the fix: 98 public pages plus 2 runtime fragments. Publication-boundary and analytics QA passed for 98 pages and the six approved analytics hosts.
- Calculation verification passed all 391 existing cases/scenarios, including 43 metal-finishing and 30 monitoring-well cases. Additional targeted baseline/proposed/log assertions: 8.
- Fresh local browser report: `tools-qa/weekly-growth-local-results.json`, generated by `tools-qa/weekly-growth-qa.mjs` using the existing Playwright runtime and installed Chrome 154. No package or browser was installed.
- Scope: 9 pages × 5 widths = **45 new render checks**; 75 initial/result/reset geometry snapshots; 31 interaction-matrix entries, including 25 tool/width runs and five Finder/width sets. Finder has 15 explicit native-click, keyboard/no-match and programmatic/type-reset scenarios across the five widths. Original historical full-site `browser-results.json` is untouched.
- Tool controls: run, result, copied clipboard content, reset, refill/re-run, unit round trip, print handler plus print-media visibility; conductivity CSV load and invalid-alert recovery. A native print dialog was not automated and is not claimed as tested.
- Visual inspection: fresh Finder 390/1280px screenshots show all 51 cards/count restored and readable controls; protected stabilization criteria and focused/hovered buttons at 390/1280px were also actually inspected. Initial/result bounding boxes are captured at 390/768/1024/1280/1440px. No CSS overflow-hiding change was made.
- Console/runtime/internal HTTP/request failures: 0. Document overflow/off-screen selected controls/header overlap: 0. Existing wide reference table keeps its horizontal scroll container; no table code changed. QA-server analytics requests intercepted: 45; browser analytics requests completed: **0**.
- Independent after-fix native-click reproduction also restores `query=''`, `system='all'`, all 51 cards and the exact count. Before deployment, live JS still contains the old `queueMicrotask(update)` path, confirming the defect exists in production source rather than arising from the local guide draft.

### Release state

- Implementation commit: `8a77095df78874587a87a09dd16bc4722c57cf1a`, pushed successfully to main; local/fetched-origin/actual remote all matched immediately after push.
- Exact-SHA GitHub Pages deployment succeeded in [run 36834304063](https://github.com/canghun13/watersystemsbench/actions/runs/36834304063), completed October 1 at `2026-10-01T08:07:27Z`.
- Fresh production browser report: `tools-qa/weekly-growth-production-results.json`; 45 renders, 75 geometry snapshots and 31 interaction entries across the same five widths. All 15 native-click/keyboard/programmatic Finder reset scenarios pass. Relevant tool run/result/Copy/Reset/refill/re-run/unit and print-hook/media scenarios pass. No runtime, internal HTTP, unexpected request or selected-layout failures.
- Production route blocker was installed before navigation: 45 Analytics scripts intercepted, **0 completed**. An additional desktop toolbar capture/native reset check intercepted 1, completed 0. The production GA4 tag is unchanged.
- Actual production screenshots inspected: 390px Finder with restored 51-card count, 1280px card layout, and a close desktop toolbar capture confirming readable reset controls and restored count. Protected controls were inspected in the local fresh matrix and also executed against production.
- Non-executing production HTTP report: `tools-qa/weekly-growth-live-results.json`, **21/21 expected responses and content checks passed**. HTTP→HTTPS 301, public routes 200, exact local/live content hashes, self-canonical/indexable metadata, one GA4 config, unchanged 98-URL sitemap and open robots all pass. Normal and Googlebot Tool Finder HTML match.
- `/docs/`, new weekly report extension variants, existing page-inventory/information-architecture/project-plan/metal-expansion HTML, handover HTML and the QA runner all return 404. Home retains all five protected badge names/links.
- Deployed Finder JS SHA-256: `39e8a72a7b786d9850fda1086b1dc142cad06ae8ca0d40de05bf4ada3c426b03`. The guide's unchanged hash is `6799a221fb91d6c54ebf50a5c2efae244e28b80a91944abc867039178b5cbd9a`; sitemap is `60f7eb2412f73ea6cd28953bf384b3db34b8e038d0e37fa6764645a49212061e`.
- Final release-record commit is the commit containing this evidence plus production QA outputs. It changes development-only files, not production artifacts; verify its follow-up Pages run and final local/origin/actual remote equality in final delivery. No indexing or traffic lift is claimed.

## Next state — maximum three

1. Reassess the deferred rinse guide against matched GSC windows and a page/query join. It was not upgraded, so do not attribute any lift to this session's unreleased draft.
2. Watch for concrete fetch/render/indexability failures, not the unchanged discovered queue alone; Monitoring Well audit stays closed without such evidence.
3. Reassess organic sources and the unclassified September 17 Direct spike using a comparable GA4/Bing period; enter the broad new-family funnel only if no higher-ROI existing upgrade remains.
