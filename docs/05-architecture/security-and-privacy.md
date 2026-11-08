# Security and privacy

## Current threat boundary

The supported setup is a local single-terminal development demo on loopback. Data and manufacturer identities are fictional. Do not expose shared demonstration accounts to a public network or enter real employee/customer/vehicle data without a reviewed hosting and privacy design.

## Implemented controls

- HTTP-only, SameSite=Strict cookie with an eight-hour lifetime.
- Secure cookies outside Development; hosted use therefore requires HTTPS termination.
- Login rate limit: five attempts per client IP per 15-minute fixed window.
- Generic login failure without disclosing whether an account exists.
- Server-assigned account role and actor; command permission checks are authoritative.
- POSTs require a custom header and reject a mismatching Origin.
- No arbitrary CORS origins, no framing and no MIME sniffing.
- State responses use no-store; UI output escapes user-controlled text.
- Threshold, numerical, VIN, CSV, workflow and capacity validation.
- Atomic transactions and revision checks prevent partial/stale writes.
- Local data, environment files and credentials excluded from Git.

## Permission matrix

| Capability | Admin | Planner | Operator | HSE | Account |
|---|---|---|---|---|---|
| Read terminal / reports | Yes | Yes | Yes | Yes | Yes |
| Inspect / start / stop approved charge | Yes | Yes | Yes | No | No |
| Approve charge / import / plan / depart | Yes | Yes | No | No | No |
| Open concern / move | Yes | Yes | Yes | Yes | No |
| Quarantine decision | Yes | No | No | Yes | No |
| Edit profile thresholds | Yes | No | No | No | No |

## Explicit limitations

Shared demo accounts use a configured common password; this is not individual identity management. The data file and audit trail are editable by a local administrator and not encrypted by the application. All demo roles read the same data. The app has no tenant isolation, password reset, MFA, user management, tamper-evident audit, durable account lockout or production secret store. A JSON file is not a safe shared storage backend for multiple app processes.

## Before a real pilot

Use individual OIDC identities and least-privilege claims; approve a tenant/OEM data access matrix; enforce database-scoped isolation; protect secrets and encryption keys; establish backups and restore exercises; define audit and observation retention; add dependency scanning, hosted security testing and incident ownership. Review integration credentials separately for each organisation.

## Personal data

New measurements identify the actor and timestamp. Even a demonstration of staff workflows can introduce personal data if real names or free-text notes are entered. Define a lawful purpose, minimisation, retention and access with the responsible data owner. Interview notes remain anonymised in the repository; keep contact information outside Git.

## Reporting a vulnerability

See [SECURITY.md](../../SECURITY.md). Do not publish production credentials, personal information or a working exploit containing customer data in an issue.

## Demo release controls

Hosted API assets use a same-origin script CSP, frame blocking, MIME sniffing protection and same-origin referrers. Request bodies are bounded; malformed request binding returns HTTP 400 and unexpected errors return a generic problem with a trace identifier while details are logged server-side. File ownership is exclusive for the local process. npm and NuGet locks support reviewed restores. These checks do not certify the application for an internet-facing operational backend. Public Pages contains only synthetic data and a tab-local adapter.
