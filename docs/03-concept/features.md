# Feature scope and implementation status

**Implemented** means present in the local application. **Partial** identifies an explicit functional limit. **Planned** means no implementation is claimed. MoSCoW remains a delivery priority, not a completion claim.

| Module | Capability | Priority | Status |
|---|---|---|---|
| Access | Sign-in, cookie session, role checks and login rate limiting | Must | Implemented for five shared demo accounts |
| Access | Individual user administration, recovery and OIDC | Must for production | Planned |
| Access | Tenant and manufacturer data isolation | Must for hosted multi-customer use | Planned |
| Vehicles | CSV arrival import, VIN and duplicate validation | Must | Implemented |
| Vehicles | Search, filters, paginated list, detail and history | Must | Implemented |
| Vehicles | Departure planning and readiness enforcement | Must | Implemented; no override workflow |
| Inspections | SOC, 12V, damage, concern and note entry | Must | Implemented |
| Inspections | Append-only history, actor and profile version | Must | Implemented |
| Inspections | Camera scanning and photo evidence | Should | Planned |
| Inspections | Offline queue and conflict reconciliation | Could | Planned |
| Rules | Versioned data profiles and model precedence | Must | Implemented |
| Rules | Storage, stale inspection, forecast and departure evaluation | Must | Implemented |
| Rules | Profile source attachments and approval workflow | Must for real operation | Planned |
| Alerts | Current deterministic dashboard alerts | Must | Implemented |
| Alerts | Acknowledge/resolve history and scheduled escalation | Should | Planned |
| Alerts | SignalR and notifications | Should | Planned |
| Yard | Movement validation and occupancy counts | Must | Implemented |
| Yard | Quarantine with HSE decision and justification | Must | Implemented |
| Yard | Emergency CSV and density warning | Should | Implemented |
| Yard | Zone CRUD and graphical map | Should / Could | Planned; seeded zones only |
| Charging | Approval, start/stop, exclusive charger assignment | Should | Implemented |
| Charging | Actual SOC, metered/estimated kWh and CSV summary | Should | Implemented |
| Charging | Charger CRUD, OCPP and power optimisation | Should / Could | Planned; seeded chargers only |
| Reports | VIN handover snapshot and PDF export | Must | Partial: browser Print / Save as PDF |
| Reports | Batch/monthly reports and OEM portal | Should / Could | Planned |
| Engineering | Build, tests, CI, atomic local storage and concurrency | Must | Implemented |
| Engineering | PostgreSQL, durable jobs, cloud deployment and monitoring | Must for production | Planned |

## Public portfolio edition

The GitHub Pages site includes a public case study and an isolated browser simulation using all 2,000 fictional records. The sandbox supports inspections, charging, quarantine, profile versions, CSV import, reports, tab-local persistence and reset. A guided walkthrough introduces six workflows. No backend authentication, real role enforcement, shared server storage or physical equipment connection is provided by the public edition. The .NET capability statuses above refer to the separate application.

## Acceptance boundary

The local demo is complete when its documented flows run, failed commands do not mutate data, records survive restart, English content and links pass repository checks, and domain plus HTTP smoke tests pass. This does not establish operational safety, legal compliance, scalability or production readiness.

See [backlog](../06-delivery/backlog.md) for the next deliverables and [testing](../testing.md) for executable verification.
