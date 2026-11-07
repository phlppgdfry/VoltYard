# Local operations runbook

## Requirements and startup

.NET 10 SDK and Python 3. Run from the repository root:

```bash
python3 tools/generate_demo_data.py
dotnet run --project src/VoltYard.Api --launch-profile local
```

Default URL: http://127.0.0.1:5080. Default runtime file: var/yard.json. The local launch profile sets Development and does not open a browser. The application serves its own UI; there is no second frontend server.

## Independent instance

```bash
Data__Path=/tmp/voltyard-review.json dotnet run --project src/VoltYard.Api   --launch-profile local --urls http://127.0.0.1:5081
```

Choose a new file path to start a fresh seed. Do not point two processes at the same file. Set Demo__Password to a private value when sharing a controlled local demonstration. Non-Development startup requires a configured password of at least 12 characters and secure cookies require HTTPS.

## Backup and recovery

Stop the server, copy the runtime JSON to a protected backup path, and restart. To restore, stop the server and point Data__Path at a verified copy. Startup fails on invalid JSON; it must never silently replace a corrupt store with fixtures. Back up authentication data-protection keys if persistent sessions are required; otherwise users can sign in again.

The file is a development persistence adapter. Atomic replacement protects the committed document from partial writes, but it is not a database backup strategy, immutable audit store or multi-process locking system.

## Health and troubleshooting

GET /health reports process health. A 401 indicates no valid session, 403 indicates role/origin/header restrictions, 409 indicates stale state or a workflow conflict. Reload after another user's changes before retrying. A full destination zone requires freeing capacity or choosing another allowed zone. A 429 login response clears after the 15-minute rate window.

If port 5080 is occupied, use an alternate URL and independent store. If .NET restore fails, confirm the SDK and NuGet network access; no paid cloud service is required.

## Container demo

`docker compose up --build` builds the application with .NET 10, mounts a named volume at /data and binds host port 5080 to loopback. Compose requires Demo__Password. It deliberately runs the local Development edition for HTTP cookie use and is not an internet deployment recipe. Stop with `docker compose down`; the named volume persists unless explicitly removed.

## Hosted release gates

Use a database, individual identity provider, tenant isolation, HTTPS, key/secret management, structured monitoring, backup/restore tests and approved profile/HSE procedures. No cloud resources are provisioned by this repository. Review [security](05-architecture/security-and-privacy.md) and the [backlog](06-delivery/backlog.md).
