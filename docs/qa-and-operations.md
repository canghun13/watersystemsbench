# QA and Operations

**Repository:** https://github.com/canghun13/watersystemsbench

## Start every task

1. Confirm the current directory.
2. Confirm the remote is `https://github.com/canghun13/watersystemsbench`.
3. Confirm the active branch.
4. Run `git status` and preserve uncommitted changes.
5. Inspect the latest commit.
6. Read `handover.md`.
7. Check whether the local branch is current with the remote.
8. Use `git fetch` and, only when appropriate, `git pull --ff-only`.
9. Start implementation only with an understood repository state.

Never use forced pull, reset, clean, rebase, or force-push for routine work. Do not document machine-specific paths or rely on a particular local checkout path.

## Finish every task

1. Inspect the actual modified files and run relevant automated checks.
2. Run browser visual and interaction QA when a site exists.
3. Update `handover.md` with the actual completed state.
4. Commit the work.
5. Push `main`.
6. Confirm local `HEAD` and `origin/main` resolve to the same commit.

## QA commands

```bash
npm ci
npm run generate
npm run qa
npm run verify:calculations
npm run serve
npm run qa:browser
```

The actual browser run is recorded in `tools-qa/browser-results.json`. Refresh that report only after testing every public page in a real browser.

## Responsive QA viewports

- 390px
- 768px
- 1024px
- 1280px
- 1440px

## Required site QA

- Broken internal and external links
- Duplicate IDs, canonical URL, title, meta description, H1, sitemap, and robots.txt
- JavaScript syntax and runtime behavior
- Browser console errors, page errors, and asset loading failures
- Mobile navigation, horizontal overflow, and visible UI clipping
- Calculate, reset, and unit-switching behavior
- Formula/result verification and result interpretation
- Contact email and mailto link
- GA4 only after a real measurement ID is supplied
- Accessibility of published pages

## Phase 1 and Phase 2 result

- Static and navigation QA: passed for 40 public pages
- Calculation verification: 30 Phase 1 numeric/conversion cases, 6 troubleshooting scenarios, 30 Phase 2 numeric/decision cases and 6 simulator scenarios passed
- Browser rendering: 200 checks (40 pages × 5 widths) passed
- Tool interactions: all 17 passed, including all 8 Phase 2 tools, for calculate/analyze/simulate, reset, copy, print, invalid input and relevant unit switching
- Console errors, page errors, asset failures, internal 404s, and horizontal overflows after fixes: 0

## Irrigation pre-implementation QA contract

The Irrigation & Sprinkler Systems cluster is specified but not implemented. Its independent calculation and interaction cases are in [irrigation-sprinkler-spec.md](irrigation-sprinkler-spec.md).

After future implementation:

- run 36 numeric/validation cases and six sprinkler troubleshooting scenarios across the seven new tools;
- regression-test all 17 current tools and their existing cases;
- render all 51 public pages at 390, 768, 1024, 1280 and 1440 px, for 255 page-width checks;
- run valid calculation, SI/US switching, invalid/boundary, dynamic-mode, reset, copy and print interaction families on every new tool;
- verify exact category counts of 7 core, 3 hubs, 24 tools, 11 guides and 6 references;
- update sitemap only when the 11 new routes actually exist and confirm exact parity;
- keep the current 40-page/200-render result as the actual baseline until implementation.

Do not create a repo-specific local tool merely to force execution from one checkout location. Keep all commands relative to the repository root.
