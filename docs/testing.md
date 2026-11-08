# Verification and testing

## Automated checks

```bash
python3 tools/check_repository.py
dotnet test --nologo
```

Repository verification checks relative Markdown links, JSON parsing, fixture VINs and counts, profile assignments, deliberate invalid manifest rows, zone totals, generated HTML consistency and English language markers. It does not crawl every external link or prove the semantic completeness of documentation.

xUnit covers storage threshold precedence, inclusive inspection/departure boundaries, stale-reading forecasts, charging segments, destination targets/conflicts, VIN validation, profile selection, invalid thresholds, persistence rollback/restart, stale revisions, quarantine charging guards and observation provenance.

## HTTP smoke test

Use a disposable store and port. The test intentionally appends fictional observations, imports records and exercises workflow commands.

```bash
Data__Path=/tmp/voltyard-smoke-new.json dotnet run --project src/VoltYard.Api   --launch-profile local --urls http://127.0.0.1:5081
```

In another terminal:

```bash
python3 tools/smoke_test.py --url http://127.0.0.1:5081
```

Use a fresh path for each independent run. Set VOLTYARD_TEST_PASSWORD if Demo__Password differs from the development default. Test code never includes credentials in a documentation/search query.

## Browser verification

Check page identity, meaningful content, absence of error overlays, console health, desktop and mobile layout, and actual interactions. Suggested flow: sign in → search VIN → record inspection → reload → verify new SOC → approve/start/stop charging → quarantine/HSE decision → profile version → report/print. Verify failed commands preserve state.

The Browser plugin was not available in this environment; Playwright is the browser-validation path. Keep screenshots and temporary browser scripts outside committed source. Tests are evidence of the checked environment, not a universal browser or safety certification.

## Remaining verification

No real chargers, camera hardware, field staff timing study, load benchmark, PostgreSQL integration, tenant isolation, production security review or disaster recovery environment has been validated. These require the next release and appropriate owners.

## Verified local run — 7 November 2026

The initial local regression run passed 29 xUnit cases and 59 HTTP assertions. Browser checks at 1440×1000 and 390×844 verified sign-in, search, inspection submission, persistence after reload, handover content and mobile overflow. There were no JavaScript page errors; an initial unauthenticated state request produced the expected HTTP 401 before sign-in. A publish build also succeeded. Docker execution and real external integrations were not tested.

## Public GitHub Pages edition

Run `node --test tests/public-sandbox.test.mjs` for sixteen public-adapter regression tests, then `python3 tools/build_pages.py` and `python3 tools/check_pages.py`. Node 24 is used in the Pages pipeline; the .NET application itself still requires no Node build.

Browser verification covered the public case study, zone selection, guided navigation, SOC/12V entry, approve/start/stop charging, metered energy, profile versioning, persistence after reload, CSV upload, zone links and responsive layouts. The browser made no /api requests. The manifest imports 40 records into the 40 free arrival-zone spaces; the other rows receive explicit validation/capacity errors. Fixture VIN errors remain at logical lines 139 and 290.

## Operational review follow-up — 7 November 2026

The reviewed release passes 33 xUnit cases in Release mode, 14 public-adapter tests and 70 HTTP assertions. New checks cover recent charging readings versus old manual inspections, unobserved arrivals, omitted API measurement fields, repeated quarantine and spreadsheet-formula escaping. The HTTP suite also verifies the second quarantine cycle and an imported vehicle's explicit inspection requirement.

A fresh browser context at 390×844 verified that an imported vehicle shows Not measured / Not recorded, has INSPECTION_REQUIRED rather than a false critical-SOC alert, and opens an arrival form with blank required observations. It produced no JavaScript errors or horizontal overflow. The review section is linked from the showcase and repository. These results do not constitute field acceptance, exhaustive security testing or a production benchmark.

## Portfolio prerelease — 8 November 2026

The release adds ten reproducible Playwright journeys for Chromium at 1440×1000 and 390×844. They assert page identity, internal anchors, asset responses, no JavaScript page errors or backend requests in the public sandbox, viewport overflow, inspection submission, tab persistence, deep links, browser history, reports, reset, walkthrough exit, CSV import/download, charging completion, rejected/accepted HSE release and recovery from malformed session state. Screenshots and navigation/resource measurements are attached to the browser report; they are observations in the test environment, not production performance guarantees.

The backend suite now has 36 cases and the public adapter 16. The HTTP suite has 74 assertions, including published asset delivery/CSP and a malformed JSON problem response. New store tests cover exclusive ownership, lock release and preserving corrupt data on startup failure. CI also builds the container, executes the disposable HTTP suite and compares the data file before/after restart. Docker was unavailable on the authoring machine; the hosted job is the execution evidence.

Run browser checks with the dependency-locked commands in the README. No formal WCAG conformance, penetration test, terminal field pilot or commercial acceptance is claimed. Existing readiness and pilot documents remain release constraints.

The separately published backend UI is also exercised at both viewports by `npm run test:backend-browser` after `dotnet publish src/VoltYard.Api -c Release -o /tmp/voltyard-publish`. It owns a disposable temporary store/server on an OS-assigned loopback port and verifies sign-in, inspection, deep-link reload, report, overflow, logout and HTTP 401 after logout. This catches empty-body HTTP success responses as well as UI regressions.
