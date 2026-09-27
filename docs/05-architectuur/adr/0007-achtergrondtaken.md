# ADR-0007: Achtergrondtaken met BackgroundService (V1)

- **Status:** Aanvaard
- **Datum:** 2026-09-27

## Context
De regelmotor moet elke nacht alle actieve voertuigen beoordelen (controles te laat, voorspellingen, vertrekregels). Later komen er misschien meer taken bij (e-mails, OCPP-polling).

## Opties
1. **`BackgroundService` + `PeriodicTimer`:** ingebouwd, geen afhankelijkheden, maar geen dashboard of retries en niet geschikt voor meerdere instanties zonder een lock.
2. **Hangfire (met PostgreSQL-opslag):** dashboard, retries, cron. Een extra afhankelijkheid.
3. **Quartz.NET:** krachtige planning, meer configuratie.
4. **Azure Container Apps Jobs:** een aparte container op een schema, cloud-native.

## Beslissing
**V1: `BackgroundService` + `PeriodicTimer`** met een eenvoudige database-lock (een PostgreSQL advisory lock), zodat maar één instantie de taak uitvoert. De taak is **idempotent**: ze twee keer uitvoeren geeft hetzelfde resultaat.

**Herzien wanneer:** er meer dan twee soorten taken zijn of er retries en monitoring nodig zijn → Hangfire of Container Apps Jobs.

## Gevolgen
- ✅ Eenvoudig, geen extra infrastructuur.
- ✅ De taak roept dezelfde `RegelMotor` aan als de API, dus er is geen dubbele logica.
- ⚠️ Geen dashboard: status bijhouden via logging en Application Insights.
