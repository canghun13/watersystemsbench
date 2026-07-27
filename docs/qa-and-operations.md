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

## Future responsive QA viewports

- 390px
- 768px
- 1024px
- 1280px
- 1440px

## Required site QA once implementation begins

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

Do not create a repo-specific local tool merely to force execution from one checkout location. If QA automation is added later, document its commands in the README.
