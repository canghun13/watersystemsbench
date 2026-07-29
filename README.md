# Water Systems Bench

## Current implementation

The site now publishes 51 public HTML pages: seven core pages, three system hubs, 24 tools, 11 guides and six references. The Irrigation & Sprinkler Systems cluster provides a connected measure → zone → apply → schedule → troubleshoot workflow at `/systems/irrigation-sprinklers/`.

**Domain:** [watersystemsbench.com](https://watersystemsbench.com)
**Repository:** https://github.com/canghun13/watersystemsbench

Water Systems Bench is an English-language, global practical workflow hub for sizing, checking, troubleshooting, and planning real-world water systems from source to use. It is a connected system resource—not simply a collection of individual calculators.

Phase 1 and Phase 2 implement the static site foundation plus the Pumps, Pressure & Pipe Flow and Wells, Storage & Rainwater clusters using static HTML, CSS, and vanilla JavaScript for deployment through GitHub Pages and Cloudflare.

**Official contact:** [canghun13@naver.com](mailto:canghun13@naver.com)
**GA4 measurement ID:** `G-7FB08YPX7C`

## Implemented scope

- 40 public HTML pages: 7 core pages, 2 system hubs, 17 tools, 8 guides, and 6 references
- Hydraulic Field Bench design system with responsive and accessible navigation
- SI-first calculations with common US customary units
- Unique metadata, canonical URLs, Open Graph data, JSON-LD, breadcrumbs, GA4, sitemap, robots, and `llms.txt`
- Repeatable static, calculation, navigation, and browser-result QA

The full plan remains 65 public pages. The other 25 pages have not been created as empty or inactive pages.

## Local preview and QA

Requires Node.js 20 or later.

```bash
npm ci
npm run generate
npm run serve
```

In a second terminal:

```bash
npm run qa
npm run verify:calculations
npm run qa:browser
```

`npm run generate` refreshes the committed static HTML, sitemap, robots file, and `llms.txt` from the repository generator. `npm run qa:browser` validates the latest recorded actual-browser run in `tools-qa/browser-results.json`; perform a new documented browser run before updating that report.

## Start work in a new environment

1. Clone the repository, or confirm the existing repository location.
2. Confirm the remote URL is `https://github.com/canghun13/watersystemsbench`.
3. Confirm the active branch is `main`.
4. Run `git status` and preserve any uncommitted work.
5. Inspect the most recent commit with `git log -1 --oneline`.
6. Read [handover.md](handover.md) before making changes.
7. If the local branch is behind, run `git fetch` followed by `git pull --ff-only` only when appropriate.
8. Begin work only after the repository state is confirmed and clean or intentionally understood.

## Finish work

1. Inspect the actual changed files and run relevant automated checks.
2. Perform browser visual and interaction QA when a site exists.
3. Update `handover.md` with the actual state, work completed, QA results, and next task.
4. Commit the completed work, push `main`, and confirm local `HEAD` matches `origin/main`.

## Key documents

- [Handover](handover.md)
- [Project plan](docs/project-plan.md)
- [Page inventory](docs/page-inventory.md)
- [Information architecture](docs/information-architecture.md)
- [Content and tool specification](docs/content-and-tool-spec.md)
- [QA and operations](docs/qa-and-operations.md)
