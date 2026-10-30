# Water Systems Bench

Water Systems Bench is an English-language, global workflow hub for sizing, checking, troubleshooting and planning real-world water systems from source to use.

- Domain: [watersystemsbench.com](https://watersystemsbench.com)
- Repository: [github.com/canghun13/watersystemsbench](https://github.com/canghun13/watersystemsbench)
- Contact: [canghun13@naver.com](mailto:canghun13@naver.com)
- GA4: `G-7FB08YPX7C`
- Stack: static HTML, CSS and vanilla JavaScript
- Deployment: GitHub Pages with Cloudflare

## Current implementation

The initial scope and validated expansions are implemented: 112 public HTML pages comprising 7 core pages, 10 connected system hubs, 59 working tools, 22 guides and 14 references.

The ten workflows are:

1. Pumps, Pressure & Pipe Flow
2. Wells, Storage & Rainwater
3. Irrigation & Sprinkler Systems
4. Water Treatment & Water Quality
5. Greywater Reuse Planning
6. Vehicle Wash Water Reclaim Planning
7. Metal Finishing Rinse Water Optimization
8. Monitoring Well Purging & Low-Flow Sampling
9. Water Laboratory Calculations & QA
10. Rainfall Records & Gauge Networks

The Water Treatment & Water Quality cluster starts at `/systems/water-treatment-quality/`. Its eight tools use tested or user-supplied values, show their methods and limitations, and do not claim potable-water safety, regulatory compliance or an approved design.

The Greywater Reuse Planning cluster starts at `/systems/greywater-reuse/`. Its five tools connect measured household supply, ET-based landscape demand, laundry event distribution, receiving-basin capacity and user-entered economics without approving a source, end use, potable connection or local compliance.

The Vehicle Wash Water Reclaim Planning cluster starts at `/systems/vehicle-wash-water-reclaim/`. Its five tools connect a matching meter/vehicle baseline, process-stream balance, delayed peak buffer, spot-free RO production and facility economics without selecting treatment or approving reclaimed-water quality or discharge.

The site uses the Hydraulic Field Bench design system, SI-first calculations with common US customary units, unique metadata and canonical URLs, JSON-LD, breadcrumbs, GA4, sitemap, robots and `llms.txt`.

## Local preview and QA

Node.js 20 or later is required.

```bash
npm run generate
npm run serve
```

In another terminal:

```bash
npm run qa
npm run verify:calculations
npm run qa:browser
```

`npm run generate` refreshes committed HTML and machine-readable site files. `npm run qa:browser` runs the current112-page Chrome matrix, all59 default results/resets, applicable unit switches and rainfall/protected interactions. Set `WSB_QA_FULL=0` for the explicitly scoped15-page release/protected matrix, or `WSB_QA_INTERACTIONS_ONLY=1` for a development supplement with no render-matrix claim. The runner defaults to port4207; start `server.mjs` with that `PORT` or override `WSB_QA_BASE`. Use the configured Node/Playwright runtime through `NODE_PATH` and installed Chrome; no installation/reset. `WSB_QA_REPORT` and `WSB_QA_IMAGES` select dated evidence locations. Historical reports/runners retain their own release counts; validating old JSON is not a fresh browser run.

The local QA server replaces requests to the six approved analytics hosts with a local no-op response and records intercepted/completed counts. This keeps automated QA out of GA4 while the committed production pages retain `G-7FB08YPX7C` unchanged.

GitHub Pages uses `_config.yml` as the production publication boundary. Repository documentation, planning files, QA tooling and package metadata remain available in Git but are excluded from the deployed artifact; the112 public routes and their runtime assets remain published.

## Repository workflow

Before changing the site, confirm the checkout, `origin`, active branch, working-tree state and latest commit, then read [handover.md](handover.md). Preserve user-managed content and unrelated changes.

Before finishing, inspect the diff, run relevant calculation/static/navigation/browser checks, update the operational documentation, commit, push `main`, and confirm local `HEAD` equals `origin/main`.

## Key documents

- [Handover](handover.md)
- [Project plan](docs/project-plan.md)
- [Page inventory](docs/page-inventory.md)
- [Information architecture](docs/information-architecture.md)
- [Content and tool specification](docs/content-and-tool-spec.md)
- [QA and operations](docs/qa-and-operations.md)
- [Water treatment implementation specification](docs/water-treatment-quality-spec.md)
- [Greywater expansion research and specification](docs/greywater-reuse-expansion.md)
- [New cluster discovery](docs/new-cluster-discovery-2026-08-11.md)
- [Vehicle wash reclaim expansion specification](docs/vehicle-wash-water-reclaim-expansion.md)
