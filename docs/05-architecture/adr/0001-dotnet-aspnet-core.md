# 0001 — C#/.NET and ASP.NET Core

**Status:** Accepted; implemented

## Context

The project needs a testable backend and evidence of C#/.NET full-stack skills.

## Decision

Use .NET 10 with ASP.NET Core for HTTP, cookies and dependency injection. Keep business rules outside the host.

## Consequences

The local build requires the .NET 10 SDK. Framework features come from the shared runtime. Domain tests do not depend on HTTP. Python remains a fixture/verification tool.

## Alternatives considered

Node-only backend, Java/Spring and a framework-heavy distributed backend.
