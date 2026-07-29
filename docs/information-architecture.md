# Information Architecture

## Third implemented system hub

`/systems/irrigation-sprinklers/` is now a live system hub. It connects measured supply, sprinkler-zone capacity, pipe/pump checks, precipitation, runtime, drip flow and low-pressure triage. The shared Systems menu lists Pumps, Wells/Storage/Rainwater and Irrigation/Sprinklers only; no Water Treatment route is published.

**Repository:** https://github.com/canghun13/watersystemsbench

## Navigation model

The information architecture follows the water-system workflow rather than isolating tools by format. Core navigation exposes Tools, Guides, Reference, About, Contact, and Privacy. The Systems menu exposes exactly the two implemented hubs: Pumps, Pressure & Pipe Flow and Wells, Storage & Rainwater. Irrigation is specification-complete but remains unlinked until its routes are implemented.

## Implemented pump-system journey

```text
Required Flow
→ Total Dynamic Head
→ Pipe Friction Loss
→ Pipe Velocity Check
→ Pump Duty Point
→ Pump Power
→ NPSH
→ Operating Cost
```

The implemented low-pressure journey is:

```text
Low Water Pressure Troubleshooter
→ Pipe Friction Loss
→ Booster Duty Point
→ Pump or pressure-system review
```

All detail pages expose four to six task-specific links. Future systems appear only as non-linked context until implemented.

## Implemented Phase 2 journeys

### Well and borehole system

```text
Well & Borehole Pump Sizing Planner
→ Well Yield vs Demand Checker
→ Total Dynamic Head Calculator
→ Pipe Friction Loss Calculator
→ Pump Curve Duty Point Comparator
→ Pressure Tank Sizing Calculator
→ Pump Short-Cycling Analyzer
→ Water Storage Tank Sizing Planner
```

### Rainwater system

```text
Rainwater Harvesting Yield Calculator
→ Rainwater Tank Days-of-Supply Simulator
→ First Flush Diverter Sizing Calculator
→ Booster Pump Duty Point Estimator
→ Intended non-potable or locally approved use
```

The well and rainwater journeys are implemented and cross-linked to the Phase 1 pump hydraulics. Irrigation and treatment remain planned and are not exposed as inactive public links.

### Irrigation system — specification complete, implementation not started

```text
Available Water Flow Test Calculator
→ Sprinkler Zone Capacity Planner
→ Water Pipe Size & Velocity Checker
→ Sprinkler Precipitation Rate Calculator
→ Irrigation Runtime & Water Depth Planner
→ Observe and adjust under actual conditions
```

Alternative branches:

```text
Drip layout
→ Drip Irrigation Flow & Zone Calculator
→ Irrigation Runtime & Water Depth Planner

Pumped supply
→ Total Dynamic Head Calculator
→ Pump Curve Duty Point Comparator
→ Irrigation Pump & Zone Matcher (single stated duty-condition screen)

Weak sprinkler zone
→ Sprinkler Low-Pressure Troubleshooter
→ Measure flow and dynamic pressure
→ Leak, restriction, demand, elevation or pump review
```

The future parent route is `/systems/irrigation-sprinklers/`. Do not expose it in navigation, sitemap or related links until the hub and its cluster are implemented. The complete calculation, content and QA contract is in [irrigation-sprinkler-spec.md](irrigation-sprinkler-spec.md).

### Water-treatment system

```text
How to Read a Water Test Report
→ Water Quality Parameter Glossary
→ Water Treatment Train Selector
→ Softener, Filter or RO tool
→ Storage and Pumping requirements
```

### Low-pressure diagnosis

```text
Low Water Pressure Troubleshooter
→ Pipe Friction Loss Calculator
→ Booster Pump Duty Point Estimator
→ Pressure Tank Sizing Calculator when applicable
```

After irrigation implementation, the general troubleshooter may hand off zone-specific symptoms to the Sprinkler Low-Pressure Troubleshooter. Until then no inactive irrigation link is published.

## Detail-page related-link groups

Use only the relevant groups below, usually totaling four to six links on a detail page:

- Before you calculate
- Use this tool now
- Interpret the result
- Fix a related problem
- Next system step
- Parent system hub

Do not publish arbitrary keyword-heavy related-link blocks. Link order must serve the user task and the system flow.
