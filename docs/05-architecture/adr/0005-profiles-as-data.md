# 0005 — Versioned profiles as data

**Status:** Accepted; implemented

## Context

Manufacturer and destination requirements vary and change. Brand-specific code would hide provenance and require redeployment for every threshold change.

## Decision

Represent profiles as configuration with applicability, ordered thresholds, departure ranges and versions. New measurements reference the active version; retain old profile objects.

## Consequences

Profile editing needs strict validation. The demo lacks approval/source-document workflows, which remain necessary before real use. Current alerts use the latest applicable profile.

## Alternatives considered

Hardcoded per-brand branches or a general-purpose embedded scripting language.
