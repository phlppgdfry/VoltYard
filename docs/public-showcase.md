# Public portfolio showcase

- Case study: https://phlppgdfry.github.io/VoltYard/
- Interactive demo: https://phlppgdfry.github.io/VoltYard/demo/
- Guided walkthrough: https://phlppgdfry.github.io/VoltYard/demo/?tour=1

## Audience and experience

The site is designed for recruiters, technical reviewers and people interested in automotive terminal workflows. It introduces the problem, presents an interactive illustrative yard map, links to realistic workflows and explains the architecture, tests and implementation trade-offs. Philippe Godfroy is identified as the author. No customer endorsement, production deployment or completed operational pilot is claimed.

The public sandbox needs no login or backend service. All 2,000 vehicles and their observations are fictional. Changes are saved in sessionStorage for the current browser tab. A reset button restores the fixture. If browser storage is unavailable, exploration still works in memory and the interface explains that a reload will reset it.

## Edition boundary

The Pages simulation mirrors the main workflows in JavaScript. It does not provide server authentication, role enforcement, shared records, physical charger control or a certified safety system. The separately runnable .NET application retains its own role checks, command validation and persistent store. Public sandbox tests and backend tests cover their respective implementations; one does not prove the other.

The checked-in 60-vehicle standalone prototype remains available separately. The Pages builder embeds the complete fictional seed in the shared UI shell, JavaScript and CSS assets and loads the public adapter from showcase/sandbox.js.

## Source and build

| Source | Purpose |
|---|---|
| showcase/index.html | English portfolio case study |
| showcase/assets/ | Local styles, interactive zone selector, favicon and actual application capture |
| showcase/sandbox.js | Browser-only commands, rollback, import, local save/reset and tour |
| prototype/index.template.html | Shared operational interface |
| demo/application-data.json | Deterministic full-inventory fixture |
| tools/build_pages.py | Creates only the intended public files in _site/ |
| tools/check_pages.py | Checks artifact completeness and local asset links |
| tests/public-sandbox.test.mjs | Fourteen adapter regression tests |
| .github/workflows/pages.yml | Build, test and publish using GitHub Pages Actions |

```bash
python3 tools/build_pages.py
python3 tools/check_pages.py
node --test tests/public-sandbox.test.mjs
python3 -m http.server 5090 --bind 127.0.0.1 --directory _site
```

Open http://127.0.0.1:5090/ for a local preview. Node 24 runs the tests; no npm dependencies or frontend build installation are needed.

## Publication

The repository is public so visitors can inspect the code and portfolio evidence. GitHub Pages uses the workflow build type and deploys the artifact from _site/. Only the showcase, fictional sandbox, sample manifest, assets and discovery files are published as the site. Local runtime files, environment secrets and the .NET server are excluded from the Pages artifact.

## Review checklist

Check the public URL in an anonymous context; desktop and narrow layouts; zone selection and deep links; tour entry/exit; inspection and session records after reload; invalid input rollback; import errors; report/print; reset; and absence of backend requests or JavaScript errors. The map is illustrative rather than a real geospatial plan.

## Release traceability and browser checks

`VERSION` defines the demo release. `build-info.json` and HTML metadata identify the source commit. Shared operational UI source lives in `prototype/app.js`, `prototype/app.css` and `prototype/index.template.html`; generated standalone HTML inlines those assets, while the API and Pages edition serve them separately. Pages deployment requires the Chromium desktop/mobile suite in `tests/e2e/` to pass. Assets carry source-commit query strings. Session data is tab-local and resettable; malformed saved state falls back to fixtures.
