# Hive + Visual Hive E2E Proof Fixture

This small React/Vite TypeScript dashboard is a clean-room acceptance target for the integrated Hive and Visual Hive installer. It has two routes (`/` and `/jobs`), a deterministic local metrics API, a built-in fallback, Python unit tests, Playwright browser smoke coverage, a scoped screenshot assertion, and axe accessibility checks. It needs no secrets or paid services.

## Local verification

Use Node 22 and a Python environment with pytest:

```bash
npm ci
npx playwright install chromium
npm run build
npm run test:python
npm run test:e2e
```

The first local screenshot bootstrap is explicit:

```bash
npm run test:e2e:update
```

Visual Hive is intentionally not referenced as a source checkout or npm dependency in this fixture. The integrated Hive installer is expected to install and pin its immutable release. Its checked-in `visual-hive.config.yaml` keeps standalone GitHub issue publishing disabled; Hive is the only intended lifecycle writer, and this initial config permits dry-run export only.

## Intentional acceptance findings

This fixture deliberately begins with two bounded gaps so an end-to-end Hive run has safe, observable work to discover and repair. Human-authored browser tests use `e2e/playwright.config.ts`; the small root config admits only Visual Hive's generated spec and does not own a web server. This keeps the two runners from competing over test discovery or server ownership:

1. There is no JavaScript unit-test runner or JavaScript unit-test file. The Python component tests are real project tests, but Visual Hive layer 2 should still emit one `test_adequacy_gap` recommending focused repository unit evidence.
2. The dashboard calls `/api/metrics`. If the request returns HTTP 500, it keeps the deterministic fallback UI and writes the failure detail only to visually hidden accessible status text. The initial Visual Hive dashboard contract does not forbid that marker, so its explicitly mapped `api-500` mutation should survive and produce a `mutation_survivor` finding.

These are acceptance fixtures, not accidental defects. Do not remove them from the initial repository state. A successful integrated proof should let Hive open lifecycle issues for them, create bounded repairs, validate exact-head checks, merge only under the selected authority, and close issues only after authoritative post-merge verification.
