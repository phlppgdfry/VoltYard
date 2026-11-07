# Rule profiles and evaluation

A profile is versioned configuration attached to a manufacturer, powertrain and optional model pattern. Fixture values are fictional. Real instructions require explicit OEM/carrier/site approval.

## Profile contract

| Field | Meaning |
|---|---|
| `id`, `name`, `version`, `effectiveFrom` | Stable identity, human label and published version |
| `manufacturerCode`, `powertrain`, `modelPattern` | Applicability; pattern supports `*` |
| `criticalSoc` | Below this: critical storage alert |
| `minStorageSoc`, `targetStorageSoc`, `maxChargeSoc` | Storage minimum, desired target and upper charging target |
| `inspectionIntervalDays` | Manual inspection interval |
| `twelveVoltIntervalDays` | Reserved configuration; no independent 12V due-date rule yet |
| `defaultDischargePerDay` | Percentage points/day used when history is insufficient |
| `departureRules` | Destination type with allowed minimum and maximum SOC |

Validation: `0 ≤ critical ≤ minimum ≤ target ≤ maximum ≤ 100`; inspection intervals 1–365 days; valid departure ranges and finite numeric values.

## Selection

Choose matching manufacturer + powertrain + model pattern first, with the longest literal pattern preferred. Otherwise use the manufacturer/powertrain profile without a pattern, then `TERMINAL-DEFAULT`. A fallback is a demo configuration, not proof of an approved OEM instruction.

## Rules

| Code | Trigger | Severity |
|---|---|---|
| `INSPECTION_REQUIRED` | No recorded battery observation | High; no invented zero-SOC warning |
| `SOC_CRITICAL` | Latest SOC below critical threshold | Critical |
| `SOC_BELOW_MIN` | Below storage minimum, unless critical | High |
| `SOC_PREDICTED_LOW` | Forecast below minimum, unless latest SOC is already low | Medium |
| `INSPECTION_OVERDUE` | Days since manual inspection greater than interval | Medium |
| `TWELVE_VOLT_WEAK` | Latest auxiliary battery status Weak | Medium |
| `NOT_DRIVEABLE` | Dead auxiliary battery or driveable=false | High |
| `DEPARTURE_SOC_HIGH` / `DEPARTURE_SOC_LOW` | Outside destination range within seven days | High |
| `QUARANTINE_REQUIRED` | Unresolved concern outside quarantine | Critical |
| `WRONG_ZONE` | EV located in Standard zone | Medium |
| `ZONE_DENSITY` | Active inventory exceeds a zone EV maximum | High, zone-level |

Equality at a minimum/maximum is allowed. At exactly the storage minimum, a future forecast can still create a separate predictive alert. Critical replaces below-minimum; below-minimum replaces predictive-low.

## Forecast

```text
rate = (previous SOC - latest SOC) / elapsed days
       when the last two observations decline over positive elapsed time;
       otherwise profile.defaultDischargePerDay
horizon = min(14 days, max(0, days until departure)), or 14 without a departure
forecast = max(0, latest SOC - rate × (age of latest SOC observation + horizon))
```

Charging appends an observation, so subsequent declining segments start after the charge. Multiple same-day records use the fallback rate. This simple estimate has no confidence interval or thermal model and is never presented as live telemetry.

## Charging target

Start with `min(targetStorageSoc, maxChargeSoc)`. Inside the departure window, raise to the destination minimum if needed, then cap at both the destination maximum and maxChargeSoc. If the minimum cannot be met, reject charging approval/start with a conflict requiring profile review.

## Version provenance and evaluation

Threshold edits preserve the previous profile in `profileHistory`; new measurements reference the active version. Current alerts are recomputed on state reads and after commands. There are no stored alert acknowledgements, scheduled jobs or immutable historical alert snapshots yet. Reports show current alerts and recorded observations. See [test cases](../../demo/rule-engine-cases.md).

The latest SOC observation date and the last manual inspection date are separate. A charging reading refreshes the forecast input, while the manual inspection can remain overdue. Uninspected vehicles require a real arrival observation before charging or departure; internal legacy defaults are not displayed as measurements.
