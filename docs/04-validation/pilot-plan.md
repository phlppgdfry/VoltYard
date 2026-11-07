# Operator discovery and shadow-mode pilot plan

This is a proposal to agree with a real operator. No pilot, access approval or partner commitment currently exists.

## 1. Identify the process and its owners

Select one automotive terminal/compound, one operational team and a narrow flow such as overdue battery observations before truck departure. Identify planner, field lead, HSE approver, system/data owner and budget owner. Confirm who owns vehicle locations, OEM instructions and charger records.

Ask each person to reconstruct one recent exception using their current tools. Establish whether the gap actually exists and what an existing TOS/charger provider already offers. A verbal compliment is not a go decision.

## 2. Entry gate

Before real data: written purpose and scope, lawful/contractual data access, approved source instructions, individual access design, retention/deletion rules and a named escalation owner. Choose pseudonymised records or a controlled export where possible; do not upload real VINs or staff details to GitHub Pages or the public repository.

Agree the permitted study tool/environment separately. The public sandbox's browser storage and shared development identities are not an operational data-processing environment.

## 3. Proposed study

Use a small operator-approved cohort and a duration sufficient to observe normal work and exceptions; for discussion, two to four weeks with roughly 50–200 vehicles. These figures are study-design suggestions, not validated sample-size calculations.

Run in **shadow mode**. The established systems, approved procedures and authorised staff remain authoritative. No automated charger commands, physical movement instructions, quarantine releases or carrier departure approvals are issued by the study tool.

Capture current observations and proposed tasks, then compare with the planner's actual decisions. Record disagreements and missing information. Do not retrospectively change an instruction version to make the result look correct.

## 4. Measurements

| Metric | How to collect | Proposed interpretation |
|---|---|---|
| Record retrieval time | Timed reconstruction of comparable cases, existing method and study view | Compare like-for-like work; report distribution and assistance |
| Observation effort | End-to-end travel/access/reading/entry time, not only form time | Net effort must be acceptable to the field team |
| Data agreement | Reconcile VIN/visit, position, observation, unit, timestamp and source version | Investigate every unexplained mismatch |
| Task precision | Planner labels each proposed exception useful/incorrect/duplicate/not actionable | Measure false positives and reasons, not only alert volume |
| Missed work | Compare against an independently reviewed set of expected tasks | Any safety-relevant miss stops reliance and triggers review |
| Handover completeness | Reconstruct selected cases without author assistance | Evidence must include source and correction history |
| Commercial value | Buyer reviews measured effort and proposed total costs | Seek a concrete next commitment, not hypothetical enthusiasm |

Set numerical success criteria with the owner after the baseline. Do not treat a small shadow sample as proof of reduced fire risk.

## 5. Stop conditions

Stop the relevant activity and return to the existing process if source instructions cannot be confirmed, data access is uncertain, an identity/tenant boundary is crossed, state cannot be reconciled, evidence is lost, staff misunderstand a forecast as a reading, or a proposed action conflicts with site procedures. Actual incidents follow the existing site response; this software does not direct them.

## 6. Exit decision

Document measured outcomes, disagreements, unresolved risks, support cost and the operator's decision: discontinue, revise the workflow, integrate with an incumbent or fund a scoped next stage. A production release needs separate acceptance, operations and security evidence.

See the [operational readiness review](../09-review/operational-readiness.md) for current blockers.
