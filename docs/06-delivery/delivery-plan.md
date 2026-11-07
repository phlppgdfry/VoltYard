# Delivery plan

## Release 0.1 — local executable demonstration

English documentation and paths; deterministic fixtures; .NET modular monolith; server commands; local persistence; role sessions; dashboard, inspections, charging, safety, profiles, import, departure and handover; domain tests, HTTP smoke test and CI.

The implementation supports demonstrating these workflows. It does not close customer validation or production-readiness milestones.

## Stage gates

| Stage | Deliverable | Exit evidence |
|---|---|---|
| Discovery | 3–5 role interviews, actual process map and instruction examples | Anonymised findings, counterexamples and agreed problem |
| Local slice | Reproducible app and English dossier | Build, tests, repository checks, HTTP and browser evidence |
| Supervised pilot preparation | Approved profiles, individual identity and database adapter | HSE/operations sign-off, access tests, restore exercise |
| Pilot | Bounded site, vehicle cohort, named support owner | Baseline, observed task timings and incident escalation route |
| Hosted release | Tenant isolation, monitoring, operations and deployment | Security review, load evidence, restore and rollback validation |
| Integration | TOS/OCPP adapters and reconciled imports | Contract tests, replay/idempotency and reconciliation evidence |

## Planning method

Estimate after splitting stories into independently testable changes. Do not promise a calendar duration from unmeasured story-point velocity. Review scope weekly with the supervisor and use evidence to update priorities.

## Dependencies

Real profile instructions and HSE ownership precede safety-sensitive pilot use. Data access and identity decisions precede tenant implementation. Hardware integration depends on charger/vendor access. School assessment requirements must be obtained rather than inferred.

## Release discipline

Keep capability status, API docs, ADRs and executable checks together. Commit verified changes, push to origin without rewriting history and retain a release note describing limitations. A passing demo is not approval to deploy publicly.
