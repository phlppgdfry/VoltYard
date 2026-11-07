# Demonstration script

Allow 10–12 minutes. Start with a fresh disposable store and the documented local profile. All examples use fictional brands and VINs.

## 1. Context and dashboard — 1 minute

Explain the question: which EVs need attention today, and what evidence exists for each VIN? Sign in as planner. Show prioritised alerts, C-EV-3 above its EV limit and faulted charger L17. Explain that observations and forecasts differ.

## 2. Search and inspection — 2 minutes

Find a non-quarantined vehicle. Open its history, then record 18% SOC and Weak 12V. Confirm an outlier if asked. Show the appended observation, actor/profile version and recalculated alerts. Refresh to demonstrate server persistence.

## 3. Charging — 2 minutes

Approve a low-SOC task, start a session and show its reserved charger. Stop using actual final SOC and optional meter kWh. Explain the estimate flag if no meter reading is supplied. Show the manufacturer energy summary. Charging does not refresh the manual inspection date.

## 4. Safety — 2 minutes

Record a battery concern on a different vehicle. Attempt charging to demonstrate the server block. Move it to Q-QUAR. Switch to HSE, enter a justified decision and show that a short justification is rejected. Release only after describing the real physical procedure as outside the demo.

## 5. Profile and departure — 2 minutes

As admin, change a threshold and inspect the simulation count. Save a new version and show that earlier inspections retain their version. Plan a destination with a different SOC range. Attempt departure with an unresolved alert and explain the conflict.

## 6. Import and handover — 2 minutes

Import `demo/vessel-voltara-400.csv`. Explain the two deliberately invalid VINs at CSV lines 139 and 290, any capacity rejections and duplicate detection on a repeated import. New vehicles require an arrival inspection. Open a handover report and use Print / Save as PDF.

## 7. Technical evidence and limits — 1 minute

Show the four .NET projects, tests and CI. Explain atomic local persistence, global revisions and the next gates: PostgreSQL, individual identities, tenant isolation, approved instructions and durable evidence. No real charger or regulatory certification is claimed.

## Recovery

If a port is occupied, choose a separate URL and store as described in [operations](../operations.md). If a revision conflict occurs, reload and repeat deliberately. Never repair a demo by editing runtime observations behind the UI during a presentation.
