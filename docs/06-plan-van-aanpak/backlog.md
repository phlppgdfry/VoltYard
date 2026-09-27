# Productbacklog

Formaat: **Als** [rol] **wil ik** [iets] **zodat** [waarde]. Prioriteit volgens MoSCoW. Schatting in story points (1, 2, 3, 5, 8).

---

## Epic 0: Fundament
| ID | Story | Prio | SP |
|---|---|---|---|
| F-01 | Als developer wil ik een solution-structuur (Api/Application/Domain/Infrastructure + tests + web) zodat de code vanaf dag één georganiseerd is | M | 3 |
| F-02 | Als developer wil ik `docker compose up` voor API, web, PostgreSQL en Azurite zodat alles lokaal met één commando draait | M | 3 |
| F-03 | Als developer wil ik een CI-pipeline (build, test, lint) op elke PR zodat fouten vroeg zichtbaar zijn | M | 2 |
| F-04 | Als developer wil ik seed-data (terminal, zones, fabrikanten, profielen, ~2.000 voertuigen) zodat de demo en de tests realistisch zijn | M | 5 |

## Epic 1: Toegang
| ID | Story | Prio | SP |
|---|---|---|---|
| A-01 | Als gebruiker wil ik inloggen met e-mail en wachtwoord zodat alleen bevoegden toegang hebben | M | 5 |
| A-02 | Als admin wil ik gebruikers aanmaken en een rol toekennen zodat iedereen de juiste rechten heeft | M | 3 |
| A-03 | Als systeem wil ik dat gebruikers alleen data van hun eigen terminal zien zodat terminals van elkaar gescheiden zijn | S | 3 |
| A-04 | Als HSE wil ik een auditlog van wijzigingen zodat ik kan nagaan wie wat deed | S | 3 |

**Acceptatiecriteria A-01**
- Correcte gegevens → access + refresh token; foute gegevens → 401 met een generieke boodschap (verklapt niet of het e-mailadres bestaat).
- Na 5 foute pogingen: lockout van 15 min.
- Een verlopen access token wordt in de frontend transparant ververst.

## Epic 2: Voertuigen
| ID | Story | Prio | SP |
|---|---|---|---|
| V-01 | Als planner wil ik een voertuig aanmaken zodat het opgevolgd kan worden | M | 3 |
| V-02 | Als planner wil ik de lijst van het schip importeren als CSV zodat ik niet 400 wagens met de hand invoer | M | 5 |
| V-03 | Als gebruiker wil ik voertuigen zoeken en filteren (VIN, status, zone, fabrikant, met waarschuwingen) zodat ik snel vind wat ik zoek | M | 3 |
| V-04 | Als gebruiker wil ik een voertuigpagina met tijdlijn en grafiek van de laadtoestand zodat ik de volledige geschiedenis zie | M | 5 |
| V-05 | Als planner wil ik een vertrek plannen (datum + bestemming) zodat de vertrekregels toegepast worden | M | 2 |
| V-06 | Als planner wil ik een vertrek bevestigen, met een blokkering of waarschuwing als het voertuig niet voldoet, zodat er geen foute wagens vertrekken | M | 3 |

**Acceptatiecriteria V-02**
- Verplichte kolommen: `vin, merk, model, aandrijving`; optioneel: `batterijKwh, fabrikantCode, bestemming, vertrekDatum`.
- Ongeldige VIN → de rij wordt overgeslagen en in het rapport vermeld met rijnummer en reden.
- Een bestaande VIN wordt overgeslagen (geen duplicaat).
- Een CSV van 1.000 rijen is in < 10 s verwerkt.
- Na de import is automatisch een regelprofiel gekoppeld aan elk voertuig.

## Epic 3: Controles
| ID | Story | Prio | SP |
|---|---|---|---|
| C-01 | Als terreinmedewerker wil ik op mijn gsm een controle registreren (laadtoestand, 12V, schade, opmerking) zodat de toestand geregistreerd is | M | 5 |
| C-02 | Als terreinmedewerker wil ik de VIN scannen met mijn camera zodat ik niet hoef te typen | S | 5 |
| C-03 | Als terreinmedewerker wil ik een foto toevoegen bij schade zodat er bewijs is | S | 3 |
| C-04 | Als terreinmedewerker wil ik mijn controletaken voor vandaag zien, per zone, zodat ik weet wat ik moet doen | S | 3 |

**Acceptatiecriteria C-01**
- De laadtoestand wordt gevalideerd (0–100). Bij een waarde < 5% of een daling van > 20 punten tegenover de vorige meting wordt om bevestiging gevraagd ("Weet je het zeker?").
- Na het opslaan toont het scherm meteen de nieuwe waarschuwingen.
- De controle kan niet meer gewijzigd worden (append-only).
- Een controle kost ≤ 30 s voor een geoefende gebruiker (testen met 3 personen).

## Epic 4: Regelprofielen en regelmotor
| ID | Story | Prio | SP |
|---|---|---|---|
| R-01 | Als admin wil ik regelprofielen beheren per fabrikant, model en aandrijving zodat de regels per merk kloppen | M | 5 |
| R-02 | Als systeem wil ik automatisch het meest specifieke profiel kiezen zodat elk voertuig de juiste regels krijgt | M | 3 |
| R-03 | Als systeem wil ik na elke controle alle regels beoordelen zodat waarschuwingen meteen verschijnen | M | 8 |
| R-04 | Als systeem wil ik elke nacht alle actieve voertuigen beoordelen zodat ook tijdsgebonden regels (te laat, voorspelling) werken | M | 5 |
| R-05 | Als planner wil ik een voorspelling van de laadtoestand bij vertrek zodat ik op tijd kan laden | S | 5 |
| R-06 | Als admin wil ik dat profielwijzigingen een nieuwe versie maken zodat oude metingen traceerbaar blijven | S | 3 |

**Acceptatiecriteria R-03** (elke regel heeft eigen unit tests)
- `SOC_ONDER_MIN`: laadtoestand 24, min 30 → waarschuwing Hoog. Laadtoestand 30 → geen waarschuwing (grens inclusief).
- Er is nooit meer dan één *open* waarschuwing per voertuig en regelcode. Bij een nieuwe schending wordt de bestaande bijgewerkt.
- Een waarschuwing wordt **automatisch opgelost** wanneer de regel niet meer geschonden wordt (bv. na laden), met als reden "Automatisch: regel niet meer geschonden".
- De regelmotor is zuiver (geen database of klok in de logica). De tijd komt binnen via `TimeProvider`, zodat hij testbaar is.

## Epic 5: Waarschuwingen en dashboard
| ID | Story | Prio | SP |
|---|---|---|---|
| W-01 | Als planner wil ik een dashboard met open waarschuwingen per ernst en zone zodat ik weet wat vandaag aandacht vraagt | M | 5 |
| W-02 | Als planner/HSE wil ik een waarschuwing bevestigen of oplossen met een reden zodat de opvolging duidelijk is | M | 2 |
| W-03 | Als gebruiker wil ik live updates zonder te verversen zodat het dashboard altijd klopt | S | 5 |
| W-04 | Als HSE wil ik een e-mail bij kritieke waarschuwingen zodat ik ook buiten de app verwittigd word | C | 3 |

## Epic 6: Terrein en veiligheid
| ID | Story | Prio | SP |
|---|---|---|---|
| T-01 | Als admin wil ik zones beheren (type, capaciteit, maximaal aantal EV's) zodat het terrein gemodelleerd is | M | 3 |
| T-02 | Als terreinmedewerker wil ik een voertuig naar een zone verplaatsen zodat de locatie klopt | M | 2 |
| T-03 | Als medewerker wil ik een quarantaine openen met een reden zodat een risicowagen apart gezet wordt | M | 3 |
| T-04 | Als HSE wil ik een verplichte beslissing nemen over elke quarantaine zodat niets vergeten wordt | M | 3 |
| T-05 | Als HSE wil ik een waarschuwing bij een te hoge EV-dichtheid of een verkeerde zone zodat het brandrisico beperkt blijft | S | 3 |
| T-06 | Als HSE wil ik een noodoverzicht per zone (af te drukken of te exporteren) zodat de brandweer meteen weet wat er staat | S | 3 |
| T-07 | Als planner wil ik een kaart van het terrein met de zones in risicokleuren zodat ik visueel overzicht heb | C | 8 |

## Epic 7: Laadmodule
| ID | Story | Prio | SP |
|---|---|---|---|
| L-01 | Als admin wil ik laders beheren (vast/mobiel, kW, zone, status) zodat de laadcapaciteit gekend is | S | 3 |
| L-02 | Als planner wil ik automatisch voorgestelde laadopdrachten met doellaadtoestand en prioriteit zodat ik weet wat eerst moet | S | 5 |
| L-03 | Als terreinmedewerker wil ik een laadsessie starten en stoppen (VIN + lader scannen, eind-laadtoestand, kWh) zodat laden geregistreerd wordt | S | 5 |
| L-04 | Als systeem wil ik de maximale doellaadtoestand afdwingen volgens het profiel en de bestemming zodat een wagen nooit te vol geladen wordt | S | 3 |
| L-05 | Als account manager wil ik een overzicht van laden per fabrikant en periode (CSV) zodat ik kan factureren | S | 3 |
| L-06 | Als planner wil ik een laadplanning die rekening houdt met laders, deadlines en maximaal vermogen zodat laden efficiënt en goedkoop verloopt | C | 8 |

**Acceptatiecriteria L-04**
- Doellaadtoestand = min(`DoelOpslagSoc`, `MaxLaadSoc`, max. laadtoestand van de volgende bestemming als het vertrek binnen X dagen valt).
- Een eind-laadtoestand boven het maximum → waarschuwing `VERTREK_SOC_TE_HOOG` of een overlaadmelding.

## Epic 8: Rapporten
| ID | Story | Prio | SP |
|---|---|---|---|
| RP-01 | Als planner wil ik een PDF-overdrachtsrapport per voertuig zodat ik de fabrikant kan bewijzen dat de wagen correct beheerd werd | M | 5 |
| RP-02 | Als account manager wil ik een batchrapport voor meerdere VIN's zodat ik per transport één document heb | S | 3 |
| RP-03 | Als manager wil ik KPI's (dode wagens, % controles op tijd, gemiddelde wachttijd, kWh) zodat ik de werking kan opvolgen | S | 5 |
| RP-04 | Als fabrikant wil ik een portaal met mijn eigen voertuigen (alleen lezen) zodat ik zelf de toestand kan opvolgen | C | 8 |

**Acceptatiecriteria RP-01**
Het rapport bevat: VIN, merk, model, fabrikant, aankomst en vertrek, het gebruikte regelprofiel (+ versie), een grafiek of tabel van de laadtoestand, alle controles (tijd, waarde, wie), laadbeurten (kWh), quarantaines, zonegeschiedenis, open en opgeloste waarschuwingen, en een tijdstempel van de generatie met een unieke rapport-ID.

---

## Samenvatting
| Prio | Aantal stories | Story points |
|---|---|---|
| Must | 24 | 91 |
| Should | 17 | 63 |
| Could | 4 | 27 |
| **Totaal** | **45** | **181** |

Met ongeveer 12 à 15 SP per week zit de minimale versie (91 SP) rond week 9, in lijn met mijlpaal M3 in het [plan van aanpak](plan-van-aanpak.md).
