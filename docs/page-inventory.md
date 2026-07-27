# Page Inventory

**Repository:** https://github.com/canghun13/watersystemsbench

## Status and conventions

This is the first-wave inventory proposal. Every row is `Planned`; none is an implemented or public page. URLs are proposed paths only. “Related” names the primary context links to expose; detail pages should normally show four to six useful links selected from the relevant workflow groups in [information architecture](information-architecture.md).

| Page title | Type | Cluster | Proposed URL | Primary user task | Related tools/guides | Status | Safety or regulatory risk | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Homepage | Core | Sitewide | `/` | Choose a starting workflow | Hubs; key guides | Planned | Low | Explain source-to-use model |
| Tools | Core | Sitewide | `/tools/` | Browse tools by system need | All tool clusters | Planned | Low | Filter/navigation concept only |
| Guides | Core | Sitewide | `/guides/` | Browse practical explainers | Guide clusters | Planned | Low | No guide content yet |
| Reference | Core | Sitewide | `/reference/` | Find units, terms, and tables | Reference pages | Planned | Medium | Cite sources when built |
| About | Core | Sitewide | `/about/` | Understand editorial purpose | Contact; Privacy | Planned | Low | Avoid unsupported claims |
| Contact | Core | Sitewide | `/contact/` | Contact the project | `mailto:canghun13@naver.com` | Planned | Low | Official email only |
| Privacy | Core | Sitewide | `/privacy/` | Understand data practices | Contact | Planned | High | Review after analytics decision |
| Pumps, Pressure & Pipe Flow | Hub | Pumps | `/tools/pumps-pressure-pipe-flow/` | Start pump/pipe workflow | Tools 1–9; guides 1–3 | Planned | Medium | First-wave hub |
| Wells, Boreholes, Storage & Rainwater | Hub | Wells | `/tools/wells-storage-rainwater/` | Plan source and storage | Tools 10–17; guides 4–8 | Planned | Medium | First-wave hub |
| Irrigation & Sprinkler Systems | Hub | Irrigation | `/tools/irrigation-sprinkler/` | Plan irrigation zones | Tools 18–24; guides 9–11 | Planned | Medium | First-wave hub |
| Water Treatment & Water Quality | Hub | Treatment | `/tools/water-treatment-quality/` | Choose treatment workflow | Tools 25–32; guides 12–14 | Planned | High | First-wave hub |

## Tools (32)

| # | Page title | Primary type | Cluster | Proposed URL | Primary user task | Related tools/guides | Status | Risk | Notes |
| -: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Total Dynamic Head Calculator | Calculator | Pumps | `/tools/total-dynamic-head-calculator/` | Estimate pump head | 2, 6, guide 1 | Planned | Medium | Validate elevation/friction assumptions |
| 2 | Pipe Friction Loss Calculator | Calculator | Pumps | `/tools/pipe-friction-loss-calculator/` | Estimate pipe loss | 1, 3, guide 1 | Planned | Medium | Material and flow inputs matter |
| 3 | Water Pipe Size & Velocity Checker | Calculator | Pumps | `/tools/water-pipe-size-velocity-checker/` | Check pipe velocity | 2, 18, guide 1 | Planned | Medium | Not a code approval |
| 4 | Pump Power & Efficiency Calculator | Calculator | Pumps | `/tools/pump-power-efficiency-calculator/` | Estimate power | 1, 6, guide 1 | Planned | Medium | Use realistic efficiency range |
| 5 | Booster Pump Duty Point Estimator | Estimator | Pumps | `/tools/booster-pump-duty-point-estimator/` | Estimate booster duty | 1, 6, guide 3 | Planned | Medium | Requires manufacturer curve review |
| 6 | Pump Curve Duty Point Comparator | Comparator | Pumps | `/tools/pump-curve-duty-point-comparator/` | Compare duty and curve | 1, 4, guide 2 | Planned | High | Do not imply equipment selection approval |
| 7 | NPSH Available Calculator | Calculator | Pumps | `/tools/npsh-available-calculator/` | Check suction margin | 6, 10, guide 2 | Planned | High | Cavitation risk requires review |
| 8 | Pump Operating Cost Comparator | Comparator | Pumps | `/tools/pump-operating-cost-comparator/` | Compare operating cost | 4, 6, guide 2 | Planned | Low | Make energy assumptions visible |
| 9 | Low Water Pressure Troubleshooter | Troubleshooter | Pumps | `/tools/low-water-pressure-troubleshooter/` | Diagnose low pressure | 2, 5, guide 3 | Planned | Medium | Route urgent hazards to professionals |
| 10 | Well & Borehole Pump Sizing Planner | Planner | Wells | `/tools/well-borehole-pump-sizing-planner/` | Plan source pump | 11, 1, guide 5 | Planned | High | Site yield and drawdown need validation |
| 11 | Well Yield vs Demand Checker | Checker | Wells | `/tools/well-yield-demand-checker/` | Check yield against demand | 10, 14, guide 5 | Planned | Medium | Seasonal availability caveat |
| 12 | Pressure Tank Sizing Calculator | Calculator | Wells | `/tools/pressure-tank-sizing-calculator/` | Size pressure tank | 13, 10, guide 6 | Planned | Medium | Manufacturer drawdown varies |
| 13 | Pump Short-Cycling Analyzer | Analyzer | Wells | `/tools/pump-short-cycling-analyzer/` | Assess cycling symptoms | 12, 10, guide 6 | Planned | Medium | Electrical/mechanical safety note |
| 14 | Water Storage Tank Sizing Planner | Planner | Wells | `/tools/water-storage-tank-sizing-planner/` | Plan stored volume | 11, 15, guide 7 | Planned | Medium | Demand/outage assumptions explicit |
| 15 | Rainwater Harvesting Yield Calculator | Calculator | Rainwater | `/tools/rainwater-harvesting-yield-calculator/` | Estimate harvest | 14, 16, guide 8 | Planned | Medium | Rainfall source must be identified |
| 16 | Rainwater Tank Days-of-Supply Simulator | Simulator | Rainwater | `/tools/rainwater-tank-days-of-supply-simulator/` | Model storage duration | 15, 14, guide 8 | Planned | Medium | Not a potable-water guarantee |
| 17 | First Flush Diverter Sizing Calculator | Calculator | Rainwater | `/tools/first-flush-diverter-sizing-calculator/` | Estimate first flush | 15, 32, guide 8 | Planned | Medium | Local guidance varies |
| 18 | Available Water Flow Test Calculator | Checker | Irrigation | `/tools/available-water-flow-test-calculator/` | Check available flow | 19, 3, guide 9 | Planned | Medium | Test method limitations visible |
| 19 | Sprinkler Zone Capacity Planner | Planner | Irrigation | `/tools/sprinkler-zone-capacity-planner/` | Plan zones | 18, 20, guide 10 | Planned | Medium | Account for pressure losses |
| 20 | Sprinkler Precipitation Rate Calculator | Calculator | Irrigation | `/tools/sprinkler-precipitation-rate-calculator/` | Calculate application rate | 19, 21, guide 10 | Planned | Medium | Match actual nozzle data |
| 21 | Irrigation Runtime & Water Depth Planner | Planner | Irrigation | `/tools/irrigation-runtime-water-depth-planner/` | Plan runtime/depth | 20, 22, guide 10 | Planned | Medium | Climate and soil context needed |
| 22 | Drip Irrigation Flow & Zone Calculator | Calculator | Irrigation | `/tools/drip-irrigation-flow-zone-calculator/` | Calculate drip zone flow | 18, 19, guide 10 | Planned | Medium | Use product emitter data |
| 23 | Irrigation Pump & Zone Matcher | Planner | Irrigation | `/tools/irrigation-pump-zone-matcher/` | Match pump and zone | 1, 6, guide 11 | Planned | Medium | Confirm actual pump curve |
| 24 | Sprinkler Low-Pressure Troubleshooter | Troubleshooter | Irrigation | `/tools/sprinkler-low-pressure-troubleshooter/` | Diagnose weak zone | 18, 2, guide 11 | Planned | Medium | Avoid unsafe DIY electrical work |
| 25 | Water Softener Sizing Calculator | Calculator | Treatment | `/tools/water-softener-sizing-calculator/` | Estimate softener size | 26, 32, guide 13 | Planned | Medium | Water test and local requirements |
| 26 | Softener Salt & Regeneration Planner | Planner | Treatment | `/tools/softener-salt-regeneration-planner/` | Plan regeneration | 25, 32, guide 13 | Planned | Medium | Discharge constraints vary |
| 27 | RO Recovery & Reject Water Calculator | Calculator | Treatment | `/tools/ro-recovery-reject-water-calculator/` | Estimate RO streams | 28, 32, guide 14 | Planned | High | Wastewater/discharge caveat |
| 28 | RO Production vs Demand Planner | Selector | Treatment | `/tools/ro-production-demand-planner/` | Choose production approach | 27, 14, guide 14 | Planned | High | Requires feed-water review |
| 29 | Media Filter Loading Rate Calculator | Calculator | Treatment | `/tools/media-filter-loading-rate-calculator/` | Calculate loading rate | 32, 25, guide 13 | Planned | Medium | Media specifications vary |
| 30 | Chlorine Dose & Solution Volume Calculator | Calculator | Treatment | `/tools/chlorine-dose-solution-volume-calculator/` | Estimate dose volume | 31, 32, guide 14 | Planned | High | Chemical safety and legal limits |
| 31 | Disinfection Contact Time Calculator | Calculator | Treatment | `/tools/disinfection-contact-time-calculator/` | Check contact time | 30, 32, guide 14 | Planned | High | Not a compliance determination |
| 32 | Water Treatment Train Selector | Selector | Treatment | `/tools/water-treatment-train-selector/` | Explore treatment sequence | 25–31, guides 12–14 | Planned | High | Must not prescribe regulated design |

## Guides (14)

| # | Page title | Type | Cluster | Proposed URL | Primary user task | Related tools | Status | Risk | Notes |
| -: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | How to Size a Water Pump from Flow and Total Dynamic Head | Guide | Pumps | `/guides/size-water-pump-flow-tdh/` | Understand pump sizing | 1–4 | Planned | Medium | Explain inputs and limits |
| 2 | How to Read a Pump Curve and Find the Duty Point | Guide | Pumps | `/guides/read-pump-curve-duty-point/` | Interpret curve | 5–7 | Planned | High | Manufacturer data required |
| 3 | How to Diagnose Low Water Pressure Without Guessing | Guide | Pumps | `/guides/diagnose-low-water-pressure/` | Follow diagnosis flow | 2, 5, 9 | Planned | Medium | Safety escalation |
| 4 | Well vs Borehole vs Tube Well: Global Terminology | Guide | Wells | `/guides/well-borehole-tube-well-terms/` | Understand terms | 10, 11 | Planned | Low | Regional language differences |
| 5 | Complete Well Water System Planning Workflow | Guide | Wells | `/guides/well-water-system-planning/` | Plan well system | 10–14 | Planned | High | Local permitting caveat |
| 6 | Pressure Tank Settings, Drawdown and Short Cycling | Guide | Wells | `/guides/pressure-tank-drawdown-short-cycling/` | Diagnose cycling | 12, 13 | Planned | Medium | Electrical safety |
| 7 | How to Size Water Storage for Demand, Outages and Refill | Guide | Wells | `/guides/size-water-storage/` | Plan storage | 11, 14 | Planned | Medium | Service reliability varies |
| 8 | Rainwater Harvesting System Planning: Roof to End Use | Guide | Rainwater | `/guides/rainwater-system-planning/` | Plan rainwater system | 15–17, 32 | Planned | High | Potable use requirements vary |
| 9 | How to Measure Irrigation Flow and Dynamic Pressure | Guide | Irrigation | `/guides/measure-irrigation-flow-pressure/` | Test supply | 18, 3 | Planned | Medium | Safe test steps |
| 10 | How to Split Sprinklers into Practical Zones | Guide | Irrigation | `/guides/split-sprinkler-zones/` | Zone irrigation | 19–23 | Planned | Medium | Design constraints vary |
| 11 | How to Troubleshoot a Low-Pressure Sprinkler Zone | Guide | Irrigation | `/guides/troubleshoot-low-pressure-sprinkler-zone/` | Diagnose zone | 18, 24 | Planned | Medium | Electrical safety |
| 12 | How to Read a Water Test Report | Guide | Treatment | `/guides/read-water-test-report/` | Interpret report | 32, reference 7 | Planned | High | Laboratory/context limits |
| 13 | Sediment Filter vs Carbon Filter vs Softener vs RO vs UV | Guide | Treatment | `/guides/filter-softener-ro-uv-comparison/` | Compare technologies | 25, 29, 32 | Planned | High | Health claims require sources |
| 14 | How to Build a Water Treatment Train Without Over-Treating | Guide | Treatment | `/guides/build-water-treatment-train/` | Sequence treatment | 27–32 | Planned | High | No universal prescription |

## Reference (8)

| # | Page title | Type | Cluster | Proposed URL | Primary user task | Related tools/guides | Status | Risk | Notes |
| -: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Water Flow, Pressure and Volume Unit Conversion Tables | Reference | Sitewide | `/reference/water-unit-conversions/` | Convert units | Tools 1–32 | Planned | Low | Verify conversion constants |
| 2 | Water Pressure and Head Conversion Reference | Reference | Pumps | `/reference/pressure-head-conversion/` | Relate pressure/head | 1, 5 | Planned | Low | State water-temperature assumption |
| 3 | Hazen-Williams C Values by Pipe Material | Reference | Pumps | `/reference/hazen-williams-c-values/` | Select coefficient context | 2, 3 | Planned | Medium | Cite source; values are assumptions |
| 4 | Common Water Pipe Internal Diameter Reference | Reference | Pumps | `/reference/water-pipe-internal-diameters/` | Check actual ID | 2, 3 | Planned | Medium | Product schedules vary |
| 5 | Pump Formulas and Hydraulic Terms | Reference | Pumps | `/reference/pump-formulas-hydraulic-terms/` | Understand formulas | 1–8 | Planned | Medium | Define boundaries |
| 6 | Water Demand Planning Factors and Safety Margins | Reference | Wells | `/reference/water-demand-planning-factors/` | Plan demand | 11, 14, 28 | Planned | Medium | Do not present universal defaults |
| 7 | Water Quality Parameter Glossary | Reference | Treatment | `/reference/water-quality-glossary/` | Understand test terms | guide 12, 32 | Planned | High | Health statements need sources |
| 8 | Water Treatment Technology Comparison Matrix | Reference | Treatment | `/reference/water-treatment-comparison-matrix/` | Compare treatment | guides 13–14, 32 | Planned | High | Jurisdiction/use dependent |

## Count check

| Category | Planned pages |
| --- | ---: |
| Core pages | 7 |
| First-wave hubs | 4 |
| Tools | 32 |
| Guides | 14 |
| Reference pages | 8 |
| Total public HTML pages | 65 |
