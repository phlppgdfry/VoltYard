# Fictional demo fixtures

All brands, WMI codes, vehicles and profile thresholds are invented for software testing. They are not real OEM instructions. Generated VINs follow the demo check-digit policy; a valid format does not imply a real vehicle.

```bash
python3 tools/generate_demo_data.py
python3 tools/check_repository.py
```

Seed: 42. Reference date: 28 September 2026. A newly created application store rebases relative dates once to the current UTC date. Existing runtime stores are not changed by regeneration.

| File | Contents |
|---|---|
| [application-data.json](application-data.json) | Complete connected application seed |
| [rule-profiles.json](rule-profiles.json) | Four fictional manufacturers and seven profiles, including V7-specific and terminal fallback |
| [zones.json](zones.json) | Seven zones and derived fixture occupancy |
| [chargers.json](chargers.json) | Twenty fixed 22kW chargers, L17 faulted, and two mobile 50kW chargers |
| [vessel-voltara-400.csv](vessel-voltara-400.csv) | 400 arrivals; CSV lines 139 and 290 intentionally have invalid VINs |
| [seed-vehicles.csv](seed-vehicles.csv) | 2,000 vehicle inventory rows |
| [seed-inspections.csv](seed-inspections.csv) | 11,714 historical observations |
| [seed-charging-sessions.csv](seed-charging-sessions.csv) | 667 synthetic historical energy sessions |
| [rule-engine-cases.md](rule-engine-cases.md) | Behaviour and boundary test matrix |

## Deliberate scenarios

Twelve vehicles start in quarantine, 25 EVs in Standard storage, and C-EV-3 contains 516 EVs against a 480 EV limit. Some inspections are overdue; SOC and 12V conditions vary. Charger L17 is faulted. V7-specific profiles override generic Voltara rules. Nordhavn's fictional shipping maximum is 45%.

Historical energy sessions demonstrate reconciliation tables and are synthetic ledger entries; they are not a physically simulated reconstruction of each seeded SOC trajectory. New sessions append accurate entered/estimated provenance.

The standalone prototype loads 60 vehicles from the same fixtures. Its zone totals describe the full synthetic yard, while vehicle lists and exports contain only the preview sample. The connected application uses all 2,000 records.

## CSV contract

Use `vin,brand,model,powertrain,kwh,manufacturerCode` and optionally `destination,departure`. Invalid or duplicate rows are rejected individually. The arrival zone may impose additional capacity rejections. Do not edit generated outputs; edit the generator and regenerate.
