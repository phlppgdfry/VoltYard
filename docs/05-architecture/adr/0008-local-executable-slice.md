# 0008 — Local executable slice

**Status:** Accepted for development, 7 November 2026

## Context

The repository contained a concept dossier and a session-only prototype. A reproducible working application was needed without requiring a cloud account or database service.

## Decision

Ship a .NET modular monolith, browser-native English UI, deterministic fixtures and an atomic JSON adapter. Use cookie roles, server command validation and global optimistic concurrency.

## Consequences

One process owns one store. Full-state reads, shared demo identities and whole-file writes limit scalability and hosting. PostgreSQL, individual identities and tenant isolation remain explicit release gates. Preserve a standalone 60-vehicle preview alongside the connected 2,000-vehicle application.

## Alternatives considered

Implement every proposed integration before delivering any executable flow, or leave the repository as documentation only.
