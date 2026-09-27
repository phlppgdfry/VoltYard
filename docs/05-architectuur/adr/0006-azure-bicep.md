# ADR-0006: Azure Container Apps + Bicep

- **Status:** Aanvaard
- **Datum:** 2026-09-27

## Context
De applicatie moet online te demonstreren zijn, betaalbaar blijven (studentenbudget) en tegelijk een portfolio vormen richting cloud-architect (AZ-204 / AZ-305).

## Opties
1. **Azure App Service:** eenvoudig, maar minder flexibel voor meerdere containers.
2. **Azure Container Apps:** containers zonder Kubernetes-beheer, kan schalen tot nul (kosten), Dapr en jobs mogelijk.
3. **VPS / Railway / Vercel:** goedkoop en eenvoudig, maar minder relevant voor het Azure-profiel.

## Beslissing
**Azure Container Apps** voor de API en de webapp, **Azure Database for PostgreSQL Flexible Server** (Burstable-tier), **Blob Storage**, **Application Insights**, **Key Vault**. Alles als **Bicep** in `infra/`, gedeployd via GitHub Actions.

## Kosten (ruwe schatting, na te kijken met de Azure Pricing Calculator)
| Onderdeel | Tier | Grootteorde / maand |
|---|---|---|
| Container Apps (2 apps, schalen tot 0) | Consumption | €0–15 (vaak binnen de gratis maandtegoeden) |
| PostgreSQL Flexible Server | Burstable B1ms | ~€15–25 |
| Blob, Key Vault, App Insights | Basis | < €5 |
| **Totaal** | | **~€20–45** |

Tip: gebruik **Azure for Students** (tegoed zonder kredietkaart) en zet de database stop buiten de demoperiodes.

## Gevolgen
- ✅ Infrastructure as Code = reproduceerbaar, en een sterk punt voor het portfolio.
- ✅ Dezelfde Docker-images lokaal en in de cloud.
- ⚠️ Een koude start bij schalen tot nul: voor de demo `minReplicas = 1` instellen.
