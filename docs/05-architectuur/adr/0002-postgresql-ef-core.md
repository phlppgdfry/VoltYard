# ADR-0002: PostgreSQL met EF Core

- **Status:** Aanvaard
- **Datum:** 2026-09-27

## Context
Relationele data (voertuigen, metingen, profielen) met sterke consistentie, een auditlog, filters en rapportering. Moet lokaal draaien (Docker) en in Azure.

## Opties
1. **SQL Server / Azure SQL:** de klassieke .NET-combinatie, maar lokaal zwaarder op een Mac (ARM) en duurder in Azure.
2. **PostgreSQL:** open source, draait licht in Docker op een Mac, `jsonb` voor de audit, partiële indexen, betaalbaar via Azure Database for PostgreSQL Flexible Server.
3. **Cosmos DB / NoSQL:** past slecht bij relationele rapportering en consistentie.

## Beslissing
**PostgreSQL** met **EF Core** (Npgsql-provider) en code-first migraties.

## Gevolgen
- ✅ Gratis lokaal, goede Mac-ondersteuning, Testcontainers voor echte integratietests.
- ✅ `jsonb` en partiële indexen (unieke open waarschuwing per regel).
- ⚠️ Als de opleiding SQL Server eist: EF Core maakt de overstap beperkt (provider wisselen, migraties opnieuw genereren).
