# Problem statement

Automotive terminals hold vehicles between vessel discharge, processing and onward transport. For EVs, the terminal needs to know whether each vehicle can move, whether an inspection is overdue, which manufacturer instructions apply and whether its next transport has different SOC limits.

A location record alone cannot answer those questions. Separate spreadsheets, charger logs and inspection forms make it harder to reconstruct what happened to a particular VIN.

## Stakeholders and consequences

| Stakeholder | Decision | Cost of missing information |
|---|---|---|
| Yard planner | Which vehicles need inspection, charging or movement today? | Recovery work, blocked moves, missed departures |
| Field operator | What must I observe and record at this vehicle? | Repeat visits, transcription errors, incomplete evidence |
| HSE lead | Which concerns remain unresolved and where are affected vehicles? | Unclear ownership and incomplete incident inventory |
| Account manager | What work and energy were supplied for each customer? | Disputed charges and manual reconciliation |
| Manufacturer/importer | How was this vehicle handled during storage? | Weak handover evidence and slow investigation |

## Product question

Can one VIN-based record, driven by versioned manufacturer profiles, reduce missed inspections and improve traceability without replacing the terminal operating system?

## Boundaries

The first implementation covers one fictional terminal. It consumes manual observations and CSV manifests. It does not infer actual battery health from SOC or identify fire risk from a percentage alone. Physical interventions remain the responsibility of trained terminal staff.

## Success measures for a supervised pilot

Establish a baseline before deployment: missed inspections per 100 vehicles, time to locate a record, time to record an inspection and time to prepare a handover. Proposed targets are median inspection entry below 30 seconds and a complete handover record in under two minutes. These are validation goals, not measured results.

## Evidence status

The operational problem is a research hypothesis informed by the [reading list](../02-research/sources.md). No customer interviews or paid deployments are claimed. Complete the [validation plan](../04-validation/hypotheses.md) before making commercial impact claims.
