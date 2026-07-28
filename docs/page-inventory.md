# Page Inventory

**Repository:** https://github.com/canghun13/watersystemsbench

## Status and conventions

This inventory distinguishes the implemented Phase 1 and Phase 2 pages from the remaining plan.

- Planned total: 65
- Implemented public HTML: 40
- Remaining planned: 25
- Implemented basic pages: 7
- Implemented system hubs: 2
- Implemented tools: 17
- Implemented guides: 8
- Implemented reference pages: 6

“Related” names the primary context links to expose; detail pages normally show four to six useful links selected from the relevant workflow groups in [information architecture](information-architecture.md).

| Page title | Type | Cluster | Proposed URL | Primary user task | Related tools/guides | Status | Safety or regulatory risk | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Homepage | Core | Sitewide | `/` | Choose a starting workflow | Hubs; key guides | Implemented | Low | Source-to-use model published |
| Tools | Core | Sitewide | `/tools/` | Browse tools by system need | All implemented tools | Implemented | Low | 17 working tools |
| Guides | Core | Sitewide | `/guides/` | Browse practical explainers | Guide clusters | Implemented | Low | Eight guides |
| Reference | Core | Sitewide | `/reference/` | Find units, terms, and tables | Reference pages | Implemented | Medium | Six sourced references |
| About | Core | Sitewide | `/about/` | Understand editorial purpose | Contact; Privacy | Implemented | Low | Editorial limits stated |
| Contact | Core | Sitewide | `/contact/` | Contact the project | `mailto:canghun13@naver.com` | Implemented | Low | Official email only; no form |
| Privacy | Core | Sitewide | `/privacy/` | Understand data practices | Contact | Implemented | High | Reflects GA4 and current static site |
| Pumps, Pressure & Pipe Flow | Hub | Pumps | `/systems/pumps-pressure-pipe/` | Start pump/pipe workflow | Tools 1–9; guides 1–3 | Implemented | Medium | Phase 1 system hub |
| Wells, Boreholes, Storage & Rainwater | Hub | Wells | `/systems/wells-storage-rainwater/` | Plan source and storage | Tools 10–17; guides 4–8 | Implemented | Medium | Phase 2 system hub |
| Irrigation & Sprinkler Systems | Hub | Irrigation | `/systems/irrigation-sprinklers/` | Plan irrigation zones | Tools 18–24; guides 9–11 | Specification complete | Medium | Implementation not started; see `docs/irrigation-sprinkler-spec.md` |
| Water Treatment & Water Quality | Hub | Treatment | `/tools/water-treatment-quality/` | Choose treatment workflow | Tools 25–32; guides 12–14 | Planned | High | First-wave hub |

## Tools (32)

| # | Page title | Primary type | Cluster | Proposed URL | Primary user task | Related tools/guides | Status | Risk | Notes |
| -: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Total Dynamic Head Calculator | Calculator | Pumps | `/tools/total-dynamic-head-calculator/` | Estimate pump head | 2, 6, guide 1 | Implemented | Medium | Gauge/absolute pressure boundary stated |
| 2 | Pipe Friction Loss Calculator | Calculator | Pumps | `/tools/pipe-friction-loss-calculator/` | Estimate pipe loss | 1, 3, guide 1 | Implemented | Medium | Hazen–Williams and Darcy–Weisbach |
| 3 | Water Pipe Size & Velocity Checker | Checker | Pumps | `/tools/water-pipe-size-velocity-checker/` | Check pipe velocity | 2, guide 1 | Implemented | Medium | Neutral screening; not code approval |
| 4 | Pump Power & Efficiency Calculator | Calculator | Pumps | `/tools/pump-power-efficiency-calculator/` | Estimate power | 1, 6, guide 1 | Implemented | Medium | Efficiency validation included |
| 5 | Booster Pump Duty Point Estimator | Estimator | Pumps | `/tools/booster-pump-duty-point-estimator/` | Estimate booster duty | 1, 6, guide 3 | Implemented | Medium | Manufacturer curve review required |
| 6 | Pump Curve Duty Point Comparator | Comparator | Pumps | `/tools/pump-curve-duty-point-comparator/` | Compare duty and curve | 1, 4, guide 2 | Implemented | High | Interpolation only; no extrapolation |
| 7 | NPSH Available Calculator | Calculator | Pumps | `/tools/npsh-available-calculator/` | Check suction margin | 6, guide 2 | Implemented | High | Absolute pressure and vapor pressure handled |
| 8 | Pump Operating Cost Comparator | Comparator | Pumps | `/tools/pump-operating-cost-comparator/` | Compare operating cost | 4, 6, guide 2 | Implemented | Low | User-entered tariff; three scenarios |
| 9 | Low Water Pressure Troubleshooter | Troubleshooter | Pumps | `/tools/low-water-pressure-troubleshooter/` | Diagnose low pressure | 2, 5, guide 3 | Implemented | Medium | Cause groups, not confirmed diagnosis |
| 10 | Well & Borehole Pump Sizing Planner | Planner | Wells | `/tools/well-borehole-pump-sizing-planner/` | Plan source pump | 11, 1, guide 5 | Implemented | High | Pump setting kept separate from TDH |
| 11 | Well Yield vs Demand Checker | Checker | Wells | `/tools/well-yield-demand-checker/` | Check yield against demand | 10, 14, guide 5 | Implemented | Medium | Average and peak gaps separated |
| 12 | Pressure Tank Sizing Calculator | Calculator | Wells | `/tools/pressure-tank-sizing-calculator/` | Size pressure tank | 13, 10, guide 6 | Implemented | Medium | Absolute-pressure drawdown relation |
| 13 | Pump Short-Cycling Analyzer | Analyzer | Wells | `/tools/pump-short-cycling-analyzer/` | Assess cycling symptoms | 12, 10, guide 6 | Implemented | Medium | Zero and high demand handled |
| 14 | Water Storage Tank Sizing Planner | Planner | Wells | `/tools/water-storage-tank-sizing-planner/` | Plan stored volume | 11, 15, guide 7 | Implemented | Medium | No-refill and partial-refill cases |
| 15 | Rainwater Harvesting Yield Calculator | Calculator | Rainwater | `/tools/rainwater-harvesting-yield-calculator/` | Estimate harvest | 14, 16, guide 8 | Implemented | Medium | Fixed and proportional losses |
| 16 | Rainwater Tank Days-of-Supply Simulator | Simulator | Rainwater | `/tools/rainwater-tank-days-of-supply-simulator/` | Model storage duration | 15, 14, guide 8 | Implemented | Medium | 365 daily sequential steps |
| 17 | First Flush Diverter Sizing Calculator | Calculator | Rainwater | `/tools/first-flush-diverter-sizing-calculator/` | Estimate first flush | 15, guide 8 | Implemented | Medium | Two explicit local-rule modes |
| 18 | Available Water Flow Test Calculator | Checker | Irrigation | `/tools/available-water-flow-test-calculator/` | Check available flow | 19, 3, guide 9 | Specification complete | Medium | Implementation not started; repeat timed-container/meter trials |
| 19 | Sprinkler Zone Capacity Planner | Planner | Irrigation | `/tools/sprinkler-zone-capacity-planner/` | Plan zones | 18, 20, guide 10 | Specification complete | Medium | Implementation not started; separate flow and pressure checks |
| 20 | Sprinkler Precipitation Rate Calculator | Calculator | Irrigation | `/tools/sprinkler-precipitation-rate-calculator/` | Calculate application rate | 19, 21, guide 10 | Specification complete | Medium | Implementation not started; total-area and repeated-spacing modes |
| 21 | Irrigation Runtime & Water Depth Planner | Planner | Irrigation | `/tools/irrigation-runtime-water-depth-planner/` | Plan runtime/depth | 20, 22, guide 10 | Specification complete | Medium | Implementation not started; efficiency, events and cycles explicit |
| 22 | Drip Irrigation Flow & Zone Calculator | Calculator | Irrigation | `/tools/drip-irrigation-flow-zone-calculator/` | Calculate drip zone flow | 18, 19, guide 10 | Specification complete | Medium | Implementation not started; direct-count and row-layout modes |
| 23 | Irrigation Pump & Zone Matcher | Planner | Irrigation | `/tools/irrigation-pump-zone-matcher/` | Match pump and zone | 1, 6, guide 11 | Specification complete | Medium | Implementation not started; single duty-condition screen only |
| 24 | Sprinkler Low-Pressure Troubleshooter | Troubleshooter | Irrigation | `/tools/sprinkler-low-pressure-troubleshooter/` | Diagnose weak zone | 18, 2, guide 11 | Specification complete | Medium | Implementation not started; cause groups, not diagnosis |
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
| 1 | How to Size a Water Pump from Flow and Total Dynamic Head | Guide | Pumps | `/guides/how-to-size-a-water-pump/` | Understand pump sizing | 1–4 | Implemented | Medium | Slug aligned to Phase 1 brief |
| 2 | How to Read a Pump Curve and Find the Duty Point | Guide | Pumps | `/guides/how-to-read-a-pump-curve/` | Interpret curve | 5–7 | Implemented | High | Manufacturer data required |
| 3 | How to Diagnose Low Water Pressure Without Guessing | Guide | Pumps | `/guides/how-to-diagnose-low-water-pressure/` | Follow diagnosis flow | 2, 5, 9 | Implemented | Medium | Safety escalation included |
| 4 | Well, Borehole & Tube Well Terminology | Guide | Wells | `/guides/well-borehole-tube-well-terminology/` | Understand terms | 10, 11 | Implemented | Low | Regional language differences |
| 5 | Complete Well Water System Planning | Guide | Wells | `/guides/complete-well-water-system-planning/` | Plan well system | 10–14 | Implemented | High | Local permitting caveat |
| 6 | Pressure Tank Drawdown & Pump Short Cycling | Guide | Wells | `/guides/pressure-tank-drawdown-short-cycling/` | Diagnose cycling | 12, 13 | Implemented | Medium | Electrical and pressure safety |
| 7 | Water Storage for Demand, Outages & Refill | Guide | Wells | `/guides/water-storage-demand-outages-refill/` | Plan storage | 11, 14 | Implemented | Medium | Service reliability varies |
| 8 | Rainwater Harvesting System Planning | Guide | Rainwater | `/guides/rainwater-harvesting-system-planning/` | Plan rainwater system | 15–17 | Implemented | High | Potable use requirements vary |
| 9 | How to Measure Irrigation Flow and Dynamic Pressure | Guide | Irrigation | `/guides/measure-irrigation-flow-pressure/` | Test supply | 18, 3 | Specification complete | Medium | Implementation not started; safe repeatable field methods |
| 10 | How to Split Sprinklers into Practical Zones | Guide | Irrigation | `/guides/split-sprinkler-zones/` | Zone irrigation | 19–23 | Specification complete | Medium | Implementation not started; flow, pressure and layout separated |
| 11 | How to Troubleshoot a Low-Pressure Sprinkler Zone | Guide | Irrigation | `/guides/troubleshoot-low-pressure-sprinkler-zone/` | Diagnose zone | 18, 24 | Specification complete | Medium | Implementation not started; electrical and pressure safety |
| 12 | How to Read a Water Test Report | Guide | Treatment | `/guides/read-water-test-report/` | Interpret report | 32, reference 7 | Planned | High | Laboratory/context limits |
| 13 | Sediment Filter vs Carbon Filter vs Softener vs RO vs UV | Guide | Treatment | `/guides/filter-softener-ro-uv-comparison/` | Compare technologies | 25, 29, 32 | Planned | High | Health claims require sources |
| 14 | How to Build a Water Treatment Train Without Over-Treating | Guide | Treatment | `/guides/build-water-treatment-train/` | Sequence treatment | 27–32 | Planned | High | No universal prescription |

## Reference (8)

| # | Page title | Type | Cluster | Proposed URL | Primary user task | Related tools/guides | Status | Risk | Notes |
| -: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Water Flow, Pressure and Volume Unit Conversion Tables | Reference | Sitewide | `/reference/water-flow-pressure-volume-conversions/` | Convert units | Tools 1–9 | Implemented | Low | Consolidated conversion page |
| 2 | Water Pressure and Head Conversion Reference | Reference | Pumps | `/reference/water-pressure-head-conversion/` | Relate pressure/head | 1, 5 | Implemented | Low | Density and temperature context |
| 3 | Hazen-Williams C Values by Pipe Material | Reference | Pumps | `/reference/hazen-williams-c-values/` | Select coefficient context | 2, 3 | Implemented | Medium | Values framed as preliminary ranges |
| 4 | Common Water Pipe Internal Diameter Reference | Reference | Pumps | `/reference/water-pipe-internal-diameters/` | Check actual ID | 2, 3 | Implemented | Medium | Manufacturer table and caveat |
| 5 | Pump Formulas and Hydraulic Terms | Reference | Pumps | `/reference/pump-formulas-hydraulic-terms/` | Understand formulas | 1–8 | Implemented | Medium | Formula conditions included |
| 6 | Water Demand Planning Factors | Reference | Wells | `/reference/water-demand-planning-factors/` | Plan demand | 11, 14, 16 | Implemented | Medium | No universal defaults |
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

## Implementation count

| Category | Implemented | Remaining planned |
| --- | ---: | ---: |
| Core pages | 7 | 0 |
| System hubs | 2 | 2 |
| Tools | 17 | 15 |
| Guides | 8 | 6 |
| Reference pages | 6 | 2 |
| Total | 40 | 25 |

## Irrigation specification projection

The Irrigation & Sprinkler Systems cluster is fully specified in `docs/irrigation-sprinkler-spec.md` but has no implemented public route. After a future implementation and successful QA, the projected inventory is:

| Category | Projected implemented | Projected remaining |
| --- | ---: | ---: |
| Core pages | 7 | 0 |
| System hubs | 3 | 1 |
| Tools | 24 | 8 |
| Guides | 11 | 3 |
| Reference pages | 6 | 2 |
| Total | 51 | 14 |
