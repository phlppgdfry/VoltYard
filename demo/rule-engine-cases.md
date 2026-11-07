# Rule and workflow verification matrix

Reference date for deterministic unit tests: 28 September 2026. Storage profile: minimum 30, target 50, maximum 60, critical 15; inspection interval 14 days; fallback discharge 0.1 percentage points/day.

| Case | Input | Expected |
|---|---|---|
| S1 | SOC 24 | SOC_BELOW_MIN, High |
| S2 | SOC exactly 30 | No SOC_BELOW_MIN; predictive-low may still apply |
| S3 | SOC 12 | SOC_CRITICAL only among storage SOC severity rules |
| S4 | SOC exactly 15 | SOC_BELOW_MIN, not critical |
| P1 | 34 → 32 over 10 days, 14-day horizon | 29.2 predicted, predictive-low |
| P2 | 31 today, one reading, fallback 0.1/day | 29.6 predicted |
| P3 | Old reading 32 on 1 September | Age included before future horizon; predictive-low |
| P4 | 30 before charge, 50 after charge, then 49 over 16 days | Rate based on 50 → 49, not pre-charge value |
| C1 | Exactly 14 days since manual inspection | No overdue alert |
| C2 | 15 days since manual inspection | INSPECTION_OVERDUE |
| C3 | Weak 12V | TWELVE_VOLT_WEAK |
| C4 | Dead 12V / cannot drive | NOT_DRIVEABLE |
| D1 | SOC 58, Shipping in four days, max 50 | DEPARTURE_SOC_HIGH |
| D2 | Same, departure in eight days | No departure-window alert yet |
| D3 | Departure in exactly seven days | Departure rules apply |
| D4 | Dealer minimum 60 with target 55 and max charge 60 | Target raised to 60 |
| D5 | Dealer minimum 70 with max charge 60 | Conflict requiring review |
| T1 | Unresolved concern outside quarantine | QUARANTINE_REQUIRED |
| T2 | EV in Standard zone | WRONG_ZONE |
| T3 | C-EV-3 inventory 516, max 480 | One zone-level density alert |
| T4 | Quarantined vehicle, charging approval/start | 409; no session created |
| T5 | Non-HSE attempts quarantine decision | 403 |
| T6 | Destination full or release without authority | Conflict; no partial movement/decision |
| V1 | Incorrect check digit, I/O/Q, short VIN | Invalid |
| V2 | Valid model-specific match | Model profile wins |
| V3 | Unknown manufacturer in profile selection | Terminal fallback |
| Q1 | Stale revision | 409 and no side effects |
| Q2 | Command mutates then throws | Committed state unchanged |
| Q3 | Store reopened after commit | Recorded value retained |
| Q4 | Repeated charge start/stop | Conflict; no duplicate allocation/energy |
| I1 | Valid manifest with two invalid VIN rows | Valid rows imported while capacity allows, exact row errors |
| I2 | Duplicate import | Existing VINs rejected |
| I3 | Quoted comma in brand/model | Parsed as one field |
| I4 | Malformed quoting | Whole command rolled back |

Executable coverage is split between xUnit and the HTTP smoke test; this matrix also includes manual/pilot scenarios. Do not describe every row as automated. See [testing](../docs/testing.md) for commands and limits.
