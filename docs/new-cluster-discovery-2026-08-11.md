# New Cluster Discovery — 2026-08-11

## Decision record

- Repository: https://github.com/canghun13/watersystemsbench
- Starting branch and commit: clean `main` at `2d5130e679b4467da5ab9f1471c51db40fd24727`, equal to `origin/main`
- Starting inventory: 74 public pages — 7 core, 5 system hubs, 37 tools, 16 guides and 9 references
- Excluded before research: Greywater variants and the nine previously reviewed families recorded in `docs/second-expansion-review.md`
- Search-volume policy: no volume, keyword-difficulty, GSC or GA4 figures were available or invented
- Final decision: **GO — Vehicle Wash Water Reclaim Planning**

## Research method

Research started from new users and operating jobs rather than existing calculator variables. Each family was decomposed into at least six query groups covering user, equipment, failure, scale, cost, design and operation. Current search results were compared with the 37-tool inventory using the user-start → decision → output → next-action test. Strong competition and shared flow/volume/cost variables were evidence, not automatic rejection reasons.

## Candidate comparison

Scores use Monetization 40 + Demand 35 + Competitive gap 25. A score cannot override a failed mandatory gate.

| Candidate | New user/task | Primary intent groups researched (≥6) | Independent tool depth | Monetization /40 | Demand /35 | Gap /25 | Total | Gate result | Decision |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Vehicle wash water reclaim planning | Professional wash operator measures and recovers process water | water/vehicle audit; reclaim balance; reclaim tank sizing; spot-free RO production; reject/backwash balance; savings/payback; performance monitoring | 5 | 37 | 30 | 22 | 89 | PASS A–I | **GO** |
| Closed-loop hydronic commissioning | HVAC technician fills and commissions water/glycol loops | system water volume; glycol adjustment; cold fill pressure; expansion vessel sizing; heat-flow/ΔT; circulator duty; pressure-swing troubleshooting | 6 | 37 | 31 | 13 | 81 | FAIL E | NO-GO: current free tools already cover each core step with transparent SI/US workflows |
| RV fresh/waste water management | RV owner plans off-grid tank use and seasonal service | trip autonomy; fresh/gray/black balance; tank capacity; sanitizer dose; winterization volume; dewinterization flush; travel weight | 5 | 32 | 29 | 16 | 77 | FAIL D | NO-GO: modern free planners already join tank duration and trip inputs; remaining tools are thin or safety-sensitive |
| Domestic hot-water delivery and recirculation | Homeowner/plumber reduces wait, waste and heat loss | pipe volume/wait; wasted water; recirculation heat loss; recirculation flow; pump runtime/cost; heater recovery; mixing capacity | 6 | 36 | 31 | 9 | 76 | FAIL E/F | NO-GO: EPA supplies a current hot-water volume workbook and free calculators cover the remaining steps |
| Aquarium water and equipment planning | Fishkeeper sizes and maintains a tank ecosystem | net volume; stocking/bioload; filter turnover; heater sizing; nitrate water change; salinity/dosing; setup weight/cost | 7 | 34 | 33 | 7 | 74 | FAIL E/H | NO-GO: dense free suites and species/product databases create direct competition and maintenance burden |
| Pool and spa water operation | Owner/operator balances chemistry and circulation | volume; turnover/runtime; chlorine dose; LSI/CSI; salt/CYA; heater cost; evaporation/leak; contamination response | 8 | 37 | 34 | 3 | 74 | FAIL E/I | NO-GO: mature free apps cover the full workflow; chemical and public-health misuse risk is high |
| Hydroponic reservoir management | Grower mixes, tops off and operates nutrient water | reservoir volume; A/B dilution; EC/PPM correction; top-off; pump turnover; irrigation cycle; power cost; change schedule | 7 | 35 | 31 | 7 | 73 | FAIL E/F | NO-GO: Grower Calc and other current suites already cover the workflow; irrigation overlap remains material |
| Steam-boiler feedwater and condensate balance | Industrial operator tracks makeup, blowdown and return | condensate return; makeup balance; cycles/blowdown; heat-loss cost; return-line sizing; flash steam; treatment loading | 6 | 38 | 28 | 7 | 73 | FAIL E/I | NO-GO: free calculators exist across every step and safe use requires specialist steam/chemistry review |
| Water-heater capacity and recovery | Household/plumber matches peak hot-water demand to equipment | first-hour rating; peak-hour demand; recovery rate; tankless flow; temperature rise; fuel cost; heat-pump recovery | 6 | 38 | 32 | 3 | 73 | FAIL E | NO-GO: dense current calculators and manufacturer/DOE methods leave no defensible workflow gap |
| Mobile pressure-washer water supply | Cleaning contractor matches source, tank, nozzle and job | nozzle sizing; target pressure; hose loss; buffer tank; faucet vs machine flow; job water volume; runtime; chemical dilution | 6 | 35 | 29 | 8 | 72 | FAIL E/F | NO-GO: PressureCal covers the equipment-specific core and the remainder repeats existing hydraulics |
| Brewing process-water chemistry | Brewer builds a water profile and treatment plan | water report; RO blending; alkalinity; mineral additions; mash pH; rinse/CIP water; RO storage; cost | 6 | 34 | 29 | 8 | 71 | FAIL E/I | NO-GO: strong free chemistry tools already calculate profiles and additions; advice is process- and chemistry-sensitive |
| Mobile food-unit water systems | Food-truck operator sizes fresh, waste and hot-water capacity | daily fresh demand; waste tank; handwash; warewash; refill interval; heater recovery; pump duty; winter operation | 6 | 35 | 27 | 8 | 70 | FAIL H/I | NO-GO: outcomes are controlled by changing local health-unit requirements and food-safety review |
| Building winterization and drain-down | Seasonal property operator protects idle plumbing | pipe volume; drain-down time; antifreeze volume; heat-trace power; freeze exposure; flush volume; restart checklist | 5 | 30 | 27 | 11 | 68 | FAIL D/I | NO-GO: four strong independent tools did not emerge without unsafe freeze predictions or product instructions |

## Demand and competition notes

### Selected candidate — Vehicle Wash Water Reclaim Planning

Demand signals:

- EPA WaterSense at Work gives a professional vehicle-wash chapter, field ranges, metering method, annual-use equation, reclamation-savings equation and payback inputs.
- DOE publishes vehicle-wash daily-use estimating ranges with and without reuse for self-service, in-bay automatic and conveyor systems.
- The International Carwash Association study records facility-level fresh, reclaim, spot-free RO, reject, carryout and evaporation streams; facility results vary widely, reinforcing repeat measurement rather than a universal default.
- Search results contain repeated `gallons per vehicle`, reclaim percentage, reclaim tank, RO spot-free, reject reuse, backwash, water/sewer cost and ROI intent.
- Current operator and detailing discussions repeat tank-size, water-per-vehicle, reclaim-recovery and DI/RO cost questions.
- Commercial intent is direct: reclaim equipment, RO/DI systems, tanks, separators, pumps, filters, chemicals, service and retrofit capital.

Competition:

| Competitor | Target user | Inputs / outputs | Units / workflow | Limitation and remaining intent |
| --- | --- | --- | --- | --- |
| EPA WaterSense at Work — Vehicle Washes | Facility manager | water/vehicle, throughput, days, savings %, tariffs | SI and US narrative/PDF workflow | Authoritative method but not an interactive connected calculator; no peak buffer or RO production check |
| DOE vehicle-wash estimating page | Federal/facility assessor | wash type and vehicle count → low/average/high daily estimate | US tables | Benchmark only; does not use facility meter data, stream balance, peak storage or economics |
| Calculator Collection car-wash water calculator | Household consumer | wash method, frequency, vehicles, tariff → annual cost | US consumer defaults | Does not model a professional wash, reclaim, spot-free RO, buffer or sewer discharge |
| Kärcher WRP product page | Equipment buyer | product capacity and claimed savings | Manufacturer-specific product selection | Useful product evidence but no facility-specific balance, peak simulation or multi-vendor planning |
| Fortis Foam ROI guide | Commercial operator | throughput, tariffs, capex, recovery assumptions | EU content workflow | Content and product-adjacent assumptions; no operator measurement, stream or storage tool |
| Tommy/PurWater engineering manual | Installer | product-specific tank and installation information | US manufacturer system | Valuable final equipment data but tied to one package and not a pre-selection facility workflow |

Competitive gap: one free, account-free, SI-first workflow that starts with a meter and matching vehicle count, separates fresh/reclaim/spot-free/reject/carryout/discharge, tests a delayed peak buffer, checks actual RO permeate production, and finishes with user-entered economics. The tools do not select treatment or approve discharge.

Why repeat use is plausible: operators can rerun the audit by shift/week/season, compare wash packages, test recovery and tank cases during procurement, recalculate RO production as membranes age, update tariffs/throughput, and monitor post-commissioning performance.

### Other candidate evidence

- Hydronics: current results include Vapco's system-volume/glycol/freeze/flow tool, Ensign's water-content calculator, Amtrol/Watts product sizing, Toolgrit/AIM expansion calculators, Reuven heat-flow calculations and current fill-pressure guidance. The entire proposed workflow is already covered, even after decomposing manufacturer-specific and SI/US gaps.
- RV: current RV Tank Capacity Calculator, RV Dump Finder and OffGridRVHub already cover tank duration, party size and trip behavior; winterization and sanitizing demand is real but fragmented around manufacturer instructions and safety-sensitive dosing.
- Domestic hot water: EPA's 2026 Hot Water Volume Calculator and current recirculation heat-loss tools cover wait/waste and loop calculations; Legionella/scalding and code boundaries narrow safe differentiation.
- Aquarium: AquaGauge, AquariumCalc and FishComfort expose stocking, volume, water-change, filter, heater, salinity and maintenance tools. Species data and changing product assumptions are central.
- Pool/spa: current free tools and PoolMath-style apps cover chemistry, turnover, runtime, energy and leaks; the gap is presentation rather than a missing decision.
- Hydroponics: Grower Calc exposes reservoir, nutrient dilution, PPM correction, pump, top-off, power and irrigation tools in one shell. A new cluster would duplicate both that suite and current WSB irrigation logic.
- Boiler/steam: current condensate-return, blowdown, heat-loss and return-line calculators exist; specialist pressure, steam-table and treatment obligations dominate.
- Water heaters: current FHR, recovery, tank/tankless and peak-demand calculators are dense; AHRI/DOE methods and manufacturer data anchor final selection.
- Pressure washers: PressureCal already provides nozzle size, target pressure and hose-loss tools. Buffer/run-time additions mainly reuse WSB flow, storage and friction decisions.
- Brewing: brewwtr, Craft Beer Wizard and other tools already connect water reports, RO blending, mineral additions and mash pH.
- Mobile food units: current health-department guidance confirms demand but local plan-review rules determine tank, handwash, warewash and waste outcomes.
- Winterization: repeated freeze/drain/heat-trace questions exist, but safe freeze-time prediction needs construction and weather conditions; remaining calculations are thin volume or product lookups.

## Mandatory gate result for selected candidate

| Gate | Result | Evidence |
| --- | --- | --- |
| A — New family | PASS | Professional vehicle-wash process-water recovery is a new operator, equipment set and outcome; it is not household greywater or a previously rejected family. |
| B — Search demand | PASS | Seven distinct current intent groups appear across agency guidance, industry studies, product pages, calculators and operator questions. |
| C — Long-tail depth | PASS | Audit, per-vehicle, reclaim balance, buffer, spot-free RO, reject/backwash, economics and monitoring form separate bundles. |
| D — Tool depth | PASS | Five independent repeat-use tools make different decisions and use different logic. |
| E — Competitive opening | PASS | Current results are authoritative PDFs/tables, household calculators, product pages or isolated ROI content; no free connected operator workflow was found. |
| F — Existing overlap | PASS | Outputs are per-vehicle baseline, process-stream balance, delayed peak buffer, spot-free production and facility retrofit payback—not existing household reuse, storage or RO-treatment decisions. |
| G — Workflow | PASS | Meter → map → balance → buffer → spot-free → economics → monitor. |
| H — Maintainability | PASS | Core logic is mass balance and user-entered meter, performance and tariff data; no price, product or jurisdiction database is required. |
| I — Safety | PASS | Tools are quantity/economics planning only and explicitly do not select treatment, certify water quality or authorize discharge. |

## Final production scope

- Hub: 1
- Tools: 5
- Guides: 2
- Reference: 1
- New public pages: 9
- Projected final public pages: 83

Implementation contract: `docs/vehicle-wash-water-reclaim-expansion.md`.

## Research links

- https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P1018SSR.TXT
- https://www.energy.gov/cmei/femp/estimating-methods-determining-end-use-water-consumption
- https://www.energy.gov/sites/prod/files/2020/11/f80/handbook-water-evaluation-tools.pdf
- https://www.carwash.org/hubfs/Pulse%20and%20Research/Water%2BUse%2C%2BEvaporation%2Band%2BCarryout%2Bin%2BProfessional%2BCar%2BWashes.pdf
- https://www.kaercher.com/int/professional/water-reclamation/physical-water-reclamation-systems/wrp-car-wash-12170530.html
- https://www.calculatorcollection.org/en/calculators/water-usage/car-wash-water-calculator/
- https://vapcosolutions.com/glycol-system-volume-dosage-calculator/
- https://ensign.software/free-calculators/system-volume-calculator/
- https://www.epa.gov/watersense/watersense-labeled-homes-hot-water
- https://www.growercalc.com/
- https://www.aquariumcalc.com/
- https://www.pressurecal.com/
- https://brewwtr.com/
