# HTTP API

Base URL for the local profile: `http://127.0.0.1:5080`. JSON uses camelCase. Cookies carry the authenticated session. Requests are same-origin; no CORS policy permits arbitrary websites.

## Routes

| Method | Path | Behaviour |
|---|---|---|
| GET | `/` | English application shell |
| GET | `/health` | Public process health |
| POST | `/api/login` | `{user,password}`; creates eight-hour session |
| POST | `/api/logout` | Clears authenticated session |
| GET | `/api/state` | Full data snapshot, current alerts, user and role |
| POST | `/api/commands/{action}` | Authorised, validated transaction with revision |
| GET | `/api/reports/{vin}` | Handover snapshot with ID and generation time |

Every POST requires `X-VoltYard-Client: web` and same-origin Origin when supplied. Scripts may omit Origin but still need the custom header and a session cookie. The API is designed for the local frontend; there are no bearer tokens, API keys or public integration contracts.

## Sign-in example

```bash
curl -s -c /tmp/voltyard-cookies -H 'Content-Type: application/json'   -H 'X-VoltYard-Client: web'   -d '{"user":"planner","password":"VoltYard-demo-2026"}'   http://127.0.0.1:5080/api/login
curl -s -b /tmp/voltyard-cookies http://127.0.0.1:5080/api/state
```

## Command payloads

All commands include `revision` from the latest `data.revision`. VIN-specific commands also include `vin`.

| Action | Additional fields | Roles |
|---|---|---|
| `inspect` | soc, twelveV, damage, suspected, note, confirm | Admin, Planner, Operator |
| `charge-approve` | None | Admin, Planner |
| `charge-start` | None; server assigns available charger | Admin, Planner, Operator |
| `charge-stop` | soc = actual final SOC; optional kwh | Admin, Planner, Operator |
| `quarantine` | reason, 10–2,000 characters | Admin, Planner, Operator, HSE |
| `move` | zone | Admin, Planner, Operator, HSE |
| `decide` | decision and justification, 10–2,000 characters | Admin, HSE |
| `profile` | Complete profile object; threshold scope retained | Admin |
| `import` | csv string, ≤2 MB and ≤10,000 rows | Admin, Planner |
| `plan` | departure (YYYY-MM-DD), destination | Admin, Planner |
| `depart` | None | Admin, Planner |

Account is read-only. Demo roles all read the same terminal; manufacturer filtering in the UI is not a security boundary.

```json
{"revision":0,"vin":"1HGCM82633A004352","soc":42,"twelveV":"OK","damage":false,"suspected":false,"note":"Arrival inspection","confirm":false}
```

The example VIN is syntactically valid but may not exist in the fixture. Use a VIN returned by state for actual requests.

## Errors and concurrency

400: invalid values or malformed input. 401: unauthenticated. 403: role or origin/header policy violation. 404: missing record or action. 409: stale revision or workflow conflict. 429: login rate limit. Domain errors use Problem Details with a human-readable title; framework body-binding failures may return a plain 400.

There is no implicit retry of a write after a conflict. Reload, review changed values and deliberately retry. Repeated charging transitions are rejected rather than double-counted.

## Import contract

Required header: `vin,brand,model,powertrain,kwh,manufacturerCode`. Optional `destination,departure`. CSV supports quoted commas and line endings. Unknown manufacturers, invalid checksums, duplicates, malformed values and unavailable arrival capacity produce row errors. Malformed CSV quoting aborts the transaction. The result contains accepted, rejected and `{line,vin,error}` entries; line numbers count logical CSV records including the header.

## Future API

Resource-specific REST endpoints, server pagination, OpenAPI, idempotency keys, tenant scoping, dedicated report persistence and external integrations follow a database/identity release. The current generic command route is intentionally narrow and documented as a local application contract.
