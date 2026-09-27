# Architecture Decision Records (ADR's)

Een ADR legt **één belangrijke beslissing** vast: de context, de opties, de keuze en de gevolgen. Zo weet je later (of weet een jurylid) **waarom** iets zo gebouwd is.

| # | Beslissing | Status |
|---|---|---|
| [0001](0001-dotnet-aspnet-core.md) | C# / .NET 10 met ASP.NET Core als backend | Aanvaard |
| [0002](0002-postgresql-ef-core.md) | PostgreSQL met EF Core | Aanvaard |
| [0003](0003-frontend-nextjs.md) | Next.js (React) als frontend, Blazor als alternatief | Voorlopig, afhankelijk van de eisen van de opleiding |
| [0004](0004-modulaire-monoliet.md) | Modulaire monoliet in plaats van microservices | Aanvaard |
| [0005](0005-regelprofielen-als-data.md) | Regels van fabrikanten als data, niet als code | Aanvaard |
| [0006](0006-azure-bicep.md) | Azure Container Apps + Bicep | Aanvaard |
| [0007](0007-achtergrondtaken.md) | Achtergrondtaken met BackgroundService (V1) | Aanvaard |

Nieuwe ADR? Kopieer [template.md](template.md) en geef hem het volgende nummer.
