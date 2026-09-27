# ADR-0001: C# / .NET 10 met ASP.NET Core als backend

- **Status:** Aanvaard
- **Datum:** 2026-09-27

## Context
Voor de finalisatie kan gekozen worden tussen PHP, Java en C#. VoltYard heeft een API nodig met veel domeinlogica (regelmotor), achtergrondtaken, realtime updates en PDF-generatie. Het is ook een portfolioproject voor een carrière richting .NET en Azure (solution/cloud architect).

## Opties
1. **PHP (Laravel):** snel productief, maar zwakkere typering voor complexe domeinlogica en minder aansluiting bij het Azure/Microsoft-profiel.
2. **Java (Spring Boot):** volwassen en sterk in enterprise, maar meer boilerplate. Gelijkwaardig op de arbeidsmarkt.
3. **C# (.NET 10, ASP.NET Core):** een moderne taal (records, pattern matching, nullable reference types), SignalR ingebouwd, uitstekende EF Core, en .NET 10 is een LTS-versie. Sluit aan bij de ervaring met TypeScript en het Azure-leertraject.

## Beslissing
**C# met .NET 10 (LTS) en ASP.NET Core Web API**, met controllers voor duidelijkheid en herkenbaarheid in de opleiding.

## Gevolgen
- ✅ Sterke typering voor de regelmotor, goed testbaar.
- ✅ SignalR, BackgroundService, OpenAPI en rate limiting zitten allemaal in het framework.
- ✅ Past bij de certificaten AZ-204 en AZ-305.
- ⚠️ Ontwikkeling op macOS: VS Code + C# Dev Kit of Rider (Visual Studio voor Mac bestaat niet meer).
