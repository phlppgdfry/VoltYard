# Demoscript (±10 minuten)

## 0. Opening: het probleem (1 min)
> *"Zeebrugge is de grootste autohaven van Europa. ICO alleen verwerkte vorig jaar 2,5 miljoen wagens. Steeds meer daarvan zijn elektrisch, en die blijven soms maandenlang staan. In 2024 stonden onverkochte Chinese EV's tot 18 maanden in Belgische havens. Een EV die te lang stilstaat, loopt leeg. Een lege EV kan niet meer rijden, en een beschadigde batterij is een brandrisico. En elke fabrikant heeft andere regels. Vandaag gebeurt dat met Excel en papier. VoltYard lost dat op."*

Toon: één slide met een foto van een vol terrein + drie pijnpunten.

## 1. Een schip komt aan (1,5 min)
- Log in als **planner**.
- Importeer `demo/schip-voltara-400.csv` → toon het importrapport (398 aangemaakt, 2 ongeldige VIN's met reden).
- Toon dat elk voertuig automatisch een **regelprofiel** kreeg.

## 2. Controle op het terrein (2 min)
- Wissel naar de **mobiele weergave** (gsm of devtools) als **terreinmedewerker**.
- Open de takenlijst → **scan een VIN** (een barcode op het scherm of op papier).
- Voer een laadtoestand van **22%** in, 12V "Zwak".
- **Wow-moment 1:** op het dashboard van de planner (tweede scherm) verschijnt de waarschuwing live, zonder te verversen (SignalR).

## 3. Regels en voorspelling (1,5 min)
- Open het voertuig → toon de **tijdlijn** en de **grafiek van de laadtoestand** met de voorspellingslijn.
- *"Deze wagen vertrekt over 12 dagen per schip. Met deze ontlaadsnelheid zakt hij onder het minimum. VoltYard waarschuwt dus nu al, niet pas als het te laat is."*
- Toon het **regelprofiel**: *"Een nieuwe fabrikant toevoegen is configuratie, geen code."*

## 4. Laden (1,5 min)
- Toon de voorgestelde **laadopdracht**: doellaadtoestand 45%, *niet* 80%. *"Want het vertrek gebeurt per schip, en de rederij accepteert maximaal 50%."*
- Start de sessie op lader L3 → stop → kWh geregistreerd.
- Toon het **overzicht voor facturatie** per fabrikant. *"Wat vroeger gratis gebeurde, kan de terminal nu factureren."*

## 5. Veiligheid (1,5 min)
- Meld **schade + een verdachte batterij** → de wagen krijgt de status *Quarantaine vereist*, HSE wordt verwittigd.
- Log in als **HSE** → neem een beslissing met motivering.
- Open het **noodoverzicht** van zone C → *"Als hier morgen brand uitbreekt, heeft de brandweer deze lijst binnen tien seconden."*

## 6. Bewijs (0,5 min)
- Genereer het **overdrachtsrapport** (PDF) → toon de volledige geschiedenis met tijdstempels en profielversie.

## 7. Onder de motorkap (1 min)
- Het C4-containerdiagram, 2 ADR's (regels als data, modulaire monoliet).
- De CI-pipeline (groen), de testdekking van de regelmotor, Bicep → Azure.

## 8. Afsluiting (0,5 min)
> *"VoltYard is gebouwd als eindwerk, maar het vertrekt van een echt probleem in onze eigen haven. De volgende stappen zijn een koppeling met laders via OCPP en met het batterijpaspoort dat vanaf februari 2027 verplicht is."*

## Voorbereiding
- [ ] Seed-data met de juiste demovoertuigen (VIN's klaar, barcodes afgedrukt)
- [ ] Twee browservensters: planner (desktop) + terreinmedewerker (mobiel)
- [ ] `minReplicas = 1` in Azure, de avond ervoor getest
- [ ] Een backup: lokale Docker-omgeving + een opgenomen demovideo
- [ ] 3× volledig geoefend met een timer
