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

The final local regression run passed 29 xUnit cases and 59 HTTP assertions. Browser checks at 1440×1000 and 390×844 verified sign-in, search, inspection submission, persistence after reload, handover content and mobile overflow. There were no JavaScript page errors; an initial unauthenticated state request produced the expected HTTP 401 before sign-in. A publish build also succeeded. Docker execution and real external integrations were not tested.

## Public GitHub Pages edition

Run `node --test tests/public-sandbox.test.mjs` for ten public-adapter regression tests, then `python3 tools/build_pages.py` and `python3 tools/check_pages.py`. Node 24 is used in the Pages pipeline; the .NET application itself still requires no Node build.

Browser verification covered the public case study, zone selection, guided navigation, SOC/12V entry, approve/start/stop charging, metered energy, profile versioning, persistence after reload, CSV upload, zone links and responsive layouts. The browser made no /api requests. The manifest imports 40 records into the 40 free arrival-zone spaces; the other rows receive explicit validation/capacity errors. Fixture VIN errors remain at logical lines 139 and 290.
