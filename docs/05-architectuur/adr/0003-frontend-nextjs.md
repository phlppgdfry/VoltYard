# ADR-0003: Next.js (React) als frontend, Blazor als alternatief

- **Status:** Voorlopig, te bevestigen met de eisen van de opleiding
- **Datum:** 2026-09-27

## Context
We hebben een dashboard nodig voor planners (desktop) en een snelle mobiele weergave voor terreinmedewerkers (VIN scannen met de camera). Er is al ervaring met Next.js en TypeScript.

## Opties
1. **Next.js (React, TypeScript):** bestaande ervaring, een groot ecosysteem (shadcn/ui, Recharts, ZXing voor barcodes), goed als PWA. Toont een "echte" full stack met een gescheiden frontend en API.
2. **Blazor (Web App, C#):** alles in C#, gedeelde DTO's, maar een kleiner ecosysteem voor de camera en barcodes, en meer nieuw te leren.
3. **ASP.NET MVC / Razor Pages:** eenvoudig, maar minder geschikt voor een rijke, realtime interface.

## Beslissing
**Next.js**, *tenzij* de opleiding een C#-frontend vereist. Dan kiezen we **Blazor Web App** (interactief server/auto) en gebruiken we JS-interop voor het scannen van barcodes.

## Gevolgen
- ✅ Snelle ontwikkeling dankzij bestaande kennis. Sterk portfolio (React + .NET is een veelgevraagde combinatie).
- ⚠️ Twee talen (C# + TypeScript). Types genereren uit OpenAPI (bv. `openapi-typescript`) houdt ze synchroon.
- 📌 **Actie:** de eisen van de opleiding controleren voor de start (zie [open vragen](../../open-vragen.md)).
