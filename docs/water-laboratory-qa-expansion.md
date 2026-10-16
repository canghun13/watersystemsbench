# Water Laboratory Calculations & QA — implementation contract

Decision: **GO**, 2026-10-16. Research: `workflow-cluster-discovery-2026-10-16.md`. Record this contract before production changes.

## Cluster and boundary

Users: water/wastewater laboratory analysts, plant laboratory staff and reviewers. Repeat job: reduce bench data, preserve the measurement basis, review precision and recovery, then retain a transparent review packet. Search targets emphasize seed geometry, eligible bottles, filter/ash units, censored duplicate batches and volume-corrected spike recovery, not just competitive head terms.

Deliver 7 public pages: `/systems/water-laboratory-qa/`; four tools below; `/guides/review-water-laboratory-calculations/`; `/reference/water-laboratory-qc-calculation-bases/`. Projected inventory 105 = 7 core + 9 hubs + 55 tools + 21 guides + 13 references. No plant-control, dosing, certified reporting, potable-safety, regulatory acceptance, test execution, sampling approval, GGA certification or BOD-time/temperature conversion. Current approved laboratory method/SOP and qualified analyst always govern. A numeric criterion comparison never means an analysis is valid.

Use static HTML/vanilla JS, existing design/layout/result/Copy/Print/reset patterns and literal navigable links. CSV files stay local; no upload, account, persistent sample database or paid service. Laboratory concentrations remain mg/L and lab volumes mL (also support L and g/mg where relevant), rather than inventing inappropriate gallon-based laboratory protocols. Preserve production GA4 and block all automated QA Analytics before navigation. Preserve exact homepage badges and all previous fixes.

## 1. BOD Seed Correction & Bottle Analyzer

- Route: `/tools/bod-seed-correction-bottle-analyzer/`; type Analyzer.
- Trigger/search: BOD seed correction; seeded dilution water; invalid seed controls; multiple bottle results.
- Inputs: bottle volume mL; method label BOD/CBOD (no numerical conversion); seeding mode none/direct/seeded dilution water; minimum depletion and final DO from SOP; local CSV `bottle,sampleMl,initialDo,finalDo,seedMl`; seed CSV `control,initialDo,finalDo,seedMl`; seeded-water control initial/final DO. Example text is visibly a demonstration, not universal criteria.
- Logic: `P = sampleMl/bottleMl`; direct-seed unit demand is mean `(control initial−final)/seedMl` over controls satisfying entered DO checks; seed correction = unit demand × sample seed. For seeded water, correction = control depletion × `(bottleMl−sampleMl)/bottleMl`. Unseeded correction zero. Demand = `(sample depletion−correction)/P`. Direct mode requires equal sample/control bottle volumes and the same seed suspension. Dilution-water mode excludes extra direct additions. Prior sample dilution must already be represented as original-sample-equivalent mL or handled outside this tool; no hidden multiplier.
- Outputs: every seed/sample row retained, per-row reason, raw depletion, correction, sample fraction, calculated mg/L or not used; summary number eligible. No automatic batch mean across potentially different sample IDs; each row is independent. Numerically excluded bottles display no reportable concentration. Zero corrected demand is zero, not negative; seed greater than depletion is excluded.
- Validation: strict headers/cell counts, finite numbers, nonnegative DO/seed; positive sample ≤ bottle; direct sample+seed ≤ bottle; positive seed in direct mode; positive seed controls; initial≥final. Bad syntax/geometry is an error, not silently skipped. Scientifically nonqualifying rows remain explicit exclusions. No eligible controls/bottles produces a completed evidence report with zero eligible, never a fake numeric pass.
- Example: 300 mL bottle, direct 2 mL seed; controls 8.4→1.6/20 mL and 8.4→4.3/10 mL give 0.375 mg/L per mL; correction 0.75. Sample 15 mL, DO 8.5→3.5 gives 85 mg/L. Seeded-water hand calculations give12.4,12.6,15.0 mg/L. DNR's third line prints13.8 but `(4.5−2.0)×6=15.0`; do not copy that arithmetic slip into the tool or expected fixture.
- Next: review method and other batch controls; optionally evaluate true duplicate results with RPD. Sources: Wisconsin DNR BOD Seed, public laboratory guidance. Never average BOD and CBOD.

## 2. TSS & VSS Gravimetric Calculator

- Route: `/tools/tss-vss-gravimetric-calculator/`; Calculator. Search: TSS VSS filter weights grams; minimum residue sample volume.
- Inputs: tare filter, dried filter+residue, ignited filter+ash; g/mg selector; filtered volume mL/L selector; paired blank ignition mass loss (same mass units); operator-entered minimum dry residue mass. Selecting units converts the existing entries once; reset restores starting units and values.
- Internal: masses mg, volume mL. `dry = dried−tare`; `volatile = dried−ignited−blankLoss`; `fixed = dry−volatile`; concentration = mass ×1000/volume; volatile fraction =100×volatile/dry, undefined if dry=0. Show dry mass versus entered minimum separately, no hardcoded method LOD/reporting limit.
- Outputs: TSS,VSS,fixed mg/L; dry/volatile/fixed mg; VSS fraction; entered minimum-mass comparison. These are gravimetric arithmetic, not organic-carbon/biomass identity or laboratory acceptance. Prepared-filter basis and matching blank correction must be appropriate to the governing method.
- Validation: finite nonnegative masses/blank; positive volume; tare≤ignited≤dried; corrected volatile between0 and dry; negative weights/volume or impossible ordering error. Zero residue allowed, fraction unavailable, mass check visible. No universal drying/ignition instruction.
- Example: tare1.1774 g, dry1.2074 g, ash1.1874 g, blank0,100 mL → TSS300,VSS200,fixed100 mg/L,66.667%volatile. Sources: DNR Laboratory Study Guide, EPA160.2/160.4 context; blank subtraction is explicitly arithmetic with user-supplied net loss, not a prescribed universal correction.

## 3. Water Duplicate RPD Batch Checker

- Route: `/tools/water-duplicate-rpd-batch-checker/`; Checker. Search: water RPD CSV nondetect; duplicate precision near reporting limit.
- Inputs: local CSV `analyte,result,duplicate,reportingLimit`; any consistent linear concentration unit; operator maximum RPD, minimum multiple of reporting limit for percentage comparison, low-level absolute-difference limit. `<number` represents a censored result; no other qualifiers inferred.
- Logic: detected pairs with positive mean → `100×abs(a−b)/((a+b)/2)`; absolute difference always displayed for uncensored values. If either value is below entered `RL×multiple`, compare absolute difference to entered absolute limit instead of RPD. Both zero have undefined RPD, can only use the low-level absolute comparison. If multiple=0 and both zero, not assessed. Any nondetect → no RPD/acceptance comparison, show needs method review, never substitute zero/half limit. Equality to a chosen limit meets that entered arithmetic criterion.
- Output: all rows, mean/difference/RPD where defined, comparison mode, status within/exceeds/not assessed. Counts not a batch-validity verdict. No automatic unit/analyte matching or regulatory qualifiers. No pH/log-unit percent comparisons.
- Validation: exact header/schema; nonnegative finite numeric values or strict `<number`; RL≥0; no blank cells, formulas or arbitrary strings. Bad row errors name row, clear stale report. Sources: EPA RPD definition and USGS field QC. Example10/12→18.1818%;0.05/0.06 atRL0.02×5 uses absolute0.01;`<0.02` pair not assessed.

## 4. Matrix Spike Recovery Calculator

- Route: `/tools/matrix-spike-recovery-calculator/`; Calculator. Search: matrix spike recovery volume correction; concentration basis dilution.
- Mode A: matched original-sample-equivalent native/spiked concentrations and added concentration, same unit/basis. `100×(spiked−native)/added`.
- Mode B: aqueous physical-volume mass balance. Native concentration `C0` before spiking; measured final-mixture concentration `Cm` after spiking (not already corrected to original sample); sample volumeV, spike volumev, stock concentrationCs. Expected final `(C0×V+Cs×v)/(V+v)`; native contribution `C0×V/(V+v)`; added final `Cs×v/(V+v)`; recovery = `100×(Cm−nativeContribution)/addedFinal`. This is an explicitly derived conservation-of-mass implementation, not a claim that Thermo's simplified formula includes identical native-dilution handling. Extra reagents/extraction/digestion/dilutions must be reconciled separately; no automatic correction of reported results.
- Inputs: nonnegative concentrations, positive added/stock and volumes, operator recovery lower/upper bounds, mode selector. Bounds are illustrative values, not recommended global limits. Negative recovery/over100 retained as review evidence, not clamped. Lower≤upper required; all active outputs finite; hidden mode inputs ignored and mode changes clear stale results.
- Outputs: recovery and comparison to entered range; expected spiked concentration; native/spike final basis; volume increase in physical mode; warning that large additions alter matrix and volume correction does not fix matrix effects. ModeA native5/spiked14.6/added10→96%; modeB C0=2,V100,Cs100,v10,Cm=12/1.1→100%.
- Sources: USGS QC, Thermo Fisher matrix-spike note; no competitor output as formula authority. Next: investigate with method-specific QC, do not rescale official results by recovery.

## Shared acceptance contract

- All four: visible method/inputs/units; working dynamic results; result input record, URL and limitations in print/copy; current input changes clear stale results; strict error and error→recovery; reset; local file/text parity where applicable; label/keyboard access; escaped sample labels; no eval/HTML injection; row/size caps for local files.
- Independent fixtures use literal expected results or independent arithmetic, not compute functions to generate expected values. Each engine normal/low/high/zero/negative/boundary/invalid combinations and unit equivalence where applicable. Cover all three BOD modes/invalid controls, zero/censored/low-level RPD branches, spike both bases/negative recovery, solids mass order/blank/zero.
- Fresh full-site five-width render regression because shared navigation/generator discovery surfaces change: 105×5=525. All55 tools default result/reset; new four at all widths for submit/error/recovery/reset/copy/print and applicable file/unit/mode change. Check header/H1, control bounds, rightmost table access, menu, Finder native reset, hover/focus, stabilization alignment and exact badge source. View actual new hub/tools/reference at desktop/mobile; numeric geometry alone is not visual PASS.
- Retain historic browser reports. Use a dated new runner/report rather than relabel old evidence. Full static/navigation/publish/analytics and all391 previous fixtures. Production exact-SHA deployment, HTTP/source/canonical/GA/sitemap105 parity, new pages/tools live, docs404, zero QA Analytics, final clean equal Git refs.
