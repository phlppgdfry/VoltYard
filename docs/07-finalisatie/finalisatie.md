# Finalisatie: hoe VoltYard de eisen van de opleiding dekt

> ⚠️ **Actie:** de officiële eisen van de opleiding naast deze tabel leggen en de kolom "Eis opleiding" invullen. Wat ontbreekt, voegen we toe aan de backlog.

## Typische competenties van een full-stack finalisatie

| Competentie | Hoe VoltYard het aantoont | Waar | Eis opleiding |
|---|---|---|---|
| **Analyse** | Probleemstelling, marktonderzoek, persona's, user journeys, hypotheses | `docs/01–04` | |
| **Ontwerp** | C4-architectuur, ERD, API-ontwerp, ADR's | `docs/05` | |
| **Backend (C#)** | ASP.NET Core Web API, EF Core, domeinlogica (regelmotor), achtergrondtaken | `src/` | |
| **Database** | Relationeel model, migraties, indexen, seed-data | `Infrastructure/` | |
| **Frontend** | Next.js: dashboard, formulieren, grafieken, mobiele weergave | `web/` | |
| **Authenticatie en autorisatie** | Identity, JWT, 6 rollen, policies, tenant-isolatie | `Api/` | |
| **Realtime** | SignalR live updates | `Api/Hubs` | |
| **Bestanden** | CSV-import, foto-upload, PDF-generatie, CSV-export | div. | |
| **Testen** | Unit, integratie (Testcontainers), E2E (Playwright) | `tests/` | |
| **DevOps** | Docker, GitHub Actions CI/CD, Azure, Bicep | `.github/`, `infra/` | |
| **Security** | OWASP-maatregelen, validatie, rate limiting | `docs/05/security` | |
| **Projectmanagement** | Plan van aanpak, backlog, sprints, risico's, logboek | `docs/06` | |
| **Communicatie** | README, documentatie, presentatie, demo | overal | |

## Wat maakt dit sterker dan een "gemiddeld" eindwerk?
1. **Een echt domeinprobleem**, onderbouwd met bronnen, en geen to-do-app of webshop.
2. **Echte domeinlogica** (de regelmotor met voorspelling) in plaats van alleen CRUD.
3. **Architectuur als een professional:** C4, ADR's, IaC, gemotiveerde keuzes.
4. **Validatie bij echte gebruikers** (als de gesprekken lukken).
5. **Lokale relevantie:** Zeebrugge, de grootste autohaven van Europa.

## Te verzamelen voor het verslag
- [ ] Screenshots per feature (desktop + mobiel)
- [ ] Een wekelijks logboek (beslissingen, problemen, oplossingen)
- [ ] Testresultaten + dekkingsrapport
- [ ] Architectuurdiagrammen (uit `docs/05`)
- [ ] Reflectie: wat liep goed, wat zou ik anders doen, wat heb ik geleerd?
