# ADR-0011 — Evidence-based scenarios and derived shift work

Status: Accepted for the demonstration release.

## Decision

Derive tasks from existing vehicle conditions and orders, rather than introduce a competing manually completed status. Store owner/deadline assignments keyed by VIN and work kind, with append-only assignment-change records. Retain assignments when conditions clear; display them as completed, and reopen if a new trigger appears. Evaluate server time explicitly through TimeProvider and expose the snapshot time. The browser-only edition uses its documented fixed scenario clock.

Only Admin/Planner may dispatch in the backend. Eligible owners depend on workflow roles. Assignment is coordination metadata and grants no vehicle-action permission. Stale revisions, invalid deadlines and resolved/nonexistent tasks are rejected atomically.

Goal-based scenario setup resets only synthetic tab-local data after confirmation. Goals read actual inspection, plan, charge-session, quarantine and departure state. Report review is a saved visitor-progress flag, not an attestation. Persistent backend data cannot be reset through this feature.

## Limits

Task identity is VIN plus kind within this single-visit model. Reopening keeps the previous owner/deadline until a dispatcher changes it. This is not a shift calendar, notification/escalation engine, immutable operational audit or individual identity provider. The browser and C# projections remain separate implementations and require parity regressions.
