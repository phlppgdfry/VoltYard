# ADR-0004: Modulaire monoliet in plaats van microservices

- **Status:** Aanvaard
- **Datum:** 2026-09-27

## Context
Eén ontwikkelaar, beperkte tijd, maar een domein met duidelijke deelgebieden (voertuigen, regels, terrein, laden, rapporten). Het moet later kunnen groeien.

## Opties
1. **Microservices:** onafhankelijk schaalbaar, maar veel overhead (netwerk, deployment, data-consistentie). Overkill voor één persoon.
2. **Klassieke gelaagde monoliet:** eenvoudig, maar modules vloeien gemakkelijk in elkaar over.
3. **Modulaire monoliet:** één deploybare eenheid, intern met duidelijke modulegrenzen. Een zuivere `Domain`-laag zonder afhankelijkheden.

## Beslissing
**Modulaire monoliet** met de projecten `Api`, `Application`, `Domain` en `Infrastructure`, en in elk project mappen per module.

## Gevolgen
- ✅ Eenvoudig te deployen en te debuggen. De domeinlogica is 100% unit-testbaar.
- ✅ Een module (bv. Laden) kan later afgesplitst worden als dat echt nodig blijkt.
- ⚠️ Discipline nodig: modules mogen alleen via services van elkaars data gebruikmaken, niet via elkaars interne klassen.
