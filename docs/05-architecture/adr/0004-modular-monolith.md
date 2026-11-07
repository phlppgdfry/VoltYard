# 0004 — Modular monolith

**Status:** Accepted; implemented

## Context

A single developer needs clear responsibilities without distributed deployment overhead.

## Decision

Separate Domain, Application, Infrastructure and Api projects within one deployable host. Domain has no package dependencies.

## Consequences

Commands and persistence are independently testable. Cross-project dependency direction must remain clear. Split services only when operational evidence justifies it.

## Alternatives considered

Microservices or one project containing all concerns.
