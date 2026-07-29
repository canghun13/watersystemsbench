# Content and Tool Specification

## Irrigation implementation status

The irrigation specification is implemented: seven forms use common SI-first conversion and result patterns, preserve physical quantity on unit changes, clear stale results on errors/reset, and expose sources, assumptions, limits and safety boundaries. Flow, pressure and water-depth outcomes remain distinct throughout the cluster.

**Repository:** https://github.com/canghun13/watersystemsbench

## Required content for every tool page

Every implemented tool page must contain:

1. Tool purpose
2. Input definitions
3. Supported units
4. Calculation or decision method
5. Result interpretation
6. Assumptions
7. Limitations
8. Safety notes
9. Practical worked example
10. Related guides
11. Related tools
12. References
13. Last reviewed date

## Units

Use SI first and support common US customary options when relevant. The baseline unit set is L/min, m³/h, GPM, kPa, bar, psi, mm, inch, °C, and °F. Clearly label conversions, preserve input precision appropriately, and never hide a unit change.

## Planned tool types

| Type | Count |
| --- | ---: |
| Calculator | 15 |
| Planner | 6 |
| Checker | 2 |
| Comparator | 2 |
| Troubleshooter | 2 |
| Selector | 2 |
| Estimator | 1 |
| Analyzer | 1 |
| Simulator | 1 |

The planned tools may use these product patterns: Calculator, Generator, Planner, Selector, Checker, Validator, Troubleshooter, Analyzer, Comparator, Optimizer, Estimator, Simulator, Checklist Builder, and Reference Lookup. The table records the initial primary type distribution; it is not a claim that every pattern is already implemented.

## Implemented Phase 1 and Phase 2 tool types

| Type | Implemented count |
| --- | ---: |
| Calculator | 7 |
| Planner | 2 |
| Checker | 2 |
| Estimator | 1 |
| Comparator | 2 |
| Troubleshooter | 1 |
| Analyzer | 1 |
| Simulator | 1 |
| Total | 17 |

The numerical tools share SI-based conversion and form utilities while keeping each tool's calculation logic in its own JavaScript module. Shared conversion support now includes volume, horizontal catchment area, and rainfall depth. The low-pressure tool is rules-based and explicitly reports cause groups rather than a confirmed diagnosis; the rainwater simulator uses 365 sequential daily storage steps.

## Irrigation specification

The future Irrigation & Sprinkler Systems cluster has a complete pre-implementation contract in [irrigation-sprinkler-spec.md](irrigation-sprinkler-spec.md). It covers one hub, seven tools, three guides, a duplication review, exact SI-based formulas, validation states, 36 independent numeric/validation cases, six troubleshooting scenarios and the future browser matrix.

The specification does not change the implemented tool counts. Its key product boundaries are:

- measured flow is not inferred pressure or guaranteed source capacity;
- zone capacity floors whole devices and reports flow and pressure separately;
- precipitation rate is not distribution uniformity;
- runtime uses a user-entered net target and efficiency rather than prescribing plant demand;
- drip layout arithmetic is not lateral hydraulic approval;
- the pump matcher screens one stated flow/head pair and never claims a curve operating point;
- the sprinkler troubleshooter reports evidence-based cause groups, not a confirmed diagnosis.

## Safety, health, and regulatory rules

- Cite authoritative primary sources for claims involving safety, health, legal requirements, or regulation.
- Identify when requirements vary by country, state, region, utility, or use case.
- Do not present outputs as formal engineering approval, legal advice, or a regulatory determination.
- Do not infer a legal design value the user has not provided.
- For potable water, chemicals, and treatment decisions, state the boundary of the tool and direct users to qualified review and applicable local requirements.

## Editorial and calculation rules

- Show the method sufficiently for users to understand the result, rather than treating it as an unexplained black box.
- Test sensible boundaries, invalid values, empty states, unit switching, reset behavior, and rounding before release.
- Give a worked example with realistic, clearly labelled assumptions.
- Include only 4–6 contextually useful related links, organized by user need rather than arbitrary SEO linking.
- Record a real last-reviewed date only when the page has been reviewed; do not fabricate one in planning.
