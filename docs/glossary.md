# Glossary

| Term | Meaning in VoltYard |
|---|---|
| AFV | Alternative-fuel vehicle |
| BEV | Battery electric vehicle |
| PHEV | Plug-in hybrid electric vehicle |
| VIN | Vehicle identification number; demo validation requires 17 permitted characters and check digit |
| OEM | Original equipment manufacturer; represented by manufacturer code |
| SOC | State of charge, percentage; not a battery-health certificate |
| SOH | State of health; not measured or inferred by this application |
| 12V / auxiliary battery | Low-voltage battery; may prevent vehicle operation even when traction SOC remains |
| Dwell time | Time between arrival and departure |
| PDI | Pre-delivery inspection |
| RoRo | Roll-on/roll-off vessel or vehicle-handling operation |
| PCTC | Pure car and truck carrier |
| TOS / YMS | Terminal operating system / yard management system |
| HSE | Health, safety and environment function |
| Rule profile | Versioned configuration describing observation thresholds and departure ranges |
| Quarantine | Recorded isolation/review workflow; physical isolation follows site procedures |
| OCPP | Open Charge Point Protocol; future charger integration |
| CPMS | Charge point management system |
| Metered energy | kWh entered from a meter; demo does not verify the device |
| Estimated energy | Calculated from SOC change, nominal capacity and an assumed efficiency |
| Append-only | Commands add observations; no API edits/deletes existing observations |
| Revision | Global store version required to reject stale writes |
| Handover snapshot | Generated record of stored evidence and current alerts; printable as PDF |
| Tenant | Future organisation/site data boundary; not implemented in this local release |
| ADR | Architecture decision record |
