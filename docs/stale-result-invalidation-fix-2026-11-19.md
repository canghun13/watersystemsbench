# Shared result invalidation —2026-11-19

Pre-implementation defect record. Selected classification: **FIX — edited inputs retained an exportable previous calculation**. Growth upgrade and expansion are deferred by Priority A, not rejected for lack of traffic.

## Reproduction and cause

- Baseline:clean main `79f63af9699d70d475ec5093b50e460b8873d91d`, equal local/fetched/actual remote.112 public pages/59 tools;858 original independent assertions and static/navigation/publication/Analytics pass. Existing release source guard38 live probes passes. Request text is byte-identical to the previously supplied weekly workflow; current six report attachments only used for analytics.
- Target: `/tools/water-storage-tank-sizing-planner/`; independent second target `/tools/total-dynamic-head-calculator/`.
- Control: `/tools/tss-vss-gravimetric-calculator/`, which already clears results on input/change.
- Exact reproduction:real production Chrome157.0.8103.79 at390/1280; calculate default storage3200L, change dailyDemand2000→3000 without resubmitting. Screen still shows3200L and old6000L gross demand while input is3000. Copy and Print remain enabled, and actual clipboard contains the prior result. Re-running the unchanged formula should produce7200L. TDH similarly retains48.46m after elevation changes to99. Control TSS hides its300mg/L report and disables both actions after dry mass changes.
- Root cause:`setupForm` in `assets/js/form-utils.js` invalidates only on submit/reset. `setupUnitSystem` separately invalidates unit changes, and newer tools add their own input listeners; older consumers lack common input/change invalidation. This is a reproduced existing correctness defect, not an asserted recent release regression or numerical formula error.
- Affected scope:all59 canonical tool routes consume this helper through25 modules. This is dependency scope, not a claim all59 reproduce the failure: some consumers already invalidate independently. Additional Matrix Spike batch controls have their own lifecycle and must remain intact.
- Evidence:`tools-qa/weekly-growth-2026-11-19-stale-baseline-results.json`,6 production cases, Analytics6intercepted/0completed; actual desktop before screenshot inspected. No analytics/report cells treated as instructions, no user data uploaded.
- QA coverage gap:previous default/reset/unit/invalid-submit checks did not universally test the interval after a native field edit but before the next submit. The new regression explicitly tests that interval and the cleared export packet on every tool route.

## Minimal implementation contract

Add form-scoped `input` and `change` listeners in `setupForm`, each calling the existing `clearResult(form)`. Reuse its established hidden result, disabled Copy/Print and cleared `dataset.lastResult` behavior. Do not recalculate automatically. Native submit remains the explicit calculation boundary; reset behavior and independent module invalidation remain unchanged.

No new formula, threshold, mode, content, metadata, URL, sitemap date, HTML, CSS, generator, conversion, dependency or backend. Exact five-badge homepage, navigation, prior releases, GA4 production tag, six-host QA blocker and production docs boundary preserved. No broader event interception, monkeypatching of values, input logging or analytics instrumentation. Programmatic `.value=` without an input/change event is outside this event contract; module-owned example/file flows retain their existing handlers.

## Verification contract

1. Red→green independent state fixtures for input/change, existing actions and copy packet, no automatic calculation, unchanged click/focus/keydown behavior, explicit submit/error recovery, form isolation and reset scheduling. Expected states are literals, not generated from production output.
2. All858 existing calculation/basis fixtures unchanged;112-page static/navigation/publication/Analytics checks.
3. Fresh full112×5=560 real render matrix, all59 defaults/resets and applicable SI/US switches, original rainfall/protected interactions. Runner gets an explicit dated-report override; no historical report overwritten or replayed as fresh.
4. Dedicated native input/change invalidation on all59 tool forms, plus representative target/control/finder/lab/batch/pressure/stabilization/file/print/Copy/reset cases across390/768/1024/1280/1440. Actual desktop/mobile before/after and print-media screenshots inspected. Test text/number/textarea/select/checkbox/file paths where present; no blanket claim for absent control types.
5. Strict scope parity:all112 HTML, all other assets, all25 numerical modules, generator, sitemap/machine files and exact homepage unchanged from baseline. Only production `form-utils.js` may differ.
6. Exact-SHA Pages success, actual live helper/source/canonical/Googlebot/docs checks and production browser verification. Exact-six-host blocker before first navigation;0 completed Analytics. No native OS print-dialog or PDF-pagination claim.

## Current search context, not a second release

GSC current7(November10–16)7clicks/281impressions versus preceding7(November3–9)4/248; latest28 16/1122 versus7/696. Rainfall first4 page rows each1impression, event tool1click; tiny discovery signal, not durable growth. Storage GSC1/4/8.75 and Bing7/130/4.6923 plus intermittent-refill long tails suggest an eventual existing-page opportunity, but Bing dates are absent and GSC sample weak. No refill-window feature is authorized as part of this defect fix. No40-family discovery, full exclusion reconstruction or expansion NO-GO claimed.
