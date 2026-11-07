# Repository instructions

- Documentation, UI, comments and new domain names are in English.
- Read README.md, docs/03-concept/features.md and docs/05-architecture/architecture.md before changing behaviour.
- Keep the modular monolith: Api → Infrastructure/Application → Domain. Domain has no external packages.
- Manufacturer thresholds are versioned data, never branches hardcoded by brand.
- Inspections and audit events are append-only. Record actor, time and profile version on new measurements.
- Use TimeProvider at application boundaries; pass dates explicitly to pure domain rules.
- Server-side validation and permissions are authoritative. Never trust client-computed safety status.
- A store mutation must commit atomically or leave no changes. Require the current revision for commands.
- Edit prototype/index.template.html, then regenerate with python3 tools/generate_demo_data.py.
- Keep the README and capability/backlog status aligned with code. Do not describe roadmap services as running.
- Run dotnet test, python3 tools/check_repository.py and the relevant disposable-store HTTP smoke test.
- Record material architecture changes in an ADR. Never commit var/yard.json, credentials or private interview notes.
- Commit and push verified repository work to the configured origin; do not rewrite remote history.
