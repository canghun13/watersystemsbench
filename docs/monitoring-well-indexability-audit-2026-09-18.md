# Monitoring Well Indexability and Discovery Audit — 2026-09-18

## Decision

**NO SITE-SIDE DEFECT FOUND.** All six reported Monitoring Well targets are technically indexable, present in the sitemap, reachable through static HTML anchors, non-orphaned, shallow in the static link graph and materially complete in the initial HTML. They behave the same as the already surfaced same-cluster control and the five established cross-cluster controls.

**NO-CHANGE — continue observation.** The observed Search Console state is classified as **Type 4 — No defect found / Google crawl scheduling**. No production HTML, CSS, JavaScript, generator, navigation, robots or sitemap change is justified by this audit.

## Start state and evidence boundary

- Repository: `https://github.com/canghun13/watersystemsbench`
- Branch: `main`
- Starting commit: `6307d8f2f8d64477ee85262c12417548e795d3f3`
- Start equality: local `HEAD`, fetched `origin/main` and `git ls-remote origin refs/heads/main` all matched the starting commit; worktree clean.
- Inventory: 98 public HTML pages — 7 core, 8 system hubs, 51 tools, 20 guides and 12 references.
- Sitemap: 98 parsed entries, 98 unique entries, zero malformed entries and zero duplicates.
- Live probe time: 2026-09-18 15:46 KST.
- Search Console evidence: the user reported six Group A URLs as `Discovered - currently not indexed` / effectively uncrawled for about two weeks, while the Group B URL was already visible in search. No authenticated Search Console session was used; no inspection values, crawl dates or counts were invented.
- A Googlebot user-agent request is only an HTTP comparison. It does not reproduce Google's network, renderer, crawl budget or index-selection systems.

## Audited URLs

### Group A — reported long-uncrawled targets

1. `/systems/monitoring-well-sampling/`
2. `/tools/monitoring-well-purge-volume-calculator/`
3. `/tools/low-flow-sampling-setup-checker/`
4. `/tools/groundwater-stabilization-log-analyzer/`
5. `/guides/plan-monitoring-well-purging-low-flow-sampling/`
6. `/reference/groundwater-low-flow-field-parameters/`

### Group B — same-cluster healthy control

- `/tools/low-flow-equipment-volume-reading-interval-planner/` — user-provided known search signal.

### Group C — established cross-cluster structural controls

- `/systems/irrigation-sprinklers/`
- `/tools/available-water-flow-test-calculator/`
- `/tools/water-softener-sizing-calculator/`
- `/guides/how-to-size-a-water-pump/`
- `/reference/water-pressure-head-conversion/`

These controls cover the same page types and mature site structures. The audit does not substitute third-party search-result observations for authenticated Search Console URL Inspection data.

## Comparison table

`Inbound` counts distinct static HTML source pages other than the page itself, restricted to the 98 sitemap URLs. `Depth` is the shortest path from `/` using literal initial-HTML `<a href>` links; it does not count the JavaScript-loaded shared header or footer.

| Group | URL | HTTP / Googlebot | Robots | Canonical | Sitemap | Inbound / depth | Initial HTML | Duplicate concern | Classification |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| A | `/systems/monitoring-well-sampling/` | 200 / 200, byte-identical | allowed; `index,follow`; no X-Robots | exact self | yes | 7 / 1 | H1, workflow copy, primary links, JSON-LD | none | Type 4 |
| A | `/tools/monitoring-well-purge-volume-calculator/` | 200 / 200, byte-identical | allowed; `index,follow`; no X-Robots | exact self | yes | 4 / 1 | H1, explanatory copy, form, links, JSON-LD | none | Type 4 |
| A | `/tools/low-flow-sampling-setup-checker/` | 200 / 200, byte-identical | allowed; `index,follow`; no X-Robots | exact self | yes | 8 / 1 | H1, explanatory copy, form, links, JSON-LD | none | Type 4 |
| A | `/tools/groundwater-stabilization-log-analyzer/` | 200 / 200, byte-identical | allowed; `index,follow`; no X-Robots | exact self | yes | 8 / 1 | H1, CSV example, form, method, links, JSON-LD | none | Type 4 |
| A | `/guides/plan-monitoring-well-purging-low-flow-sampling/` | 200 / 200, byte-identical | allowed; `index,follow`; no X-Robots | exact self | yes | 8 / 1 | H1, full guide, links, JSON-LD | none | Type 4 |
| A | `/reference/groundwater-low-flow-field-parameters/` | 200 / 200, byte-identical | allowed; `index,follow`; no X-Robots | exact self | yes | 7 / 2 | H1, parameter table/rules, links, JSON-LD | none | Type 4 |
| B | `/tools/low-flow-equipment-volume-reading-interval-planner/` | 200 / 200, byte-identical | allowed; `index,follow`; no X-Robots | exact self | yes | 8 / 1 | H1, explanatory copy, form, links, JSON-LD | none | healthy control |
| C | `/systems/irrigation-sprinklers/` | 200 / 200, byte-identical | allowed; `index,follow`; no X-Robots | exact self | yes | 14 / 1 | H1, workflow copy, primary links, JSON-LD | none | healthy control |
| C | `/tools/available-water-flow-test-calculator/` | 200 / 200, byte-identical | allowed; `index,follow`; no X-Robots | exact self | yes | 7 / 2 | H1, explanatory copy, form, links, JSON-LD | none | healthy control |
| C | `/tools/water-softener-sizing-calculator/` | 200 / 200, byte-identical | allowed; `index,follow`; no X-Robots | exact self | yes | 6 / 2 | H1, explanatory copy, form, links, JSON-LD | none | healthy control |
| C | `/guides/how-to-size-a-water-pump/` | 200 / 200, byte-identical | allowed; `index,follow`; no X-Robots | exact self | yes | 12 / 2 | H1, full guide, links, JSON-LD | none | healthy control |
| C | `/reference/water-pressure-head-conversion/` | 200 / 200, byte-identical | allowed; `index,follow`; no X-Robots | exact self | yes | 7 / 2 | H1, equations/table, links, JSON-LD | none | healthy control |

## HTTP, host and robots findings

- Every canonical URL returned 200 to a normal browser UA and the Googlebot UA. For every URL the returned HTML hash was identical between those two probes.
- Every non-trailing-slash variant returned one 301 directly to the corresponding trailing-slash canonical URL. There was no unexpected redirect chain.
- `http://watersystemsbench.com/systems/monitoring-well-sampling/` and the HTTPS `www` variant each returned one 301 to the HTTPS apex canonical.
- Live `/robots.txt` returned 200 `text/plain`, contains `User-agent: *`, `Allow: /` and declares the HTTPS apex sitemap.
- All 12 pages have `meta robots="index,follow"`; none returned `X-Robots-Tag`.
- Every tested canonical is HTTPS, apex/non-www, typo-free and self-referential.

## Sitemap findings

- Repository and live `sitemap.xml` are byte-identical.
- XML parsing found 98 URLs, all unique and conforming to the site's HTTPS apex, trailing-slash convention.
- All seven Monitoring Well URLs are present exactly once. The six targets and same-cluster control use their self-canonical URLs.
- Public HTML count and sitemap count both remain 98. No sitemap change was made.

## Static discovery, orphan and depth findings

The homepage's initial HTML directly links the Monitoring Well hub and five of the six Group A targets. The hub's initial HTML directly links all four tools, the guide and the reference. The type indexes also link their members directly.

Representative paths are:

- `/` → `/systems/monitoring-well-sampling/`
- `/` → `/systems/monitoring-well-sampling/` → `/reference/groundwater-low-flow-field-parameters/`
- `/` → `/tools/monitoring-well-purge-volume-calculator/`
- `/` → `/tools/low-flow-sampling-setup-checker/`
- `/` → `/tools/groundwater-stabilization-log-analyzer/`
- `/` → `/guides/plan-monitoring-well-purging-low-flow-sampling/`
- `/` → `/tools/` → each Monitoring Well tool
- `/` → `/guides/` → the Monitoring Well guide
- `/` → `/reference/` → the Monitoring Well reference

All links above are literal `<a href>` elements in initial HTML. The shared header/footer provide additional navigation after JavaScript loads, but no target depends on them for discovery. No target is orphaned. Group A depth 1–2 is equal to or shallower than the cross-cluster controls' depth 1–2.

## Initial HTML, content and duplicate-shell assessment

- H1, canonical, meta robots, core explanatory copy, primary links and JSON-LD are server-delivered on every page.
- Each tool's full labelled form is in initial HTML. JavaScript computes results but is not needed to discover or understand the tool's primary purpose.
- The six targets have unique titles, H1s, introductions and primary jobs: workflow collection; standing-volume/purge-time/container calculation; intake/screen/drawdown/flow setup checks; time-series stabilization analysis; field-procedure guidance; and field-parameter/method reference.
- The three target tools use different input sets and outputs. The analyzer additionally contains a concrete CSV schema/example and parameter-by-parameter comparison method. The guide and reference are substantive prose/table resources rather than renamed tool shells.
- Approximate initial visible-text counts for Group A range from 443 to 623 tokens, overlapping the controls' 280 to 863 range. This count is corroborative only; the independent purposes, forms, methods and outputs are the primary evidence against a thin or duplicate shell.

## Structured data and generator consistency

- Every JSON-LD block parsed as valid JSON.
- System hubs use `CollectionPage`; tools use `WebApplication`; guides and references use `TechArticle`. Every audited page also has a `BreadcrumbList` with the current route represented.
- Names/headlines and URLs correspond to the current page. No cross-page canonical or structured-data URL defect was found.
- `tools-qa/generate-site.mjs` registers all four Monitoring Well tools, the guide, reference and hub relationships. Generated homepage, hub, Tools/Guides/Reference indexes, routed pages and sitemap contain the same slugs.
- Repository bytes exactly matched live production for all 12 audited pages, `/robots.txt` and `/sitemap.xml`, eliminating a stale-production explanation for the observed GSC state.

## Gate evaluation

| Gate | Result | Evidence |
| --- | --- | --- |
| A — clear site-side defect | FAIL | no HTTP, UA, robots, canonical, sitemap, static-link, orphan, depth, initial-HTML, content-shell or generator defect found |
| B — meaningful difference from healthy controls | FAIL | targets and controls share the same indexable delivery and depth pattern |
| C — defect can affect discovery/indexability | FAIL | there is no verified defect to connect causally |
| D — safe, bounded fix | NOT REACHED | no fix is warranted |

Because Gates A–D did not all pass, production changes were prohibited by the task contract.

## QA and protected boundaries

- Targeted live normal-UA and Googlebot-UA probes: 12/12 returned 200; body differences 0.
- Trailing-slash canonicalization: 12/12 non-slash forms returned the expected 301.
- Repository/live byte parity: 12/12 pages plus `robots.txt` and `sitemap.xml` matched exactly.
- Static graph: six Group A targets and the Group B control all reachable from `/`; orphan targets 0.
- JSON-LD parse failures across the 12-page comparison set: 0.
- Publish-boundary QA passed: 98 public pages retained and development documents excluded from the Jekyll artifact.
- Analytics QA passed: all 98 production pages retain `G-7FB08YPX7C`; the QA server still rewrites only the six approved analytics hosts.
- Static QA passed: unique metadata, valid JSON-LD, exact GA4, sitemap parity, clean JavaScript and repository string scan.
- Navigation QA passed: all local links/assets resolved across 98 public pages and two runtime fragments.
- Live `/docs/page-inventory.html`, `/docs/information-architecture.html` and `/docs/project-plan.html` returned 404. Direct HTTP probes did not execute page JavaScript and therefore completed zero Analytics requests.
- The live homepage still contains all five protected badge destinations: KittyLaunch, SellWithBoost, Twelve Tools, Findly and BoostDomainRating.
- Production HTML changes: 0.
- Production CSS changes: 0.
- Production JavaScript changes: 0.
- Generator changes: 0.
- Sitemap changes: 0.
- Protected badge/footer area changes: 0.

## Final classification and next observation condition

Every Group A target is **Type 4 — No defect found / Google crawl scheduling**. `Discovered - currently not indexed` shows that Google knows the URLs; with no verified technical or discovery defect and one same-cluster URL already surfaced, the appropriate action is continued observation rather than speculative SEO changes.

Reopen this audit only if new evidence shows a site-side divergence, such as a non-200 or Googlebot-specific response, robots/noindex header, wrong canonical, sitemap omission, lost static inbound links, production/repository mismatch, or a Search Console URL Inspection result identifying a concrete fetch/render/canonical problem. Do not repeat indexing requests or expand content solely because the scheduling state persists.

**Final decision: NO-CHANGE — no site-side defect found; continue observation.**
