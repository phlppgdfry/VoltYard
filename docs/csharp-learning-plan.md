# C#/.NET learning plan

Use the working repository to explain and extend the code deliberately. Complete exercises independently before comparing with an implementation.

| Block | Concepts | Repository exercise | Evidence |
|---|---|---|---|
| 1 | Types, nullability, collections and functions | Explain VIN transliteration/check digit and write an invalid-input case | Passing boundary tests and a verbal explanation |
| 2 | Classes, records and encapsulation | Trace Vehicle, Inspection and RuleProfile | Entity diagram and invariants |
| 3 | LINQ and pure functions | Explain profile precedence and rule ordering | Model-specific/fallback tests |
| 4 | TimeProvider and deterministic tests | Simulate an overdue inspection without waiting | Exact-boundary tests |
| 5 | Interfaces and dependency inversion | Explain IYardStore and file adapter ownership | Dependency diagram |
| 6 | ASP.NET Core binding and middleware | Follow an authenticated inspection request | 400/401/403/409 examples |
| 7 | Transactions and concurrency | Explain clone → validate → flush → replace | Rollback and stale-revision tests |
| 8 | Browser integration | Trace form submission, API result and refreshed alerts | Browser interaction evidence |
| 9 | Data persistence evolution | Design PostgreSQL constraints and migration | ADR and integration-test plan |
| 10 | Delivery and operations | Run CI locally, container demo and restore exercise | Reproducible runbook |

## Suggested practice changes

Add a separately dated 12V observation, introduce nullable SOC for uninspected imports, persist full movement events or implement an order cancellation with equipment release. Start each with acceptance cases and preserve historical evidence.

## Learning discipline

Read current official documentation for framework-specific syntax. Explain why a boundary is inclusive, why the server validates commands and why a local JSON lock does not protect multiple processes. Do not mistake generated code volume for understanding.

## Reflection prompts

Which model fields are cached projections versus authoritative records? What fails if a file save throws? How could a client bypass UI checks? How would tenant isolation change every query? Which test proves a user-visible invariant rather than repeating implementation details?
