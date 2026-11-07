# 0007 — Background evaluation

**Status:** Deferred; on-request evaluation implemented

## Context

Age-based inspection and forecast rules change even when no one enters data. Persisted alert lifecycle and notifications eventually need durable processing.

## Decision

For the local slice, evaluate current alerts using the current UTC date whenever state is requested. Add durable, idempotent scheduled evaluation with a stored alert model in the database release.

## Consequences

No scheduled notifications or alert acknowledgements are claimed. A future scheduler must preserve uniqueness by terminal/VIN/rule and record reopen/resolution events.

## Alternatives considered

BackgroundService immediately or an external queue/scheduler.
