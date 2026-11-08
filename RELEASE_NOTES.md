# VoltYard v0.3.0-demo.1

Portfolio/demo prerelease — 8 November 2026.

[Public case study](https://phlppgdfry.github.io/VoltYard/) · [Interactive sandbox](https://phlppgdfry.github.io/VoltYard/demo/) · [Guided walkthrough](https://phlppgdfry.github.io/VoltYard/demo/?tour=1)

VoltYard demonstrates an operational coordination and evidence layer connecting inspections, EV readiness, exceptions and handover for automotive/RoRo terminals. This is a finished demonstration release, not approved operational terminal software.

## Delivered

- English enterprise case study and isolated, no-login browser sandbox with 2,000 deterministic synthetic vehicles.
- Inspect, filter, charge, quarantine, review profiles, import CSV and produce printable handover records; reset tab-local changes at any time.
- Separate .NET 10 backend with cookie/role protection, optimistic revisions, atomic file persistence, append-only observations and command audit.
- Shared, reviewable browser assets; deep links, reload/back navigation, guided-tour exit and recovery from malformed tab state.
- Exclusive local store ownership, safe problem responses, bounded HTTP bodies, same-origin script CSP, and CSV formula escaping.
- Locked npm/NuGet dependencies, browser-gated Pages deployment, source commit metadata and container verification.

## Verification

Release validation commands and the historical/current evidence are documented in [testing](docs/testing.md). The final verification set includes 36 backend tests, 16 public-adapter tests, 74 disposable-store HTTP assertions and ten public Chromium desktop/mobile journeys and two published-backend UI journeys. Release build and publish are checked, and dependencies are audited for known vulnerabilities. Hosted CI builds and exercises a non-root container and compares persisted data across restart. Browser screenshots and measurements are retained in the workflow artifacts for 14 days.

The deployed `build-info.json` identifies the exact source commit. A successful backend build is separate from a public backend deployment; the release does not provision a backend host.

## Practical limits

No real terminal pilot, OEM/carrier profile approval, TOS/OCPP integration, live charger control, individual enterprise identity, tenant isolation or production database is included. The file adapter remains single-process local demo storage. Browser state is synthetic and local to a visitor's tab. Quarantine decisions demonstrate workflow recording and do not certify battery safety or replace approved site procedures. Current quarantine case details are held on the vehicle; command audit is not an immutable safety evidence archive.

No formal penetration test, WCAG conformance certification, commercial ROI or customer endorsement is claimed. [Operational readiness](docs/09-review/operational-readiness.md) and the [pilot plan](docs/04-validation/pilot-plan.md) describe the validation gates before real use.
