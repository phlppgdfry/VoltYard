# Regelgeving, richtlijnen en standaarden

*Dit is geen juridisch advies. Voor een echt product: de actuele teksten controleren en experts raadplegen (HSE, rederijen, verzekeraars).*

## Samenvatting voor VoltYard

| Kader | Status | Wat het voor VoltYard betekent |
|---|---|---|
| **IMO MSC.1/Circ.1615** (interim-richtlijnen brand in ro-ro-ruimtes) | Niet bindend | Brandpreventie aan boord. Terminals moeten wagens "klaar voor verscheping" aanleveren |
| **IMO: verplichte EV-regels** | Verwacht rond 2027 | Strengere eisen bij verscheping. De regels in VoltYard moeten **makkelijk aan te passen** zijn |
| **EMSA-richtlijnen voor alternatief aangedreven voertuigen (AFV)** | Richtlijn (EU) | EV's met een verdachte of beschadigde batterij **niet aan boord**, tenzij de batterij verwijderd is. Dit wordt een quarantainestatus in VoltYard |
| **Nationale regels** (bv. Griekenland) | Bindend op veerboten | Maximaal 40% laadtoestand op veerboten. Dit toont dat **limieten per bestemming of rederij** kunnen verschillen |
| **Eisen van rederijen** | Contractueel | Vaak een laadtoestand tussen **20% en 50%** bij verscheping |
| **AIAG M-26** (BEV Supply Chain Handling Guideline) | Branchestandaard | Laadtoestand, temperatuur, opslag en omgaan met schade. Partners moeten **aantonen** hoe ze de laadtoestand beheren. Dit wordt het overdrachtsrapport |
| **EU-batterijpaspoort** (Verordening (EU) 2023/1542) | Verplicht vanaf **18 februari 2027** | Digitaal paspoort per EV-batterij (> 2 kWh) via een QR-code, met onder meer chemie en batterijgezondheid. Later kan VoltYard hier **statische batterijdata** uit halen |
| **OCPP** (Open Charge Point Protocol) | Open standaard | Het standaardprotocol tussen laders en beheersoftware. Voor een latere automatische koppeling met laders (kWh, laadtoestand) |
| **GDPR** | Bindend | Weinig persoonsgegevens (alleen medewerkers), maar wel logging en toegangsbeheer. Zie [security](../05-architectuur/security-en-privacy.md) |
| **Nettarieven met piekcomponent** (België/Vlaanderen) | Van toepassing | Netkosten hangen af van de **piekafname**. Slim laden, dus spreiden in de tijd, bespaart geld. Een argument voor de laadmodule |

## Laadtoestand: typische waarden

Uit verschillende bronnen. **Dit zijn voorbeeldwaarden, geen norm.** In VoltYard zijn het configureerbare [regelprofielen](../03-concept/regelprofielen.md).

| Situatie | Typische waarde | Bron |
|---|---|---|
| Verscheping (ro-ro / PCTC) | 20–50% laadtoestand | Eisen van rederijen (ODS Orient Spedition) |
| Veerboot Griekenland | ≤ 40% laadtoestand | Grieks ministerie van Scheepvaart |
| Langdurige opslag | 50–60% laadtoestand | Algemeen advies over EV-opslag |
| Zelfontlading | ~1% per maand (tractiebatterij) | Algemeen advies. **Varieert sterk per model** |
| 12V-batterij | Ontkoppelen of onderhoudsladen na ~2 weken stilstand | Algemeen advies |

**Ontwerpgevolg:** VoltYard moet omgaan met **tegenstrijdige doelen**. Voor opslag wil je de laadtoestand hoog genoeg houden (50–60%), maar voor verscheping moet ze misschien laag genoeg zijn (≤ 40–50%). De regelmotor moet dus rekening houden met de **volgende bestemming en de vertrekdatum**. Zie [regelprofielen](../03-concept/regelprofielen.md).

## Brandveiligheid op het terrein (ontwerpprincipes)

Uit de brandveiligheidsbronnen:
- **brandgangen** en voldoende afstand tussen EV's;
- **thermische bewaking** tijdens transport en opslag;
- een **aparte zone** (quarantaine) voor verdachte of beschadigde voertuigen;
- rekening houden met veel **bluswater** en een grote **rookpluim**;
- **dode wagens** kunnen niet zelf wegrijden bij een incident, dus hun locatie kennen is belangrijk.

In VoltYard wordt dat: zonetypes, een maximale EV-dichtheid per zone, quarantaineregels, de positie van brandkranen als kaartlaag en een lijst met wagens die niet zelf kunnen rijden.

## Nog uit te zoeken

- [ ] De inhoud van AIAG M-26 zelf (betalend document): welke velden en frequenties precies?
- [ ] De EMSA-richtlijn in detail: welke criteria bepalen of een batterij "verdacht" is?
- [ ] Welke regels hanteren de terminals in Zeebrugge zelf (HSE-procedures)?
- [ ] Rederijen in Zeebrugge: welke laadtoestand eisen ze bij verscheping?
- [ ] Brandweer / Hulpverleningszone: welke eisen gelden voor EV-opslag op terminals?
