# Second Expansion Review

## Decision record

- Review date: 2026-08-08
- Repository: https://github.com/canghun13/watersystemsbench
- Starting commit: `753fa8c0b5426f38b8c1ad1b9e8555c2929adee3`
- Starting state: clean `main`, equal to `origin/main`
- Starting public inventory: 74 pages — 7 core, 5 system/cluster hubs, 37 tools, 16 guides and 9 references
- First expansion cluster in this cycle: Greywater Reuse Planning
- Protected area: the complete user-managed homepage directory-badge block below the footer, containing KittyLaunch, SellWithBoost, Twelve Tools, Findly and BoostDomainRating
- Final decision: **NO-GO**
- Production pages added: **0**
- Sitemap changed: **no**
- Production HTML, CSS, JavaScript and generator changes: **none**

This review did not reuse the scores from the greywater expansion decision. It repeated the candidate comparison against the current 74-page site, the current 37-tool inventory and live search results on the review date. No search-volume or keyword-difficulty figures were invented; demand was judged from repeated calculator, sizing, planning, troubleshooting and operator-workflow intent.

## Current site boundary

The current site already covers five connected systems:

1. Pumps, pressure and pipe flow
2. Wells, boreholes, storage and rainwater
3. Irrigation and sprinklers
4. Water treatment and water quality
5. Greywater reuse planning

The second expansion therefore had to create a genuinely new job rather than repackage pump duty, TDH, pipe friction, flow measurement, storage sizing, rainwater yield, irrigation demand, water-treatment selection or greywater supply/use logic.

## Research method

Each candidate was searched through a main topic plus combinations of calculator, sizing, planner, estimator, checker, troubleshooting, flow, pressure, capacity, cost, failure, design, operation, maintenance, equipment and user type. The review then compared:

- repeated practical questions and long-tail tool intent;
- government, Extension, manufacturer, SaaS and calculator-directory tools;
- whether current tools already cover the calculation or decision;
- whether four independent tools form one workflow;
- whether local code, public-health, geotechnical, product or live-data dependencies remain maintainable.

The strongest evidence was taken from current official tools and documentation where available. Commercial calculator pages were used only to establish present competitive coverage and user experience.

## Candidate scoring

Scores use Monetization 40 + Traffic/search demand 35 + Competitive gap 25. A total alone cannot produce a GO; all seven gates must also pass.

| Candidate | Monetization /40 | Demand /35 | Gap /25 | Total /100 | Decision | Primary reason |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| Water loss / leakage | 35 | 31 | 8 | 74 | NO-GO | Strong demand, but AWWA already provides the authoritative free audit workflow; the remaining household workflow overlaps existing flow, pressure, cost and troubleshooting tools. |
| Commercial building water demand / distribution | 38 | 31 | 4 | 73 | NO-GO | Dense free WSFU/DFU and pipe-sizing competition, licensed or versioned code-table dependence, and direct hydraulic overlap. |
| Stormwater / site drainage | 37 | 32 | 4 | 73 | NO-GO | EPA supplies free site runoff and full drainage models; simplified tools add permit-design risk and repeat existing runoff, storage and pipe hydraulics. |
| Septic systems | 35 | 30 | 6 | 71 | NO-GO | Repeated sizing intent exists, but integrated free competitors already cover the obvious workflow and local public-health rules control the result. |
| Cooling-tower water management | 36 | 29 | 4 | 69 | NO-GO | Many free calculators already connect makeup, evaporation, cycles, blowdown and cost; safe differentiation would require chemistry and microbial-control maintenance. |
| Construction dewatering | 35 | 26 | 7 | 68 | NO-GO | A free integrated planner already covers inflow, method and settlement while reliable output depends on site geotechnical and discharge constraints. |
| Livestock / stockwater systems | 32 | 27 | 8 | 67 | NO-GO | Real ranch workflow exists, but the candidate mostly recombines current demand, storage, pipe, TDH and pump tools; USDA also publishes detailed free workbooks. |
| Wastewater pump stations | 33 | 25 | 7 | 65 | NO-GO | Wet-well and lift-station demand is narrower, free calculators exist, and the useful calculations substantially overlap current pump/TDH/friction/storage tools. |
| Pond / small-reservoir management | 31 | 25 | 7 | 63 | NO-GO | Volume, turnover, pump and aeration tools are already abundant; four independent non-overlapping tools did not emerge without ecological or product-specific assumptions. |

## Gate review

Gate definitions:

- A — independent problem
- B — at least four independent repeat-use tools
- C — verified search intent
- D — meaningful gap against strong free competition
- E — no material overlap with the current site
- F — maintainable safety and regulatory boundary
- G — one connected practical workflow

| Candidate | A | B | C | D | E | F | G | Blocking result |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| Water loss / leakage | PASS | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | The defensible utility workflow duplicates AWWA; the household remainder duplicates current site jobs. |
| Commercial building water demand / distribution | PASS | PASS | PASS | **FAIL** | **FAIL** | **FAIL** | Direct competitors, hydraulic overlap and code-edition maintenance. |
| Stormwater / site drainage | PASS | PASS | PASS | **FAIL** | **FAIL** | **FAIL** | EPA and private tools cover the workflow; local rainfall/permit design remains safety-critical. |
| Septic systems | PASS | PASS | PASS | **FAIL** | PASS | **FAIL** | Strong free workflow competition plus jurisdictional and public-health dependence. |
| Cooling-tower water management | PASS | **FAIL** | PASS | **FAIL** | PASS | **FAIL** | Core tools are linked variants of one water balance; safe operation requires changing chemistry and microbial-control guidance. |
| Construction dewatering | PASS | PASS | PASS | **FAIL** | **FAIL** | **FAIL** | Free integrated competition, existing hydraulic overlap and site-specific geotechnical risk. |
| Livestock / stockwater systems | PASS | **FAIL** | PASS | **FAIL** | **FAIL** | **FAIL** | Four apparent tools are mainly existing-site formulas assembled around locally controlled standards. |
| Wastewater pump stations | PASS | **FAIL** | PASS | **FAIL** | **FAIL** | **FAIL** | Wet-well additions do not create four independent tools beyond the existing pump workflow. |
| Pond / small-reservoir management | PASS | **FAIL** | PASS | **FAIL** | **FAIL** | **FAIL** | Tool depth relies on simple variants or ecological/product assumptions and competes with mature free calculators. |

No candidate passed all gates. The review therefore stops before implementation, as required.

## Demand and competition evidence

### 1. Water loss / leakage

Repeated searches exist for water audit, water loss control, leak-rate calculation, minimum-night-flow analysis, pressure management and cost of leakage. The high-value utility workflow, however, is already anchored by AWWA's current Free Water Audit Software, which provides a top-down water balance and performance indicators as an industry-standard free tool.

- AWWA Free Water Audit Software: https://www.awwa.org/toolbox/free-water-audit-software/
- AWWA Water Loss Control resources: https://www.awwa.org/resource/water-loss-control/

**Unfilled edge considered:** a friendlier mobile workflow connecting field observations to loss economics. It is not large enough for a separate cluster because a rigorous audit would reproduce the AWWA method, while a household version would reuse current flow measurement, pressure-change, operating-cost and low-pressure/leak troubleshooting logic.

### 2. Commercial building water demand / distribution

Search results repeatedly expose fixture-unit conversion, peak-demand, supply-pipe sizing and drainage-load intent. The results are already dense with free tools offering code-edition or regional methods, unit support and direct sizing outputs.

- Free Plumbing Tools fixture-unit and pipe sizing: https://freeplumbing.tools/
- Ensign pipe sizing / loading units calculator: https://ensign.software/free-calculators/pipe-sizing-loading-units-calculator/
- Build Refs WSFU calculator: https://buildrefs.com/calculators/plumbing/wsfu/
- MEPbase fixture-unit calculator: https://tools.mepbase.com/fixture-unit-calculator

**Unfilled edge considered:** a transparent multi-code comparison. That would require continuous maintenance of licensed or versioned tables and still overlap current pipe-friction, TDH, booster-duty and velocity tools.

### 3. Stormwater / site drainage

Demand is strong across runoff, Rational Method, drainage-pipe, detention-volume and green-infrastructure queries. Competition is unusually strong: EPA provides both a mobile web calculator using local databases and the free open-source SWMM engine; private free planners already combine Rational peak flow, Manning pipe capacity and detention.

- EPA National Stormwater Calculator: https://www.epa.gov/water-research/national-stormwater-calculator
- EPA Storm Water Management Model: https://www.epa.gov/water-research/storm-water-management-model-swmm
- Reuven stormwater drainage calculator: https://reuven.tools/tools/stormwater-drainage/

**Unfilled edge considered:** a small-site preliminary sequence. Its differentiated value is too small after excluding local IDF data, inlet capture, downstream tailwater, permitting and professional design, and the remaining arithmetic overlaps rainwater, storage and pipe tools.

### 4. Septic systems

Tank sizing, percolation rate, drain-field sizing, cost and pump-out timing show clear repeated homeowner and installer intent. Septic Compass already presents these as five connected free tools with standards/formula explanations and mobile use; additional directories publish the same core calculators.

- Septic Compass: https://septic-compass.com/
- VastCalc drain-field calculator: https://vastcalc.com/calculators/construction/drain-field
- Toolgrit septic system calculator: https://www.toolgrit.com/tools/septic-system-calc

**Unfilled edge considered:** a jurisdiction-aware screening workflow. It would need actively maintained local soil, setback, permit, design-flow and public-health rules, so the apparent gap fails the safety/maintenance gate.

### 5. Cooling-tower water management

There is repeat operational intent for cycles of concentration, evaporation, blowdown, makeup, water cost, scale tendency and reuse. Current free tools already cover both single calculations and joined workflows.

- Industrial cooling-tower blowdown and reuse planner: https://simulations4all.com/simulations/industrial-cooling-tower-blowdown-reuse-planner
- CheCalc cooling-tower makeup calculator: https://www.checalc.com/solved/ctmakeup.html
- Reynolds & Bauhm cooling-tower calculator: https://reynoldsbauhm.co.uk/cooling-tower-calculator
- EPA WaterSense at Work: https://www.epa.gov/sites/production/files/2017-02/documents/watersense-at-work_final_508c3.pdf

**Unfilled edge considered:** connect water balance to treatment decisions. The core balance tools are not four independent jobs, and meaningful treatment recommendations would raise changing chemistry, equipment and Legionella-control obligations.

### 6. Construction dewatering

Searches show recurring excavation-inflow, wellpoint, sump-pump, drawdown, discharge and settlement questions. A current free planner already combines excavation geometry, water table, permeability, inflow, method selection and settlement screening.

- Construction Dewatering Quick Planner: https://simulations4all.com/simulations/construction-dewatering-quick-planner

**Unfilled edge considered:** a transparent field sequence. Reliable guidance still requires site pumping tests, aquifer boundaries, soil stratigraphy, settlement review and discharge permissions, while pump and pipe calculations overlap the present site.

### 7. Livestock / stockwater systems

Official design documents and community questions confirm recurring demand around daily herd use, source flow, trough/storage volume, pipeline capacity and solar pumping. USDA/NRCS publishes detailed design workbooks and state-specific supporting tools, while current free solar-pump tools already include livestock-demand and TDH workflows.

- USDA/NRCS North Dakota engineering design tools, including the Stockwater Design workbook: https://www.nrcs.usda.gov/conservation-basics/conservation-by-state/north-dakota/engineering-design-tools-technical-notes
- USDA/NRCS Maryland livestock watering and pipeline workbooks: https://www.nrcs.usda.gov/state-offices/maryland/design-spreadsheets
- USDA/NRCS Livestock Pipeline practice standard: https://www.nrcs.usda.gov/resources/guides-and-instructions/livestock-pipeline-ft-516-conservation-practice-standard
- Cylome solar water-pump sizing tool: https://www.cylome.com/tools/solar-pump

**Unfilled edge considered:** a simpler ranch planning flow. Daily demand is new, but storage, pipeline friction, TDH, pump duty and irrigation supply are already core Water Systems Bench functions. The local NRCS standard explicitly controls design use, so this is a workflow landing page around existing tools rather than a new four-tool cluster.

### 8. Wastewater pump stations

Searches repeat wet-well sizing, pump cycles, retention, force-main velocity, pump duty and operating questions. Free tools and official calculation sheets already cover the central work.

- HydroCalc lift-station design: https://oeihydrocalc.com/lift-stations
- Toolgrit lift-station operations calculator: https://www.toolgrit.com/tools/lift-station-calculator
- Seattle wet-well sizing design guidance: https://www.seattle.gov/documents/departments/spu/engineering/11pumpstationsfinalredacted.pdf

**Unfilled edge considered:** an operator-first wet-well workflow. Wet-well cycling alone is not enough depth; force main, TDH, pump curves, short cycling, storage and cost materially repeat current tools, while wastewater safety and public-works design remain specialist concerns.

### 9. Pond / small-reservoir management

Pond volume, turnover, pump flow, aeration and fish-load searches show repeat use, including recurring community questions about irregular volume and equipment selection. Free competitors already combine the obvious outputs.

- PondCalc pump calculator: https://pondcalc.com/en/pond-pump-calculator
- PondCalc aeration calculator: https://pondcalc.com/en/pond-aeration-calculator
- Aeration Supply pond volume and turnover calculator: https://aerationsupply.com/pages/pond-size-and-volume-calculator
- AquaCalcs pond calculator: https://aquacalcs.com/pond-calculator/

**Unfilled edge considered:** an irregular-geometry and seasonal water-balance workflow. Volume, pump and evaporation are largely variants of current storage/pump tools; aeration and biological loading require site conditions and product performance, leaving insufficient independent depth.

## Closest candidate and final NO-GO reason

Water loss / leakage was the closest candidate because its recurring utility cost and operational intent is strong. It still fails two mandatory gates:

1. **Competition:** AWWA's free audit software is the authoritative workflow, not merely a basic competing calculator.
2. **Existing-site overlap:** after excluding a duplicate utility audit, the remaining household tools are mostly current flow, pressure, cost and troubleshooting calculations with a leakage label.

Livestock / stockwater systems showed the most plausible new audience, but not four independent new tools. It would primarily assemble existing demand, storage, pipeline and pump calculations around local USDA/NRCS criteria.

The remaining candidates fail competition, overlap, tool-depth or safety/maintenance gates more decisively. Publishing any of them now would lower the stated GO threshold.

## Revisit conditions

Reopen expansion research only when at least one of the following creates a materially different evidence base:

- sustained GSC/GA4 queries reveal a recurring, non-branded workflow not served by the 37 current tools;
- user requests repeatedly identify four distinct calculations or decisions in one new workflow;
- a candidate can beat current free tools on a demonstrated missing input, interpretation or cross-step handoff rather than styling alone;
- stable, openly usable source methods replace a currently local, licensed, product-specific or frequently changing dependency;
- a proposed cluster passes all seven gates after another current SERP review.

## Verification

Although this decision changes no production artifact, the current release was rechecked after documenting it:

- calculation regression passed for all current clusters, including 46 greywater numeric/validation checks;
- static QA passed for 74 public pages;
- navigation QA passed for 76 repository HTML documents;
- the recorded real-browser QA passed 370 renders at 390, 768, 1024, 1280 and 1440px, 37 tool interactions and 19 responsive-table checks;
- reported console, page, asset, internal-404, page-overflow and table-clipping failures remained zero;
- public HTML count and sitemap URL count both remained 74;
- `index.html`, `sitemap.xml`, `llms.txt`, site assets, generator and QA implementation were unchanged.

## Change boundary

This NO-GO review intentionally changes documentation only. It does not add routes, update navigation, regenerate HTML, alter CSS/JavaScript, modify `sitemap.xml` or `llms.txt`, or touch the protected homepage badge block. Public page count remains 74 and sitemap count remains 74.
