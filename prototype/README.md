# English interface and standalone preview

The connected application serves `index.template.html` and loads all 2,000 fictional vehicles from the .NET API. Start it with the root README instructions for persistent storage, authentication and authoritative server validation.

For a standalone demonstration, open [index.html](index.html) directly in a browser. It embeds 60 vehicles and uses simplified session-only commands. Reloading resets preview changes. It does not provide authentication, full inventory exports or CSV import. Zone totals represent the full fixture; preview lists represent the sample.

## Editing

Edit `index.template.html`, then run:

```bash
python3 tools/generate_demo_data.py
python3 tools/check_repository.py
```

Never hand-edit generated `index.html` or sample-data.json. The template has no external JS or font dependency. Its English UI covers dashboard, vehicles, field inspections, charging, safety, profile simulation, import and audit. Backend-only functions explain their connection requirement in the standalone preview.

## Verification

Check desktop and narrow viewports, keyboard form entry, server errors, dialog focus, actual state after reload and report printing. The live server is authoritative for role checks and workflow conflicts. Browser-native charts and client simulation are presentation helpers.

The old private hosted artifact is not the canonical source. Use the checked-in preview or connected application for review.
