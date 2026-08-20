# Workflow Cluster Discovery — 2026-08-20

## Decision record

- Repository: https://github.com/canghun13/watersystemsbench
- Review date: 2026-08-20
- Starting branch and commit: clean `main` at `6cf4e45368ddb0ddbe0101149cd0bc99bb6353c2`, equal to fetched `origin/main` and the remote `main` ref
- Starting inventory: 83 public pages — 7 core pages, 6 system hubs, 42 tools, 18 guides and 10 references; sitemap count 83
- Research scope: 13 genuinely new workflow families after excluding every family in the 2026-08-08 and 2026-08-11 cycles
- Search-volume policy: no keyword-volume, difficulty, CPC, GSC or GA4 figures were available or invented
- Final decision: **NO-GO — no genuinely new workflow cluster clears the expansion bar**
- Production HTML/CSS/JavaScript/generator changes: **0**
- New public pages: **0**
- Sitemap change: **none**

## Previous-candidate exclusion list

The exclusion test is based on the user's job and final decision, not the candidate name. Renaming or narrowing a prior family does not make it new.

| Previously reviewed family | Cycle | Decision | Reason / implementation state | Related WSB scope | Re-review allowed? |
| --- | --- | --- | --- | --- | --- |
| Greywater reuse | 2026-08-08 | GO | Implemented as a measured supply → irrigation demand → distribution → surge → economics workflow | 5 tools, 2 guides, 1 reference, 1 hub | No; implemented |
| Water loss / leakage | 2026-08-08 | NO-GO | AWWA owns the authoritative free audit workflow; household remainder overlaps flow, pressure, cost and troubleshooting | Pump, flow, pressure and cost tools | Only with materially new external evidence; mark RECONSIDERATION |
| Commercial building water demand / distribution | 2026-08-08 | NO-GO | Dense WSFU/DFU and pipe-sizing competition plus licensed/versioned code tables | TDH, pipe friction, booster duty | Same restriction |
| Stormwater / site drainage | 2026-08-08 | NO-GO | EPA tools cover the workflow; local IDF and permit design create risk | Rainwater, storage and pipe tools | Same restriction |
| Septic systems | 2026-08-08 | NO-GO | Free connected competitors and jurisdictional public-health requirements | Storage and wastewater-adjacent planning | Same restriction |
| Cooling-tower water management | 2026-08-08 | NO-GO | Core arithmetic is one linked balance; free tools are mature; chemistry and microbial control dominate safe operation | Treatment and operating-cost tools | Same restriction |
| Construction dewatering | 2026-08-08 | NO-GO | Free integrated planners, hydraulic overlap and site-specific geotechnical/discharge constraints | Pump, TDH, friction and storage tools | Same restriction |
| Livestock / stockwater | 2026-08-08 | NO-GO | Apparent tools recombine existing demand, storage, pipe and pump work around local standards | Wells, storage and pumping | Same restriction |
| Wastewater pump stations | 2026-08-08 | NO-GO | Wet-well additions do not produce four new jobs beyond existing pump hydraulics | Pump duty, TDH, cycles, storage | Same restriction |
| Pond / small-reservoir management | 2026-08-08 | NO-GO | Mature volume/turnover/aeration tools and ecological/product assumptions | Storage, pump and rainwater tools | Same restriction |
| Professional vehicle-wash reclaim | 2026-08-11 | GO | Implemented as audit → stream map → reclaim balance → buffer → spot-free RO → economics | 5 tools, 2 guides, 1 reference, 1 hub | No; implemented |
| Closed-loop hydronic commissioning | 2026-08-11 | NO-GO | Free tools cover volume, glycol, fill pressure, expansion, heat flow and circulator duty | Pump and pressure tools | No without contradictory evidence |
| RV fresh/waste water management | 2026-08-11 | NO-GO | Connected trip planners exist; remaining winterization/sanitizing tools are thin or safety-sensitive | Storage and quantity planning | Same restriction |
| Domestic hot-water delivery / recirculation | 2026-08-11 | NO-GO | EPA workbook and current calculators cover wait, volume, heat loss, flow and cost | Pipe and operating-cost tools | Same restriction |
| Aquarium water and equipment planning | 2026-08-11 | NO-GO | Dense suites and species/product databases create direct competition and maintenance load | Treatment and pump tools | Same restriction |
| Pool / spa water operation | 2026-08-11 | NO-GO | Mature free chemistry/circulation apps and high chemical/public-health misuse risk | Treatment, dosing and pump tools | Same restriction |
| Hydroponic reservoir management | 2026-08-11 | NO-GO | Existing suites cover nutrient, top-off, pump and irrigation decisions | Irrigation and treatment tools | Same restriction |
| Steam-boiler feedwater / condensate | 2026-08-11 | NO-GO | Free calculators cover every step; steam and chemistry require specialist review | Treatment and operating-cost tools | Same restriction |
| Water-heater capacity / recovery | 2026-08-11 | NO-GO | Dense FHR, recovery and tank/tankless calculators leave no opening | Demand and cost tools | Same restriction |
| Mobile pressure-washer water supply | 2026-08-11 | NO-GO | Equipment-specific core is covered; buffer and hose work repeats existing hydraulics | Flow, storage and friction tools | Same restriction |
| Brewing process-water chemistry | 2026-08-11 | NO-GO | Strong free chemistry tools already connect reports, RO blending and additions | Treatment and RO tools | Same restriction |
| Mobile food-unit water systems | 2026-08-11 | NO-GO | Changing health-unit rules control fresh, waste, handwash and warewash outcomes | Storage and hot-water planning | Same restriction |
| Building winterization / drain-down | 2026-08-11 | NO-GO | Four independent safe tools did not emerge without unsafe freeze predictions or product rules | Storage and pipe-volume work | Same restriction |

No excluded family was counted among the new candidates below. No RECONSIDERATION candidate was opened because the current search results did not contradict a previous blocking conclusion.

## Research method

Research began with users and equipment not centered in the current 42-tool inventory. Queries combined each topic with `calculator`, `sizing`, `planner`, `audit`, `capacity`, `water use`, `storage`, `cost`, `maintenance`, `performance` and `troubleshooting`. For promising candidates, at least five distinct intent groups were checked and current results were classified as government/public agency, university Extension, manufacturer/vendor, generic calculator, spreadsheet/manual, forum or dedicated free tool.

The review used primary sources to validate that a real workflow exists and current competing tools to establish the actual SERP opening. Shared variables such as flow, volume, time and cost were not automatic rejection reasons; the comparison used user start state, final decision, primary output and next action.

## New candidate families

The one-line candidate contract is included in the first three columns. `Independent tools` is the plausible count before deep competition and overlap review; a count of four does not by itself pass Gate E.

| Candidate | Primary user / trigger / decision | Why not already covered; previous-review overlap | Primary workflow | Independent tools | Long-tail intent groups | Monetization /40 | Demand /35 | Gap /25 | Total | Gate result |
| --- | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | --- |
| Commercial ice-machine water and capacity planning | Food-service/facility operator facing shortage, high water use or replacement; decide production, bin and operating case | Ice harvest/bin behavior is new; food-truck and water-heater families were excluded, but this is fixed equipment using certified user-entered performance data | Log demand → size production/bin → test peak storage → audit water/energy → compare replacement | 4 | demand; bin/peak; ambient derating; water efficiency; air-vs-water cooling; operating cost | 36 | 30 | 10 | **76** | FAIL G |
| Dust-suppression water logistics | Site/haul-road operator planning repeat applications; decide water, truck cycles, refill capacity and cost | Different from dewatering because water is supplied rather than removed; still close to construction water logistics | Measure area → enter approved rate → plan tankloads/refill → schedule fleet → compare cost | 5 | application rate; coverage; tanker cycles; fill-source flow; route time; additive comparison; cost | 36 | 28 | 8 | **72** | FAIL G, H, I |
| Maple sap concentration and sugarhouse water balance | Hobby/commercial sugarmaker with variable sap Brix and a finite processing window; decide RO/evaporator/storage capacity | New seasonal producer and product-water balance; brewing was excluded, but maple sap concentration is a different job | Measure Brix/volume → estimate syrup yield → size RO window → balance concentrate/permeate → estimate boil-off/time → schedule storage | 4 | sap-to-syrup yield; RO concentration; RO throughput; evaporator time/fuel; sap storage; density correction; economics | 30 | 23 | 17 | **70** | FAIL E, G |
| Resort / backyard snowmaking water supply | Snowmaking operator deciding coverage, reservoir draw and run window | New end use, but pump, pressure and storage calculations overlap existing tools | Set coverage/depth → convert snow to water → check source/storage → match guns and pressure → schedule weather window → estimate cost | 4 | water per area-depth; gun flow; pump pressure; pond storage; wet-bulb performance; runtime; energy cost | 34 | 25 | 10 | **69** | FAIL E, H, I |
| Commercial laundry process-water efficiency | Laundry operator with meter/load data deciding equipment or rinse reclaim | New per-load operator, but vehicle-wash reclaim uses the same audit/balance/buffer/economics pattern | Meter loads → normalize water/laundry mass → map wash/rinse/hot streams → test reclaim buffer → compare retrofit | 4 | gallons per pound; per-cycle audit; hot-water demand; rinse reclaim; storage; sewer cost; payback | 35 | 27 | 6 | **68** | FAIL F, G |
| Pure-water window and solar-panel cleaning | Professional cleaner choosing DI-only vs RO/DI, mobile storage and per-job cost | New surface-cleaning user, but directly adjacent to the previously rejected pressure-washer family and current RO/storage tools | Measure TDS/demand → compare DI/RO path → check production/storage → match brush flow → calculate consumables/job cost | 5 | DI resin life; RO/DI selection; production rate; tank autonomy; brush flow; reject water; per-job cost | 35 | 29 | 4 | **68** | FAIL A, F, G |
| Concrete batching and wash-water control | Batch-plant technician correcting free water and handling wash water; decide batch adjustment and reuse quantity | New industrial material decision; not dewatering, but structural quality is controlled by standards and test data | Test aggregate moisture → correct batch water/masses → verify w/c limit → segregate wash water → screen reuse | 4 | moisture correction; absorption/SSD; batch water; w/c check; washout volume; reclaimed-water blend | 37 | 26 | 4 | **67** | FAIL G, H, I |
| Winery process-water and seasonal wastewater planning | Small winery operator preparing crush; decide peak water/wastewater storage and irrigation balance | Wine production was not reviewed; brewing chemistry is excluded, but this candidate focuses on seasonal water/wastewater | Meter production → normalize water/wine → build crush/non-crush hydrograph → size buffer → check entered irrigation demand → track KPI | 4 | water per litre/case; crush peak flow; tank cleaning; wastewater storage; irrigation balance; treatment loading; audit KPI | 34 | 24 | 8 | **66** | FAIL H, I |
| Abrasive-waterjet utility and consumables planning | Fabrication-shop operator estimating water, abrasive, runtime and waste | New machine/process, not a generic pump workflow | Select verified orifice/nozzle case → calculate water/abrasive → estimate cut time → plan catcher/sludge capacity → compare job cost | 4 | orifice flow; abrasive feed; cutting speed; pump power; job cost; garnet waste; maintenance | 37 | 27 | 2 | **66** | FAIL G, H |
| Laboratory purified-water demand and distribution | Lab/facility planner matching Type I/II/III demand, production and storage | New end users, but core capacity/RO/storage work overlaps current treatment tools and quality selection is application-specific | Inventory points/quality → build daily/peak demand → size production/storage → check distribution → monitor consumables/quality | 4 | lab water grade; RO/DI sizing; peak demand; storage recovery; point-of-use flow; cartridge life; loop distribution | 35 | 26 | 4 | **65** | FAIL F, G, I |
| Commercial warewashing water and booster planning | Restaurant operator choosing machine throughput, hot-water recovery and operating case | Fixed kitchen equipment is distinct from mobile food units, but final selection is model/listing and jurisdiction dependent | Log racks/covers → size peak throughput → read model rinse use → size booster/recovery → calculate water/energy cost | 4 | racks/hour; rinse water/rack; booster kW; hot-water recovery; pre-rinse use; water/energy cost | 36 | 28 | 1 | **65** | FAIL G, H, I |
| Hydro-vac excavation water and spoil logistics | Hydro-vac estimator planning usable water, slurry/debris capacity, dump cycles and productivity | Different mechanism from dewatering but still part of construction excavation/disposal, making family separation weak | Define cut/soil → enter measured water rate → balance usable water and debris tank → plan dump/refill cycles → estimate shift cost | 4 | water per excavation; slurry swell; debris capacity; refill cycles; dump time; productivity; disposal cost | 35 | 22 | 6 | **63** | FAIL A, H, I |
| Pottery / ceramics studio wash-water and clay capture | Home/studio potter protecting plumbing and organizing settling/reclaim | New hobbyist and suspended-clay stream with little current WSB overlap | Segregate clay/glaze streams → measure wash water/solids → plan settling stages → schedule decant/cleanout → estimate reclaim | 3 | clay trap; settling buckets; sink protection; reclaim water; cleanout interval; glaze disposal | 24 | 18 | 18 | **60** | FAIL C, E, H, I |

## Evidence and current competitors

### Commercial ice machines

- U.S. DOE gives explicit annual water-use and lifetime operating-cost methods for water-cooled commercial ice machines: https://www.energy.gov/cmei/femp/purchasing-energy-efficient-water-cooled-ice-machines
- ENERGY STAR publishes harvest-rate, energy and potable-water criteria by machine type: https://www.energystar.gov/products/commercial_food_service_equipment/commercial_ice_makers/key_product_criteria
- EPA WaterSense at Work supplies water-use and replacement-savings equations: https://www.epa.gov/sites/default/files/2017-01/documents/ws-commercial-water-sense-at-work-ci.pdf
- Current connected free sizing competitors already combine daily demand, peak buffer, operating-condition correction and bin selection: https://www.atlanticse.com/pages/commercial-ice-machine-size-calculator and https://calcimator.com/calculators/cooking-food/commercial-ice-machine

### Dust suppression

- A live DustRX Hydro calculator already connects area, application rate, tank size, tankloads, work hours, water use, equipment/labour and installed cost: https://www.profileevs.com/calculators/DustRxHydroCalc/index.htm
- A second current ROI tool includes truck-fleet fuel, labour, raw water and maintenance: https://terafil.com/haul-road-dust-control-roi-terafil-grt-haul-loc/
- Public guidance demonstrates that approved application rates and additive concentrations are site/program specific rather than universal: https://cms.tacoma.gov/SWMM_WebBook/Responsive%20HTML5/BookBook/Volume_3_Construction_Site_Stormwater_Best_Management_Practices/BMP_C127_-_Polyacrylamide_for_Soil_Erosion_Protection.htm

### Maple sap processing

- Washington State University confirms separate sap-yield, Brix, RO, energy and food-safety decisions: https://extension.wsu.edu/maplesyrup/hobbyist/faq/ and https://extension.wsu.edu/maplesyrup/commercial/financial/
- Utah State University Extension gives the revised Jones Rule and explains RO concentration: https://extension.usu.edu/forestry/publications/utah-forest-facts/044-maple-sap-processing
- The North American Maple Syrup Producers Manual publishes RO feed-rate/run-time logic: https://holmes.osu.edu/sites/holmes/files/imce/Program_Pages/Maple/North%20American%20Maple%20Syrup%20Producers%20Manual%20full%20pdf.pdf
- Cornell already offers an authoritative suite of density, dilution, pricing, tubing, vacuum, sap value, processing wage and business calculators/spreadsheets: https://blogs.cornell.edu/cornellmaple/cornell-maple-calculators/

### Other candidate evidence

- Snowmaking: current free nozzle/pressure calculators and vendor water-storage planning already cover core steps: https://snow-state.com/snowmaking-calculations/ and https://www.snowmakers.com/water-reservoir-and-intake-planning
- Commercial laundry: EPA supplies a water-use/replacement method, while a current free tool directly calculates rinse-reclaim savings/payback: https://www.epa.gov/sites/default/files/2017-01/documents/ws-commercial-water-sense-at-work-ci.pdf and https://calcimator.com/calculators/business/laundry-water-recycling
- Pure-water cleaning: a current independent site already offers an RO/DI selector, resin-life and cost workflow: https://windowcleaningtoolguide.com/pure-water-systems/ and https://windowcleaningtoolguide.com/tools/ro-di-system-selector/
- Concrete: FHWA publishes the batch moisture/absorption correction worksheet and current calculators implement the same decision: https://highways.dot.gov/media/43476 and https://concretetoolkit.com/calculators/concrete-aggregate-moisture-calculator-usa/
- Winery: current guidance and production calculators connect metered water, production KPIs and wastewater: https://www.wineaustralia.com/getmedia/72627da6-d28a-42f2-b600-28fdd5a6c85c/operational-guidelines.pdf and https://www.bcwgc.org/sites/default/files/uploads/Wastewater%20Management%20-%20Final%20Digital.pdf
- Waterjet: OEM calculators already cover water, abrasive, cut performance and cost: https://waterjet-calculator.hypertherm.com/ and https://clients.wardjet.com/tools/waterjet-cost-calculator
- Laboratory purified water: current vendor and independent tools connect demand, production, storage and treatment route: https://www.pureprocesstechnology.com/how-to-size-a-lab-water-purification-system/ and https://makoryn.com/tools/industrial-di-water-planner/
- Warewashing: current free calculators and public design manuals cover racks/hour, water, energy, booster and hot-water sizing: https://calcimator.com/calculators/cooking-food/commercial-dishwasher and https://agriculture.sc.gov/wp-content/uploads/2026/03/RFEPlanningResource2026_digital.pdf
- Hydro-vac: a current wet-slurry calculator exposes onboard usable water and debris/slurry balance: https://vacsmart.info/home/calculator/
- Pottery: current search results are primarily community discussions and DIY videos rather than stable calculation methods; recurring questions exist, but no four independent quantitative decisions emerged.

## Deep validation — top three

### 1. Commercial Ice-Machine Water and Capacity Planning

**Workflow:** Observe stockouts, melt and utility use → log peak-day ice demand → calculate production and bin balance → compare certified model water/energy rates → verify supply/drain and operating conditions → monitor measured output.

**Distinct long-tail groups:** commercial ice machine sizing; ice bin sizing; hot-kitchen production derating; gallons per 100 lb ice; air-cooled versus water-cooled cost; ice-machine water audit; RO/storage for ice machine.

**SERP composition:** DOE/EPA/ENERGY STAR methods and product criteria; equipment dealers with interactive sizing; subscription/equipment vendors; generic calculators; manufacturer charts; restaurant/refrigeration forums. The current Atlantic Service calculator already accepts application demand, operating-condition correction, peak reserve and storage-bin inputs. Calcimator returns demand, production, bin, water and energy in one interaction.

#### Potential-tool independence test

| Tool | Primary user / trigger | Inputs | Output / decision | Repeat-use reason | Existing overlap | Result |
| --- | --- | --- | --- | --- | --- | --- |
| Measured Ice Demand Logger | Operator with peak-day records | purchased/used/remaining ice by period | measured peak and daily demand | seasonal/menu/event changes | New | Independent, but a log more than a calculation |
| Ice Production & Bin Simulator | Operator comparing a model | measured demand series, user-entered actual production, starting bin | stockout/minimum bin/ending stock | test hot-weather and event cases | Storage simulators share balance logic | Independent decision |
| Ice-Machine Water Efficiency Audit | Facility auditor | water meter interval, ice produced, operating days | potable/condenser water per 100 lb and annual use | repeat after service/replacement | Vehicle-wash audit uses same normalization pattern | Independent KPI, already prescribed by EPA |
| Ice-Machine Operating Cost Comparator | Buyer | certified/user-entered kWh and water rates, production, tariffs | annual/lifetime cost and payback | tariffs and models change | Pump/vehicle economics share cost logic | Useful, but DOE already provides the complete method |

The four pages could be made functional, but the current SERP already joins the highest-volume production/bin decision and public tools publish the remaining audit/replacement equations. Water Systems Bench would offer cleaner measurement-first presentation, not a missing workflow. That fails Gate G.

**Why users would not yet choose WSB:** vendor neutrality and SI/US support are useful, but not enough to displace a free connected calculator plus DOE/EPA methods without a demonstrably missing decision.

| Gate | Result | Evidence |
| --- | --- | --- |
| A — New family | PASS | Commercial ice production is not a previous family. |
| B — Real workflow | PASS | Demand, bin, production, utilities and monitoring form a real equipment workflow. |
| C — Search demand | PASS | Multiple sizing, bin, water, efficiency and cost queries recur. |
| D — Long-tail depth | PASS | Seven distinct intent groups were verified. |
| E — Tool depth | PASS, weak | Four usable tools exist, although two are prescribed audit/cost views. |
| F — Existing-site separation | PASS | Final outputs are ice production, bin stockout and water/energy intensity. |
| G — Competitive opening | **FAIL** | Current free interactive sizing covers demand, derating and bin; DOE/EPA cover water and cost. |
| H — Maintainability | PASS | Product performance can remain user-entered/certified. |
| I — Safety | PASS | Quantity/economics can exclude sanitation and food-safety decisions. |

### 2. Dust-Suppression Water Logistics

**Workflow:** Identify an approved dust-control plan and treatment area → enter the project-specific application rate → calculate water/pass → plan tankloads, fill-source time and fleet shifts → monitor application and runoff → compare entered cost cases.

**Distinct long-tail groups:** gallons per acre dust control; water truck coverage; tanker loads/day; fill time and source flow; haul-road application frequency; dust suppressant dilution; water-truck fleet cost.

**SERP composition:** vendor calculators, environmental permits/guides, public works PDFs, equipment-rental content, haul-road vendors and research. The Profile EVS calculator already connects nearly every proposed input and output in one free interaction; TeraFil adds fleet and maintenance ROI.

#### Potential-tool independence test

| Tool | Primary output / decision | Existing overlap | Competitive result |
| --- | --- | --- | --- |
| Application Water Planner | volume/pass from entered approved rate and area | Irrigation depth/area arithmetic | Built into DustRX Hydro |
| Truck Coverage & Tankload Planner | coverage/load and whole loads/pass | Storage/volume arithmetic | Built into DustRX Hydro |
| Fill-Source & Shift Scheduler | fill time, cycles and trucks required | Flow/storage timing | Mostly present in integrated vendor workflows |
| Project Water/Cost Comparator | seasonal water, labour/equipment and cost | Existing cost patterns | DustRX and TeraFil cover it |
| Additive Mix Calculator | user-entered product and water per tank | Treatment dose arithmetic | Product/permit-specific and unsafe as a generic selector |

**Independent-site reason tested:** a vendor-neutral site could avoid product claims, but after removing unapproved application-rate and additive advice it would reproduce the integrated calculators with user-entered values. Local soil, weather, runoff, water-source and air-quality requirements control effective/safe operation.

| Gate | Result | Evidence |
| --- | --- | --- |
| A — New family | PASS | Supplying water for dust control differs from removing groundwater. |
| B — Real workflow | PASS | Area → water → tanker logistics → monitoring/cost is coherent. |
| C — Search demand | PASS | Operational and equipment queries are repeated. |
| D — Long-tail depth | PASS | Seven distinct groups were verified. |
| E — Tool depth | PASS, weak | Four planning views exist but share one rate × area × cycles model. |
| F — Existing-site separation | PASS | Fleet logistics is new despite shared flow/volume variables. |
| G — Competitive opening | **FAIL** | Existing connected free tools already cover water, trucks, labour and ROI. |
| H — Maintainability | **FAIL** | Rates, approved additives and application constraints are site/program specific. |
| I — Safety | **FAIL** | Generic rates can cause runoff, erosion, contaminated-water or permit problems. |

### 3. Maple Sap Concentration and Sugarhouse Water Balance

**Workflow:** Measure raw sap volume/Brix → estimate recoverable syrup → choose a target concentration → test RO feed rate and operating window → balance concentrate/permeate → calculate evaporation load/time → schedule tanks and compare the season case.

**Distinct long-tail groups:** sap-to-syrup ratio; maple Brix calculator; maple RO sizing; RO processing hours; permeate/concentrate balance; evaporator boil time/fuel; sap storage; RO payback.

**SERP composition:** university Extension guidance, the North American producer manual, Cornell spreadsheets, specialist calculators, equipment suppliers, producer forums and videos. Demand is real but concentrated in maple-producing regions and seasons.

#### Potential-tool independence test

| Tool | Primary output / decision | Existing overlap | Independence result |
| --- | --- | --- | --- |
| Sap-to-Syrup Yield Calculator | expected finished syrup and processing loss | New product-specific mass balance | Independent |
| Maple RO Concentration Balance | concentrate, permeate and ending Brix | Current RO recovery/reject balance plus sugar mass | Useful but shares the same mass-conservation core as yield |
| RO Run-Window Planner | hours/capacity needed for a sap run | RO production/demand logic | Independent equipment-capacity decision |
| Evaporator Water-Off & Time Planner | water to boil and time at measured evaporation rate | Simple subtraction/time after yield/RO | Too thin as a separate repeat tool |
| Sap Collection/Storage Scheduler | tank peak from collection and processing time series | Existing storage simulator pattern | Independent scenario, but food-quality hold time cannot be generalized safely |

After merging the two mass-balance views and the thin evaporation arithmetic, only three defensible repeat tools remain: yield/balance, RO capacity and storage scheduling. Cornell's authoritative suite already serves density correction and business economics, so those cannot be added merely to reach four.

**Independent-site reason tested:** mobile, SI/US, no-login connection of yield → RO → storage would be friendlier than spreadsheets, but friendlier presentation does not create four independent tools. A global water-systems site would also serve a geographically and seasonally narrow audience.

| Gate | Result | Evidence |
| --- | --- | --- |
| A — New family | PASS | Maple sap processing was not previously reviewed. |
| B — Real workflow | PASS | Measure → concentrate → evaporate → store is coherent. |
| C — Search demand | PASS | Producer manuals, calculators and questions confirm demand. |
| D — Long-tail depth | PASS | Eight distinct groups were verified. |
| E — Tool depth | **FAIL** | Mass-balance variants merge; only three robust repeat tools remain. |
| F — Existing-site separation | PASS | Final output is sap/syrup production capacity, not drinking-water treatment. |
| G — Competitive opening | **FAIL** | Cornell already offers authoritative density, pricing and business calculators; remaining gap is too narrow. |
| H — Maintainability | PASS | User-entered Brix, rates and losses avoid a product database. |
| I — Safety | PASS | Quantity planning can exclude finished-syrup food-safety approval. |

## Final decision

**NO-GO — no genuinely new workflow cluster clears the expansion bar.**

Commercial ice-machine planning is the strongest candidate at 76/100 and is the only top-three candidate with four reasonably independent tools and a safe, maintainable scope. It still fails mandatory Gate G: current free interactive tools already combine demand, operating-condition adjustment and bin sizing, while DOE/EPA publish the water-use, replacement and operating-cost method. A WSB cluster would improve presentation rather than fill a missing decision workflow.

Dust-suppression logistics has strong commercial proximity but fails the competitive-opening, maintenance and safety gates. Maple sap processing has an authentic workflow and an apparent mobile-tool gap, but four tools result only by splitting one mass balance into multiple pages; after merging, it fails Tool depth and remains adjacent to Cornell's authoritative calculator suite.

The other ten candidates fail more decisively on previous-family separation, existing-site overlap, dense OEM/free competition, product/regulatory maintenance, specialist safety, or four-tool independence. No production implementation contract is justified in this cycle.

## Change boundary and next observation point

- Production HTML changes: 0
- Production CSS changes: 0
- Production JavaScript changes: 0
- Generator changes: 0
- New public pages: 0
- Sitemap remains 83 URLs with zero `/docs/` URLs
- Existing GA4, analytics QA blocker, production-docs boundary, workflow visuals, Tool Finder, responsive tables and homepage badges are untouched

Revisit commercial ice-machine planning only if search/user evidence reveals a missing fourth-or-fifth decision not covered by current sizing calculators and DOE/EPA audit methods—for example, a repeatable measured bin-production time-series workflow with clear demand. Revisit maple only if four independent operational decisions emerge without splitting mass balance or duplicating Cornell. Otherwise prioritize indexing and measured user evidence for the existing 83 pages.
