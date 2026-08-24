# Aggressive workflow-cluster discovery — 2026-08-24

## Decision

**GO: Metal Finishing Rinse Water Optimization.** Start commit: `f912ab32f97354b184b33984ec1d80ca31f420ef`. Start inventory: 83 public HTML pages (7 core, 6 hubs, 42 tools, 18 guides, 10 references).

The review reconstructed 36 previously evaluated families: Greywater and Vehicle Wash were implemented; water loss, commercial-building demand, stormwater, septic, cooling towers, dewatering, livestock water, wastewater pump stations, ponds, hydronics, RV water, domestic-hot-water recirculation, aquariums, pools, hydroponics, boiler/condensate, water heaters, mobile pressure washing, brewing, mobile food units, winterization, ice machines, dust suppression, maple sap, snowmaking, commercial laundry, pure-water cleaning, concrete wash water, winery water, waterjet cutting, laboratory purified water, warewashing, hydro-vac and pottery wash water were rejected. No renamed or narrower variant of those families was counted below.

## Fresh discovery screen

| # | New family | Repeat workflow | Tool depth | Demand signal | Competition/gap | Initial decision |
|---:|---|---|---:|---|---|---|
| 1 | Pumping-test and well-rehabilitation analysis | test → diagnose → retest | 5 | strong | strong software | advance |
| 2 | Irrigation salinity and sodicity | test → leach → amend → schedule | 4 | strong | integrated Extension tool | advance |
| 3 | Bulk-water delivery and cistern logistics | demand → route → delivery → reserve | 5 | medium | fragmented | advance |
| 4 | Stone-fabrication recycle and slurry | meter → settle → recycle → remove | 5 | medium | vendor-led | advance |
| 5 | Metal-finishing rinse optimization | audit → drag-out → counterflow → verify → payback | 5 | strong | fragmented PDFs | advance |
| 6 | Liquid-ring vacuum seal-water management | meter → heat balance → recirculate → payback | 5 | strong | fragmented OEM guidance | advance |
| 7 | Water-main flushing and disinfection | volume → velocity → dose → dechlorinate | 5 | strong | integrated current tool | advance |
| 8 | Commercial humidification water/energy | load → water → blowdown → cost | 5 | strong | several free tools | advance |
| 9 | Granular-media backwash operations | expansion → flow → waste → schedule | 4 | medium | overlaps existing filter tool | reject |
| 10 | Remote tank telemetry/runout forecasting | trend → runout → delivery | 4 | medium | SaaS/data backend | reject |
| 11 | Carpet-extraction water logistics | route → fill → recover → discharge | 4 | medium | strong estimating apps | reject |
| 12 | Floor-scrubber route water operations | tank → productivity → refill | 4 | medium | strong calculators | reject |
| 13 | Espresso-equipment water/scale planning | test → treatment → service | 4 | medium | product-specific | reject |
| 14 | Steam/combi-oven water utilities | demand → treatment → drain | 4 | low | manufacturer-specific | reject |
| 15 | Marine watermaker autonomy | demand → production → storage | 4 | medium | product/vendor heavy | reject |
| 16 | Road-sweeper refill productivity | route → spray → refill | 4 | low | weak search intent | reject |
| 17 | Dairy-parlor process-water balance | milk cycle → wash → reuse | 5 | medium | regulation/site specific | reject |
| 18 | Produce-wash water management | wash → refresh → verify → discharge | 5 | strong | food-safety boundary | reject |
| 19 | Managed-aquifer recharge operations | recharge → clogging → recovery | 5 | medium | professional/regulatory | reject |
| 20 | Wet-scrubber recirculation water balance | evaporation → blowdown → makeup | 5 | medium | chemistry-specific | reject |
| 21 | Water-wash paint-booth balance | recirculate → sludge → makeup | 4 | low | product-specific | reject |
| 22 | Aggregate wash-plant water balance | feed → recovery → pond → makeup | 5 | medium | project-scale design | reject |
| 23 | Compressor cooling-water audit | meter → heat → reuse → payback | 4 | medium | overlaps industrial utilities | reject |
| 24 | Sterilizer/autoclave utility water | cycles → cooling → cost | 4 | medium | equipment-specific | reject |
| 25 | Shelter/kennel wash-water operations | area → wash → storage → cost | 4 | low | weak tool intent | reject |
| 26 | Produce hydrocooling water | load → turnover → cooling → discharge | 4 | medium | food-safety/thermal design | reject |
| 27 | HVAC condensate recovery | yield → storage → use → payback | 4 | strong | overlaps HVAC sites | reject |
| 28 | Fire-hydrant flow and fire-water availability | test → correct → compare → reserve | 5 | strong | safety/liability | reject |
| 29 | Water-hammer screening | velocity → closure → surge → mitigation | 4 | strong | existing engineering tools | reject |
| 30 | Mechanical-seal flush-water management | meter → limit → recover → cost | 4 | medium | OEM-specific | reject |
| 31 | Glass wet-grinding recycle | meter → settle → recycle → purge | 4 | low | thin intent | reject |
| 32 | Food-processing CIP water balance | recipe → rinse → recovery → cost | 5 | strong | process/safety-specific | reject |
| 33 | Emergency-shelter water continuity | people → days → delivery → reserve | 4 | strong | emergency liability | reject |
| 34 | Community refill-kiosk operations | demand → production → storage → service | 4 | medium | potable/regulatory | reject |
| 35 | Hydrostatic-test water commissioning | fill → test → recover → discharge | 4 | medium | episodic, not repeat-use | reject |
| 36 | Product rain-room test-loop reuse | load → storage → treatment → cost | 4 | low | weak public demand | reject |

## Serious-candidate scoring

| Candidate | Monetization /40 | Demand /35 | Gap /25 | Total | Decision |
|---|---:|---:|---:|---:|---|
| Metal finishing rinse optimization | 39 | 30 | 22 | **91** | GO |
| Liquid-ring vacuum seal water | 38 | 28 | 22 | 88 | reserve |
| Bulk-water/cistern logistics | 36 | 27 | 19 | 82 | reject |
| Stone-fabrication recycle | 37 | 25 | 17 | 79 | reject |
| Pumping-test/well rehabilitation | 35 | 30 | 12 | 77 | reject |
| Commercial humidification | 36 | 29 | 12 | 77 | reject |
| Irrigation salinity/sodicity | 34 | 29 | 8 | 71 | reject |
| Water-main flushing/disinfection | 37 | 28 | 6 | 71 | reject |

## Top-five Gate A–K

P = pass; F = fail. A independent problem; B at least four independent tools; C specific repeated search intent; D material competition gap; E no existing-tool overlap; F maintainable safety boundary; G connected workflow; H no equivalent strong free suite; I static/client-side feasibility; J stable, auditable inputs; K responsible result boundary.

| Candidate | A | B | C | D | E | F | G | H | I | J | K | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Metal finishing rinse | P | P | P | P | P | P | P | P | P | P | P | GO |
| Liquid-ring vacuum | P | P | P | P | P | P | P | P | P | F | P | no selection: OEM thermal limits dominate |
| Bulk-water logistics | P | P | F | P | P | F | P | P | P | P | F | NO-GO |
| Stone fabrication | P | P | F | F | P | F | P | P | P | F | F | NO-GO |
| Pumping-test analysis | P | P | P | F | P | P | P | F | P | P | P | NO-GO |

Metal finishing is independent because it optimizes contaminated process-rinse stages and drag-out—not potable treatment, vehicle washing or household reuse. Liquid-ring work depends more heavily on OEM temperature, cavitation and heat-exchanger data. Bulk water is dominated by delivery pricing and public-health logistics. Stone fabrication is product/slurry/discharge specific. Pump-test analysis has current purpose-built free and commercial suites.

## Evidence and competitive validation

- EPA metal-finishing development documents and pollution-prevention material repeatedly use drag-out, rinse flow, countercurrent staging and conductivity control as operational decisions. Search results were predominantly official PDFs, older worksheets and consulting articles rather than a connected, accessible suite.
- Liquid-ring guidance from EPA and OEMs confirms a strong water-saving workflow, but final allowable seal-water temperature and capacity remain machine specific.
- USGS provides pumping-test analysis methods and spreadsheets; AQTESOLV, AquiDPlot, AquiPro and Pump IQ already serve the same core workflow.
- Utah State University Extension already combines salinity, SAR, gypsum and leaching calculations.
- HydrantLoop combines main volume, flushing velocity and chlorination/dechlorination.

## Revisit conditions

Revisit a rejected family only if current competitors disappear or meaningful query evidence reveals an uncovered repeat workflow; do not repackage an existing Water Systems Bench formula. The chosen cluster remains bounded to quantity, operational comparison and monitoring. It never sets permit limits, chooses plating chemistry, approves discharge, certifies rinsing or replaces an SDS, authority or qualified industrial review.
