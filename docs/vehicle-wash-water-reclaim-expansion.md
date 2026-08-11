# Vehicle Wash Water Reclaim Expansion

## Implementation contract

- Decision: GO
- Research: `docs/new-cluster-discovery-2026-08-11.md`
- Hub: `/systems/vehicle-wash-water-reclaim/`
- Audience: professional conveyor, in-bay automatic, fleet and other measured vehicle-wash operators; global; SI first with US customary volume support
- Workflow: Meter baseline → Map streams → Balance reclaim → Simulate peak buffer → Plan spot-free production → Check economics → Monitor
- Safety boundary: non-potable process-water quantity and economics only; no treatment selection, reclaimed-water quality claim, chemical compatibility claim, sewer/stormwater authorization or workplace approval

## Shared interaction contract

Every tool has labelled SI/US inputs, one SI internal basis, validation before output, stale-result clearing, Reset, Copy, Print, a worked example, formula/logic, assumptions, limitations, sources, safety language and related workflow links. Invalid inputs must not render `NaN`, infinity, negative physical volumes or an earlier valid result.

## Tool specifications

### Vehicle Wash Water Use Audit Calculator

- URL: `/tools/vehicle-wash-water-use-audit-calculator/`
- Type: Calculator
- Search intent: car wash water usage calculator; gallons/litres per vehicle; car wash water audit
- User / problem: operator needs a comparable facility baseline before a reclaim or equipment decision
- Inputs: start meter, end meter, matching vehicle count, interval days, projected operating days/year
- Units / internal units: L or US gal displayed; litres internal
- Logic: interval = end − start; per vehicle = interval/vehicles; per day = interval/days; annual = per day × operating days
- Outputs: interval use, volume/vehicle, volume/day, m³/year
- Validation: end > start; whole vehicle and operating-day counts; positive interval; days ≤ 366
- Error / boundary: meter rollover or shared meters require an adjusted input outside the tool; zero vehicles invalid; large values remain finite
- Interpretation: repeat comparable intervals; do not average unlike wash packages or equipment states
- Worked example: 100,000 → 115,000 L, 300 vehicles, five days = 50 L/vehicle, 3,000 L/day, 900 m³/year at 300 days
- Sources: EPA WaterSense at Work; DOE estimating methods; ICA 2018 study
- Existing-page overlap: existing tools do not calculate a process KPI from a matching meter/throughput interval
- Independent QA: SI, US equivalence, zero vehicles, reversed meter, equal meter, fractional vehicle, 366/367 days, high realistic meter

### Wash Water Reclaim Balance Planner

- URL: `/tools/wash-water-reclaim-balance-planner/`
- Type: Planner
- Search intent: car wash reclaim percentage; reclaim water balance; fresh water per car with reclaim
- User / problem: operator must separate potential recovered return from fresh-only and non-recoverable streams
- Inputs: gross applied water/vehicle, fresh-only spot-free volume, carryout/evaporation, collection %, treatment recovery %, vehicles/day
- Units / internal units: L or US gal displayed; litres internal
- Logic: collectable = gross − carryout; potential recovered = collectable × collection × recovery; reclaim used = min(potential, gross − spot-free); fresh = gross − reclaim; remaining discharge = gross − carryout − reclaim
- Outputs: reclaim, fresh, carryout and discharge per vehicle; reclaim share; daily fresh/reclaim/discharge
- Validation: gross > 0; spot-free ≤ gross; carryout < gross; percentages 0–100; whole positive vehicles
- Error / boundary: recovery is capped by eligible process demand; 0% collection/recovery produces zero reclaim; 100% never overrides carryout or fresh-only demand
- Interpretation: an equipment recovery claim is not the same as facility fresh-water savings
- Worked example: 180 L gross, 20 L spot-free, 30 L carryout, 90% collection, 80% recovery = 108 L reclaim and 72 L fresh/vehicle
- Sources: EPA; DOE; ICA
- Existing-page overlap: unlike Greywater tools, output is a professional wash process-stream allocation per vehicle with carryout and fresh-only finish water
- Independent QA: normal SI/US, zero recovery, maximum recovery, spot-free > gross, carryout = gross, cap by eligible demand, high throughput

### Reclaim Buffer Tank Simulator

- URL: `/tools/reclaim-buffer-tank-simulator/`
- Type: Simulator
- Search intent: car wash reclaim tank sizing; water recycling tank capacity; reclaim peak buffer
- User / problem: operator/installer must know whether starting storage and delayed return cover a busy wash window
- Inputs: vehicles/hour, peak hours, reclaim demand/vehicle, recovered return/vehicle, return delay, working tank volume, starting volume, minimum reserve
- Units / internal units: L or US gal displayed; litres and minutes internal
- Logic: minute-step deterministic balance; withdraw demand only above reserve; add delayed return; cap at working volume; track shortfall, minimum, ending level and overflow
- Outputs: covered/shortfall status, minimum/ending volume, reserve margin, unserved reclaim demand, overflow/bypass
- Validation: positive demand/rates/window/tank; nonnegative return/delay/start/reserve; start ≤ tank; reserve < tank
- Error / boundary: no-return case, delay longer than peak, return greater than demand, full starting tank and zero reserve are supported
- Interpretation: rerun throughput and starting-level cases; not a control-system or water-quality model
- Worked example: 12 vehicles/hour for four hours, 100 L demand, 90 L delayed return, 5,000 L tank, 3,000 L start, 500 L reserve
- Sources: ICA stream evidence; EPA operating guidance; current equipment data required
- Existing-page overlap: existing storage tools size outage/demand water; this simulator models delayed recirculating process return and reserve through a peak
- Independent QA: covered, shortfall, overflow, zero return, delay > window, start > tank, reserve = tank, SI/US equivalence, high realistic volume

### Spot-Free Rinse RO Production Planner

- URL: `/tools/spot-free-rinse-ro-production-planner/`
- Type: Planner
- Search intent: car wash spot-free water calculator; RO storage sizing; RO reject water car wash
- User / problem: operator must match measured permeate production and storage to daily and peak final-rinse demand
- Inputs: vehicles/day, spot-free volume/vehicle, measured permeate/hour, production hours, availability %, verified recovery %, peak vehicles/hour, peak hours, usable storage
- Units / internal units: L or US gal displayed; litres and hours internal
- Logic: demand = vehicles × rinse; effective rate = measured rate × availability; daily production = rate × hours; feed = permeate/recovery; reject = feed − permeate; peak storage = max(0, peak demand − concurrent production)
- Outputs: daily status/balance, effective production, peak storage need/margin, feed and reject
- Validation: positive demand/rates/hours; production hours ≤ 24; percentages > 0 and ≤ 100; nonnegative storage
- Error / boundary: 100% recovery yields zero reject; insufficient daily production and insufficient peak storage are distinct results
- Interpretation: use measured output at actual feed temperature, pressure, chemistry and membrane condition
- Worked example: 120 vehicles × 15 L; 120 L/h × 18 h × 90% = 1,944 L/day against 1,800 L/day demand
- Sources: ICA facilities using RO and reclaim; EPA vehicle-wash guidance; current membrane manufacturer data
- Existing-page overlap: current RO Production vs Demand Planner addresses water-treatment product demand and reserve; this page adds per-vehicle spot-free duty, peak throughput and reject-to-reclaim stream handoff
- Independent QA: normal SI/US, exact daily balance, daily shortfall, peak storage shortfall, 100% recovery, zero recovery, >24 hours, high throughput

### Vehicle Wash Reclaim Savings Calculator

- URL: `/tools/vehicle-wash-reclaim-savings-calculator/`
- Type: Calculator
- Search intent: car wash water recycling savings; reclaim ROI; car wash water and sewer cost
- User / problem: owner compares measured baseline/proposed water quantities with current facility costs
- Inputs: baseline/proposed fresh L/vehicle, baseline/proposed sewer L/vehicle, vehicles/day, operating days/year, water/sewer tariff, added annual operating cost, installed cost
- Units / internal units: L or US gal displayed; litres internal; tariffs currency/m³
- Logic: annual differences × throughput; avoided water + avoided sewer − operating cost; simple payback only when installed cost and net savings are positive
- Outputs: fresh/sewer m³ saved, avoided charges, gross/net savings, simple payback
- Validation: nonnegative volumes/costs; positive whole throughput; days ≤ 366
- Error / boundary: proposed use may exceed baseline and produce negative savings; payback then remains unavailable
- Interpretation: test low-throughput, low-recovery, high-maintenance and tariff-rule cases
- Worked example: 180 → 72 L/vehicle × 120/day × 300 days = 3,888 m³/year fresh reduction
- Sources: EPA equations and payback inputs; DOE water evaluation method; ICA measured variability
- Existing-page overlap: household Greywater economics uses daily domestic reuse; this is a commercial per-vehicle dual fresh/sewer retrofit model tied to wash throughput
- Independent QA: normal, zero tariffs, negative savings, zero capex, no positive payback, 366/367 days, SI/US equivalence, high realistic throughput

## Guides and reference

- `/guides/meter-vehicle-wash-water-use/`: meter boundary, matching vehicle count, comparable conditions, per-vehicle/day calculations, repeats and evidence retention
- `/guides/plan-vehicle-wash-water-reclaim-retrofit/`: baseline, stream map, eligibility, quantity balance, peak buffer, spot-free RO, economics, commissioning and stop conditions
- `/reference/vehicle-wash-water-stream-map/`: fresh, reclaimed, spot-free permeate, RO reject, carryout/evaporation, backwash/purge/sludge, sewer and stormwater boundaries in a labelled responsive table

## QA contract

- New calculation checks: at least 40 independent numeric/validation cases across the five tools, including SI/US equivalence and invalid recovery
- Browser interactions: all five tools at all required widths for calculate, invalid result clearing, Reset, Copy, Print and unit switching
- Full regression: all pre-existing calculation suites; static/navigation QA; 83 pages × 5 widths = 415 renders; 42 tool interactions minimum; Tools Finder, workflow visuals, Greywater tables and homepage badge block preserved
- Live verification: homepage, new hub, audit, balance, simulator, RO planner, savings, guide, reference, Tools hub and sitemap

## Source contract

- U.S. EPA WaterSense at Work — Vehicle Washes: https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P1018SSR.TXT
- U.S. DOE vehicle-wash estimating methods: https://www.energy.gov/cmei/femp/estimating-methods-determining-end-use-water-consumption
- U.S. DOE Handbook of Water Evaluation Tools: https://www.energy.gov/sites/prod/files/2020/11/f80/handbook-water-evaluation-tools.pdf
- International Carwash Association 2018 study: https://www.carwash.org/hubfs/Pulse%20and%20Research/Water%2BUse%2C%2BEvaporation%2Band%2BCarryout%2Bin%2BProfessional%2BCar%2BWashes.pdf

Manufacturer information may verify a proposed package but cannot replace the facility baseline or serve as the only method source.
