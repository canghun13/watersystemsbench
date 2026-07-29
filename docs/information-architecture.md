# Information Architecture

## Navigation model

The site follows a water-system workflow instead of separating resources only by format. Primary navigation exposes Home, Tools, Guides, Reference and a Systems menu. The Systems menu contains exactly four implemented hubs:

- Pumps, Pressure & Pipe Flow
- Wells, Storage & Rainwater
- Irrigation & Sprinkler Systems
- Water Treatment & Water Quality

About, Contact and Privacy remain available through project navigation. No inactive future system is linked.

## Connected journeys

### Pumps, pressure and pipe flow

```text
Required flow
→ Total dynamic head
→ Pipe friction and velocity
→ Pump duty point
→ Power and efficiency
→ NPSH and operating cost
```

### Wells, storage and rainwater

```text
Source yield
→ Demand and peak gap
→ Pump duty
→ Pressure tank or bulk storage
→ Rainwater yield and sequential storage
→ Intended use and verification
```

### Irrigation and sprinklers

```text
Measured flow and dynamic pressure
→ Zone capacity
→ Pipe and pump feasibility
→ Precipitation rate
→ Runtime and depth
→ Observe, troubleshoot and adjust
```

### Water treatment and water quality

```text
Representative sample and laboratory report
→ Intended use and problem definition
→ Treatment-train candidates
→ Softener, media, RO or disinfection arithmetic
→ Hydraulic, storage, backwash and reject constraints
→ Follow-up monitoring and maintenance
```

The treatment hub is `/systems/water-treatment-quality/`. The obsolete planning-only `/tools/water-treatment-quality/` route must not be introduced.

## Treatment branches

- Hardness: water test → softener capacity → salt/regeneration plan → service-flow and breakthrough verification.
- Dissolved solids: feed analysis → RO recovery/reject balance → production/demand/storage plan → product and reject verification.
- Particles or turbidity: cause/test review → media loading and backwash check → downstream barrier review.
- Disinfection: public-health or qualified target → user-entered dose arithmetic → user-entered CT comparison → residual and microbiological verification.
- Unknown or health-significant result: laboratory/public-authority response before equipment selection.

## Related-link rules

Detail pages should expose four to six task-specific links chosen from:

- Before you calculate
- Use this tool now
- Interpret the result
- Fix a related problem
- Next system step
- Parent system hub

Link order serves the workflow. Do not publish arbitrary keyword blocks, duplicate routes or unimplemented destinations.
