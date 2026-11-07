# 0002 — PostgreSQL and EF Core

**Status:** Proposed; deferred from local release

## Context

Production needs transactional records, indexing, constraints, tenant isolation and durable history.

## Decision

Plan a PostgreSQL adapter behind the application persistence boundary. Do not claim a running database until migrations and integration tests exist.

## Consequences

The current atomic JSON adapter proves workflows but cannot support multiple processes or production data volumes. Migration must preserve observation/profile provenance and concurrency semantics.

## Alternatives considered

SQL Server, SQLite and a hosted document database.
