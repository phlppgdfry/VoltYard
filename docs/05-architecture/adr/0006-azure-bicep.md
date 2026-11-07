# 0006 — Azure and Bicep deployment direction

**Status:** Proposed; not deployed

## Context

A hosted pilot may need managed database, identity, storage and observability in a controlled environment.

## Decision

Consider Container Apps, managed PostgreSQL and infrastructure as code after identity and database readiness. Do not add placeholder deployment scripts that imply a functioning environment.

## Consequences

No Azure resources, prices, credentials or capacity are assumed. Select region, cost limits, backup policy and tenant responsibilities with the owner before provisioning.

## Alternatives considered

A managed application host, conventional VM or another cloud.
