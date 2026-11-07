# Definition of done

## A repository change

- Behaviour and acceptance criteria are explicit and consistent with scope.
- Code, UI, documentation and new paths are English.
- Server validates data, workflow and role permissions.
- Failed commands have no committed side effects; stale writes return a conflict.
- Observation/profile provenance and append-only history remain intact.
- Relevant domain, workflow and HTTP tests pass; rendered UI changes receive browser checks.
- Data regeneration and local documentation links pass repository verification.
- No secrets, runtime stores, private notes, build outputs or screenshots enter Git accidentally.
- README, capability matrix, API contract and ADRs describe the final implementation.

## Local demonstration release

A clean checkout can generate fixtures, build, test and start using documented commands. The dashboard, search, inspection, charging, quarantine, profile, import and report flows are demonstrable. Records survive server restart. Tested environment and remaining limits are recorded.

## Production release

Requires additional gates: individual identity, tenant isolation, database transactions, approved profile sources, HSE workflow approval, immutable evidence, secure hosting, load measurements, monitoring, backups/restore, dependency review, incident response and an agreed data-processing/retention design. The local release does not meet this gate.
