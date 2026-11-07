# Operational fit and readiness review

Review date: 7 November 2026. This combines a source-code review, executable regression checks, browser verification and desk research. It is not an independent security certification, operator endorsement or a completed field study.

## Assessment

**Useful portfolio demonstrator; plausible operational problem; unproven standalone business; not ready for unsupervised terminal operations.**

The likely users are automotive/RoRo terminal operators, inland vehicle compounds, PDI teams and EV logistics service providers. A port authority or a container terminal is not automatically the buyer. A focused integration for an identified operator is a more credible next hypothesis than a general-purpose port platform.

## Evidence from the industry

| Evidence | What it establishes | What it does not establish |
|---|---|---|
| [Wallenius Wilhelmsen's Zeebrugge terminal page](https://www.walleniuswilhelmsen.com/terminal/zeebrugge) lists EV charging and on-port vehicle processing | These activities exist at the target type of site | A missing software tool or willingness to buy VoltYard |
| [Smappee's ICO case study](https://www.smappee.com/eu/cases/ico-terminals-from-standalone-charge-points-to-one-controlled-energy-system) describes per-vehicle energy targets passed from ICO's system through an API, alongside site energy control | Material overlap with the charging proposition is already marketed for a named terminal | Independent verification of vendor performance or the completeness of its inspection/evidence workflows |
| [INFORM's Vehicle Yard Management page](https://www.inform-software.com/en/solutions/vehiclelogistics/vehicle-yard-management) describes vehicle location/condition visibility, planning and partner interfaces | Established alternatives already manage significant adjacent workflows | A detailed feature comparison without a vendor demonstration |
| [ECG's SOC requirements page](https://www.ecgassociation.eu/publications-and-reports/ev-soc-requirements/) says its OEM table was updated in May 2026 and instructs readers to confirm with the relevant companies | Requirements vary and public summaries need confirmation | Authority to configure a real operating profile from the demo values |
| [ECG's October 2025 BEV handling announcement](https://ecgassociation.eu/article/?id=3ee64ddb-fac9-4a8a-a9e9-72bc1492fb94) describes work involving maritime carriers | Industry procedures continue to evolve | A universal quarantine or incident-response rule |

Vendor pages establish published capabilities, not independently audited outcomes. No sales claims, port throughput estimates or promised safety improvements are inferred from these sources.

## Where VoltYard might add value

A potential entry point is a gap between an operator's existing TOS, charger platform and inspection records: explain which approved instruction applies, identify an unresolved exception, assign follow-up and reconstruct a VIN's handling history. This is an inference to test, not a demonstrated competitive advantage.

A smaller compound with fragmented records may be more accessible for discovery than a large terminal with established enterprise systems. That is a recruitment hypothesis; budget, connectivity, IT requirements and existing software still need checking.

## Defects corrected during this review

| Finding | Effect before the fix | Change and verification |
|---|---|---|
| Forecast used the last manual inspection date to age the latest SOC | A recent charge could be treated as an old reading and create a false predictive alert | Forecast ages the latest SOC observation; manual inspection freshness remains separate. C# and browser-adapter regressions |
| Uninspected arrivals carried internal zero/OK placeholders | Current alerts could imply a measured empty battery; some views implied a known auxiliary condition | Explicit INSPECTION_REQUIRED alert; no invented SOC/predictive alerts; UI/export show unmeasured/unknown; API rejects omitted SOC/auxiliary fields; arrival inspection required before charging/departure |
| Public simulation retained an old Released decision when re-entering quarantine | A second quarantine could be exited using the previous release | Re-entry opens a new review state; regression proves movement remains blocked until a new decision |
| Downloaded CSV strings were quoted but did not neutralise formula prefixes | A user-entered model or manufacturer could be interpreted as a spreadsheet formula | Shared CSV formatter prefixes dangerous leading characters; regression covers formula and quote escaping |

These are corrections to the demonstrator. They do not close the production blockers below.

## Operational gaps that matter most

| Priority | Gap | Why an operator would care | Required next evidence/deliverable |
|---|---|---|---|
| P0 | TOS/inventory ownership and reconciliation | A second location list becomes stale and creates double entry | Agree source of truth, identifiers, events, retries, reconciliation and correction ownership |
| P0 | Recurring yard visits for the same VIN | A vehicle can return; a permanent departed flag and duplicate rejection cannot model every visit | Vehicle identity separate from YardVisit, custody, actual arrival/departure and return flows |
| P0 | Approved, applicable instructions | OEM, model, software/transport mode, carrier and route may change what is required | Licensed/approved source, scope, effective/expiry dates, approver and conflicts/fallback policy |
| P0 | Individual identities and permissions | Shared demo accounts cannot attribute real staff decisions | Individual identity, role review, terminal/customer isolation and account lifecycle |
| P0 | Durable evidence and corrections | Latest quarantine case and generic audit metadata cannot reconstruct every prior movement, decision and correction | Append-only cases/events, location history, authorised reversals and stored report snapshots |
| P0 | Physical safety authority | A scratch, suspected battery issue and active incident need different handling | HSE-approved triage and escalation; distinguish software hold from physical isolation and emergency response |
| P0 | Recovery and operating continuity | One file/process is not sufficient for an operational system | Transactional database, tested restore, monitoring, support and fallback procedures |
| P1 | Exact parking position and access | A zone code alone may not locate a blocked-in or immobilised vehicle | Site/level/row/bay, key/access process and agreed movement/recovery observation |
| P1 | Observation provenance and missing values | No reading is different from zero; 12V OK is not proof that a car can move | Nullable/explicit observation states, method, device/source, captured/received times and correction workflow |
| P1 | Auxiliary battery model | A three-value 12V field is not a general diagnostic model | Approved battery type/nominal voltage/test method and a separately observed mobility state |
| P1 | Charging feasibility | First-free assignment ignores connector, AC/DC support, power, staff and site constraints | Equipment/vehicle compatibility, reservations, power budget, cancellations and fault handling |
| P1 | Energy accounting | SOC change and nominal capacity do not establish billing-grade energy or an exact target | Meter identifiers/readings, estimate provenance, contract units, periods and reconciliation |
| P1 | Task usability at scale | A first-50 charging table, no assignment and weak deadline handling leave work hidden | Search/pagination, staff/zone assignment, departure deadlines, shift capacity and field navigation |
| P1 | Connectivity and duplicate entry | Repeated walking, unlocking vehicles and typing may cost more than the proposed saving | Observe real work, scan/device trial and measured offline/conflict requirements |
| P1 | Notification ownership | Calculating current alerts is not durable acknowledgement/escalation | Alert owner, due time, acknowledge/resolve/reopen history and idempotent scheduled evaluation |
| P1 | Readiness versus approval | No current alert does not prove carrier acceptance, condition, legal/customs release or safe loading | Separate statuses for missing evidence, work completion and authorised transport release |
| P2 | Maintainability and independent verification | Dense inline UI and duplicated JavaScript/C# logic increase drift risk | Shared behavioural fixtures, independent end-to-end checks and a frontend module/refactor plan |

P0 means a gate before real operational reliance, not a feature that must be added to a public portfolio demo. Some P1 items become P0 for a particular site's procedure. The operator must determine that applicability.

## Data acquisition is a major product question

Which vehicles expose SOC without being opened or awakened? What changes in transport mode? Who has keys and authority to read a dashboard or diagnostic interface? Does a charger actually provide SOC, or only energy? Which observations can legally and contractually be reused? Do not assume OCPP alone provides VIN identity or SOC for every AC charging setup.

Charge targets expressed in percentage SOC and targets expressed in delivered kWh are different contracts. The demonstrator's fixed 90% efficiency calculation is an estimate. An integration needs the provider's actual capabilities and units, validated measurements and a reconciliation owner.

## Workload and economics check

Illustration only: 2,000 active vehicles inspected every 14 days imply about 143 inspections/day on average. At an assumed two minutes of total work per inspection, that is about 4.8 person-hours/day before additional travel or exceptions. A 30-second form target measures data entry, not the entire visit. Real schedules, sampling rules and OEM instructions must replace these assumptions.

Calculate benefit after subtracting the extra effort of observation, double entry, training, support and integration. Do not add avoided incidents or extra billable energy as guaranteed savings. A customer must confirm baseline work and which services it can charge for.

## Recommended next move

Use the public site for research and portfolio review. Recruit a planner, field operator, HSE owner, technical/IT owner and budget owner from a specific operator. Ask them to walk through a recent real exception and their existing systems before showing the demo.

Then agree a bounded, supervised **shadow-mode** study: the established process remains authoritative; VoltYard makes no equipment commands, transport releases or emergency decisions. See [pilot plan](../04-validation/pilot-plan.md). Do not start by adding AI, more dashboards or a full TOS replacement.

## Decision gates

- **Portfolio/shareable demonstration:** suitable with explicit fictional-data and edition boundaries; build/tests/browser checks support this claim.
- **Discovery workshop:** suitable as a discussion instrument; no real operational data is required.
- **Supervised real-data pilot:** not yet approved; requires a named sponsor, data permission, approved instructions, scoped technical controls and shadow-mode protocol.
- **Production terminal use:** not ready. No complete field validation, independent security review, production identity/database/operations or buyer commitment is recorded.

## Verification of the corrected release

33 backend regression cases, 14 public-sandbox cases and 70 HTTP assertions pass locally. Repository/static artifact checks pass. Browser checks verify unknown-arrival presentation and blank required inputs on a narrow viewport without JavaScript errors or horizontal overflow. See [testing](../testing.md) for commands and evidence boundaries.

## Limits of this review

The review does not exercise every browser, fixture permutation, failure mode or adversarial payload. Tests demonstrate selected invariants, not exhaustiveness. No terminal operator, OEM, carrier, insurer or HSE authority was contacted as part of this review. Nothing here is evidence that one of the named organisations endorses or needs VoltYard.
