# Architecture decision records

Status distinguishes proposed technology direction from the implemented local release.

| ADR | Decision | Status |
|---|---|---|
| [0001](0001-dotnet-aspnet-core.md) | C#/.NET and ASP.NET Core | Accepted and implemented |
| [0002](0002-postgresql-ef-core.md) | PostgreSQL and EF Core | Proposed for production adapter |
| [0003](0003-frontend-nextjs.md) | Next.js frontend | Deferred; local release uses a browser-native UI |
| [0004](0004-modular-monolith.md) | Modular monolith | Accepted and implemented |
| [0005](0005-profiles-as-data.md) | Versioned rule profiles as data | Accepted and implemented |
| [0006](0006-azure-bicep.md) | Azure and Bicep | Proposed; no infrastructure deployed |
| [0007](0007-background-jobs.md) | Background evaluation | Deferred; current alerts evaluated on request |
| [0008](0008-local-executable-slice.md) | Executable local slice with atomic file storage | Accepted for development demo |

| [0009](0009-public-pages-showcase.md) | Public GitHub Pages showcase and isolated browser sandbox | Accepted and implemented |

| [0010](0010-demo-release-hardening.md) | Shared UI assets, locked dependencies and browser-gated demo release | Accepted and implemented |

Use the [template](template.md). Preserve superseded decisions and explain their replacement rather than rewriting history as if every proposal shipped.
