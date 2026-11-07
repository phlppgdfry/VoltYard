# Vision and value proposition

**Help terminal teams keep stored EVs operational and produce a clear record of how each vehicle was handled.**

For a yard planner, VoltYard turns observations and approved manufacturer instructions into a prioritised work list. For an operator, it provides a short inspection form. For HSE, it keeps unresolved concerns visible. For a customer, it provides a VIN-based handover record.

## Product principles

- Start with the vehicle and its evidence record.
- Store manufacturer instructions as versioned data.
- Enforce consequential workflow rules on the server.
- Show missing information rather than inventing measurements.
- Keep field entry short and usable on a small screen.
- Complement the terminal operating system through explicit integration boundaries.

## First release

One terminal, manual observations, CSV arrivals, profile evaluation, charging records, quarantine decisions and handover snapshots. The current implementation is local and demonstrable with fictional data.

## Future direction

PostgreSQL, individual identities, tenant isolation, a durable alert lifecycle, TOS integration and charger telemetry follow pilot validation. They are not prerequisites for testing whether operators understand the workflow.

## Product boundaries

VoltYard is not a BMS, thermal monitoring device, fire alarm, TOS replacement or legal compliance certificate. It does not remotely control real chargers in this version.

## Value test

A successful pilot must show less manual reconstruction and fewer missed tasks relative to a measured baseline. Attractive dashboards alone do not establish operational value.
