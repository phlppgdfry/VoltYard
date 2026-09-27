# Probleemstelling

## Kort

> Car terminals slaan steeds meer elektrische voertuigen op, en steeds langer. Ze hebben geen gestandaardiseerde, digitale manier om **per voertuig** de batterijtoestand op te volgen, de **verschillende regels van elke autofabrikant** toe te passen, **brandrisico's** te beheersen en **aan te tonen** dat ze dat correct deden.

## Context

Een nieuwe wagen gaat van de fabriek naar de klant via een keten van partijen: de fabriek, een rederij (PCTC-schip), een terminal in de haven, soms een compound of PDI-centrum (Pre-Delivery Inspection), een transporteur met autotransporters, en ten slotte de dealer.

Op de **terminal** komt alles samen. Schepen lossen er honderden tot duizenden wagens tegelijk, die daar blijven staan tot ze verder vervoerd worden. Die tijd noemt men de **dwell time**.

Bij benzine- en dieselwagens is een lange dwell time vooral een kwestie van plaats. **Bij EV's komen er drie nieuwe problemen bij.**

## De drie kernproblemen

### 1. Batterijen lopen leeg, en een lege EV is een blok beton
- Een EV verliest ook stilstaand lading, door zelfontlading en doordat systemen in de wagen stroom blijven verbruiken. Vuistregel: **ongeveer 1% van de tractiebatterij per maand**, bij sommige modellen meer.
- Grotere boosdoener: de **12V-hulpbatterij**. Staat een wagen langer dan ongeveer twee weken stil, dan wordt aangeraden die los te koppelen of te onderhouden. Is de 12V-batterij leeg, dan start de wagen niet, ook al is de grote batterij nog vol.
- Gevolg: EV's die niet meer rijden, liggen **ver van vaste laadpunten** en blokkeren de terreinwerking. Wallenius Wilhelmsen in Zeebrugge investeerde daarom in *"trailers to move cars with flat batteries, or too low SOC"*.
- Bij de klant: EV's die **leeg bij de dealer aankomen**, en in het ergste geval batterijschade door diepe ontlading. Dat is een garantierisico voor de fabrikant.

### 2. Brandrisico
- Een EV-brand is moeilijk te blussen, geeft een grote rookpluim en vraagt veel bluswater. Een brand kan zich verspreiden voor de brandweer ter plaatse is.
- Aanbevolen maatregelen: **brandgangen, thermische camera's en aparte zones**. EV's met een verdachte of beschadigde batterij horen niet aan boord (EMSA).
- Op de RoRo Congress 2025 in Zeebrugge zei de sector: *"Terminals that fail to implement specialized handling procedures for electric vehicles risk not only safety incidents but also reputational damage and operational shutdowns."*

### 3. Elke fabrikant heeft andere regels, en je moet kunnen bewijzen dat je ze volgde
- Rederijen vragen vaak een laadtoestand **tussen 20% en 50%** bij verscheping, en sommige overheden leggen een maximum op (Griekenland: maximaal 40% op veerboten).
- Voor langdurige opslag wordt vaak **50–60%** aangeraden, maar de exacte waarden verschillen per fabrikant en per model.
- De AIAG-richtlijn M-26 (opgesteld samen met grote fabrikanten) vraagt dat logistieke partners **kunnen aantonen hoe ze de laadtoestand beheren** in plaats van te improviseren.
- Terminals die met meerdere merken werken, hebben hier geen standaard voor: een haven *"may not want to invest in different systems in order to handle different OEMs"*.

## Waarom nu?

| Trend | Gevolg |
|---|---|
| Het aandeel EV's in de invoer groeit, met veel nieuwe Chinese merken zonder eigen Europees netwerk | Meer EV's, en langer op de terminal |
| Terminals verdienen steeds meer aan de wachttijd zelf: laden, PDI, opslag (de "dwell economy") | Laden wordt een **dienst die je kan factureren**, en dat vraagt registratie |
| Strengere brandregels voor schepen en terminals, verplichte IMO-regels voor EV's verwacht rond 2027 | Aantoonbare procedures worden een vereiste |
| Batterijpaspoort in de EU, verplicht vanaf 18 februari 2027 | Batterijdata per voertuig wordt gestandaardiseerd en makkelijker bereikbaar |
| Nieuwe capaciteit in Zeebrugge: ICO bouwt een geautomatiseerd parkeergebouw voor ~10.000 wagens (klaar eind 2027), WWL breidt uit met ~8.000 plaatsen | Meer wagens dichter op elkaar, dus brandveiligheid en planning worden nog belangrijker |

## Wie heeft het probleem?

| Partij | Pijn |
|---|---|
| **Terminaloperator** (yard planner, HSE) | Lege wagens blokkeren de werking, brandrisico, papierwerk per fabrikant |
| **Terreinmedewerker** | Controles op papier, niet weten welke wagen voorrang heeft |
| **Autofabrikant / importeur** | Lege of beschadigde wagens bij de dealer, garantiekosten, geen zicht op de toestand |
| **Rederij** | Wagens die niet aan de laadregels voldoen of een risico vormen aan boord |
| **Verzekeraar** | Wie is aansprakelijk voor batterijschade of brand? |

## Wat we (nog) niet weten

Dit probleem steunt vandaag op **publieke bronnen**, niet op gesprekken. We moeten nog nagaan:
- Hoe terminals dit **vandaag** doen: Excel, papier, een module in hun terreinsoftware, of een systeem van de fabrikant zelf?
- **Hoe groot** de pijn is: hoeveel lege EV's per maand, hoeveel tijd kost het?
- **Wie zou betalen**: de terminal, of de fabrikant via de terminal?

Zie [hypotheses](../04-validatie/hypotheses.md) en de [interviewgids](../04-validatie/interviewgids.md).
