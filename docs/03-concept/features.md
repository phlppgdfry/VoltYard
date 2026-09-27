# Features (MoSCoW)

**M** = Must (zonder dit geen finalisatie) · **S** = Should (hoort erbij als het haalbaar is) · **C** = Could (extra) · **W** = Won't (niet in de finalisatie, wel roadmap)

## 1. Basis en toegang
| # | Feature | Prio |
|---|---|---|
| 1.1 | Inloggen (e-mail + wachtwoord), JWT | M |
| 1.2 | Rollen: Admin, Planner, Terreinmedewerker, HSE, Account manager, Fabrikant (lezer) | M |
| 1.3 | Gebruikersbeheer door de admin | M |
| 1.4 | Multi-tenant: meerdere terminals in één installatie | S |
| 1.5 | Auditlog van alle wijzigingen | S |
| 1.6 | Tweestapsverificatie | C |
| 1.7 | SSO (Entra ID) | W |

## 2. Voertuigen
| # | Feature | Prio |
|---|---|---|
| 2.1 | Voertuig aanmaken (VIN, merk, model, aandrijving, batterijcapaciteit, fabrikant) | M |
| 2.2 | **VIN valideren** (17 tekens, geen I/O/Q, controlecijfer waar van toepassing) | M |
| 2.3 | CSV-import van de lijst van het schip | M |
| 2.4 | Lijst met zoeken, filters (status, zone, fabrikant, waarschuwingen) en paginering | M |
| 2.5 | Detailpagina: tijdlijn met metingen, laadbeurten, waarschuwingen, verplaatsingen en een grafiek van de laadtoestand | M |
| 2.6 | Statusmachine (zie [user journeys](user-journeys.md)) | M |
| 2.7 | Vertrekplanning per voertuig (datum + bestemmingstype) | M |
| 2.8 | Bulkacties (bv. 50 wagens tegelijk naar zone C) | S |

## 3. Batterijcontroles (mobiel)
| # | Feature | Prio |
|---|---|---|
| 3.1 | Controle registreren: laadtoestand, 12V OK / niet OK / spanning, visuele schade, opmerking | M |
| 3.2 | Mobielvriendelijke interface met grote knoppen | M |
| 3.3 | **VIN-barcode scannen** met de camera | S |
| 3.4 | Foto toevoegen bij schade | S |
| 3.5 | Takenlijst per medewerker of zone | S |
| 3.6 | Offline werken met synchronisatie achteraf (PWA) | C |
| 3.7 | Laadtoestand automatisch via telematica | W |

## 4. Regelprofielen en regelmotor
| # | Feature | Prio |
|---|---|---|
| 4.1 | Regelprofielen beheren (CRUD) per fabrikant, model en aandrijving | M |
| 4.2 | Automatisch het juiste profiel kiezen (het meest specifieke wint) | M |
| 4.3 | Regelmotor bij elke meting | M |
| 4.4 | Nachtelijke controle als achtergrondtaak | M |
| 4.5 | Vertrekregels per bestemmingstype | M |
| 4.6 | Voorspelling van de laadtoestand (lineaire ontlading) | S |
| 4.7 | Profielen met versies (metingen verwijzen naar de versie die toen gold) | S |
| 4.8 | Regels importeren/exporteren (JSON) | C |

## 5. Waarschuwingen
| # | Feature | Prio |
|---|---|---|
| 5.1 | Waarschuwingen aanmaken met type, ernst en voorgestelde actie | M |
| 5.2 | Levenscyclus: Open → Bevestigd → Opgelost (automatisch of handmatig) | M |
| 5.3 | Dashboard: "Wat vraagt vandaag aandacht?" | M |
| 5.4 | Live updates (SignalR) | S |
| 5.5 | E-mailmelding bij kritieke waarschuwingen | C |
| 5.6 | Pushmeldingen op de gsm | W |

## 6. Terrein en veiligheid
| # | Feature | Prio |
|---|---|---|
| 6.1 | Zones beheren: type (Standaard, EV, Laden, Quarantaine), capaciteit, maximaal aantal EV's | M |
| 6.2 | Voertuig verplaatsen naar een zone (met historiek) | M |
| 6.3 | Quarantaineworkflow met een verplichte beslissing door HSE | M |
| 6.4 | Waarschuwingen voor dichtheid en verkeerde zone | S |
| 6.5 | **Noodoverzicht** per zone (EV's, laadtoestand, rijvaardig?), af te drukken of te exporteren | S |
| 6.6 | Visuele kaart van het terrein (zones op een plattegrond, kleuren volgens risico) | C |
| 6.7 | Plaatsen van brandkranen en brandgangen als kaartlaag | C |
| 6.8 | Koppeling met thermische camera's | W |

## 7. Laadmodule (zie [laadmodule.md](laadmodule.md))
| # | Feature | Prio |
|---|---|---|
| 7.1 | Laders beheren (vast / mobiel, kW, zone, status) | S |
| 7.2 | Laadopdrachten: automatisch voorgesteld en handmatig | S |
| 7.3 | Laadsessie starten en stoppen, met kWh (gemeten of geschat) | S |
| 7.4 | Maximale doellaadtoestand afgedwongen volgens het profiel en de bestemming | S |
| 7.5 | Overzicht voor facturatie per fabrikant (CSV) | S |
| 7.6 | Laadplanner (greedy) met piekbeheer | C |
| 7.7 | Route voor de mobiele laadunit | C |
| 7.8 | OCPP-koppeling | W |

## 8. Rapporten en portaal
| # | Feature | Prio |
|---|---|---|
| 8.1 | **Overdrachtsrapport** per voertuig (PDF) | M |
| 8.2 | Batchrapport (bv. alle wagens van één transport) | S |
| 8.3 | Maandrapport per fabrikant | S |
| 8.4 | KPI's: aantal dode wagens, gemiddelde wachttijd, % controles op tijd, kWh | S |
| 8.5 | Portaal voor fabrikanten (alleen lezen, alleen de eigen wagens) | C |
| 8.6 | Publieke API voor fabrikanten en terreinsoftware | W |

## Samenvatting van de scope

- **Minimale versie (M):** voertuigen, controles, regelprofielen, regelmotor, waarschuwingen, zones, quarantaine, overdrachtsrapport, rollen. **Dit volstaat voor een sterke finalisatie.**
- **Doel (M + S):** met de laadmodule, live updates, VIN-scan, het noodoverzicht en KPI's. **Dit maakt het uitzonderlijk.**
- **Extra (C):** kaart, laadplanner, portaal voor fabrikanten, offline werken.
