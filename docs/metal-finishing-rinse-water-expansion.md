# Metal Finishing Rinse Water Optimization — implementation contract

Decision date: 2026-08-24. Implementation target: one hub, five tools, one guide and one reference.

## Workflow

Meter a representative baseline → quantify drag-out → compare countercurrent stages → analyze conductivity/flow logs → compare annual savings and payback → repeat after changes.

All tools are static, local-browser tools with SI internal units and US customary volume support. They clear stale results on errors and provide Calculate/Analyze, Reset, Copy and Print through the shared form system. They provide operational evidence only: users enter their own concentration target, tariff and process data.

## Tool contracts

### Metal Finishing Rinse Water Audit Calculator

- URL: `/tools/metal-finishing-rinse-water-audit-calculator/`
- Intent/user: operators and pollution-prevention staff calculating water per load from a matched meter/production interval.
- Inputs: start/end meter volume; interval hours; loads; operating hours/day and days/year; combined water/sewer tariff.
- Outputs: interval water, L or gal/load, hourly flow, annual m³ and utility cost.
- Validation: end > start; positive loads/hours; days 1–366. Boundary cases include zero start, invalid reversal and high production.
- Example: 10,000 L over 8 h and 200 loads = 50 L/load and 1,250 L/h.

### Plating Drag-Out Loss Estimator

- URL: `/tools/plating-drag-out-loss-estimator/`
- Inputs: measured retained mL/load, loads/hour, bath concentration g/L, material value/currency per kg and shift hours.
- Outputs: drag-out L/h, solution L/shift, active mass kg/h and value/shift.
- Validation: positive measured retention, production and shift; concentration/value may be zero.
- Example: 40 mL/load × 25 loads/h = 1 L/h; at 100 g/L and 8 h, 0.8 kg/shift.

### Countercurrent Rinse Flow Planner

- URL: `/tools/countercurrent-rinse-flow-planner/`
- Inputs: measured drag-out L/h or gal/h, required dilution ratio and 1–4 ideal mixed stages.
- Method: `Q = n × D × R^(1/n)`; compare with a one-stage `D × R` screen.
- Outputs: required flow, equivalent one-stage flow and modeled reduction.
- Validation: positive D, R > 1, whole stages 1–4. The idealized equation is not a quality guarantee.

### Rinse Conductivity Log Analyzer

- URL: `/tools/rinse-conductivity-log-analyzer/`
- Inputs: local CSV/text rows (`minutes, flow, conductivity, loads`) and user-supplied conductivity alert value. A local file is read only in the browser.
- Outputs: row count, total water, water/load, idle-flow water, excursions and peak conductivity.
- Validation: header optional; nonnegative numeric rows; positive minutes; at least one load for per-load result; malformed rows fail visibly.

### Rinse Water Savings & Payback Comparator

- URL: `/tools/rinse-water-savings-payback-comparator/`
- Inputs: baseline/proposed L/h or gal/h; hours/day; days/year; water, sewer and treatment costs per m³; annual added operating cost; installed cost.
- Outputs: annual water saved, gross and net savings, simple payback or explicit unavailable state.
- Validation: proposed cannot exceed baseline; days 1–366; nonnegative costs.

## Supporting pages

- Hub `/systems/metal-finishing-rinse-water/`: the complete operator sequence and boundaries.
- Guide `/guides/reduce-metal-finishing-rinse-water/`: measurement, drag-out prevention, countercurrent conversion, controls and verification.
- Reference `/reference/metal-finishing-rinse-control-methods/`: method comparison table with responsive wrapper.

## Independent acceptance tests

Each compute function receives normal SI, normal US-equivalent, zero/negative, boundary, invalid-combination and realistic-high cases. Browser checks cover reset, valid→error stale clearing, error→recovery, copy, print and local-file parsing. Static QA covers metadata, scripts, sitemap parity, links and duplicate IDs. Full 91-page browser QA runs at 390, 768, 1024, 1280 and 1440 pixels, including table-wrapper clipping checks.
