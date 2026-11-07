# 0003 — Next.js frontend

**Status:** Deferred for this release

## Context

The original concept proposed a React/Next.js dashboard and mobile interface. The existing prototype already provides a usable browser-native surface.

## Decision

Deliver the local slice using one English template served by ASP.NET Core. Reassess Next.js when routing, component ownership or a larger frontend team justify a separate build.

## Consequences

No Node build is needed. Frontend code requires deliberate organisation as it grows; a framework migration must preserve server authority, accessible forms and the documented HTTP contract.

## Alternatives considered

Next.js immediately, Blazor and an independently hosted SPA.
