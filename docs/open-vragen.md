# Open vragen

Wat nog uitgezocht of beslist moet worden. Afvinken en het antwoord (of een link) erbij zetten.

## Opleiding (dringend: week 1)
- [ ] Wat zijn de officiële eisen van de finalisatie? (verplichte technologieën, onderdelen, format van het verslag)
- [ ] Wat is de deadline, en zijn er tussentijdse opleveringen?
- [ ] Mag de frontend in React/Next.js, of moet alles in C# (Blazor / MVC)? → ADR-0003
- [ ] Is een specifieke database verplicht (SQL Server)? → ADR-0002
- [ ] Is een individueel project toegestaan, en mag het een eigen idee zijn?
- [ ] Moet de code publiek zijn, of volstaat een privé repo met toegang voor de jury?

## Domein (via de interviews)
- [ ] Hoe volgen terminals vandaag de laadtoestand op? (P1)
- [ ] Hoe vaak komen lege EV's voor, en wat kost dat? (P2)
- [ ] In welke vorm geven fabrikanten hun regels door? (P3)
- [ ] Welke laadtoestand eisen de rederijen die in Zeebrugge aanleggen?
- [ ] Welke laders gebruiken ze, met OCPP of niet?
- [ ] Wordt laden vandaag gefactureerd?
- [ ] Hoe wordt de laadtoestand fysiek afgelezen (dashboard in de wagen, lader, app van de fabrikant)?
- [ ] Welke brandveiligheidseisen gelden voor EV-opslag (Hulpverleningszone, verzekeraar)?

## Techniek
- [ ] Welke PDF-bibliotheek? (QuestPDF: controleer de licentievoorwaarden; alternatief: een HTML-naar-PDF-renderer)
- [ ] Barcode: ZXing of de native `BarcodeDetector`? (testen op iOS Safari)
- [ ] Hoe houden we de TypeScript-types in sync met de API (OpenAPI → `openapi-typescript`)?
- [ ] Hosting van de frontend: Container Apps (alles in Azure) of Vercel?

## Product
- [ ] Naam "VoltYard": beschikbaar als domein en merk? (controleren voor publieke communicatie)
- [ ] Starten bij grote terminals, of bij compounds en PDI-centra? (B3)
