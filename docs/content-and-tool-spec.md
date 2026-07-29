# Content and Tool Specification

## Implemented tool distribution

| Primary type | Count |
| --- | ---: |
| Calculator | 15 |
| Planner | 6 |
| Checker | 2 |
| Comparator | 3 |
| Troubleshooter | 2 |
| Selector | 1 |
| Estimator | 1 |
| Analyzer | 1 |
| Simulator | 1 |
| Total | 32 |

`RO Production vs Demand Planner` is a planner, not a selector. The Water Treatment Train Selector is the one implemented selector.

## Required tool-page content

Every tool page contains:

1. Purpose and appropriate use
2. Labelled inputs and supported units
3. Calculation or decision method
4. Result interpretation
5. Assumptions and limitations
6. Safety and regulatory boundary
7. Worked example
8. Related tools, guides and parent workflow
9. Primary or authoritative references
10. Real last-reviewed date

## Interaction contract

- SI is the internal calculation basis; relevant US customary units are supported.
- Unit switching converts entered quantities once, updates visible labels and clears stale results.
- Invalid inputs produce an inline alert and hide stale output.
- Reset restores defaults and clears errors/results.
- Successful output enables copy and print actions.
- Calculations remain in testable JavaScript functions separate from DOM wiring.
- Results expose their method and do not become unexplained black-box recommendations.

## Treatment-specific boundaries

- Softener calculations distinguish tested hardness, optional user-supplied iron factor, capacity, salt setting and peak service flow.
- RO recovery is a water balance, not a membrane-performance or product-safety claim.
- RO production factors come from the exact system or membrane data; the tool does not invent correction factors.
- Media service and backwash loading are compared only with user-entered product/media limits.
- Chlorine arithmetic uses a user-entered target dose and product concentration. It does not recommend a dose.
- Percent-by-weight chemical input requires the user to enter density.
- CT arithmetic uses measured residual, entered baffling factor and an optional user-entered target. It does not select a compliance target.
- The treatment-train selector returns candidate stages, testing needs and constraints. It does not prescribe a universal train or declare water potable.
- Positive microbiological evidence triggers an urgent safe-source/public-authority message.

## Safety, health and regulatory rules

- Use primary authoritative sources for safety, health, chemical, legal and regulatory claims.
- Identify jurisdictional and intended-use variation.
- Never present an output as formal engineering approval, potable-water certification, legal advice or regulatory compliance.
- Never infer a health-protection dose, CT target, contaminant limit or design value the user did not provide.
- Direct chemical users to the current product label, SDS, PPE, ventilation and applicable qualified/local-authority guidance.
- Direct drinking-water and health-significant results to appropriate laboratory, public-health and certified-product review.

## Editorial and QA rules

- Use substantial original explanations, explicit units and realistic worked examples.
- Keep related links limited to useful next steps.
- Test normal, boundary, invalid, mode-switch, unit-switch, reset, copy and print behavior.
- Independently verify numerical expectations and rules paths.
- Record browser evidence only after an actual complete run.
