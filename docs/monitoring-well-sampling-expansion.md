# Monitoring Well Purging & Low-Flow Sampling Operations — implementation contract

Decision date: 2026-08-31. Research record: `docs/workflow-cluster-discovery-2026-08-31.md`.

## Cluster

- Target users: environmental field technicians, consultants, site owners and reviewers preparing recurring monitoring-well sampling rounds
- Recurring problem: turn the governing workplan/SOP plus current well/equipment measurements into a transparent purge/setup/reading/stabilization record
- Workflow: Review workplan → Inspect and gauge well → Calculate the applicable purge/equipment volume → Establish low-flow setup → Record readings → Evaluate entered criteria → Print/copy the record
- Search bundle: monitoring well purge volume calculator; groundwater purge time; low-flow groundwater sampling; pump intake and screen; drawdown; flow-cell volume; groundwater stabilization criteria; groundwater sampling log
- Competitive gap: official PDF procedures and forms, one-purpose volume calculators and paid field platforms; no connected free/account-free/local-data workflow found
- Existing-site separation: supply-well tools size pumps and compare source yield with demand; these tools support environmental sampling preparation and field evidence, not aquifer testing, supply design or water-treatment selection
- Safety boundary: the governing project workplan, regulator-approved SOP and qualified project lead choose the method, limits and whether/when a sample may be collected. Outputs do not establish representativeness, laboratory validity, compliance or disposal authorization.
- Maintenance boundary: user-entered criteria and equipment data; no regional rules database, product catalog, laboratory database, map, account, backend or paid API
- Primary sources: EPA EQASOP-GW4 and low-flow technical issue paper; USGS PAT context; current public agency field forms

## Shared interaction contract

All four tools are SI-first with US customary support and one SI internal basis. Each has labelled inputs, a clear starting state, validation, stale-result clearing, Calculate/Check/Analyze, Reset, Copy Result, Print, interpretation, assumptions, limitations, a worked example, technical sources and the related next step. Invalid input never leaves an earlier valid result or displays `NaN`/infinity. Local log text/files never leave the browser.

## Tool 1 — Monitoring Well Purge Volume & Time Calculator

- URL: `/tools/monitoring-well-purge-volume-calculator/`
- Type: Calculator
- Search intent: monitoring well purge volume calculator; groundwater well volume; well purge time; purge-water drum count
- Trigger/decision: a workplan explicitly requires a user-entered number of casing volumes; estimate target volume, ideal time and whole containers
- Inputs: casing inside diameter; total measured depth; depth to water; workplan purge-volume multiplier; measured purge rate; usable container capacity
- Units/internal units: mm or in; m or ft; L/min or US gal/min; litres internal
- Logic: `water column = total depth − depth to water`; `well volume = π × (ID/2)^2 × water column`; `target volume = well volume × multiplier`; `ideal time = target volume / measured rate`; `containers = ceil(target volume / usable capacity)`
- Outputs: water-column height; one casing volume; target volume; ideal duration; whole containers and unused capacity
- Interpretation: only applies to the entered volume-based method. Low-flow stabilization is not defined by arbitrary casing-volume multiples.
- Validation/boundaries: total depth > depth to water; positive ID/multiplier/rate/capacity; finite realistic bounds; zero/negative/reversed geometry invalid; multiplier is never selected by the tool
- Worked example: 50 mm ID, 12 m total depth, 4 m depth to water, 3 volumes, 1 L/min and 20 L usable container capacity → about 15.7 L per volume, 47.1 L target, 47.1 min and 3 containers
- Independent QA: normal SI; US equivalent; shallow/large well; one multiplier; decimal multiplier; reversed depths; zero rate; negative diameter; valid→invalid; invalid→valid; reset/copy/print

## Tool 2 — Low-Flow Sampling Setup Checker

- URL: `/tools/low-flow-sampling-setup-checker/`
- Type: Checker
- Search intent: low flow groundwater sampling setup; pump intake screen; groundwater drawdown; low-flow pump rate
- Trigger/decision: before or during low-flow purging, compare current geometry/rate with project-entered constraints and expose what requires adjustment/review
- Inputs: top and bottom of screen below measuring point; pump intake depth; initial depth to water; stabilized depth to water; measured pump rate; project maximum drawdown; project maximum pump rate
- Units/internal units: metres/feet and L/min/US gal/min; metres and L/min internal
- Logic: `drawdown = stabilized depth − initial depth`; intake must lie inside entered screen interval; stabilized water level must remain above the screen top to avoid exposing the screen in this preliminary check; drawdown and rate are compared only with user-entered limits; submerged head above intake is `intake depth − stabilized depth`
- Outputs: setup status; intake/screen relation; screen-exposure flag; drawdown and margin; flow-rate margin; submerged head above intake; explicit items needing project-lead review
- Interpretation: a numerical pass means only that entered geometry and rate satisfy entered constraints; it does not prove representative groundwater flow or authorize sampling
- Validation/boundaries: bottom screen > top screen; intake and water levels within measured well depth context; stabilized depth may not be shallower than initial by more than a tiny measurement tolerance; positive entered limits/rate; invalid geometry clears results
- Worked example: screen 10–12 m, intake 11 m, water 4.00→4.05 m, 0.25 L/min, entered drawdown limit 0.10 m and rate limit 0.50 L/min → entered checks met
- Independent QA: all checks met; intake above/below screen; exposed screen; drawdown exactly at/above limit; rate exactly at/above limit; US equivalent; invalid screen order; stale clearing; reset/copy/print

## Tool 3 — Low-Flow Equipment Volume & Reading Interval Planner

- URL: `/tools/low-flow-equipment-volume-reading-interval-planner/`
- Type: Planner
- Search intent: low flow sampling tubing volume; flow cell volume; groundwater sampling reading interval; equipment volume purge
- Trigger/decision: determine how long the current flow must run to displace a user-entered number of equipment volumes before a reading or after a rate/setup change
- Inputs: tubing inside diameter; wetted tubing length; pump/chamber internal volume; flow-cell internal volume; other wetted volume; measured flow rate; required equipment-volume exchanges; planned reading interval
- Units/internal units: mm/in, m/ft, mL/L/US fl oz where appropriate; litres and minutes internal
- Logic: `tubing volume = π × (ID/2)^2 × length`; `equipment volume = tubing + pump + flow cell + other`; `displacement target = equipment volume × exchanges`; `minimum interval = displacement target / flow rate`; `volume between planned readings = rate × interval`
- Outputs: component and total equipment volume; displacement target; minimum interval; planned interval margin; pass/review statement against the entered exchange count
- Interpretation: the workplan and equipment instructions choose the exchange count and measurement cadence; the tool only evaluates entered values
- Validation/boundaries: positive tubing dimensions/flow/exchanges/interval; component volumes may be zero except total must be positive; excessively large values remain finite; invalid values clear results
- Worked example: 6 mm ID × 20 m tubing, 100 mL pump/chamber, 250 mL flow cell, 50 mL other, 0.25 L/min, one exchange and 5 min interval → about 0.97 L equipment volume and 3.86 min minimum interval, so 5 min clears the entered screen
- Independent QA: normal SI; US equivalent; zero optional components; interval exact/short/long; large deep-well tubing; zero flow; negative length; valid→invalid; reset/copy/print

## Tool 4 — Groundwater Stabilization Log Analyzer

- URL: `/tools/groundwater-stabilization-log-analyzer/`
- Type: Local-file Analyzer
- Search intent: groundwater stabilization criteria calculator; low flow sampling log; groundwater field parameter stabilization
- Trigger/decision: evaluate the most recent consecutive readings against the exact criteria entered from the governing workplan/SOP and create a local review record
- Inputs: pasted text or local CSV with `minutes,pH,temperature,conductivity,do,orp,turbidity,depthToWater,flow`; required consecutive-reading count; enabled parameter criteria; absolute range for pH/ORP/drawdown/flow and relative range-to-mean (%) for temperature/conductivity/DO/turbidity
- Internal units: elapsed minutes, degrees C, user-consistent conductivity, mg/L, mV, NTU, metres and L/min. US templates convert feet and US gal/min to the same internal basis before analysis.
- Logic: parse strictly increasing elapsed minutes; inspect the last N rows; for absolute criteria use `max − min`; for relative criteria use `(max − min) / abs(mean) × 100`, with a visible zero-mean invalid state; integrate purged volume over each time interval using the preceding recorded flow; every enabled parameter must have finite values and meet its user-entered criterion
- Outputs: row count; analyzed time window; calculated purge volume; each parameter range/relative range and met/not-met result; overall `entered criteria met` or `not yet met`; copy/print report
- Interpretation: the tool never says “collect sample.” It reports only whether the last N entered readings satisfy the entered arithmetic criteria; equipment accuracy, workplan exceptions and professional judgment remain outside it.
- Validation/boundaries: at least N valid rows; N ≥ 3; strict time order; nonnegative flow; required enabled columns; no malformed/blank numeric cells; no silent row skipping; zero-mean percentage criteria invalid; valid result clears after invalid input
- Worked example: five 5-minute readings with stable final three values and 0.25 L/min flow → final-window criteria met and about 5 L purged over 20 minutes
- Independent QA: stable log; one-parameter failure; insufficient rows; unordered time; malformed row; zero mean; blank enabled value; disabled optional parameter; file-text parity; SI/US flow/depth equivalence; valid→invalid; invalid→valid; reset/copy/print

## Supporting pages

- Hub: `/systems/monitoring-well-sampling/` — the complete planning-to-evidence sequence and boundaries
- Guide: `/guides/plan-monitoring-well-purging-low-flow-sampling/` — workplan review, well inspection, equipment setup, purge approaches, field readings, evidence and stop/escalation conditions
- Reference: `/reference/groundwater-low-flow-field-parameters/` — field-parameter purpose, entered-criteria modes, common recording pitfalls and a responsive comparison table; no universal regulatory limits

## Integration and QA contract

- Add exactly 7 public pages: one hub, four tools, one guide and one reference
- Integrate with homepage only if the new eighth workflow card fits the established layout; otherwise expose through shared Systems navigation, Tools/Guides/Reference hubs and related well/water-quality pages
- Add the four Tools to the existing Tool Finder using existing Calculator, Checker, Planner and Analyzer types; add one system taxonomy entry only
- Update sitemap and `llms.txt` under current conventions; production `/docs/` must remain excluded
- Preserve exact production GA4 `G-7FB08YPX7C`, the analytics request blocker, workflow-arrow removal, Tool Finder UX, existing responsive-table wrappers and every user-managed badge
- Add independent calculation/decision fixtures for every case above; expected values must not be generated by production code
- Run all established calculation regressions, static, navigation, publish-boundary and analytics QA
- Browser matrix after implementation: final public count × the configured 390, 768, 1024, 1280 and 1440 widths
- Visual inspection: hub at 1440/390; every new Tool at least once; analyzer at 1440/390; reference at 390; Tools hub at 1440/390; homepage at 1440/390 if changed
- Live verification after `main` deployment: homepage if changed, hub, all four tools, guide, reference, Tools hub, JavaScript asset and sitemap; analytics browser automation must complete zero tracking requests

## Technical sources

- EPA EQASOP-GW4 Low-Stress (Low-Flow) SOP: https://www.epa.gov/sites/default/files/2017-10/documents/eqasop-gw4.pdf
- EPA Low-Flow (Minimal Drawdown) Ground-Water Sampling Procedures: https://www.epa.gov/remedytech/low-flow-minimal-drawdown-ground-water-sampling-procedures
- USGS Purge Analyzer Tool context: https://www.usgs.gov/centers/new-england-water-science-center/science/purge-analyzer-tool-pat-assess-optimal-pumping
- Example public low-flow field form: https://extapps.dec.ny.gov/data/DecDocs/B00032/Work%20Plan.ERP.B00032.2020-05-07.SRIWP.pdf

The implementation may cite these sources but may not turn example values into universal project requirements.
