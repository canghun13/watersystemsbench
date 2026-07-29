# Water Treatment & Water Quality Implementation Specification

## Release scope

Implemented on 2026-07-29 as the fourth and final first-wave cluster.

- Hub: `/systems/water-treatment-quality/`
- Tools: 8
- Guides: 3
- References: 2
- New public pages: 14
- Site total after release: 65

The hub route is `/systems/water-treatment-quality/`. It supersedes the earlier planning-only `/tools/water-treatment-quality/` route.

## Tools

1. Water Softener Sizing Calculator
2. Softener Salt & Regeneration Planner
3. RO Recovery & Reject Water Calculator
4. RO Production vs Demand Planner
5. Media Filter Loading Rate Calculator
6. Chlorine Dose & Solution Volume Calculator
7. Disinfection Contact Time Calculator
8. Water Treatment Train Selector

## Content

- Guides: read a water test report; compare sediment filter/carbon/softener/RO/UV; build a treatment train without over-treating.
- References: water-quality parameter glossary; water-treatment technology comparison matrix.
- All pages connect testing, intended use, candidate stages, hydraulic/storage constraints and verification.

## Calculation contract

- Hardness conversion: `1 grain/US gal = 17.118061 mg/L as CaCO₃`.
- Softener capacity: adjusted daily grain load × service days, with an explicit reserve.
- Regeneration: user-entered usable capacity and salt dose; reserve reduces service capacity.
- RO recovery: permeate ÷ feed; reject = feed − permeate.
- RO production: rated production × user-entered correction factors × actual/rating hours.
- Media loading: flow ÷ total filter area; circular vessel area uses `πd²/4`.
- Chemical solution: user-entered net dose × treated volume ÷ active concentration.
- CT: measured residual × nominal contact time × user-entered baffling factor.
- Selector: transparent rules returning candidate stages, tests, reasons, constraints and urgent flags.

## Non-negotiable boundaries

- No default or recommended chlorine dose.
- No default or recommended CT target.
- No claim of drinking-water safety, treatment efficacy, certified reduction, compliance or approved design.
- Product density is required for percent-by-weight solution calculations.
- Laboratory context, certified product claims, current manufacturer data, local requirements and follow-up testing remain outside the arithmetic.
- Positive microbiological evidence requires an alternate safe-source/public-authority message.
- Chemical handling warns against incompatible mixing and directs users to the product label and SDS.

## Verification contract

- 65 independent treatment numeric/validation checks
- 15 independent selector scenarios
- Existing calculation regression retained
- 65 public pages across 390, 768, 1024, 1280 and 1440 px: 325 render checks
- All eight treatment tools: calculate/select, invalid path where applicable, reset, relevant unit/mode changes, copy and print
- Exact sitemap and category parity
- Zero console errors, page errors, missing assets, internal 404s and horizontal overflows

## Source classes

Primary source mapping uses U.S. EPA, CDC, NSF, WHO and USGS material for private-well testing, home treatment, treatment processes, softening, RO, disinfection/CT, certified claims, drinking-water guidance and terminology. Current jurisdictional requirements and exact product data take precedence for a real project.
