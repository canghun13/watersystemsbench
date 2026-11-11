# TSS-only result scope — implementation contract, 2026-11-11

Written before public implementation. Selected classification: **EXISTING-UPGRADE GO — TSS & VSS Gravimetric Calculator, TSS-only scope**. No new cluster, URL or standalone tool.

## Evidence and decision

Clean main baseline `a984e42bfa6a43e08731f7b44d556c0291574f23` equals fetched and actual remote. Fresh112-page publication/Analytics/static/navigation checks and799 independent assertions pass. Existing release guard41 live checks passes. Baseline real Chrome target/control at390/1280 passes4 renders;6 Analytics requests intercepted/0 completed. Target default produces300 mg/L TSS/200 VSS, but blank ash blocks even TSS; no result-scope selector exists. This is a missing supported workflow, not an incorrect existing combined formula or a Priority A site outage.

Current supplied GSC page row:78 impressions,1 click,position4.32, versus56/0/4.62 in the committed November4 record. Query `vss calculation`14/6 and `vss calculator`3/4.33 corroborate solids interest, not query-page attribution or proof of TSS-only demand. The rolling page increase is not matched weekly lift. Primary laboratory teaching material explicitly distinguishes the dry-filter TSS calculation from the later ignition/VSS determination. A user holding only tare/dry/volume must not invent ash or infer VSS=0.

Editorial prioritization, search30/rank20/value20/gap15/ROI15: TSS89(24/18/19/14/14); Pipe ID74(26/19/12/5/12), existing table already answers lookup; Pump Curve73(22/16/16/6/13), existing guide/BEP/NPSH/comparator already covers job. Matrix Spike and Pressure Tank were recently upgraded and are not repeated without new deficiency. Gates A–G pass for TSS: real page signal, exact existing TSS intent, reproduced forced-ignition omission, useful complete arithmetic, strengthened existing search destination, unchanged URL, bounded local form/branch. Search gain is a hypothesis, not promised uplift.

## Contract

- User/trigger: analyst or operator has prepared-filter tare, dried-filter residue mass and original filtered volume, with no ignition result, or later has the matching ignition record.
- Existing route/title/H1/canonical/description preserved. Default remains combined TSS/VSS; original `computeSolids` unchanged.
- Add `solidsScope`: combined / TSS only. Shared tare/dry/volume/minimum remain; ignition and matching ignition-blank fields are hidden and disabled in TSS-only, retained for switching back, never substituted with fabricated zero/tare.
- Units: existing g↔mg and mL↔L conversion, internal mg/mL. No irrelevant US liquid units or solids-to-turbidity conversion. Hidden retained mass inputs continue unit conversion so switching back does not mix units.
- New pure `computeTss`: dryMass=dryMg−tareMg; TSS=dryMass×1000/volumeMl. Same finite nonnegative mass≤1e12 and volume≥1e-9 limits as original engine. Require dry≥tare; zero residue valid. Minimum mass comparison retained, not a detection/reporting limit.
- TSS-only output: TSS, dry residue, explicit selected scope, entered minimum comparison, **VSS/fixed/VSS fraction not determined**. No invented fraction or zero. Original combined result unchanged except useful scope context.
- Input record/copy/print: include selected scope, actual relevant masses, units, volume, current result, notes and URL. Exclude disabled ignition/blank inputs. Hide forms/actions/nav/uncomputed/errors in print. No new print CSS unless actual regression requires it.
- State: scope/unit/edit clears result and disables result actions; error clears stale result; combined still requires ignition/blank; reset restores combined/default units/masses and correct second conversion. Unknown scope rejected.
- Method text distinguishes calculation scope from test completion and prevents using missing ignition as zero. No procedural furnace instructions, universal QC limits, batch approval, reporting authorization, safety certification or new method database.
- Target-only content/date/sitemap update; no other public HTML or shared CSS/form-utils/unit-conversions/navigation/Finder/badges changes. Laboratory engine module changes require all four lab peers plus protected controls.
- Static browser fallback retains the original combined form; no new local CSV/upload workflow. No dependency/install/backend/API.

## Independent fixture plan

Hand-derived literals, not production-generated expected values:30mg/100mL→300mg/L;14.6mg/500mL→29.2;35.9mg/150mL→239.3333333;0mg→0;1mg/1L→1. Test fractional/large/equivalent units, minimum below/equal/above, invalid negative/NaN/Infinity/upperbounds/zero volume/dry<tare and unmeasured ignition omitted entirely. Preserve combined300/200/100/66.6667% and blank-corrected behavior through existing102 assertions.

Browser target +7 lab routes/core/protected pages at390/768/1024/1280/1440; complete relevant input/error/reset/unit/copy/print and lab-peer controls. Actual mobile/desktop screenshots inspected. Production exact-SHA Pages/source and browser verification required. Analytics exact-six-host block before navigation;0 completed. No OS print-dialog/PDF-pagination claim.

## Sources checked November11

- [Minnesota Pollution Control Agency, Math Workbook for Wastewater Operators](https://www.pca.state.mn.us/sites/default/files/wq-wwtp8-02.pdf), printed99–101(PDF98–100): separate TSS tare/dry/volume and later ignition/VSS problems. Training arithmetic, not current laboratory accreditation or reporting rules. Accessible full document; relevant section reviewed.
- EPA160.2 search extraction supports dry retained residue; direct large EPA compilation fetch exceeded browser extraction size. NEMI direct403 and UMass copy404 are not claimed full-source reviews. Existing EPA/Wisconsin source links retained; new calculation needs no inferred universal test limits.

## Expansion boundary

Priority B has a specific high-value existing workflow, so Priority C broad discovery is not entered this week. No new40-family search, full reconstructed exclusion union, expansion winner or expansion NO-GO is claimed. Last new cluster remains October30 Rainfall Records & Gauge Networks. Low traffic is not the reason to withhold expansion.
