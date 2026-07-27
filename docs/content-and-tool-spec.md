# Content and Tool Specification

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
