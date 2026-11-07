# 0009 — Public GitHub Pages showcase

**Status:** Accepted and implemented

## Context

The repository owner requested a public GitHub site, a stronger portfolio presentation and an accessible demo without setup. GitHub Pages serves static files and cannot execute the ASP.NET Core host.

## Decision

Publish an English case study and a browser-only fictional-data simulation through GitHub Pages Actions. Reuse the UI template, embed the complete 2,000-vehicle fixture and apply an explicit public sandbox adapter. Keep state within the visitor's tab, allow reset and provide a guided tour. Make the project repository public and link technical claims to source and verification evidence.

## Consequences

Everyone can explore without an account, infrastructure budget or access to a shared backend. The public edition does not implement server-side security or shared persistence; the case study states this boundary. JavaScript simulation and C# application semantics need separate regression checks. A static build publishes only the intended public artifact. The .NET application remains independently runnable.

## Alternatives considered

Publishing a screenshot-only portfolio would not let visitors test decisions. Hosting the .NET service would add identity, infrastructure and operational responsibilities beyond a public fictional-data showcase. Publishing only the old 60-vehicle prototype would leave important flows incomplete.
