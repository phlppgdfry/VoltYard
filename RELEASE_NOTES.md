# VoltYard v0.4.0-demo.1

Portfolio/demo prerelease — 23 November 2026.

[Public case study](https://phlppgdfry.github.io/VoltYard/) · [Choose a scenario](https://phlppgdfry.github.io/VoltYard/demo/#scenarios) · [My shift](https://phlppgdfry.github.io/VoltYard/demo/#shift)

## Delivered

- Two goal-based public scenarios: departure preparation and documented quarantine exception review. Progress follows recorded inspections, plans, charging sessions, HSE decisions, report review and departure; no manual completion checkboxes.
- Scenario progress persists through refresh. Starting a scenario confirms a tab-local synthetic reset; persistent backend stores have no scenario-reset endpoint. New vehicle evidence invalidates an earlier report-review step.
- Personal, unassigned, team and completed work views; VIN/model search and pagination.
- Persisted eligible demo owners and UTC deadlines, rescheduling and unassignment, append-only assignment-change history and existing optimistic-revision protection.
- Explainable domain-derived priority: safety/critical/observation/handover base ranks, overdue and near-departure adjustments. Conditions clear or reopen assignments; forecasts at an already reached charge target produce review work. Conflicting charge/departure targets create admin-only profile review without breaking yard-state loading.
- Dispatch restricted to Admin/Planner in the backend. Assigning work grants no additional vehicle-action permissions. The public account selector is a fictional personal-view filter.
- Updated showcase screenshots, user guide, architecture decision, readiness review and automated regression coverage.

## Verification

45 backend cases, 22 public-adapter cases, 18 desktop/mobile public browser journeys, two backend UI journeys and 92 HTTP assertions per disposable environment. The HTTP suite checks authoritative work projection, invalid assignment, history, unassignment and role boundaries. Backend browser checks include assignment, reload and unassignment. CI builds/tests/publishes the backend, audits dependencies, exercises a non-root container and restart persistence, and gates Pages on real browser journeys.

Deployment metadata in `build-info.json` identifies the source commit. See [testing](docs/testing.md) and the [scenario/shift guide](docs/scenarios-and-shift.md). Browser screenshots and reports are retained in CI artifacts for 14 days.

## Boundaries

This is a completed portfolio demonstration, not approved operational terminal software. Scenarios use fictional tab-local records and a fixed demo shift clock. The separately runnable backend uses its actual evaluation timestamp and local single-process JSON persistence; it is not publicly hosted by Pages. Shared demo accounts are not individual staff identities. Assignment completion means the recorded trigger has cleared, and may reopen; it is not evidence that a named person performed physical work. Report review is visitor progress, not a signed approval.

No production roster/capacity optimiser, background reminders, recurring visit model, OEM/HSE approval, TOS/OCPP integration, production database, formal security/accessibility certification or field validation is claimed. Operational production gates remain in the [readiness review](docs/09-review/operational-readiness.md).
