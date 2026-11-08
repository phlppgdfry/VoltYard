# ADR-0010 — Reproducible public demo release

Status: Accepted and implemented for the portfolio/demo release.

## Context

The template mixed several hundred lines of scripts and styles with markup. Pages altered source strings to adapt the same UI. The file store assumed that only one process would open it, and browser validation was not reproducible in CI.

## Decision

Keep the modular monolith and local file adapter. Extract canonical browser assets and use an explicit public edition flag. Generate the standalone preview from those sources; build Pages with inert synthetic seed data and a separate browser command adapter. Hold an exclusive store lock for the lifetime of the backend. Commit npm and NuGet dependency locks. Gate Pages on desktop/mobile Chromium journeys and preserve source metadata in deployment artifacts.

## Consequences

UI changes can be reviewed without navigating embedded fixture data. Hosted scripts can follow a same-origin CSP. A second local process fails visibly rather than overwriting another owner's state. Browser regressions are reproducible without credentials. The two command implementations still need parity testing; this decision does not introduce production persistence, identity, charger integration or operational approval.
