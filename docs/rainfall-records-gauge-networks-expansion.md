# Rainfall Records & Gauge Networks — pre-implementation contract

Date:2026-10-30. Authority: `workflow-cluster-discovery-2026-10-30.md`. Starting release:`c6bc568cf77ea8d0f5e2baf0e3fc0d80c6c85f21`. This contract precedes public implementation. No result certifies a gauge, corrects observations automatically, establishes an independent storm process or approves forecasting/drainage design.

## Routes and inventory

|Kind|Route|Title / primary intent|
|---|---|---|
|Hub|`/systems/rainfall-records-gauge-networks/`|Rainfall Records & Gauge Networks|
|Analyzer|`/tools/rainfall-counter-to-increments-analyzer/`|Rainfall Counter-to-Increments Analyzer|
|Analyzer|`/tools/rainfall-event-separator/`|Rainfall Event Separator & Analyzer|
|Checker|`/tools/rain-gauge-double-mass-checker/`|Rain Gauge Double-Mass Checker|
|Calculator|`/tools/areal-rainfall-series-calculator/`|Areal Rainfall Series Calculator|
|Guide|`/guides/review-rainfall-records-before-analysis/`|How to Review Rainfall Records Before Analysis|
|Reference|`/reference/rainfall-record-bases-and-missing-data/`|Rainfall Record Bases & Missing Data|

Projection after successful implementation:112 public pages =7 core +10 hubs +59 tools +22 guides +14 references; sitemap112. Four independent questions: accumulated depth interpretation, temporal segmentation, paired-period consistency, spatial averaging with coverage. No unit/reverse-formula pages. Use existing shell, dedicated engine/style/registry factory. No new dependency, framework, backend, account, data service or installation.

## Shared record/input contract

- Locally pasted CSV or locally read file only. Exact named headers, comma-separated unquoted fields; BOM and CRLF accepted; surrounding cell whitespace accepted. Reject embedded commas/quotes, blank interior rows, wrong/duplicate headers, wrong column counts, duplicate identifiers, malformed numbers, infinities and negative rainfall. No skipped malformed row.
- Blank numeric cells and exact `NA` are missing, never0. All other missing codes must be reconciled before use; `-999`, inequalities and `NaN` are rejected. Zero is observed dry weather.
- Numeric input uses finite decimal values up to1e9; nonzero values below1e-12 are outside the supported precision and rejected, including decimal underflow to0. Arithmetic uses browser floating-point numbers, not arbitrary-precision metrology. Keep physically meaningful resolution and original observations.
- Maximum5 MiB UTF-8,100,000 data rows and400,000 cells per CSV. At most30 station columns. A bounded preview shows at most100 result rows; full CSV export uses all analyzed rows and states the chosen basis. Arithmetic must not be based on the preview.
- Time format for counter/event data:`YYYY-MM-DD HH:mm` in one fixed-offset clock. Strict real calendar dates, minute precision, strictly increasing unique times. No automatic timezone/DST/date-format inference; translate changing DST/local labels before use. The expected whole-minute step is entered explicitly (1–1440). All timestamps must lie on the first record's step grid; skipped steps are unknown intervals, not zeros.
- Counter/event timestamps mark **interval ends**. The first counter row is only a baseline. The first interval-depth row represents the full interval ending at its timestamp. Missing leading/trailing context remains visible in event boundaries.
- Depth unit is explicitly `mm` or `in`;1 in =25.4 mm. Selecting a source unit changes interpretation and clears output; it does not rewrite pasted/file values. Users must convert the source data themselves before using a different source unit. Support independent SI/US-equivalent fixtures, not a fake textarea auto-conversion.
- Paired/network `period` labels are unique, nonempty safe identifiers (letters/numbers/space/underscore/hyphen/period/colon, maximum64 characters). Input order is preserved, not automatically sorted or inferred as dates. Operator must align actual accumulation periods and durations. Station IDs start with a letter and contain only letters/numbers/underscore/hyphen, maximum32 characters.
- Reset, edits, unit changes and new file selection revoke stale report/copy/export state immediately. An in-flight file read cannot overwrite later edits/reset/selection or resurrect output. A failed replacement file must not leave an old result exportable.
- New forms use IDs for local lookup and deliberately omit native control names. Thus CSV/configuration fields are not successful native form entries. Analyze is disabled in initial HTML until local handlers mount; a noscript notice explains the boundary. Verify empty native FormData and disabled Analyze with JavaScript off, as well as normal scripting-enabled operation.

## Tool1 — counter-to-increment analyzer

Inputs:`time,counter` CSV; expected step; depth unit. Counter is an accumulated depth, not bucket tips, intensity or an interval measurement. No instrument calibration factor is inferred.

For pair i−1,i: raw delta=`counter_i−counter_(i−1)` when both values exist. Accept an interval increment only when elapsed time equals the entered step, both values are present and delta≥0. A zero delta is a valid dry interval. Decrease is an **unresolved reset/decrease**, not negative rainfall, zero rainfall, inferred wrap or the new counter value. A skipped-step positive delta is an **unallocated gap delta**: retain the raw evidence, but do not divide it across the gap or count it as an accepted interval. Either missing endpoint makes the pair unknown. Following a reset, the next ordinary nondecreasing pair may again be valid from its new observed baseline.

Outputs: accepted-depth sum (explicitly partial if any interval excluded), valid interval count/time against all expected source-window intervals, excluded span/time, per-pair status/raw delta and interval-end rows. Transfer CSV is exactly `time,rainfall`, one row for every post-baseline record, with `NA` at unresolved intervals. If the first pair itself spans a gap, prepend one explicit NA at the first expected interval end so that Tool2 retains the original observation window. This is an unknown anchor, not an observation or a reconstructed depth; interior missing timestamps remain unexpanded. Audit CSV separately retains raw evidence/status; no automatic corrected counter series. A positive derived increment below supported input precision stops the run rather than creating an unimportable or false-zero transfer.

Demonstration hourly counters0,1,3,0,2: accepted1+2+2=5 mm,3 valid intervals,1 unresolved decrease; transfer1,2,NA,2. Reset-period depth is unknown, not0.

## Tool2 — event separator/analyzer

Inputs:`time,rainfall` interval-depth CSV, expected step, chosen dry gap in minutes (at least the step, at most10,080), depth unit. All positive rainfall is wet. No trace threshold silently erases small rainfall; no automatic climate-specific IETD is chosen. Example settings are not recommendations.

Two wet groups are separated when the intervening **observed zero-depth duration is ≥ the chosen dry gap**. Dry-run accumulation uses complete known intervals, not wall-clock gaps between wet readings. A missing value or skipped interval ends an active event with an unknown right boundary and clears known dry context; the next wet group has an unknown left boundary unless sufficient observed dry intervals have since accumulated. Missing data never establish separation. A positive reading following an implicit gap still represents its own stated end interval; the gap before that interval remains unknown.

Event start=`first wet end−step`; last wet end is the end. Duration includes intermediate dry intervals shorter than the chosen gap, but excludes bounding dry runs. Depth=sum of known wet depths in that fragment. Mean intensity=depth/duration hours; peak interval intensity=max interval depth/(step hours), not an instantaneous or moving-window maximum. Complete versus left/right-unknown **fragments** must be explicit. First/last events need sufficient dry context to have bounded edges; record boundaries do not automatically close them. No frequency/return-period/IDF or flood prediction.

All-dry records validly return0 events. All-missing records return0 identified fragments **and no observed depth**, not a measured0 total. Report observed wet-depth conservation across all fragments, missing rows, skipped intervals and valid observation coverage separately. Run a second dry-gap scenario by editing the same tool; do not create another page.

Demonstration hourly depths0,0,2,1,0,0,4,0,0; gap120 minutes:2 bounded events, depths3 and4 mm, durations120 and60 minutes, peak intensities2 and4 mm/h, total observed7 mm. The exact two-hour dry gap separates; a three-hour gap joins into one bounded/edge-qualified fragment as dictated by the available context.

## Tool3 — double-mass checker

Inputs:`period,target,reference` CSV; count of original input rows before a user-chosen split; depth unit. Minimum4 rows; split leaves at least2 original rows on each side. Matching period length, catchment regime and reference construction are external responsibilities. A reference may already be a documented multi-station composite; do not invent it automatically.

A pair is usable only when both nonnegative depths are present; otherwise omit **both** from paired accumulation and retain an exclusion. Cumulated reference is x; cumulated target is y. Each segment's through-origin cumulative increment ratio=`sum target / sum reference`, not an automatically fitted free-intercept regression or significance test. Split refers to original rows, including excluded rows. Ratio undefined when its reference sum is0; relative segment change undefined when either needed ratio is undefined or first ratio is0. Require at least2 usable pairs in each segment to report a segment comparison; otherwise show not assessed. No divide-by-zero, forced0 ratio or rejection of legitimate dry pairs.

Outputs: paired totals/count and exclusions, selected split, segment ratios/relative change where defined, per-period paired accumulation and accessible SVG relation with tabular alternative. A ratio change does not establish cause, a calibration error or statistically significant nonstationarity. Never apply a correction factor to original rainfall. Missing-pair totals are not full-record totals. At most500 plotted paired points, clearly labelled if thinned; exactly500 remain unthinned, larger records retain500 actual original points including both ends. The origin is an additional plotting anchor, not a rainfall observation. Full calculations/export retain all rows.

Demonstration target10,20,30,15,30,45 versus reference10,20,30,10,20,30; split after3 rows: totals150/120 mm, ratios1 and1.5, relative change+50%. This is descriptive arithmetic, not an instruction to multiply old or new observations by a factor.

## Tool4 — multi-period areal rainfall series

Inputs: weights CSV`station,weightPercent` and observations CSV`period,A,B,...` with exactly matching station IDs; depth unit. Require2–30 positive weights, sum100% within0.000001 percentage point (normalize only this tiny rounding difference and disclose it). No arbitrary rescaling of an incomplete network. Do not construct Thiessen polygons or derive spatial representativeness from station count. Weights must come from an established, verified fixed network and basin boundary.

For complete period:mean=`Σ(weight_i/Σweights)×depth_i`. For incomplete period: **no full-basin mean**; show available weight, missing stations and known weighted contribution only. Missing observations are not0; remaining stations are not silently renormalized. No observations means no known contribution is reported, not a measured dry0. An observed all-zero complete period legitimately has a mean0. Moving/deleting a gauge changes the physical network; obtain a new weight set rather than using this tool to invent a replacement.

Outputs: complete/incomplete/no-observation counts, fixed weights, complete-period means, per-period coverage/missing IDs/known contribution, full CSV export and100-row labelled preview. No complete-period sum presented as the full supplied-record rainfall. This multi-period missing-coverage decision and retained audit is mandatory; a single weighted-average formula alone is an insufficient fourth tool.

Demonstration weights A20%,B30%,C50%:10/20/30→23 mm at100% coverage;0/0/0→0 mm at100%;NA/5/NA→no basin mean,30% coverage and1.5 mm known contribution. Full-network totals cannot be inferred from the last period.

## Shared UX, output and integration

- Existing Hydraulic Field Bench shell, button states, label/help conventions, responsive layout, breadcrumbs, sources, dates and local file/paste affordances. Keep input schemas in wrapping help, not unbreakable long labels.
- Dedicated page CSS/JS. Never change shared form-utils, unit conversions, Finder matching/reset, button rules, stabilization layout or old formulas merely for this cluster.
- Contextual copy/print: tool URL, clock/interval/depth basis, dry-gap or split/weight configuration, source row counts, exclusions and preview/full-export distinction. Chart has a text/table alternative. CSV must be escaped/safe, names controlled, numeric precision not silently rounded to displayed values. Pure transfer CSV must not acquire explanatory comment/header rows that break the next tool.
- Valid print summaries also include the actual entered CSV headers/values in explicitly bounded100-row-per-field previews, not merely source counts. Large-file originals/full copy/exports remain separate. Uncomputed/error states hide the entire report layout in print media; disabled action buttons alone are not the only guard.
- Copy/print/export disabled without a current valid report. Keyboard-focusable labelled internal-scroll table regions; last column reachable on mobile. Display nonzero small values in scientific notation if ordinary decimals would show a false0.
- Reset returns examples/settings and initial report state. Load file only replaces text after successful current-generation read; stale reads discarded. Same file can be selected again. File error/recovery must be tested, including two file fields on the network tool.
- Hub links four independent entry points; guide explains counter vs increment vs intensity, missing vs dry, event censoring, split/reference interpretation and fixed-network coverage. Reference compares record bases without a universal dry gap, correction, criterion or design table. Every tool explains assumptions, formulas, worked example, limitations and primary sources; no boilerplate-only guide/reference.
- Expose7 routes through home/system navigation, Finder/system filter, Guides/Reference indexes, sibling/next-step links, sitemap and llms. Preserve the exact five homepage badges, all older slugs/metadata/formulas and old review/sitemap dates. Give changed discovery surfaces truthful October30 dates only.

## Primary support and scope

- CDSS Delta/Cumulate documentation: differencing, missing endpoints, reset ambiguity and paired cumulative comparison. The conservative refusal to reconstruct unknown reset/gap rainfall is WSB's explicit implementation policy, not a claim that it is the only valid instrument-specific method.
- IETD `drawre` documentation and the2023 rainfall-event paper: interval depth and operator-selected dry-gap separation; WSB retains missing/censored fragments rather than automatically deleting them or selecting a universal trace threshold.
- NWS Basic Hydrologic Concepts and precipitation measurement pages: station spatial weights and weighted mean. Multi-period coverage/unknown handling is the stated WSB audit policy, not an official forecast procedure.
- Sources and competitor details are linked in the discovery document. USGS1541-B direct fetch failed403; do not pretend to have reviewed that PDF or depend on an unread fitting/significance procedure.

## Independent verification matrix —planned, not yet passed

Use hand/literal expectations and separate unit conversions, not calls to the implementation to generate fixtures. At minimum:

|Group|Required independent cases|
|---|---|
|Parser|BOM/CRLF; whitespace; exact headers; duplicate/missing/extra columns; quotes/comma labels; interior blank row; blank vsNA vs0; malformed/nonfinite/negative numbers; row/cell/byte limits; duplicate IDs; unsafe IDs|
|Time|leap-day valid/invalid; invalid month/day/hour/minute; duplicate/descending times; non-grid records; skipped steps; fixed-clock no timezone inference; step boundaries|
|Counter|default5 mm; all dry0; missing current and previous; increase across skipped time; unresolved drop; recovery after drop; equal counters; positive first baseline not rainfall; large/tiny values; mm/in equivalence; transferNA and no invented steps|
|Events|default2 events/7 mm; exact-gap separation; below-gap joining; internal dry duration; leading/trailing censor; explicitNA/gap splits; sufficient dry recovery; all dry; all missing; missing between storms not dry; depth conservation; mean/peak interval intensity; SI/US equivalence; invalid gap/step|
|Double mass|default1/1.5/+50%; unchanged ratios; unequal durations operator warning; split counts original rows; paired omissions; one-sided missing; insufficient segment pairs; dry reference; zero initial ratio; all-zero pairs; SI/US invariance of ratios; cumulative totals|
|Areal|default23/0/NA;30%/1.5 partial; all missing; missing tiny-weight station still incomplete; no renormalization;2/30 station bounds; invalid/duplicate/mismatched stations; zero/negative weights; sum tolerance; period duplicates; large/tiny values; SI/US equivalence; full export beyond preview|

Fresh static/navigation/publish-boundary/Analytics checks and all544 existing numeric assertions must pass. Add explicit registry/date/metadata/canonical/schema/label/source/parser guards. Shared generator/navigation/discovery changes require **112×5=560 local renders**, not just35 new-page screenshots; exercise existing59 tools, applicable unit switching, Finder native reset/empty/system/type paths, ten-system mobile menu, stabilization alignment, responsive Greywater/terminology tables, pressure-tank rating confirmation and protected badges.

Each new page at390/768/1024/1280/1440; each new tool normal/zero/boundary/large/invalid/error-recovery/stale/reset/refill/source-unit/file/copy/print/export cases as relevant. Review actual screenshots and rightmost-column scrolling. Exact-six-host Analytics guard before first automated navigation; completed requests0. No native OS print-dialog/PDF-pagination assertion unless actually tested separately.

After push: actual remote/local/fetched SHA equality, exact-SHA successful Pages run, production route/source/asset/canonical/GA4/sitemap/docs404/badge verification, all7 new pages×5 widths plus protected controls and real production interactions, actual screenshots and zero Analytics completions. Record actual scope/results in dated artifacts; do not overwrite old QA evidence. Final docs-only handoff also needs exact-SHA deployment and clean main equality. No ranking/indexing/traffic lift attributed to the release.
