# Charging workflow

## Purpose

Coordinate manual charging work by VIN and retain an explainable energy record. The application does not control physical equipment.

## States and guards

| Transition | Role | Server checks |
|---|---|---|
| Proposed → Approved | Planner/Admin | Vehicle active, no unresolved quarantine, target above current SOC, no existing order |
| Approved → Running | Operator/Planner/Admin | Approved order, safe workflow state, free available charger, target still valid |
| Running → Completed | Operator/Planner/Admin | Running session, finite end SOC between start SOC and 100, valid optional energy reading |

A charger can serve only one active session. Faulted L17 is never assigned. A repeated start/stop fails instead of creating duplicate energy records. Global optimistic concurrency protects simultaneous commands.

## End-of-session evidence

Enter the observed final SOC. If a meter reading is unavailable, energy is estimated:

```text
estimated kWh = (end SOC - start SOC) / 100 × nominal battery capacity / 0.90
```

The stored session identifies whether kWh is metered or estimated. This calculation is a demonstration approximation, not a billing-grade meter. Observations above the planned target remain recorded and departure alerts remain visible; the system must not rewrite a real reading to match a target.

A charging SOC observation does not reset the last manual inspection date. Physical damage and 12V condition still need independent observation.

## Targets and conflicts

Use the [profile target algorithm](rule-profiles.md), including the next destination's limits when departure is within seven days. An impossible minimum/maximum combination requires review, not automatic violation of one rule.

## Energy summary

The manufacturer CSV totals all recorded sessions in the current store, including synthetic history. It is not a monthly invoice and has no tax, tariff or currency logic. Reports retain individual sessions and their energy source.

## Roadmap

Charger administration, explicit charger selection, cancelled orders, meter identifiers, correction/reversal records, tariffs, period reconciliation, OCPP, power caps and mobile charging routes. Validate hardware access and customer chargeability before implementing these integrations.
