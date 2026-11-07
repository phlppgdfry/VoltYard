# Risk register

Ratings are qualitative planning judgements. Review after each discovery/pilot milestone.

| Risk | Impact | Mitigation / evidence | Owner |
|---|---|---|---|
| Problem already solved by existing systems | High | Compare real workflows and vendor demonstrations before committing to a product | Product |
| Incorrect or conflicting OEM/carrier instructions | High | Approved sources, applicability/versioning and explicit conflict handling | Operations/HSE |
| SOC estimate mistaken for actual battery state | High | Label observations versus forecasts; validate field procedures | Product/HSE |
| Staff cannot obtain consistent measurements | High | Observe a real inspection and define missing-data behaviour | Field supervisor |
| Shared identities expose or misattribute records | High | Local fictional demo only; individual OIDC identities before pilot | Engineering |
| File store used concurrently by multiple processes | High | Single owner; migrate to transactional database before hosted use | Engineering |
| Free-text notes contain personal/confidential data | Medium | Guidance, minimisation, retention and access review | Data owner |
| Hardware integration scope grows without access | Medium | Keep manual workflow; require a test device and contract | Engineering |
| Demonstration code described as compliant production software | High | Capability matrix, explicit limits and release gates | Product |
| Curriculum requirements differ from assumptions | Medium | Obtain supervisor rubric and map actual evidence | Student/supervisor |
| Whole-state API becomes slow | Medium | Measure representative inventory; implement indexed server pagination | Engineering |
| Audit metadata insufficient for a dispute | High | Full case/movement/correction history and immutable report snapshots in next release | Product/engineering |

Open decisions are tracked in [open questions](../open-questions.md). No mitigation is complete merely because it appears in this table.
