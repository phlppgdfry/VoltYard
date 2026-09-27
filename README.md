# VoltYard

> **Veilig en aantoonbaar beheer van elektrische voertuigen op car terminals en compounds.**
> Per voertuig een batterijlogboek, automatische waarschuwingen volgens de regels van elke autofabrikant, brandveilig parkeren en slim laden, met een sluitend bewijs bij de overdracht.

**Status:** concept- en voorbereidingsfase. Er is nog geen code, bewust: eerst valideren, dan bouwen.
**Context:** finalisatieproject Full Stack Developer (C# / .NET), opgezet zodat het ook kan doorgroeien tot een echt product.
**Laatste update:** 27 september 2026

---

## In één minuut

Zeebrugge is de grootste autohaven van Europa. Elk jaar gaan er miljoenen nieuwe wagens door de terminals, en een snel groeiend deel daarvan is elektrisch. Die EV's staan soms **weken tot maanden** op de terminal. In 2024 stonden onverkochte Chinese EV's tot 18 maanden in Belgische havens.

Dat zorgt voor drie problemen die de sector vandaag grotendeels op papier en met losse Excel-bestanden oplost:

1. **Batterijen lopen leeg.** Een lege EV kan niet meer rijden, blokkeert de terreinwerking en komt leeg aan bij de dealer.
2. **Brandrisico.** EV's vragen aparte parkeerzones, controles en een quarantaine voor verdachte wagens. De sector vraagt uitdrukkelijk om *"specialized handling procedures"*.
3. **Elke autofabrikant heeft andere regels.** Minimale en maximale laadtoestand, controlefrequentie, laadlimieten... Terminals die met meerdere merken werken, hebben daar geen standaard voor. Richtlijnen zoals AIAG M-26 vragen dat logistieke partners *kunnen aantonen* hoe ze de laadtoestand beheren.

**VoltYard** vertaalt die regels naar software:

| Module | Wat het doet |
|---|---|
| 🔋 **Batterijlogboek** | Per VIN: laadtoestand, 12V-spanning en visuele controle, ingevoerd via een gsm-app op het terrein |
| 📐 **Regelprofielen** | De regels van elke autofabrikant en elk model als configureerbare data, niet vastgelegd in de code |
| 🚨 **Waarschuwingen** | "Laden nodig", "controle te laat", "niet klaar voor verscheping", "quarantaine vereist" en een voorspelling van wanneer een wagen onder de grens zakt |
| 🔥 **Brandveilig parkeren** | Zones (EV, quarantaine, laden), maximale EV-dichtheid en waarschuwingen bij een verkeerde plaatsing |
| ⚡ **Laadmodule** | Laadopdrachten met prioriteit, beheer van laders (vast en mobiel), kWh-registratie en facturatie per fabrikant |
| 📄 **Overdrachtsrapport** | Een PDF-bewijs per voertuig of batch voor de autofabrikant, de verzekeraar of de rederij |

---

## Documentatie

| # | Onderdeel | Inhoud |
|---|---|---|
| 01 | [Probleemstelling](docs/01-probleem/probleemstelling.md) | Het probleem, voor wie en waarom nu |
| 02 | [Markt en context](docs/02-onderzoek/markt-en-context.md) | Zeebrugge, volumes, de "dwell economy" |
| 02 | [Concurrentieanalyse](docs/02-onderzoek/concurrentie.md) | Wat bestaat er al, en waar zit het gat? |
| 02 | [Regelgeving en richtlijnen](docs/02-onderzoek/regelgeving-en-richtlijnen.md) | IMO, EMSA, AIAG M-26, batterijpaspoort, OCPP |
| 02 | [Bronnen](docs/02-onderzoek/bronnen.md) | Alle gebruikte bronnen |
| 03 | [Visie en waardepropositie](docs/03-concept/visie-en-waardepropositie.md) | Wat VoltYard is, en wat niet |
| 03 | [Persona's](docs/03-concept/personas.md) | Voor wie we bouwen |
| 03 | [User journeys](docs/03-concept/user-journeys.md) | Van aankomst van het schip tot vertrek |
| 03 | [Features (MoSCoW)](docs/03-concept/features.md) | Alle functies met prioriteit |
| 03 | [Regelprofielen](docs/03-concept/regelprofielen.md) | Het hart van het systeem: de regels per fabrikant |
| 03 | [Laadmodule](docs/03-concept/laadmodule.md) | Laden als functie en als betaalde dienst |
| 04 | [Hypotheses](docs/04-validatie/hypotheses.md) | Wat we aannemen en moeten bewijzen |
| 04 | [Interviewgids](docs/04-validatie/interviewgids.md) | Vragen voor terminalmedewerkers |
| 05 | [Architectuur](docs/05-architectuur/architectuur.md) | C4-diagrammen en technologie |
| 05 | [Datamodel](docs/05-architectuur/datamodel.md) | Entiteiten en relaties (ERD) |
| 05 | [API-ontwerp](docs/05-architectuur/api-ontwerp.md) | Endpoints en conventies |
| 05 | [Security en privacy](docs/05-architectuur/security-en-privacy.md) | Rollen, rechten, GDPR |
| 05 | [ADR's](docs/05-architectuur/adr/README.md) | Architectuurbeslissingen |
| 06 | [Plan van aanpak](docs/06-plan-van-aanpak/plan-van-aanpak.md) | Fasen, planning, opleveringen |
| 06 | [Backlog](docs/06-plan-van-aanpak/backlog.md) | Epics en user stories met acceptatiecriteria |
| 06 | [Risico's](docs/06-plan-van-aanpak/risicos.md) | Risico's en maatregelen |
| 06 | [Definition of Done](docs/06-plan-van-aanpak/definition-of-done.md) | Wanneer iets "af" is |
| 07 | [Finalisatie](docs/07-finalisatie/finalisatie.md) | Hoe dit project de eisen van de opleiding dekt |
| 07 | [Demoscript](docs/07-finalisatie/demoscript.md) | Het verhaal voor de jury |
| 08 | [Businessmodel](docs/08-business/businessmodel.md) | Lean Canvas, prijshypotheses, markttoegang |
| – | [Open vragen](docs/open-vragen.md) | Wat nog beslist of uitgezocht moet worden |
| – | [Logboek](docs/logboek.md) | Wekelijks: beslissingen, problemen, voortgang |
| – | [Woordenlijst](docs/woordenlijst.md) | SOC, PDI, PCTC, OCPP... |

---

## Technologie (gepland)

- **Backend:** C# / .NET 10, ASP.NET Core Web API, EF Core, PostgreSQL
- **Realtime:** SignalR (live waarschuwingen)
- **Frontend:** Next.js (React, TypeScript): een dashboard voor planners en een mobielvriendelijke app voor het terrein
- **Rapporten:** PDF-generatie aan de serverkant
- **Tests:** xUnit, Testcontainers (PostgreSQL)
- **DevOps:** Docker, GitHub Actions, Azure (Container Apps + PostgreSQL Flexible Server), infrastructuur via Bicep

De motivering per keuze staat in de [ADR's](docs/05-architectuur/adr/README.md).

---

## Volgende stappen

1. [ ] De eisen van de opleiding naast [finalisatie.md](docs/07-finalisatie/finalisatie.md) leggen
2. [ ] 3 à 5 validatiegesprekken voeren met de [interviewgids](docs/04-validatie/interviewgids.md)
3. [ ] De [hypotheses](docs/04-validatie/hypotheses.md) bijwerken en de scope vastleggen
4. [ ] Fase 1 starten: het fundament (zie het [plan van aanpak](docs/06-plan-van-aanpak/plan-van-aanpak.md))
