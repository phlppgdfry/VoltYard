# Concurrentieanalyse

*Stand van zaken september 2026, op basis van publieke informatie. Dat een oplossing niet online te vinden is, betekent niet dat ze niet bestaat. Grote terminals kunnen interne tools hebben. Valideren via de [interviews](../04-validatie/interviewgids.md).*

## Overzicht

| Categorie | Voorbeelden | Wat ze doen | Wat ontbreekt voor ons probleem |
|---|---|---|---|
| **Terreinbeheer / FVL-software** | INFORM (Syncrotess), AutoVentive, eigen TOS-systemen | Locatie van voertuigen, bewegingen, planning van terrein en PDI | Niet gebouwd rond de **batterijtoestand**, geen regels per fabrikant voor EV's, geen brandzones |
| **Software voor EV-wagenparken** | Veel aanbieders (fleet management, laadbeheer) | Laadtoestand, batterijgezondheid en laadplanning voor **eigen, actieve** wagenparken via telematica | Gaat uit van live data uit de wagen. Nieuwe, onverkochte wagens op een terminal hebben die koppeling meestal **niet**, en ze zijn niet van de terminal |
| **Laadbeheer (CPMS)** | Laadpaaloperatoren, OCPP-platformen | Laders aansturen, kWh meten, facturatie per laadsessie | Kent het **voertuig** niet en de regels van de fabrikant evenmin. Beheert sessies, geen voertuigdossiers |
| **Schade-inspectie en overdracht** | UVeye, DAMAGE iD, Bison Grid, Record360 | Foto's en schaderapporten bij overdracht, AI-scans | Gaat over schade aan de carrosserie, **niet over de batterij** of de laadtoestand. Mogelijk een partner of integratie |
| **Mobiele laadunits (hardware)** | SparkCharge en anderen | Mobiele batterijopslag en laders, snel te plaatsen op ports en logistieke sites | Alleen hardware. **Wie beslist welke wagen geladen wordt?** Daar zit onze software |
| **Publiek laden voor e-trucks** | Milence | Boekingen aan publieke laadparken voor trucks | Andere doelgroep (trucks, niet opgeslagen nieuwe wagens) |
| **Richtlijnen** | AIAG M-26, EMSA, IMO | Beschrijven *wat* je moet doen | Het blijft papier. Niemand zet het om naar software |
| **Wat terminals intern doen** | Excel, papieren checklists, instellingen op laders (WWL) | Werkt op kleine schaal | Niet schaalbaar over merken heen, moeilijk te auditen, geen voorspellingen |

## Positionering

```
                    Kent de regels van de fabrikant
                                ▲
                                │
                                │         ★ VoltYard
                                │   (voertuigdossier + regels
                                │    + laden + bewijs)
                                │
  Alleen laadsessies ───────────┼─────────── Volledig voertuigdossier
  (CPMS, laders)                │            (terreinsoftware)
                                │
                                │
                                │
                                ▼
                    Generiek, geen EV-regels
```

**VoltYard is het enige in dit veld dat vertrekt vanuit het voertuig én de regels van de fabrikant**, en dat laden, veiligheid en bewijs samenbrengt.

## Mogelijke reacties van concurrenten

| Speler | Kan dit ook bouwen? | Onze verdediging |
|---|---|---|
| Leveranciers van terreinsoftware (INFORM enz.) | Ja, als module | Snelheid, focus en onafhankelijk van merken. Of net **samenwerken** en een integratie aanbieden |
| Grote terminals intern | Ja | Een kleinere terminal of compound bouwt dit niet zelf. Onze regelbibliotheek wordt beter met elke klant |
| Fabrikanten (eigen portalen) | Voor hun eigen merk | Een terminal wil niet twintig portalen, maar één systeem |

## Partners in plaats van concurrenten

- **Laadhardware (OCPP):** VoltYard stuurt laders aan of leest ze uit, en verkoopt geen hardware.
- **Schade-inspectie:** batterijstatus en schaderapport samen in één overdrachtsdossier.
- **Terreinsoftware:** VoltYard haalt de locatie en planning op en stuurt waarschuwingen terug.

## Conclusie

Er is **veel aanbod rond** het probleem (terreinbeheer, laden, schade), maar ik vond geen product dat de specifieke combinatie aanbiedt: **dossier per VIN, regels per fabrikant, brandzones, planning van het laden en bewijs, voor terminals met meerdere merken.** Dat is de hypothese die we met interviews moeten bevestigen.
