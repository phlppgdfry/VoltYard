# Definition of Done

Een user story is **af** als:

## Functioneel
- [ ] Alle acceptatiecriteria zijn gehaald
- [ ] Getest in de browser (desktop **en** mobiele weergave voor de schermen van terreinmedewerkers)
- [ ] Foutsituaties worden netjes afgehandeld (validatieboodschappen, Problem Details, geen crash)

## Code
- [ ] Code staat op een feature branch, via een PR gemerged naar `main`
- [ ] CI is groen (build, tests, lint, typecheck)
- [ ] Geen compiler warnings (nullable-warnings inbegrepen)
- [ ] Geen secrets of connection strings in de code
- [ ] Naamgeving consistent met de rest van de code

## Tests
- [ ] Domeinlogica heeft unit tests (regels: ook de grensgevallen)
- [ ] Nieuwe endpoints hebben minstens één integratietest (happy path + autorisatie)
- [ ] Bestaande tests slagen nog

## Security
- [ ] Het endpoint heeft de juiste autorisatiepolicy
- [ ] Tenant-isolatie gerespecteerd (data van een andere terminal is niet zichtbaar)
- [ ] Invoer gevalideerd aan de serverkant

## Documentatie
- [ ] De OpenAPI-beschrijving klopt (samenvatting + responsetypes)
- [ ] Bij een belangrijke beslissing: een ADR toegevoegd
- [ ] Docs bijgewerkt als het gedrag afwijkt van wat in `docs/` staat
- [ ] Een regel in het `logboek.md` van de week

## Een fase is af als
- [ ] Alle stories van die fase voldoen aan de DoD hierboven
- [ ] Gedeployd naar de demo-omgeving (vanaf fase 1)
- [ ] De seed-data is bijgewerkt zodat de nieuwe functionaliteit te demonstreren is
