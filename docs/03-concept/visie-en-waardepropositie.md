# Visie en waardepropositie

## Visie

> **Geen enkele EV verlaat een terminal leeg, onveilig of zonder bewijs.**

## Elevator pitch

*"Car terminals slaan duizenden elektrische wagens op, soms maandenlang. Elke fabrikant heeft andere regels voor de batterij, lege EV's blokkeren het terrein en een batterijbrand is een groot risico. Vandaag volgen terminals dat op met Excel en papier. VoltYard geeft elke EV een digitaal batterijdossier, past automatisch de regels van elke fabrikant toe, plant slim wanneer welke wagen geladen wordt en levert bij vertrek een sluitend bewijs. Zo vermijdt de terminal stilstand, beheerst ze de risico's en maakt ze van laden een dienst die ze kan factureren."*

## Waardepropositie per doelgroep

| Doelgroep | Pijn vandaag | Wat VoltYard oplevert |
|---|---|---|
| **Terminaloperator** | Lege EV's blokkeren de werking, papierwerk per fabrikant, brandrisico | Minder dode wagens, één systeem voor alle merken, beheersbaar risico |
| **Yard planner** | Weet niet welke wagen eerst geladen of gecontroleerd moet worden | Een lijst met prioriteiten en waarschuwingen, met voorspellingen |
| **Terreinmedewerker** | Papieren checklists, dubbel werk | Controle in 20 seconden: VIN scannen, laadtoestand invoeren, klaar |
| **HSE / veiligheid** | Geen overzicht van risicowagens en EV-dichtheid | Quarantainebeheer, zone-overzicht, lijst voor noodgevallen |
| **Commercieel / finance** | Laden en controles zijn moeilijk te factureren | Registratie per wagen en per fabrikant, klaar om te exporteren voor facturatie |
| **Autofabrikant / importeur** | Geen zicht op de toestand, lege wagens bij de dealer | Portaal of rapport met de toestand per VIN en een bewijs bij overdracht |

## Wat VoltYard WEL is
- Een **EV-laag** bovenop de bestaande terreinwerking
- **Onafhankelijk van merken:** de regels zijn configuratie, geen code
- Werkt **zonder telematica** (handmatige invoer via de gsm) en **met telematica** (later)
- Een **bewijsdossier**: elke meting en elke actie wordt vastgelegd met tijd en persoon

## Wat VoltYard NIET is (bewuste keuzes)
- **Geen vervanging** voor de terreinsoftware of het TOS. We beheren geen scheepsplanning of gate-in/gate-out.
- **Geen laadhardware.** We sturen laders aan of lezen ze uit, maar verkopen ze niet.
- **Geen systeem voor brandblussing of -detectie.** We ondersteunen preventie en overzicht, maar vervangen geen gecertificeerde brandveiligheidssystemen.
- **Geen diagnosetool voor batterijen.** We registreren metingen, maar stellen geen technische diagnose.

## Kernprincipes voor het ontwerp

1. **Mobiel eerst op het terrein:** grote knoppen, werkt met handschoenen, scannen in plaats van typen.
2. **Regels zijn data:** een nieuwe fabrikant toevoegen vraagt geen nieuwe release.
3. **Alles is traceerbaar:** een auditlog van elke wijziging, en metingen worden nooit overschreven.
4. **Voorspellen in plaats van reageren:** waarschuwen *voor* een wagen onder de grens zakt.
5. **Eenvoudig beginnen, uitbreidbaar ontwerpen:** eerst handmatige invoer, later OCPP en telematica.
