# Project Plan

## Implemented irrigation release — 2026-07-29

The Irrigation & Sprinkler Systems hub, seven tools and three guides are implemented. The public count is now 51 of 65 planned pages; 14 pages remain planned. This release establishes the third system hub and increases implemented tools/guides to 24/11.

**Repository:** https://github.com/canghun13/watersystemsbench

## Product model

Water Systems Bench is not a loose collection of water calculators. It is a global, practical workflow hub that connects users through a real-world water-system path:

```text
Source
→ Storage
→ Pumping
→ Pipes and Transport
→ Treatment
→ Use
→ Drainage
→ Wastewater Treatment
→ Reuse or Discharge
```

Initial positioning:

> A practical workflow hub for sizing, checking, troubleshooting and planning real-world water systems from source to use.

The site is English-language and global. It is planned for static HTML, CSS, and vanilla JavaScript, deployed via GitHub Pages and Cloudflare.

## Prioritisation method

Each cluster is scored from publicly observable demand signals and competitive context:

- Search suitability: 40
- Actual search-demand evidence: 35
- Competitive opportunity: 25
- Total: 100

These are planning scores, not a claim of exact search volume. Do not present the demand component as verified volume unless a documented source supports it.

| Rank | Cluster | Search suitability | Demand evidence | Competitive opportunity | Total | Phase |
| -: | --- | --: | --: | --: | --: | --- |
| 1 | Pumps, Pressure & Pipe Flow | 37 | 33 | 21 | 91 | First wave |
| 2 | Wells, Boreholes, Storage & Rainwater | 35 | 32 | 22 | 89 | First wave |
| 3 | Irrigation & Sprinkler Systems | 34 | 33 | 20 | 87 | First wave |
| 4 | Water Treatment & Water Quality | 38 | 31 | 16 | 85 | First wave |
| 5 | Stormwater, Drainage & Flooding | 31 | 30 | 20 | 81 | Second wave |
| 6 | Building Water Supply & Management | 35 | 27 | 18 | 80 | Include in early first wave where useful |
| 7 | Wastewater Treatment & Chemical Dosing | 34 | 25 | 20 | 79 | Second wave |
| 8 | Industrial Process Water & Wastewater | 36 | 24 | 17 | 77 | Second to third wave |
| 9 | Cooling Tower & Boiler Water Treatment | 34 | 22 | 16 | 72 | Later |
| 10 | Aquaculture & Pond Water Quality | 28 | 25 | 18 | 71 | Later |
| 11 | Pools & Spas | 34 | 31 | 5 | 70 | Exclude initially |
| 12 | Municipal Water & Sewer Networks | 31 | 23 | 14 | 68 | Later |
| 13 | Fire Water Systems | 36 | 20 | 9 | 65 | Exclude initially |
| 14 | Dams, Rivers, Reservoirs & Resources | 20 | 28 | 11 | 59 | Later |

## Phase 1 and Phase 2 implementation

Phase 1 and Phase 2 are implemented: the shared static foundation, seven core pages, two connected system hubs, 17 working tools, eight guides, and six reference pages. This produces 40 public HTML pages.

The planning inventory remains 65 public pages: 7 core pages, 4 first-wave hubs, 32 tools, 14 guides, and 8 reference pages. Twenty-five planned pages remain unimplemented. No empty future-cluster pages were published.

The implemented design system is called **Hydraulic Field Bench**: deep water navy and mineral blue, limited teal and safety amber, technical drawing lines, instrument-style inputs, and operating-report results. It avoids stock imagery and generic dashboard styling.

## Next implementation scope

Use the two completed clusters as the shared foundation for the Irrigation & Sprinkler Systems workflow. Confirm formulas, sources, content depth, and cross-cluster links before creating public pages.

## Content principles

- Lead users from a system question to the next practical calculation, decision, or explanation.
- Prefer clear SI units while supporting common US customary units where useful.
- Explain assumptions, limitations, and what a result does not prove.
- Use primary, authoritative sources for safety, health, regulatory, and legal topics.
- Surface jurisdictional variation instead of making universal compliance claims.
