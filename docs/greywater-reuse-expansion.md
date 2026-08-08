# Greywater Reuse Planning Expansion

## Decision record

- Repository: https://github.com/canghun13/watersystemsbench
- Starting commit: `afd187a310a4f1e0ebdc4a9c9ef17684a5601fd1`
- Starting state: clean `main`, 65 public pages, 32 tools, 14 guides and 8 references
- Protected area: the complete user-managed directory-badge block below the homepage footer
- Operating principle: `Insufficient long-term analytics is not currently a blocker for validated aggressive expansion.`

## Existing system map and gap

```text
Source
→ Wells / Rainwater
→ Storage
→ Pumping
→ Pipe transport
→ Irrigation / use
→ Water treatment
→ Water quality
```

The initial site covers source quantity, hydraulics, irrigation application and water treatment. It does not yet connect household non-potable wastewater generation to a safe, local-rule-dependent reuse workflow. Greywater is therefore a genuine bridge between water source conservation, irrigation demand, plumbing separation and water-quality boundaries.

## Candidate evaluation

Scores use Monetization 40 + Traffic/search demand 35 + Competitive gap 25.

| Candidate | Monetization | Demand | Gap | Total | Decision |
| --- | ---: | ---: | ---: | ---: | --- |
| Greywater reuse planning | 34 | 29 | 21 | 84 | Selected: five independent tool intents and strong connection to three existing clusters. |
| Water loss and leakage | 36 | 31 | 16 | 83 | Rejected for this release: household leak arithmetic and utility water-audit workflows split the primary user too sharply; AWWA already supplies an authoritative free audit tool. |
| Septic systems | 35 | 30 | 14 | 79 | Rejected: strong demand, but drain-field and tank sizing are highly jurisdictional and several polished free calculators already rank. |
| Stormwater drainage | 37 | 31 | 10 | 78 | Rejected: dense free-tool competition and preliminary Rational/Manning tools can be mistaken for permit design. |
| Commercial building water systems | 34 | 28 | 10 | 72 | Rejected: fixture-unit and pipe-sizing results depend on licensed code tables and many current free tools compete directly. |
| Pond / reservoir management | 31 | 25 | 15 | 71 | Rejected: useful volume and aeration intents exist, but topical fit and connected workflow are weaker. |
| Wastewater pump stations | 29 | 21 | 17 | 67 | Rejected: professional demand is narrower and wet-well/force-main work overlaps existing pump, TDH and friction tools. |

### Demand and competition evidence

- Greywater searches expose recurring supply, irrigation matching, tank/surge, laundry-to-landscape and savings intents. Existing free results generally combine rough household assumptions into one result; few expose a measurement-first sequence with local-rule gates.
- The San Francisco Public Utilities Commission publishes a full Graywater Design Manual and laundry-to-landscape program, confirming a real design workflow rather than a renamed water-use calculator.
- Washington State Department of Health bases greywater design and management mainly on source and volume, and warns that local jurisdictions may be more restrictive.
- EPA WaterSense publishes a landscape water-budget method based on local reference evapotranspiration, plant type, area, rainfall and irrigation efficiency.
- Competing greywater calculators found during the review include Crop Circle Farms, SpeedCalcs, CalcBee, Starlight Tools and TradeCalculator. They validate intent but mostly present one general estimator, regional default assumptions, or a single stored-reuse scenario.

## Final candidate contract

```text
Candidate: Greywater Reuse Planning
Primary user: Homeowners, landscape planners, water-efficiency practitioners and preliminary residential designers
Core problem: Match measured reusable household water to an allowed non-potable use without overwatering, ponding, cross-connection or hidden cost assumptions
Primary keywords/intents: greywater calculator; graywater system sizing; greywater irrigation calculator; laundry to landscape design; greywater savings calculator
Long-tail opportunities: shower greywater volume; laundry outlet count; mulch basin surge capacity; greywater versus landscape ET demand; greywater payback with sewer tariff
Existing competitors: Crop Circle Farms, SpeedCalcs, CalcBee, Starlight Tools, TradeCalculator and regional agency worksheets/manuals
Competitive gap: A connected, transparent supply → demand → distribution → surge → economics workflow with SI/US inputs and explicit regulatory gates
Existing Water Systems Bench overlap: Uses existing volume, rainfall and area conversions, but no current tool calculates household greywater generation, event distribution, basin acceptance or reuse economics
Why users would use this instead of a manufacturer page: The workflow is product-neutral and keeps source measurement, irrigation demand, local rules and diversion constraints visible
Monetization potential: Strong adjacency to plumbers, greywater installers, irrigation suppliers, diverter/valve products, treatment equipment and water-efficiency services
Traffic potential: Multiple recurring calculator and how-to intents, plus greywater/graywater spelling variants and laundry-to-landscape long tails
Risk: Public-health, cross-connection and jurisdictional variation; controlled by excluding potable reuse, never selecting a legal system type, and requiring local review
Final decision: Implement one hub, five tools, two guides and one reference
```

## Implemented route and tool contracts

### Hub

- `/systems/greywater-reuse/`

### Tools

1. `/tools/greywater-supply-calculator/` — Calculator
   - Intent: estimate measured household greywater supply.
   - Inputs: occupants, shower flow/minutes, bath volume, laundry volume/loads, basin volume, capture factor.
   - Outputs: source breakdown, raw and usable daily/weekly supply.
   - Boundary: excludes toilets, potable approval and automatic source permission.
2. `/tools/greywater-irrigation-demand-planner/` — Planner
   - Intent: compare reusable supply with ET-based landscape demand.
   - Logic: `gross demand = max(0, ETo × plant factor − effective rainfall) × area / efficiency`.
   - Outputs: demand, supply, coverage, balance and supported area.
3. `/tools/laundry-to-landscape-zone-planner/` — Planner
   - Intent: distribute one washing-machine event across whole outlets.
   - Logic: event volume/outlets plus feasible outlet range from user-entered minimum and maximum volume.
   - Boundary: no universal plant/basin target and no potable cross-connection.
4. `/tools/greywater-surge-basin-checker/` — Checker
   - Intent: screen event volume against entered basin void capacity and measured infiltration over an entered drain-down window.
   - Boundary: stops at preliminary volume checking; field observation and local setbacks govern.
5. `/tools/greywater-reuse-savings-calculator/` — Calculator
   - Intent: estimate water/sewer charge savings and simple payback using user-entered tariffs and sewer-offset rules.
   - Boundary: no invented tariff, rebate, financing or lifecycle assumption.

Each tool supports SI-first and US customary input, validation, stale-result clearing, reset, copy, print, accessible live results, worked example, formula explanation, limitations, safety notes, sources and workflow links.

### Guides

- `/guides/plan-home-greywater-reuse-system/`
- `/guides/troubleshoot-greywater-irrigation/`

### Reference

- `/reference/greywater-source-use-screening/`

## Primary sources

- San Francisco Public Utilities Commission — Graywater Design Manual: https://www.sfpuc.gov/documents/graywater-design-manual
- Washington State Department of Health — Greywater Reuse: https://doh.wa.gov/community-and-environment/wastewater-management/greywater-reuse
- US EPA WaterSense — Water Budget Tool: https://www.epa.gov/watersense/water-budget-tool
- US EPA — Non-potable Environmental and Economic Water Reuse Calculator methods: https://www.epa.gov/sites/default/files/widgets/newr-calculator/resources.html
- Australian Government — Australian Guidelines for Water Recycling: https://www.waterquality.gov.au/guidelines/recycled-water

Regional examples are identified as examples, not global rules. No page presents greywater as potable or automatically legal.
