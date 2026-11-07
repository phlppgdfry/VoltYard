# Assessment evidence

This project is designed to support a Full Stack Developer C#/.NET final assessment. The actual school rubric has not been supplied; the mapping below is a working proposal to review with the supervisor.

| Competency | Repository evidence | Demonstration |
|---|---|---|
| Problem analysis | Research, personas, hypotheses and interview guide | Explain assumptions and missing validation |
| Domain modelling | Vehicle, observations, profiles, charging and quarantine | Explain invariants and conflicting requirements |
| C# design | Domain/Application/Infrastructure/Api separation | Trace an inspection command end to end |
| API and security | Cookie identity, roles, Problem Details and revision guards | Show 401, 403, invalid input and stale-write conflict |
| Persistence | Copy-on-write store and atomic replacement | Restart and show the retained observation |
| Frontend | English responsive forms, filtering, charts and report print | Complete a field inspection on a narrow viewport |
| Testing | xUnit, repository checks, HTTP smoke tests and browser evidence | Explain boundary cases and rollback tests |
| Delivery | CI, Docker demo and operational instructions | Start from a clean checkout |
| Critical reflection | ADRs, capability limits and production backlog | Explain why database/identity work remains |

## Evidence integrity

Do not submit fictional fixture outcomes as customer research. Do not claim PostgreSQL, Next.js, SignalR, OCPP or Azure deployment as implemented. Distinguish the working local application, the simplified standalone prototype and the planned production architecture.

## Submission checklist

Confirm rubric, required report/deck formats and permitted dependencies. Capture a successful build/test run, anonymised browser evidence, a concise architecture explanation, limitations and the [demo script](demo-script.md). Include citations for research and be ready to explain the code without relying on generated prose.
