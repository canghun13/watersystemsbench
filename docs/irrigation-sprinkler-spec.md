# Irrigation & Sprinkler Systems Cluster Specification

**Repository:** https://github.com/canghun13/watersystemsbench
**Specification status:** Specification complete; implementation not started
**Prepared against:** `main` at `a7408f57b944358232d01d3eb4c85fdca1043a5f`
**Prepared:** 2026-07-28

## 1. Scope and release boundary

This document is the implementation contract for the future Irrigation & Sprinkler Systems cluster. It specifies one system hub, seven tools and three guides. It does not mark any route as implemented and does not authorize changes to the current 40 public HTML pages, 17 working tools, eight guides, six references, shared design, analytics, sitemap, generator or QA scripts.

| Deliverable | Route | Status |
| --- | --- | --- |
| Irrigation & Sprinkler Systems | `/systems/irrigation-sprinklers/` | Specification complete |
| Available Water Flow Test Calculator | `/tools/available-water-flow-test-calculator/` | Specification complete |
| Sprinkler Zone Capacity Planner | `/tools/sprinkler-zone-capacity-planner/` | Specification complete |
| Sprinkler Precipitation Rate Calculator | `/tools/sprinkler-precipitation-rate-calculator/` | Specification complete |
| Irrigation Runtime & Water Depth Planner | `/tools/irrigation-runtime-water-depth-planner/` | Specification complete |
| Drip Irrigation Flow & Zone Calculator | `/tools/drip-irrigation-flow-zone-calculator/` | Specification complete |
| Irrigation Pump & Zone Matcher | `/tools/irrigation-pump-zone-matcher/` | Specification complete |
| Sprinkler Low-Pressure Troubleshooter | `/tools/sprinkler-low-pressure-troubleshooter/` | Specification complete |
| How to Measure Irrigation Flow and Dynamic Pressure | `/guides/measure-irrigation-flow-pressure/` | Specification complete |
| How to Split Sprinklers into Practical Zones | `/guides/split-sprinkler-zones/` | Specification complete |
| How to Troubleshoot a Low-Pressure Sprinkler Zone | `/guides/troubleshoot-low-pressure-sprinkler-zone/` | Specification complete |

After a future implementation and successful QA, the projected state is 51 public pages: seven core pages, three hubs, 24 tools, 11 guides and six references, with 14 pages still planned. Until then the actual state remains 40 public pages and 25 planned pages.

## 2. Search-intent and duplication review

All 11 proposed pages remain separate. No route is merged or removed.

| Proposed page | Closest current page | Distinct user job and boundary | Decision |
| --- | --- | --- | --- |
| Available Water Flow Test Calculator | Water Pipe Size & Velocity Checker; Well Yield vs Demand Checker | Converts one to five measured bucket or meter trials into available flow. It does not infer pipe capacity, source yield or pressure. | Keep |
| Sprinkler Zone Capacity Planner | Water Pipe Size & Velocity Checker; Booster Pump Duty Point Estimator | Floors the discrete head count under a user-measured flow budget and separately checks entered dynamic-pressure losses. It does not size pipe or create a pump curve. | Keep |
| Sprinkler Precipitation Rate Calculator | Rainwater Harvesting Yield Calculator | Converts sprinkler discharge and irrigated geometry to applied depth per hour. It does not estimate captured rainfall. | Keep |
| Irrigation Runtime & Water Depth Planner | Water Storage Tank Sizing Planner | Converts net target depth, application efficiency and precipitation rate into schedule time and applied volume. It does not size stored supply. | Keep |
| Drip Irrigation Flow & Zone Calculator | Well Yield vs Demand Checker | Totals emitter flow and divides rows into feasible zones. It does not evaluate aquifer or daily source reliability. | Keep |
| Irrigation Pump & Zone Matcher | Total Dynamic Head Calculator; Pump Curve Duty Point Comparator | Screens one user-entered pump duty condition against one zone requirement. It must link to the full TDH and curve tools and must not claim the actual operating point. | Keep |
| Sprinkler Low-Pressure Troubleshooter | Low Water Pressure Troubleshooter | Uses irrigation-specific evidence: one/all zones, valve/filter state, nozzle demand, head pop-up, lateral leaks, elevation and pump behavior. It reports cause groups, not a diagnosis. | Keep |
| Irrigation hub | Existing system hubs | Orchestrates the measure → zone → application → runtime → troubleshoot workflow. | Keep |
| Three irrigation guides | Existing pump/well guides | Provide field measurement, zone design and irrigation-zone diagnostic procedures that are not covered by current guides. | Keep |

Inventory impact: zero removals, zero merges and zero count changes. The only planning correction is the hub route from the earlier planning entry `/tools/irrigation-sprinkler/` to `/systems/irrigation-sprinklers/`.

## 3. Shared calculation, unit and interface contract

### 3.1 Unit policy

- Present SI first and offer common US customary units where relevant.
- Internal flow: L/min, except emitter flow uses L/h.
- Internal volume: L.
- Internal pressure: kPa.
- Internal hydraulic head: m of water.
- Internal length and spacing: m.
- Internal area: m².
- Internal applied depth and precipitation rate: mm and mm/h.
- Internal time: seconds for field tests and minutes for schedules.
- Use US liquid gallons, not Imperial gallons.
- Conversions:
  - `1 US gal = 3.785411784 L`
  - `1 GPM = 3.785411784 L/min`
  - `1 m³/h = 16.6666667 L/min`
  - `1 psi = 6.894757293 kPa`
  - `1 bar = 100 kPa`
  - `1 m water head = 9.80665 kPa`
  - `1 ft water head = 2.98906692 kPa`
  - `1 in = 25.4 mm`
  - `1 ft² = 0.09290304 m²`
- Calculate from unrounded internal values. Round only display values, normally to two decimals, while retaining enough digits to distinguish boundary results.

### 3.2 Common form behavior

- Required fields have visible labels, units and inline errors.
- Unit switching preserves the physical quantity and converts the displayed value; it never reinterprets the same digits.
- Blank optional fields are omitted from the method rather than silently treated as measured zero.
- Zero is accepted only where physically meaningful, such as zero elevation rise or zero entered loss.
- Negative dimensions, time, flow, pressure, counts, depth, efficiency or losses are invalid.
- Integer counts are validated as whole numbers.
- Results identify the active calculation mode, assumptions and limiting condition.
- Reset restores documented defaults and clears results, validation messages and copied-state notices.
- Copy produces a plain-text, labelled summary containing inputs, units, outputs, assumptions and the page URL; it excludes hidden fields and analytics data.
- Print uses the existing print pattern and includes title, entered values, results, interpretation, limitations and sources without navigation controls.
- No tool stores field values remotely. GA4 remains the current site-wide implementation and must not receive free-text or field values.

### 3.3 Shared safety boundary

These tools are preliminary planning aids. Actual dynamic measurements, current nozzle/emitter/pump manufacturer data, backflow protection, cross-connection control, electrical safety, buried utility location, local watering restrictions and qualified review remain outside the calculations. No output is a permit, code determination, pump selection approval, irrigation audit or guarantee of distribution uniformity.

## 4. Hub specification

### Irrigation & Sprinkler Systems

- **URL:** `/systems/irrigation-sprinklers/`
- **Type:** System hub
- **Search intent:** Find the correct irrigation calculator or troubleshooting workflow.
- **Primary user:** Homeowner, landscape installer, irrigation technician or small-site planner.
- **Primary task:** Move from measured supply to feasible zones, application rate, runtime and diagnosis without confusing flow, pressure and water depth.
- **Differentiation:** A workflow page, not a calculator and not a generic collection of keyword links.
- **Required opening:** Explain the distinction among flow (quantity per time), dynamic pressure (energy available while flowing), precipitation rate (depth per time) and runtime (time needed for a target depth).
- **Workflow cards:**
  1. Measure supply — flow test calculator and measurement guide.
  2. Build a feasible zone — zone capacity, pipe velocity and zoning guide.
  3. Determine application — precipitation rate and drip zone calculators.
  4. Schedule water — runtime planner.
  5. Match a pumped supply — pump & zone matcher, TDH and pump curve tools.
  6. Diagnose weak coverage — irrigation low-pressure troubleshooter and guide.
- **Required cross-cluster links:** Water Pipe Size & Velocity Checker, Pipe Friction Loss Calculator, Total Dynamic Head Calculator, Pump Curve Duty Point Comparator and Low Water Pressure Troubleshooter.
- **Safety panel:** Use local product data and requirements; isolate electrical and pressurized equipment before service; use qualified help for backflow, pump controls, buried piping and regulated work.
- **Editorial depth:** At least 900 original words, excluding navigation, cards and source titles.
- **Structured data:** Existing WebPage/Breadcrumb pattern only; do not claim professional service or regulatory approval.

### Required cross-cluster link journeys

These journeys define implementation-time related-link direction. Do not publish the links until their destinations exist, and do not link to the still-unimplemented Water Treatment cluster.

```text
Well Yield vs Demand Checker
→ Water Storage Tank Sizing Planner
→ Available Water Flow Test Calculator
→ Sprinkler Zone Capacity Planner
→ Irrigation Pump & Zone Matcher
→ Irrigation Runtime & Water Depth Planner
```

```text
Rainwater Harvesting Yield Calculator
→ Rainwater Tank Days-of-Supply Simulator
→ Available Water Flow Test Calculator
→ Drip Irrigation Flow & Zone Calculator
→ Irrigation Runtime & Water Depth Planner
```

```text
Available Water Flow Test Calculator
→ Sprinkler Zone Capacity Planner
→ Water Pipe Size & Velocity Checker
→ Irrigation Pump & Zone Matcher
→ Sprinkler Precipitation Rate Calculator
→ Irrigation Runtime & Water Depth Planner
```

```text
Sprinkler Low-Pressure Troubleshooter
→ Available Water Flow Test Calculator
→ Pipe Friction Loss Calculator
→ Water Pipe Size & Velocity Checker
→ Irrigation Pump & Zone Matcher
```

## 5. Tool specifications

### 5.1 Available Water Flow Test Calculator

- **Title:** Available Water Flow Test Calculator
- **URL:** `/tools/available-water-flow-test-calculator/`
- **Type:** Checker/calculator
- **Search intent:** Calculate irrigation supply flow from a timed container or meter test.
- **Primary user:** Person measuring the source before choosing heads or zones.
- **User task:** Convert repeatable field observations into per-trial and average available flow.
- **Differentiation:** Measurement conversion only; no pipe capacity, well yield, head count or pressure prediction.

**Inputs and modes**

- Mode: timed container or meter difference.
- One to five trials; add/remove trial controls must remain keyboard accessible.
- Timed container trial: collected volume and elapsed time.
- Meter trial: start reading, end reading and elapsed time.
- Volume units: L, m³ or US gal; time: seconds or minutes.
- Optional test label is local-only and excluded from analytics.

**Internal logic**

- Convert each valid volume difference to L and time to seconds.
- Timed container: `Q_i (L/min) = V_i (L) ÷ t_i (s) × 60`.
- Meter mode: `ΔV_i = end_i − start_i`; `Q_i = ΔV_i ÷ t_i × 60`.
- `average Q = sum(Q_i) ÷ valid trial count`.
- Average the trial flow results, not raw times or meter readings.
- Do not discard a positive outlier automatically. Show each trial and flag a spread when `(maximum − minimum) ÷ average > 0.10`; ask the user to repeat under stable conditions.

**Outputs and interpretation**

- Trial table with volume difference, elapsed time and flow.
- Average flow in L/min, L/s, m³/h and GPM.
- Minimum, maximum and percent spread when two or more trials exist.
- Interpretation: “Measured test flow under the stated conditions,” never “guaranteed available flow.”
- Next step: measure dynamic pressure at comparable demand and apply a deliberate reserve in the zone planner.

**Validation and boundary states**

- Require at least one complete valid trial.
- Volume and elapsed time must be greater than zero.
- Meter end must be greater than meter start.
- Maximum five trials; incomplete extra rows are ignored only if entirely blank.
- Reject mixed or missing units, non-finite values and elapsed time above 24 hours as likely entry error.
- Empty state explains both methods without showing a zero result.

**Reset/copy/print**

- Reset returns to one blank timed-container trial in SI.
- Copy and print include all valid trials and the averaging method.

**Worked example**

Three 10 L trials take 20, 25 and 30 seconds. The trial flows are 30, 24 and 20 L/min; average available flow is `24.6667 L/min`, displayed as 24.67 L/min (6.52 GPM). Spread is `(30 − 20) ÷ 24.6667 = 40.54%`, so the result is flagged for repeat testing.

**Safety and regulatory limitations**

Do not leave hoses unattended, create trip hazards, flood structures or defeat backflow devices. A bucket test does not establish pressure at sprinkler heads, source sustainability or legal withdrawal capacity.

**Related pages**

Parent hub; Sprinkler Zone Capacity Planner; How to Measure Irrigation Flow and Dynamic Pressure; Water Pipe Size & Velocity Checker; Well Yield vs Demand Checker.

**Primary technical sources**

1. Oregon State University Extension, *Irrigation water scheduling*: https://extension.oregonstate.edu/catalog/em-9717-irrigation-water-scheduling
2. Oklahoma State University Extension, *Managing Pressure in the Home Irrigation System*: https://extension.okstate.edu/fact-sheets/managing-pressure-in-the-home-irrigation-system

**Calculation verification cases:** A1–A6 in section 8.
**Browser interaction cases:** B1–B7 in section 9.

### 5.2 Sprinkler Zone Capacity Planner

- **Title:** Sprinkler Zone Capacity Planner
- **URL:** `/tools/sprinkler-zone-capacity-planner/`
- **Type:** Planner
- **Search intent:** Estimate how many identical sprinkler heads can operate on one measured supply.
- **Primary user:** Person dividing a layout into practical zones.
- **User task:** Find the flow-limited whole-head count and independently screen pressure feasibility.
- **Differentiation:** It uses entered product flow at entered product pressure and stated losses; it does not calculate a nozzle curve, pipe friction or a pump operating point.

**Inputs**

- Measured available flow: L/min, m³/h or GPM.
- Flow reserve: 0–50%.
- Per-head/nozzle flow at required operating pressure: L/min or GPM.
- Optional proposed head count: integer 1–10,000.
- Measured dynamic pressure at the supply test condition: kPa, bar or psi.
- Required pressure at the head from current manufacturer data: kPa, bar or psi.
- Elevation rise from test point to highest/critical head: m or ft; may be zero.
- Entered combined pressure loss for backflow device, valves, filter, mainline and lateral: kPa, bar, psi, m head or ft head; may be zero.

**Internal logic**

- `usable flow = measured flow × (1 − reserve/100)`.
- `flow-limited heads = floor(usable flow ÷ per-head flow)`.
- `unused flow = usable flow − flow-limited heads × per-head flow`.
- `elevation pressure = elevation rise × 9.80665 kPa/m`.
- `pressure margin = measured dynamic pressure − required head pressure − entered loss − elevation pressure`.
- Pressure is feasible only when margin is at least zero.
- The final feasible count is zero when pressure is infeasible; otherwise it is the flow-limited count.
- If a proposed count is entered, proposed demand is `count × per-head flow`; compare it with usable flow and separately report pressure.
- Never adjust per-head flow from the pressure margin. The entered flow must correspond to the manufacturer's required pressure.

**Outputs and interpretation**

- Usable flow, flow-limited whole-head count, unused flow and limiting constraint.
- Dynamic-pressure budget with required head pressure, elevation, entered losses and margin.
- Proposed-zone status when count is entered: Pass, Review or Fail.
  - Pass: flow and pressure meet the reserve-adjusted criteria.
  - Review: flow passes but pressure inputs are omitted; no silent pressure approval.
  - Fail: flow or entered pressure budget fails.
- Callout to run pipe friction and velocity checks with actual pipe internal diameter and layout.

**Validation and boundary states**

- Available flow and per-head flow must be greater than zero.
- Reserve must be 0–50%.
- Pressure fields are paired: both measured dynamic and required head pressure are needed for a pressure result.
- Negative loss/elevation is invalid; downhill static gain is outside this simplified planner and belongs in TDH review.
- Zero heads is a valid result, not an error.
- Very large counts trigger a plausibility note without changing the result.

**Reset/copy/print**

- Reset clears the proposed count and all results; default reserve is blank, not an invented recommendation.
- Copy/print show “pressure not assessed” if pressure inputs were omitted.

**Worked example**

Measured flow is 100 L/min, reserve 10% and each head requires 12 L/min. Usable flow is 90 L/min, so the whole-head limit is 7 with 6 L/min unused. If dynamic pressure is 400 kPa, required head pressure 210 kPa, entered losses 50 kPa and elevation rise 10 m, margin is `400 − 210 − 50 − 98.0665 = 41.9335 kPa`; the seven-head preliminary zone passes both screens.

**Safety and regulatory limitations**

Use flowing pressure at a relevant test condition, not static pressure. Verify nozzle flow and pressure together from current product data. This result does not validate backflow, pipe sizing, water hammer, valve selection or local design requirements.

**Related pages**

Parent hub; Available Water Flow Test Calculator; Water Pipe Size & Velocity Checker; Pipe Friction Loss Calculator; How to Split Sprinklers into Practical Zones.

**Primary technical sources**

1. Oklahoma State University Extension, *Managing Pressure in the Home Irrigation System*: https://extension.okstate.edu/fact-sheets/managing-pressure-in-the-home-irrigation-system
2. USDA NRCS, *National Engineering Handbook Part 652, Irrigation Guide, Chapter 6*: https://directives.nrcs.usda.gov/sites/default/files2/1712932413/25695.pdf
3. Hunter Industries, *Residential System Design Guide*: https://www.hunterindustries.com/sites/default/files/dg_student_guide_dom.pdf

**Calculation verification cases:** Z1–Z6.
**Browser interaction cases:** B1–B7.

### 5.3 Sprinkler Precipitation Rate Calculator

- **Title:** Sprinkler Precipitation Rate Calculator
- **URL:** `/tools/sprinkler-precipitation-rate-calculator/`
- **Type:** Calculator
- **Search intent:** Calculate sprinkler application depth per hour from zone flow and area or repeated head spacing.
- **Primary user:** Person comparing nozzles or preparing a runtime schedule.
- **User task:** Convert discharge into precipitation rate without confusing it with rainfall or distribution uniformity.
- **Differentiation:** Computes theoretical gross application rate; it does not measure catch-can uniformity, plant demand or irrigation efficiency.

**Inputs and modes**

- Total-zone mode: total zone flow and irrigated plan area.
- Repeated-spacing mode: actual flow per head/nozzle at its stated pressure, arc 1–360°, spacing along row, spacing between rows and layout (rectangular/square or triangular).
- Optional runtime for applied-depth preview.
- Flow: L/min or GPM; area: m² or ft²; spacing: m or ft; runtime: min or h.

**Internal logic**

- Total-zone: `PR (mm/h) = 60 × Q (L/min) ÷ A (m²)`.
- US display cross-check: `PR (in/h) = 96.25 × Q (GPM) ÷ A (ft²)`.
- Repeated rectangular/square spacing: `PR = 21,600 × q (L/min) ÷ [arc degrees × spacing_x (m) × spacing_y (m)]`.
- Triangular spacing divides the rectangular cell area by using `layout factor = sin(60°) = 0.8660254038`: `PR = 21,600q ÷ [arc × spacing_x × spacing_y × 0.8660254038]`.
- Applied depth preview: `depth = PR × runtime minutes ÷ 60`.
- Total-zone mode is required for mixed arcs/nozzles or irregular areas. Repeated-spacing mode assumes a repeating, correctly overlapped layout and identical devices.

**Outputs and interpretation**

- Precipitation rate in mm/h and in/h.
- Optional applied depth for the entered runtime.
- Method equation with converted internal values.
- Explicit note: theoretical average rate is not distribution uniformity; verify with catch cans under actual wind and pressure.

**Validation and boundary states**

- Flow, area and both spacings must be greater than zero.
- Arc must be greater than zero and no more than 360°.
- Runtime may be zero only when the user intentionally requests a zero-depth preview; blank suppresses the preview.
- Reject a mixed-device layout in spacing mode through explanatory guidance, not an invented blending formula.

**Reset/copy/print**

- Reset returns to total-zone SI mode with blank fields.
- Copy/print name the mode and layout assumption.

**Worked example**

A 120 L/min zone irrigating 4,000 m² has `PR = 60 × 120 ÷ 4,000 = 1.8 mm/h` (0.0709 in/h). At 45 minutes it applies a theoretical 1.35 mm.

**Safety and regulatory limitations**

Do not use the result as proof of uniformity or permission to irrigate. Check local watering days, runoff restrictions and manufacturer pressure data; stop if runoff or unsafe overspray occurs.

**Related pages**

Parent hub; Irrigation Runtime & Water Depth Planner; Sprinkler Zone Capacity Planner; How to Split Sprinklers into Practical Zones; How to Measure Irrigation Flow and Dynamic Pressure.

**Primary technical sources**

1. Hunter Industries, *Irrigation Technical Handbook*: https://www.hunterindustries.com/sites/default/files/BR_IrrigationTechManual_dom.pdf
2. Rain Bird, *Irrigation Design Manual*: https://www.rainbird.com/sites/default/files/media/documents/2018-02/IrrigationDesignManual.pdf
3. USDA NRCS, *National Engineering Handbook Part 652, Irrigation Guide, Chapter 6*: https://directives.nrcs.usda.gov/sites/default/files2/1712932413/25695.pdf

**Calculation verification cases:** P1–P6.
**Browser interaction cases:** B1–B7.

### 5.4 Irrigation Runtime & Water Depth Planner

- **Title:** Irrigation Runtime & Water Depth Planner
- **URL:** `/tools/irrigation-runtime-water-depth-planner/`
- **Type:** Planner
- **Search intent:** Convert a target irrigation depth and precipitation rate into runtime, events and cycles.
- **Primary user:** Person programming a controller after measuring application rate.
- **User task:** Account visibly for application efficiency, allowed events and cycle splitting.
- **Differentiation:** Scheduling arithmetic only; it does not estimate evapotranspiration, prescribe plant water need or select legally allowed days.

**Inputs**

- Net target depth for a one-week scheduling period: mm or in.
- Gross precipitation/application rate: mm/h or in/h.
- Application efficiency: greater than 0 and at most 100%.
- Irrigated plan area: m² or ft².
- Irrigation events/allowed watering days in that period: integer 1–7.
- Cycles per event: integer 1–20.
- Optional measured/selected soil intake limit: mm/h or in/h.
- Optional user note; no default climate assumption.

**Internal logic**

- `gross required depth = net target depth ÷ efficiency fraction`.
- `total weekly runtime (min) = gross depth ÷ precipitation rate × 60`.
- `runtime per event = total runtime ÷ number of events`.
- `runtime per cycle = runtime per event ÷ cycles per event`.
- `gross applied volume (L) = gross depth (mm) × area (m²)`.
- `net retained volume (L) = net depth (mm) × area (m²)`.
- If precipitation rate exceeds an entered intake limit, show a cycle-and-soak warning. Do not invent soak time or claim that a chosen cycle count prevents runoff.

**Outputs and interpretation**

- Net and gross weekly depth; total weekly runtime; runtime per event; runtime per cycle; plain-language weekly schedule summary.
- Gross applied and target net volume.
- Efficiency uplift shown explicitly.
- Intake-rate warning and reminder to observe runoff, slope and actual soil response.

**Validation and boundary states**

- Target depth may be zero and returns zero runtime/volume with a “no irrigation scheduled” state.
- Precipitation rate must be greater than zero when target depth is greater than zero.
- Efficiency must be >0–100%.
- Area must be greater than zero.
- Event and cycle counts are required whole numbers in their ranges.
- Negative values, non-finite values and impossible unit selections are invalid.

**Reset/copy/print**

- Reset leaves efficiency blank; no universal efficiency is preselected.
- Copy/print state that the user supplied the target depth, efficiency and allowed events.

**Worked example**

For a 20 mm net target, 80% efficiency, 10 mm/h precipitation rate and 500 m² area, gross depth is 25 mm, total runtime is 150 minutes, gross volume is 12,500 L and net target volume is 10,000 L. With three events and two cycles per event, runtime is 50 minutes per event and 25 minutes per cycle.

**Safety and regulatory limitations**

Plant demand, weather, rooting depth, salinity, slope, soil condition and local restrictions can materially change a schedule. Comply with local watering rules and stop or shorten cycles when runoff, ponding or overspray occurs.

**Related pages**

Parent hub; Sprinkler Precipitation Rate Calculator; Drip Irrigation Flow & Zone Calculator; How to Split Sprinklers into Practical Zones; Rainwater Tank Days-of-Supply Simulator.

**Primary technical sources**

1. FAO, *Irrigation Scheduling, Chapter 5*: https://www.fao.org/4/T7202E/t7202e06.htm
2. Oregon State University Extension, *Irrigation water scheduling*: https://extension.oregonstate.edu/catalog/em-9717-irrigation-water-scheduling
3. Colorado State University Extension, *Methods to Schedule Home Lawn Irrigation*: https://extension.colostate.edu/resource/methods-to-schedule-home-lawn-irrigation/

**Calculation verification cases:** R1–R6.
**Browser interaction cases:** B1–B7.

### 5.5 Drip Irrigation Flow & Zone Calculator

- **Title:** Drip Irrigation Flow & Zone Calculator
- **URL:** `/tools/drip-irrigation-flow-zone-calculator/`
- **Type:** Calculator
- **Search intent:** Total drip emitter flow and divide rows into zones under an available-flow limit.
- **Primary user:** Gardener, grower or installer laying out point-source or inline drip.
- **User task:** Calculate emitters, zone flow, event volume and maximum whole rows per zone.
- **Differentiation:** Flow and layout arithmetic only; it does not calculate emitter pressure variation, lateral hydraulics, clogging risk or crop demand.

**Inputs and modes**

- Direct-count mode: emitter count and rated flow per emitter.
- Row-layout mode: row/lateral length, emitter spacing, number of rows and rated flow per emitter.
- Emitter flow units: L/h or US gal/h.
- Optional event runtime.
- Optional measured available flow and flow reserve 0–50%.
- Length: m or ft; source flow: L/min, m³/h or GPM.

**Internal logic**

- Direct: `total emitters = entered count`.
- Row layout uses the explicit endpoint convention: one emitter at the start and the last emitter no farther than the row length; `emitters per row = floor(row length ÷ spacing) + 1`.
- `total emitters = emitters per row × rows`.
- `total flow (L/h) = total emitters × emitter flow`.
- `event volume (L) = total flow × runtime hours`.
- `usable source flow (L/h) = available L/min × 60 × (1 − reserve/100)`.
- `maximum emitters = floor(usable source flow ÷ emitter flow)`.
- In row mode, `maximum whole rows per zone = floor(maximum emitters ÷ emitters per row)`.
- `minimum zones = ceil(total rows ÷ maximum whole rows per zone)` when at least one row fits.
- If no whole row fits, report zero and require redesign; never return division by zero.

**Outputs and interpretation**

- Emitters per row, total emitters, total flow in L/h, L/min and GPM.
- Event volume when runtime is entered.
- When source flow is entered: usable flow, maximum emitters, maximum whole rows and minimum zones.
- Note that actual lateral length, pressure-regulating components, filtration, flushing and manufacturer limits require separate review.

**Validation and boundary states**

- Counts are positive whole numbers.
- Row length, spacing and emitter flow must be greater than zero.
- Runtime may be zero and returns zero event volume; blank suppresses it.
- Reserve 0–50%; source flow must be positive if provided.
- Warn when spacing is greater than row length: the endpoint convention returns one emitter and asks the user to confirm the layout.

**Reset/copy/print**

- Reset returns to direct-count SI mode with optional source section collapsed.
- Copy/print include the endpoint convention and whether source capacity was assessed.

**Worked example**

A 100 m row with 0.5 m spacing has `floor(100 ÷ 0.5) + 1 = 201` emitters. Ten rows at 2 L/h per emitter require 2,010 emitters and 4,020 L/h (67 L/min). If measured source flow is 50 L/min with 10% reserve, usable flow is 2,700 L/h, allowing 1,350 emitters or six whole 201-emitter rows; at least two zones are required.

**Safety and regulatory limitations**

Use current emitter pressure/length tables, filtration and flushing guidance. Protect the potable supply as locally required. Fertilizer or chemical injection and acid cleaning are outside this tool and require product-specific, occupational and environmental controls.

**Related pages**

Parent hub; Available Water Flow Test Calculator; Sprinkler Zone Capacity Planner; Irrigation Runtime & Water Depth Planner; How to Split Sprinklers into Practical Zones.

**Primary technical sources**

1. Washington State University Irrigation, *Drip Line Application Rate Calculator*: https://irrigation.wsu.edu/Secondary_Pages/Irr_Calculators/Drip/D_DripRate.php
2. Utah State University Extension, *The Do-It-Yourself Guide to Backyard Drip Irrigation*: https://extension.usu.edu/yardandgarden/research/the-do-it-yourself-guide-to-backyard-drip-irrigation
3. Oklahoma State University Extension, *Drip Irrigation Systems*: https://extension.okstate.edu/fact-sheets/drip-irrigation-systems

**Calculation verification cases:** D1–D6.
**Browser interaction cases:** B1–B7.

### 5.6 Irrigation Pump & Zone Matcher

- **Title:** Irrigation Pump & Zone Matcher
- **URL:** `/tools/irrigation-pump-zone-matcher/`
- **Type:** Planner
- **Search intent:** Screen whether one stated pump flow/head condition covers one irrigation zone requirement.
- **Primary user:** Person connecting a known pump duty statement to a preliminary zone.
- **User task:** Compare both flow and head, with a visible safety reserve.
- **Differentiation:** It compares a single available pair supplied by the user. It does not intersect a pump curve with a system curve and must not call the result an operating point.

**Inputs**

- Pump available flow and available head at the same stated test/duty condition.
- Available flow: L/min, m³/h or GPM.
- Available head: m, ft, kPa, bar or psi.
- Zone design flow.
- Required sprinkler/emitter operating pressure from current manufacturer data.
- Elevation rise from pump reference to critical outlet.
- Pipe friction loss.
- Backflow/filter/valve/other entered loss.
- Safety reserve: 0–50%, applied to both required flow and total required head.

**Internal logic**

- Convert pressure to head with `head m = pressure kPa ÷ 9.80665`.
- `base required flow = zone design flow`.
- `base required head = outlet pressure head + elevation rise + pipe friction head + other loss head`.
- `reserve-adjusted flow = base flow × (1 + reserve/100)`.
- `reserve-adjusted head = base head × (1 + reserve/100)`.
- `flow margin = available flow − reserve-adjusted flow`.
- `head margin = available head − reserve-adjusted head`.
- Status:
  - **Match:** available flow and head both meet reserve-adjusted requirements.
  - **Marginal:** both meet base requirements but either misses the selected reserve.
  - **Insufficient:** either base flow or base head is not met.
- Never interpolate or extrapolate a pump curve. The two available values must describe the same manufacturer/test duty condition.

**Outputs and interpretation**

- Base and reserve-adjusted required flow/head.
- Flow and head margins with the limiting side.
- Match, Marginal or Insufficient with a plain-language explanation.
- Mandatory next link to Pump Curve Duty Point Comparator and Total Dynamic Head Calculator.

**Validation and boundary states**

- Available flow/head and zone flow/operating pressure must be greater than zero.
- Elevation and losses may be zero but not negative.
- Reserve 0–50%.
- Reject a “flow at zero head” paired with “shutoff head” as two different points; helper text must explicitly forbid combining catalog maxima.
- Exact equality passes the relevant threshold.

**Reset/copy/print**

- Reset clears reserve and values; no default engineering margin is invented.
- Copy/print include the single-point limitation prominently.

**Worked example**

Available pump condition is 100 L/min at 60 m head. The zone needs 80 L/min and 200 kPa outlet pressure, 10 m elevation and 5 m combined loss. Base head is `200 ÷ 9.80665 + 10 + 5 = 35.3943 m`. With 10% reserve, requirements are 88 L/min and 38.9337 m. Margins are 12 L/min and 21.0663 m, so the preliminary status is Match.

**Safety and regulatory limitations**

Do not select, throttle or wire a pump from this result. Confirm the full manufacturer curve, efficiency, motor load, NPSH, allowable operating range, controls and system curve with qualified review. Pumps and pressurized/electrical equipment require safe isolation.

**Related pages**

Parent hub; Total Dynamic Head Calculator; Pump Curve Duty Point Comparator; Pump Power & Efficiency Calculator; How to Read a Pump Curve and Find the Duty Point.

**Primary technical sources**

1. USDA NRCS, *National Engineering Handbook Part 623, Chapter 8: Irrigation Pumping Plants*: https://directives.nrcs.usda.gov/sites/default/files2/1720457430/Chapter%208%20-%20Irrigation%20Pumping%20Plants.pdf
2. Hunter Industries, *Residential System Design Guide*: https://www.hunterindustries.com/sites/default/files/dg_student_guide_dom.pdf
3. Oklahoma State University Extension, *Managing Pressure in the Home Irrigation System*: https://extension.okstate.edu/fact-sheets/managing-pressure-in-the-home-irrigation-system

**Calculation verification cases:** M1–M6.
**Browser interaction cases:** B1–B7.

### 5.7 Sprinkler Low-Pressure Troubleshooter

- **Title:** Sprinkler Low-Pressure Troubleshooter
- **URL:** `/tools/sprinkler-low-pressure-troubleshooter/`
- **Type:** Rules-based troubleshooter
- **Search intent:** Narrow likely reasons that one or all sprinkler zones have low pressure.
- **Primary user:** Person observing weak spray, incomplete pop-up or poor reach.
- **User task:** Separate source-wide, zone-specific, demand, restriction, leak, elevation and pump evidence before changing equipment.
- **Differentiation:** Irrigation-zone evidence and next measurements; the current general low-pressure tool remains the building/source-level starting point.

**Inputs**

- Scope: one zone, several zones or all zones.
- Symptom: heads do not pop up, short reach/large droplets, uneven heads, pressure falls after start, intermittent behavior or other listed observation.
- Static pressure known/value; dynamic pressure known/value.
- Measured available flow known/value.
- Installed zone total nozzle demand known/value.
- Supply type: municipal/utility, well/pump, gravity/storage or unknown.
- Symptom varies by time of day: yes/no/unknown.
- Isolation valve fully open: yes/no/unknown.
- Zone valve opens fully: yes/no/unknown.
- Filter/screen condition: clean/restricted/unknown/not present.
- Pressure regulator/PRV present and condition: normal/suspect/unknown/not present.
- Visible broken head, leak, soggy area or unexpected discharge: yes/no/unknown.
- Nozzles or head count recently changed: yes/no/unknown.
- Highest affected head substantially above source/test point: yes/no/unknown.
- Pumped supply: yes/no; if yes, pump cycling, loss of prime/cavitation-like noise, or known alarm: yes/no/unknown.
- Electrical enclosure, backflow device or buried mainline work needed: yes/no/unknown.

**Decision logic and ranking**

Use transparent additive evidence, not probability percentages. Each triggered cause group receives High, Medium or Low priority based on directness; ties follow the safest/least invasive next measurement.

1. **Active leak/broken outlet — High** when visible discharge, soggy area or broken head is reported. Isolate the zone if safe and repair before capacity changes.
2. **Zone valve/filter restriction — High** when one zone is affected and valve not fully open or filter restricted; Medium when unknown.
3. **Excess zone demand — High** when only one zone is affected after added/larger nozzles, or measured flow is below summed nozzle demand; Medium when head count is high but demand is not measured.
4. **Source-wide flow/pressure limitation — High** when all zones are weak and dynamic pressure/flow is low; Medium when only static pressure is known.
5. **Lateral restriction or leak — High** when one zone is uneven from early to distant heads or has a soggy area; Medium when the zone alone is weak with valve/filter cleared.
6. **Elevation loss — Medium/High** when only upper heads are weak and lower heads behave normally; request pressure at the critical head.
7. **Pump/source behavior — High** when pumped supply has alarms, loses prime, cycles abnormally or pressure collapses; stop unsafe operation and use qualified service.
8. **Individual head/nozzle obstruction — High** when a single head is weak while neighbors are normal.

Never recommend a booster pump until leaks, restrictions, dynamic measurement, zone demand and existing pump/source behavior are reviewed.

**Outputs and interpretation**

- Ranked cause groups with evidence that triggered each rank.
- “Check next” sequence containing observable or measurable actions.
- Links to the flow test, zone capacity, pipe friction, pump matcher and guide.
- Explicit statement: “This is a triage result, not a confirmed diagnosis.”

**Validation and boundary states**

- Require scope and at least one symptom.
- Numeric pressure/flow is optional but must be positive when supplied.
- Unknown is a valid evidence state and leads to a measurement request, not a guessed answer.
- Conflicting inputs remain visible and produce a “verify observations” note.
- Urgent stop state for exposed wiring, active electrical faults, unsafe flooding, damaged pressure equipment or a pump running dry.

**Reset/copy/print**

- Reset returns all evidence fields to unknown and clears rankings.
- Copy/print include responses, triggered rules, uncertainty and safety escalation.

**Worked example**

Only one zone is weak; its valve status is unknown, filter is restricted, no nozzles were added and no leak is seen. Output ranks zone valve/filter restriction High, lateral restriction Medium and source-wide limitation Low. The first actions are clean/verify the filter per manufacturer instructions, confirm the valve opens fully, then measure dynamic pressure before and during the zone.

**Safety and regulatory limitations**

Do not open energized controls, bypass backflow devices, excavate without utility location or service a pressurized system without isolation. Use a qualified irrigation, plumbing, pump or electrical professional where required.

**Related pages**

Parent hub; How to Troubleshoot a Low-Pressure Sprinkler Zone; Available Water Flow Test Calculator; Sprinkler Zone Capacity Planner; Low Water Pressure Troubleshooter.

**Primary technical sources**

1. Oklahoma State University Extension, *Managing Pressure in the Home Irrigation System*: https://extension.okstate.edu/fact-sheets/managing-pressure-in-the-home-irrigation-system
2. Oklahoma State University Extension, *The Effects of Wind Speed and Water Pressure on Home Sprinkler Systems*: https://extension.okstate.edu/fact-sheets/the-effects-of-wind-speed-and-water-pressure-on-home-sprinkler-systems
3. US EPA WaterSense, *Sprinkler Spruce-Up*: https://www.epa.gov/watersense/sprinkler-spruce-up

**Scenario verification cases:** T1–T6.
**Browser interaction cases:** B1–B7.

## 6. Guide specifications

### 6.1 How to Measure Irrigation Flow and Dynamic Pressure

- **URL:** `/guides/measure-irrigation-flow-pressure/`
- **Search intent:** Learn a repeatable, safe way to measure irrigation flow and pressure under use.
- **Audience and prerequisite:** Homeowner/technician with a suitable container or readable meter and a compatible pressure gauge; defer work involving backflow assemblies or unsafe fittings.
- **Reader outcome:** Produce labelled flow trials, static pressure and relevant dynamic pressure without treating one measurement as a universal supply guarantee.
- **Required sections:**
  1. Flow, static pressure and dynamic pressure are different.
  2. Choose a representative time and test point.
  3. Timed-container method with one to five repeats.
  4. Meter-difference method and avoiding concurrent water use.
  5. Measuring static pressure.
  6. Measuring dynamic pressure while representative flow is occurring.
  7. Municipal/utility supply: record time-of-day variation and avoid unrelated concurrent use unless the intended test deliberately includes it.
  8. Well/pump supply: record pump cycling, tank state and a stable pumping interval without defeating controls.
  9. Recording test point, time, valve position, elevation and active demand.
  10. Common errors: wrong meter unit, partial container volume, reaction-time error, leaking connection, static reading substituted for dynamic and readings taken at unmatched conditions.
  11. Repeating inconsistent tests and interpreting spread.
  12. What the measurements do not establish.
  13. Next steps into zone capacity and pipe checks.
- **Required field worksheet:** Date/time, source/test point, meter/container, trial values, static pressure, dynamic pressure, concurrent uses, elevation note and observations.
- **Worked example:** Use the A4 three-trial example and explain its 40.54% spread.
- **Images/diagrams:** Original schematic showing gauge/test point and a separate container/meter sequence; no unsafe backflow connection depiction.
- **Safety/regulatory:** Slip/flooding, potable cross-connection, pressurized fittings and local water restrictions.
- **Related pages:** Hub, flow calculator, zone planner, pipe velocity checker and general low-pressure guide.
- **Minimum sources:** Oregon State Extension scheduling; Oklahoma State pressure guidance; EPA WaterSense Sprinkler Spruce-Up.
- **Editorial depth:** At least 1,400 original words.
- **Guide acceptance:** Procedures are numbered, units are dual-labelled, static/dynamic distinction is stated before any number, and no universal acceptable pressure is asserted.

### 6.2 How to Split Sprinklers into Practical Zones

- **URL:** `/guides/split-sprinkler-zones/`
- **Search intent:** Decide which sprinklers or drip laterals can operate together.
- **Audience and prerequisite:** Planner with measured flow/dynamic pressure and current nozzle/emitter product data.
- **Reader outcome:** Draft zones grouped by compatible equipment, exposure and hydraulic feasibility.
- **Required sections:**
  1. Why zone boundaries are hydraulic and horticultural.
  2. Inventory heads/nozzles/emitters and their stated flow/pressure.
  3. Separate sprays, rotors and drip; avoid unmatched precipitation within a zone.
  4. Group sun/shade, slope, soil, plant type and exposure.
  5. Apply a user-selected flow reserve and floor whole devices.
  6. Check pressure budget, elevation, valves, filters and actual pipe friction.
  7. Check pipe velocity/internal diameter.
  8. Head-to-head spacing and actual manufacturer layout.
  9. Convert application rate to runtime; observe runoff and use cycles as needed.
  10. Pumped systems: full duty-point/curve review.
  11. Zone worksheet and field commissioning.
- **Required worksheet columns:** Device type/model, arc, flow at pressure, count, zone demand, supply flow, reserve, dynamic pressure, elevation, entered losses, area, precipitation rate and notes.
- **Worked examples:** Seven-head zone from section 5.2 and the six-row drip limit from section 5.5.
- **Safety/regulatory:** Backflow/cross-connection, permits, buried utilities, electrical valves/controls and local schedules.
- **Related pages:** Hub, zone capacity, precipitation, drip, runtime, pipe velocity and pump matcher; render only four to six links per on-page group.
- **Minimum sources:** Hunter design guide; Rain Bird design manual; NRCS Chapter 6; EPA WaterSense audit guidelines.
- **Editorial depth:** At least 1,800 original words.
- **Guide acceptance:** Clearly separates flow pass from pressure pass, prohibits combining pump catalog maxima, and does not present generic spacing or pressure values as product requirements.

### 6.3 How to Troubleshoot a Low-Pressure Sprinkler Zone

- **URL:** `/guides/troubleshoot-low-pressure-sprinkler-zone/`
- **Search intent:** Diagnose a weak sprinkler zone in a safe measurement order.
- **Audience and prerequisite:** Owner/technician able to observe a zone without opening energized or pressurized equipment.
- **Reader outcome:** Determine whether evidence points first to an individual head, zone restriction/leak, excess demand, elevation, source or pump.
- **Required diagnostic sequence:**
  1. Stop for electrical hazards, flooding, damaged pressure equipment or dry-running pump.
  2. Define one head, one zone, several zones or all zones.
  3. Compare symptoms with recent changes.
  4. Inspect broken heads, visible leaks and soggy areas.
  5. Verify accessible isolation valve, zone valve and filter state safely.
  6. Compare installed nozzle demand with measured flow.
  7. Measure static and dynamic pressure at comparable conditions.
  8. Compare near/far and low/high heads for restriction/elevation evidence.
  9. Review pumped-source alarms, cycling and full curve/system duty.
  10. Escalate to qualified service and document findings.
- **Symptom table:** Heads not popping, short reach/large droplets, one weak head, near heads stronger than far heads, upper heads weak, pressure collapses after start, intermittent zone and misting/high pressure.
- **Worked scenarios:** All T1–T6 cases from section 8, with uncertainty and next measurement.
- **Safety/regulatory:** No energized enclosure work, backflow bypass, unlocated excavation or pressurized disassembly.
- **Related pages:** Hub, irrigation troubleshooter, flow calculator, zone capacity, pipe friction, pump matcher and general low-pressure troubleshooter.
- **Minimum sources:** Oklahoma State pressure guidance and checkup; EPA Sprinkler Spruce-Up; EPA WaterSense irrigation audit guidelines.
- **Editorial depth:** At least 1,600 original words.
- **Guide acceptance:** Does not jump to a booster pump, distinguishes low from excessive pressure symptoms and states that rules are triage rather than diagnosis.

## 7. Source register and claim policy

Use the following direct sources during implementation. Cite the closest source beside technical claims; do not cite a search result, marketing reseller or unsourced blog.

| Topic | Source |
| --- | --- |
| Irrigation design/application rate | USDA NRCS, *Irrigation Guide Chapter 6*: https://directives.nrcs.usda.gov/sites/default/files2/1712932413/25695.pdf |
| Pump curves and operating range | USDA NRCS, *Irrigation Pumping Plants, Chapter 8*: https://directives.nrcs.usda.gov/sites/default/files2/1720457430/Chapter%208%20-%20Irrigation%20Pumping%20Plants.pdf |
| Scheduling and efficiency relation | FAO, *Irrigation Scheduling*: https://www.fao.org/4/T7202E/t7202e06.htm |
| Flow/scheduling field method | Oregon State University Extension: https://extension.oregonstate.edu/catalog/em-9717-irrigation-water-scheduling |
| Pressure effects and diagnosis | Oklahoma State University Extension: https://extension.okstate.edu/fact-sheets/managing-pressure-in-the-home-irrigation-system |
| Low/high pressure symptoms | Oklahoma State University Extension: https://extension.okstate.edu/fact-sheets/the-effects-of-wind-speed-and-water-pressure-on-home-sprinkler-systems |
| Home system visual check | Oklahoma State University Extension: https://extension.okstate.edu/fact-sheets/simple-irrigation-checkup-for-home-sprinkler-systems |
| Maintenance/head-to-head context | US EPA WaterSense: https://www.epa.gov/watersense/sprinkler-spruce-up |
| Irrigation audit/pressure context | US EPA WaterSense audit guidelines: https://www.epa.gov/sites/default/files/2017-02/documents/ws-specification-home-irr-audit-guidelines-v1.1_1.pdf |
| Manufacturer precipitation formulas | Hunter Industries: https://www.hunterindustries.com/sites/default/files/BR_IrrigationTechManual_dom.pdf |
| Manufacturer layout formulas | Rain Bird: https://www.rainbird.com/sites/default/files/media/documents/2018-02/IrrigationDesignManual.pdf |
| Drip application geometry | Washington State University: https://irrigation.wsu.edu/Secondary_Pages/Irr_Calculators/Drip/D_DripRate.php |
| Small-site drip layout | Utah State University Extension: https://extension.usu.edu/yardandgarden/research/the-do-it-yourself-guide-to-backyard-drip-irrigation |

Manufacturer sources support equations and product-data interpretation, not universal design settings. Public-agency or extension sources support field method and safety context. Every future page needs at least two directly relevant primary technical sources and a real review date added only at implementation review.

## 8. Independent future verification cases

Expected values below are calculated from the published equations in this specification, not from future JavaScript. Tolerances: ±0.01 for displayed values unless a case states exact integer/status output; unit-equivalence comparisons use relative tolerance `1×10⁻⁶` before display rounding.

### Available flow — six cases

| ID | Inputs | Expected |
| --- | --- | --- |
| A1 | 10 L in 20 s | 30 L/min; 0.5 L/s; 1.8 m³/h; 7.92516 GPM |
| A2 | 5 US gal in 40 s | 7.5 GPM; 28.39059 L/min |
| A3 | Meter 12.40 to 12.65 m³ in 5 min | Difference 250 L; 50 L/min |
| A4 | 10 L in 20, 25 and 30 s | Trials 30, 24, 20 L/min; average 24.66667 L/min; spread 40.54054%; repeat-test flag |
| A5 | 10 L in 0 s | Validation error; no numeric result |
| A6 | Meter end equal to or below start | Validation error; no numeric result |

### Zone capacity — six cases

| ID | Inputs | Expected |
| --- | --- | --- |
| Z1 | 100 L/min, 10% reserve, 12 L/min/head | Usable 90 L/min; 7 whole heads; 6 L/min unused |
| Z2 | 72 L/min, 0% reserve, 12 L/min/head | Exact 6 whole heads; 0 unused |
| Z3 | Z1 plus 350 kPa dynamic, 210 kPa head, 50 kPa losses, 10 m rise | Pressure margin −8.0665 kPa; pressure Fail; feasible count 0 |
| Z4 | Z1 but 400 kPa dynamic | Pressure margin 41.9335 kPa; pressure Pass; feasible count 7 |
| Z5 | Z1 with proposed 8 heads and no pressure fields | Demand 96 L/min; flow Fail; pressure not assessed |
| Z6 | Reserve −1% or 51% | Validation error; no result |

### Precipitation rate — six cases

| ID | Inputs | Expected |
| --- | --- | --- |
| P1 | Total 120 L/min over 4,000 m² | 1.8 mm/h; 0.07087 in/h |
| P2 | Total 30 GPM over 10,000 ft² | 0.28875 in/h; 7.33425 mm/h |
| P3 | 1 L/min/head, 360°, 4 m × 4 m rectangular | 3.75 mm/h |
| P4 | Same as P3, triangular | 4.33013 mm/h |
| P5 | 10 mm/h for 45 min | Applied depth 7.5 mm |
| P6 | Zero area, zero spacing or arc outside 1–360° | Validation error |

### Runtime and depth — six cases

| ID | Inputs | Expected |
| --- | --- | --- |
| R1 | Net 20 mm, efficiency 80%, PR 10 mm/h, area 500 m², 1 event/1 cycle | Gross 25 mm; 150 min; gross 12,500 L; net 10,000 L |
| R2 | Net 30 mm, efficiency 75%, PR 15 mm/h, 3 events, 2 cycles | Gross 40 mm; total 160 min; 53.3333 min/event; 26.6667 min/cycle |
| R3 | Net 0 mm with otherwise valid inputs | Zero gross depth, runtime and volumes; no-irrigation state |
| R4 | Net 1 in, efficiency 100%, PR 0.5 in/h | 120 min; SI/US-equivalent result |
| R5 | Positive target with PR 0 | Validation error |
| R6 | PR 12 mm/h, entered intake 8 mm/h | Numeric schedule unchanged; cycle-and-soak/runoff observation warning |

### Drip flow and zones — six cases

| ID | Inputs | Expected |
| --- | --- | --- |
| D1 | 100 emitters at 4 L/h | 400 L/h; 6.66667 L/min; 1.761 GPM |
| D2 | D1 for 1.5 h | 600 L event volume |
| D3 | 100 m row, 0.5 m spacing, 10 rows, 2 L/h | 201 emitters/row; 2,010 total; 4,020 L/h; 67 L/min |
| D4 | D3 plus 50 L/min source and 10% reserve | Usable 2,700 L/h; max 1,350 emitters; 6 whole rows/zone; minimum 2 zones |
| D5 | Direct 2 L/h emitters, 10 L/min source, 0% reserve | Max 300 emitters exactly |
| D6 | Zero spacing, negative flow or non-integer row count | Validation error |

### Pump and zone match — six cases

| ID | Inputs | Expected |
| --- | --- | --- |
| M1 | Available 100 L/min at 60 m; zone 80 L/min; outlet 200 kPa; rise 10 m; losses 5 m; reserve 10% | Base head 35.39432 m; adjusted flow 88 L/min; adjusted head 38.93375 m; margins 12 L/min and 21.06625 m; Match |
| M2 | M1 but available 85 L/min at 36 m | Base needs pass; reserve needs fail; Marginal |
| M3 | M1 but available 70 L/min at 60 m | Base flow fails; Insufficient |
| M4 | M1 but available 100 L/min at 30 m | Base head fails; Insufficient |
| M5 | M1 with outlet entered as 29.00755 psi | Same internal head/status within equivalence tolerance |
| M6 | Negative loss, negative elevation or reserve above 50% | Validation error |

### Troubleshooter — six scenarios

| ID | Evidence | Expected top result and next action |
| --- | --- | --- |
| T1 | One zone weak; restricted filter; valve unknown; no leak/change | Zone valve/filter restriction High; clean/verify filter safely, confirm valve opening, then measure dynamic pressure |
| T2 | All zones weak; static normal; dynamic pressure and measured flow low | Source-wide flow/pressure limitation High; repeat comparable dynamic/flow test and review source/mainline before zone changes |
| T3 | One zone became weak after larger nozzles were installed | Excess zone demand High; total current nozzle demand and compare with measured usable flow |
| T4 | One weak head; adjacent heads normal; no soggy area | Individual head/nozzle obstruction High; inspect/clean or replace per manufacturer instructions after safe isolation |
| T5 | Far heads weak; near heads normal; soggy patch present | Active leak/lateral problem High; stop zone if safe, locate/repair leak before pressure changes |
| T6 | Pumped supply; all zones collapse; pump alarms or loses prime | Pump/source behavior High and urgent stop; prevent dry running and obtain qualified pump/electrical service |

Total future verification coverage: 36 numeric/validation cases plus six rules scenarios, 42 cases across all seven tools.

## 9. Future browser and static QA contract

### 9.1 Full-site release gate

After implementation, test all 51 public pages at 390, 768, 1024, 1280 and 1440 px: **255 browser renders**. The release report must record exact page and viewport totals rather than projecting them.

For every render verify:

- no horizontal overflow, clipped controls or overlapping header/footer;
- mobile navigation and three-system menu behavior;
- one visible H1, unique title/description and correct canonical;
- breadcrumb and related-link behavior;
- no console errors, page errors, failed assets or internal 404s;
- readable tables, equations, warnings and print layout;
- keyboard focus, labels, error association and status announcements;
- exact GA4 ID `G-7FB08YPX7C` once, following the existing site convention;
- sitemap parity only after the 11 pages exist.

### 9.2 Seven-tool interaction matrix

Each new tool must pass the following seven interaction families; mode-specific variants are required, not optional spot checks.

| ID | Interaction family | Required checks |
| --- | --- | --- |
| B1 | Valid primary calculation | Enter the worked example; verify independent expected result and interpretation |
| B2 | SI/US unit switching | Switch before and after calculation; physical quantity and result remain equivalent |
| B3 | Boundary/invalid input | Empty, zero where invalid, negative, range and integer errors; no `NaN`, `Infinity` or stale result |
| B4 | Mode/dynamic fields | Container/meter, total/spacing, direct/row and optional pressure/source sections show correct labels and ignore hidden fields |
| B5 | Reset | Defaults, units, rows, errors, results and status announcements return to documented state |
| B6 | Copy | Clipboard summary contains labelled current inputs/results/limitations and no hidden or stale values |
| B7 | Print | Print invocation succeeds; print view contains calculation context and omits interactive-only controls |

Every invalid-field test must also verify recovery: correcting the value removes the associated error and enables a fresh, non-stale result. At 390 px, explicitly test the longest unit labels and result-table cells for wrapping without clipping.

Additional required checks:

- Flow tool: add/remove up to five trials; average and spread update correctly.
- Zone tool: head-count floor and pressure-fail zero-feasible state.
- Precipitation tool: rectangular/triangular layout and mixed-layout guidance.
- Runtime tool: event/cycle splitting, zero target and intake warning.
- Drip tool: endpoint convention, no-whole-row state and minimum-zone ceiling.
- Pump matcher: Match/Marginal/Insufficient and single-duty-point warning.
- Troubleshooter: all T1–T6 scenarios, unknown answers, conflicts and urgent stop.

### 9.3 Static and content assertions

- Actual public HTML becomes 51 only after implementation.
- Category parity becomes 7 core, 3 hubs, 24 tools, 11 guides and 6 references.
- Eleven new routes are present once each in sitemap, canonical references and generated navigation where intended.
- No old planning route `/tools/irrigation-sprinkler/` remains.
- No empty/filler page, copied manufacturer prose or unsupported universal default.
- Every tool has at least two primary technical sources and all required sections.
- Calculation suite runs all A1–M6 cases and T1–T6 scenarios independently.
- Existing 17 tools and their current verification cases remain regression-tested.
- Contact/domain/repository remain `canghun13@naver.com`, `watersystemsbench.com` and `https://github.com/canghun13/watersystemsbench`.

## 10. Implementation acceptance checklist

The future implementation is complete only when:

1. All 11 specified routes exist with substantive original content and correct metadata.
2. All seven tools implement the exact modes, formulas, validation and states in this document.
3. All 42 independent cases pass.
4. Full static/generator QA passes without regressing the current site.
5. Browser QA records 255 successful page-width renders and all seven tool interaction matrices.
6. Sitemap contains exactly the actual 51 public pages.
7. System navigation exposes the third hub without inactive/future links.
8. GA4, official email, domain, repository and design conventions remain exact.
9. Safety boundaries and primary sources are visible on every relevant page.
10. `handover.md` is updated from “implementation not started” only after evidence exists.
