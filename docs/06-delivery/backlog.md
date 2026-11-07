# Product backlog

Status is based on repository behaviour, not the existence of an issue. The original concept's story counts and point totals were planning estimates and are not used as completion metrics.

## Delivered local slice

| ID | Story and acceptance evidence |
|---|---|
| F-01 | As a developer, build a modular .NET solution with dependency-free rules and repeatable fixtures. Build and tests pass. |
| A-01 | As a demo user, sign in with a role. Protected reads require a cookie; forbidden commands return 403. |
| V-01 | As a planner, import a quoted manifest. Invalid/duplicate VINs produce row errors; valid rows are committed atomically. |
| V-02 | As a user, search/filter/paginate vehicles and inspect history. No record changes during a read. |
| V-03 | As a planner, plan and confirm departure. Unresolved vehicle alerts, quarantine and active orders block confirmation. |
| C-01 | As an operator, append an observed SOC/12V inspection with notes and concern flags. Invalid/outlier values are guarded. |
| R-01 | As an admin, simulate and publish ordered thresholds as a new version. Old observations retain their version. |
| R-02 | As a system, choose model > manufacturer > fallback profiles and evaluate current rules with explicit time. |
| W-01 | As a planner, see server-evaluated current alerts ordered by severity. |
| T-01 | As staff, move vehicles only into allowed zones with available capacity. |
| T-02 | As HSE, record a quarantine decision with justification. Only release permits leaving quarantine. |
| T-03 | As HSE, export a complete loaded-zone emergency CSV. |
| L-01 | As a planner/operator, approve/start/stop charging with exclusive equipment allocation and quarantine guards. |
| L-02 | As an account user, distinguish metered versus estimated energy and export manufacturer totals. |
| RP-01 | As a user, generate a handover snapshot and print/save it as PDF. |
| Q-01 | As a developer, reject stale writes and roll back failed commands; preserve records across restart. |

## Next release — required before a real pilot

| ID | Priority | Story | Acceptance criteria |
|---|---|---|---|
| DB-01 | Must | Replace file store with PostgreSQL/EF Core | Migrations from empty database; unique VIN and equipment constraints; transaction rollback and concurrency integration tests |
| ID-01 | Must | Individual identity through OIDC | Role claims mapped centrally; revocation and expired-session tests; no shared accounts |
| TN-01 | Must | Terminal/OEM data isolation | Every read/write scoped; adversarial cross-tenant API tests |
| PR-01 | Must | Profile approval and provenance | Source attachment, approver, effective/expiry dates, conflicting-profile handling and historical replay |
| AU-01 | Must | Durable evidence model | Separate quarantine cases, immutable decisions, full movement records and correction/reversal events |
| OB-01 | Must | Nullable observations | Unknown SOC/12V distinct from zero/dead; mandatory arrival inspection; no fabricated measurements |
| OP-01 | Must | Backup, restore and monitoring | Restore drill, health/readiness split, structured logs, alerts and owner runbook |
| SA-01 | Must | Validate safety workflow with HSE | Approved concern categories, release authority and real incident procedure mapping |
| VL-01 | Must | Customer discovery and baseline | Anonymised findings, workflow timings and pilot success/stop criteria |

## Subsequent improvements

| ID | Priority | Story | Acceptance criteria |
|---|---|---|---|
| AL-01 | Should | Persist alert lifecycle | Unique active alert per terminal/VIN/rule; acknowledge/resolve/reopen history; idempotent scheduler |
| UI-01 | Should | Server-side list and task pagination | Bounded payloads; stable filter/query contract; measured 10k inventory workload |
| ZC-01 | Should | Zone and charger administration | Authorised edits, capacity reduction impact check, unavailable-equipment guards |
| SC-01 | Should | Camera VIN scan and photos | Camera permission/error flow, supported labels, file validation and retention |
| RP-02 | Should | Stored batch/monthly reports | Immutable report payload, renderer version, period filters and reconciliation |
| CH-01 | Should | Session correction and cancellation | Reversal records rather than editing energy history; cancellation releases allocation |
| RT-01 | Could | SignalR updates | Authorised group scope, reconnect and stale-state handling |
| OC-01 | Could | OCPP integration | Device identity, replay-safe session ingestion, meter reconciliation and physical safety boundary |
| OF-01 | Could | Offline field queue | Durable client IDs, user-visible sync and explicit conflict reconciliation |
| MAP-01 | Could | Yard map and mobile route | Validated geometry, accessible list alternative and capacity/route constraints |

## Verification rule

A story is complete only when the [definition of done](definition-of-done.md) is met. Planned tests, interview templates and proposed infrastructure do not count as delivered evidence.
