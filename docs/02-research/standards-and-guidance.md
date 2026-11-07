# Standards and guidance

Reviewed against the linked primary sources on 7 November 2026. Real operating instructions must be approved for the specific OEM, carrier, route and terminal.

| Source | Relevance | Product implication |
|---|---|---|
| [EMSA guidance for AFVs in ro-ro spaces](https://emsa.europa.eu/publications/reports/item/4729-guidance-on-the-carriage-of-afvs-in-ro-ro-spaces.html) | Guidance developed with European and industry experts for alternative-fuel vehicles | Keep marine transport requirements separate from terminal storage profiles |
| [AIAG M-26 announcement](https://www.aiag.org/about-aiag/newsroom/articles/2024/09/23/aiag-announces-new-finished-vehicle-logistics-%28fvl%29-guidance-documents) | Industry handling guidance for BEVs in finished vehicle logistics | Obtain the licensed guideline and map approved requirements to observations and records |
| [EU Batteries Regulation, Article 77](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1542) | Battery passports apply from 18 February 2027 to EV batteries and other specified categories placed on the market or put into service | A future integration; VoltYard is not currently a passport issuer |
| [Commission battery-passport preparation guidance](https://single-market-economy.ec.europa.eu/news/guidance-support-preparations-digital-batteries-passport-2026-08-21_en) | Preparation and data-point guidance | Confirm applicable data and access rights before designing an integration |

## Configuration is not compliance

The fixture values, including shipping SOC 20–50% and ferry SOC 20–40%, are illustrative test settings. They are not universal legal limits or instructions for any real brand. Do not treat one route's policy as a rule for all ferries.

The application supports storage thresholds, inspection intervals and departure ranges. A percentage cannot establish a safe battery or an acceptable shipment. Damage and suspected battery issues require site HSE decisions regardless of SOC.

## Approval process for a real profile

1. Identify OEM, model, powertrain, terminal, carrier, destination and effective dates.
2. Attach the authoritative instruction, document version and permitted use.
3. Have operations and HSE resolve conflicting requirements.
4. Test boundary values and destination-specific targets in a staging environment.
5. Approve and publish a new profile version; retain historical references.
6. Review when the source changes or before its expiry.

The demo stores profile versions but does not implement this approval workflow or source attachments yet.

## Open research

Obtain licensed M-26 content, approved site emergency procedures, insurer requirements and actual OEM instructions. Confirm retention, lawful use of employee identifiers and any integration access with the relevant owners. See [security](../05-architecture/security-and-privacy.md).
