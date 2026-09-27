# Leerplan C# / .NET (afgestemd op VoltYard)

**Doel:** vlot kunnen starten aan fase 1, zonder vast te lopen op de basis. Dit verkleint risico **R6** (leercurve) uit de [risicoanalyse](06-plan-van-aanpak/risicos.md).
**Tijd:** ongeveer **20–25 uur**, te spreiden over 2–3 weken (bv. tijdens fase 0).
**Aanpak:** per blok één stuk theorie (Microsoft Learn, gratis) en een **mini-oefening die later echte VoltYard-code wordt**.

---

## Je vertrekt niet van nul: TypeScript → C#

Je kent TypeScript al. C# lijkt er sterk op (beide talen zijn ontworpen door Anders Hejlsberg).

| TypeScript / Node | C# / .NET | Opmerking |
|---|---|---|
| `package.json` + npm | `.csproj` + NuGet (`dotnet add package`) | |
| `interface User { name: string }` | `record User(string Name);` of `class` | `record` = onveranderlijk, ideaal voor DTO's |
| `string \| null` | `string?` | Zet **nullable** aan: het werkt als strict null checks |
| `?.` en `??` | `?.` en `??` | Identiek |
| `async/await`, `Promise<T>` | `async/await`, `Task<T>` | Identiek principe |
| `arr.filter(x => …).map(x => …)` | `list.Where(x => …).Select(x => …)` | **LINQ**: werkt ook op databasequeries (EF Core) |
| `type Status = "Open" \| "Closed"` | `enum Status { Open, Closed }` | |
| Union types, discriminated unions | `switch`-expressies + pattern matching | `ernst switch { Ernst.Kritiek => …, _ => … }` |
| Express / Next.js API routes | ASP.NET Core (controllers of minimal APIs) | |
| Prisma / Drizzle | Entity Framework Core | Migraties: `dotnet ef migrations add …` |
| Jest / Vitest | xUnit | `[Fact]`, `[Theory]` + `[InlineData]` |
| Zod | FluentValidation / DataAnnotations | |
| `process.env` | `IConfiguration` + `appsettings.json` + user-secrets | |
| Dependency injection (zelden in Node) | **Ingebouwd en overal** | `builder.Services.AddScoped<IRegelMotor, RegelMotor>()` |

---

## Blok 1: C#-taal (±6 u), vóór fase 1

**Leren**
- [Build .NET applications with C#](https://learn.microsoft.com/en-us/training/paths/build-dotnet-applications-csharp/) (leerpad)
- [Get started with C#, deel 1](https://learn.microsoft.com/en-us/training/paths/get-started-c-sharp-part-1/): alleen de onderdelen die je nog niet kent overlopen
- [Tour of C#](https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/): records, pattern matching, nullable, LINQ

**Mini-oefening: VIN-validator** *(wordt later `Domain/Voertuigen/Vin.cs`)*
```bash
dotnet new classlib -n VinOefening && dotnet new xunit -n VinOefening.Tests
```
- Schrijf `Vin.TryParse(string input, out Vin vin, out string fout)`: 17 tekens, geen I/O/Q, controlecijfer (het algoritme staat in `tools/generate_demo_data.py`).
- Tests: alle VIN's uit `demo/seed-voertuigen.csv` zijn geldig, rij 139 en 290 uit `demo/schip-voltara-400.csv` zijn ongeldig.

## Blok 2: testen (±3 u)

**Leren**
- [Unit testing C# with xUnit](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-csharp-with-xunit)
- [TimeProvider](https://learn.microsoft.com/en-us/dotnet/standard/datetime/timeprovider-overview): hoe je "vandaag" testbaar maakt (nodig voor de regelmotor)

**Mini-oefening: eerste regel** *(wordt later `Domain/Regels/SocOnderMinimumRegel.cs`)*
- Implementeer `SocOnderMinimumRegel` en `SocKritiekRegel`.
- Zet de gevallen **S1–S5** uit [regelmotor-testgevallen.md](../demo/regelmotor-testgevallen.md) om naar een `[Theory]`.

## Blok 3: ASP.NET Core Web API (±5 u), fase 1

**Leren**
- [Understand ASP.NET Core fundamentals](https://learn.microsoft.com/en-us/training/paths/aspnet-core-fundamentals/) (leerpad)
- [Create a web API with ASP.NET Core controllers](https://learn.microsoft.com/en-us/training/modules/build-web-api-aspnet-core/) (module)
- [OpenAPI in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/overview)
- [Foutafhandeling en Problem Details](https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors)

**Mini-oefening:** een endpoint `GET /api/vin/{vin}/valideer` dat je VIN-validator gebruikt en bij een fout Problem Details teruggeeft.

## Blok 4: database met EF Core en PostgreSQL (±5 u), fase 1–2

**Leren**
- [Persist and retrieve relational data with EF Core](https://learn.microsoft.com/en-us/training/modules/persist-data-ef-core/) (module)
- [Npgsql EF Core provider](https://www.npgsql.org/efcore/) + [overzicht bij Microsoft](https://learn.microsoft.com/en-us/ef/core/providers/npgsql/)
- [Global query filters](https://learn.microsoft.com/en-us/ef/core/querying/filters): nodig voor de isolatie per terminal

**Mini-oefening:** een tabel `Voertuig` + migratie + `demo/seed-voertuigen.csv` inlezen als seed. PostgreSQL draait in Docker:
```bash
docker run -d --name vy-pg -e POSTGRES_PASSWORD=dev -p 5432:5432 postgres:16
```

## Blok 5: wat je nodig hebt vanaf fase 2–5 (opzoeken wanneer je het nodig hebt)

| Onderwerp | Bron | Nodig in |
|---|---|---|
| Autorisatie met policies | [Policy-based authorization](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies) | Fase 1 (A-01, A-02) |
| Achtergrondtaken | [Hosted services / BackgroundService](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services) | Fase 2b (R-04) |
| Validatie | [FluentValidation](https://docs.fluentvalidation.net/) | Fase 2a |
| Integratietests | [Integration tests in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests) + [Testcontainers for .NET](https://dotnet.testcontainers.org/) | Vanaf fase 1 |
| Realtime | [SignalR introduction](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction) | Fase 5 (W-03) |
| Azure | [Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/overview) + [Bicep](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview) | Fase 6 |
| Architectuurtekeningen | [C4-model](https://c4model.com/) | Doorlopend |

## Certificaat: AZ-900 (optioneel, parallel)
[Azure Fundamentals (AZ-900)](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/) sluit aan bij fase 6 en is de eerste stap richting solution/cloud architect. Controleer vooraf of er studentenkortingen of gratis vouchers zijn (bv. via Microsoft Learn-evenementen).

## Tools op je Mac (gecontroleerd op 27-09-2026)
| Tool | Status |
|---|---|
| .NET SDK 10 | ✅ geïnstalleerd (10.0.401) |
| VS Code + C# Dev Kit, C#, Docker, Bicep, ESLint, Prettier, Tailwind, PostgreSQL-client | ✅ geïnstalleerd |
| VS Code: Playwright, REST Client, Mermaid-preview | ✅ toegevoegd |
| JetBrains Rider | ✅ geïnstalleerd (gratis voor niet-commercieel gebruik) |
| Node.js | ✅ v24 |
| Docker Desktop | zie de status in [README](../README.md#mac-klaar) |

**Handig voor VS Code:** met de extensie *REST Client* kan je later een `api.http`-bestand gebruiken om de API te testen, net zoals Postman, maar in je repo.
