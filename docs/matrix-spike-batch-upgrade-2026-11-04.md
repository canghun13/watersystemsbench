# Matrix Spike Recovery batch upgrade —2026-11-04

Pre-implementation contract. Baseline main `8ebf7cbde3963b81a8d26b6080352eaebb80497c`, clean and equal to fetched/actual main. This is one existing-page upgrade, not a new tool or cluster.

## Decision and evidence

Target `/tools/matrix-spike-recovery-calculator/` has113 GSC page-table impressions/1 click/position10.07 versus47/0/11.91 in the October30 record. These are rolling aggregates, not a weekly page lift. The latest query table has `spike recovery calculation`10 impressions/9.1; no query-page join is supplied. Current form supports one analyte/record and one pair of entered limits. It cannot retain several identities, differing per-record SOP limits, incomplete rows and a complete review export together.

EPA Region1's archived inorganic validation worksheet, matrix-spike section, explicitly retains analyte identity, native/spiked result, addition, recovery and method-specific limits. It is workflow corroboration, not a universal method or current acceptance policy. Thermo Fisher's primary guidance supports matched-basis recovery and defers acceptance criteria to the analytical method/SOP. Physical-volume mode remains the site's explicitly derived aqueous additive-volume model, not an asserted transcription of a method.

Primary sources:

- https://19january2021snapshot.epa.gov/sites/static/files/2018-06/documents/r1-dr-inorganic-worksheets-2018.pdf (matrix-spike section on PDF page14).
- https://www.epa.gov/hw-sw846/quality-assurance-qa-quality-control-qc (matrix-specific QC and multiple-analyte limitations).
- https://assets.thermofisher.com/TFS-Assets/LPD/Product-Information/Why-How-Matrix-Spike-ST-MATSPIKE-EN.pdf (recovery formula and SOP-specific interpretation).

Actual current competitors reviewed: Molecular Lab Tools basic/spike modes, unit support, entered target range and copy; ToolFoundry single-spike calculation/interpretation/limits. These are real alternatives; no absence-of-tools claim. FastCalc search result describes paired MS/MSD/RPD, but direct retrieval failed, so interactive behavior was not verified. The selected improvement is a bounded local multi-record worksheet on an already searched URL, not a market-wide uniqueness claim.

Existing-candidate score uses search30/rank20/value20/gap15/ROI15. Matrix Spike25+18+18+13+13=87, all A–G pass. Pipe ID26+18+12+5+12=73, table already answers lookup; Pump Curve22+15+16+7+13=73, guide/comparator already answer the observed job. Both observe. A new broad expansion funnel is not entered or claimed; current low traffic is not the reason.

## Preserved scope

Keep URL, title, H1, canonical, description, original single-record form and original `computeSpike`, all old JS/CSS and all111 other public HTML byte-identical after newline normalization. Only selected reviewed/sitemap date becomes November4. Public pages112, tools59 and sitemap112 unchanged. Preserve five homepage badges, GA4, exact-six-host guard, publication exclusions, existing navigation/Finder/stabilization and October releases.

Add a dedicated batch module/CSS/content factory and a target-only optional extra-styles hook in the generator; no backend, API, framework or dependency. Batch module imports the original pure engine rather than reimplementing its formula. Old single-record behavior remains independently tested. New batch form has ID-only unnamed controls and initially disabled review action; script-off fallback must serialize0 entries.

## Batch contract

- One concentration unit for all concentration cells in a review: mg/L or µg/L. Selecting it declares the source basis and never rewrites CSV numbers. Volumes are mL in physical-volume mode. Equivalent-unit fixtures scale all concentration inputs together.
- Exact plain/unquoted CSV. Matched header `record,native,spiked,added,lower,upper`; volume header `record,native,spiked,sampleMl,spikeMl,stock,lower,upper`. IDs identify sample and analyte,1–80 characters, unique, no comma/quote or spreadsheet-formula prefix. BOM/CRLF accepted.1–250 records,256KiB; blank required cells/structural errors fail the review, not silently skip rows. NA/ND/inequality or invalid numeric cells remain identified as not calculated; never zero-substitute.
- Strict nonnegative decimal/exponent inputs, maximum1e12; nonzero inputs at least1e-9. Added concentration/sample volume/spike volume/stock strictly positive. Per-row lower/upper required and ordered. Original engine's inclusive comparison tolerance1e-10 percentage points is retained and disclosed. No invented method limits or clipping of negative/above100% recovery.
- Two basis modes reuse the existing equations. Every calculated row retains original inputs, native/added contribution, expected spiked concentration, signed recovery and entered-range status. Row calculation errors retain identity and reason. Summary separates calculated/within/outside/not-calculated counts; any uncomputed row makes review incomplete, never a healthy batch pass. This does not validate an analytical batch or replace MS/MSD, LCS, blank or other QC.
- Screen/print preview first100 rows, explicitly bounded; full audit CSV exports all250 supported rows and original input fields including invalid entries. Copy packet retains full entered CSV, unit, basis, results and URL. Formula-like text cells in audit CSV are apostrophe-prefixed for spreadsheet safety, including invalid numeric inputs; the text copy retains the original source and is not advertised as spreadsheet-safe. No automatic correction of official sample results.
- Local file only, no upload. Read generation cancels stale file completion after edits/reset/mode/unit changes. Same-file reselection and oversize/malformed recovery tested. File pending disables run; reset/edits clear prior result and exports. Mode changes preserve entered text; replace-example button is explicit. Reset returns the demonstration, not user data.
- Dedicated full-width batch input/report avoids a tall blank second column. Visible horizontal-scroll/keyboard guidance and a labelled scroll region expose all columns. Anchors account for the sticky header. Print shows title, chosen unit/basis, current summary, focused recovery/range/review/reason columns, bounded source preview, URL and limitations; contributions remain in screen/copy/full CSV. Forms/buttons/nav/articles and uncomputed/error batch state are hidden; all-not-calculated review has Print disabled. Existing single report may also print if separately calculated; both reports retain their own input contexts. Native OS print dialog/PDF pagination not claimed.

## Independent checks before release

Literal expectations:5/14.6/10→96%;2/6/10→40%;0/0/10→0%;5/0/10→−50%. Physical2mg/L×100mL +100mg/L×10mL, final120/11mg/L→100%; native contribution20/11, addition100/11. Physical2/12/100/20/50→124%. Vary per-row limits, inclusive bounds, units, zero and NA, duplicate/unsafe labels, parser caps, underflow/overflow, invalid recovery prerequisites and250-row export. Expected values are independent literals/rationals, not produced by the implementation.

Run all702 existing assertions plus new fixtures; static/navigation/publication/Analytics112. Scope guard verifies111 unchanged pages, all old engines/styles, metadata/form, exact badge block, original dates and sole sitemap-date change. Fresh browser scope expands to21 representative pages ×5 widths because of the target-only generator hook, all selected batch interactions plus protected single/laboratory/rainfall/Finder/stabilization/pressure/table controls. Inspect actual desktop/mobile result/print/table screenshots; geometry alone is not visual PASS. Source hashes stable during final runs. Push main, exact-SHA Pages, actual production source/bot/boundary/browser QA, handover and clean equal refs required before completion.
