# Regelprofielen: het hart van VoltYard

## Idee

Elke fabrikant, en soms elk model, heeft eigen regels voor laadtoestand, controles en laden. In plaats van die regels **in de code** te schrijven, maakt VoltYard er **data** van: een *regelprofiel*.

Zo kan een terminal een nieuwe fabrikant toevoegen zonder dat er een nieuwe softwareversie nodig is. En de regels zijn **zichtbaar, controleerbaar en krijgen een versie**, wat belangrijk is als je later moet bewijzen welke regel op een bepaald moment gold.

## Structuur van een regelprofiel

| Veld | Voorbeeld | Betekenis |
|---|---|---|
| `Naam` | "BYD – standaard BEV" | |
| `Fabrikant` | BYD | Koppeling aan de klant |
| `ModelPatroon` (optioneel) | "Seal*", "Atto 3" | Specifieker profiel per model. **Het meest specifieke profiel wint** |
| `Aandrijving` | BEV / PHEV | |
| `MinOpslagSoc` | 30% | Onder deze waarde: **laden nodig** |
| `DoelOpslagSoc` | 50% | Tot hier laden voor opslag |
| `MaxLaadSoc` | 60% | Nooit hoger laden (voorkomt te vol laden) |
| `KritiekSoc` | 15% | Onder deze waarde: **kritieke** waarschuwing (risico op diepe ontlading) |
| `ControleIntervalDagen` | 14 | Hoe vaak een controle nodig is |
| `TwaalfVoltControleIntervalDagen` | 14 | Controle of onderhoud van de 12V-batterij |
| `StandaardOntlaadsnelheidPerDag` | 0,1% | Voor de voorspelling zolang er te weinig metingen zijn |
| `VertrekRegels` | zie hieronder | Grenzen per type vertrek of bestemming |
| `GeldigVanaf` / `Versie` | 2026-10-01 / v3 | Profielen krijgen een versie. Een meting verwijst naar de versie die toen gold |

### Vertrekregels (per bestemmingstype)

| Bestemmingstype | Min. laadtoestand | Max. laadtoestand | Opmerking |
|---|---|---|---|
| `Verscheping` | 20% | 50% | Typische eis van rederijen |
| `Veerboot` | 20% | 40% | Strengere limiet op sommige routes |
| `Truck` | 30% | 80% | Wagen moet zelf op de autotransporter kunnen rijden |
| `Trein` | 30% | 80% | |
| `Dealer` | 50% | 80% | Klant verwacht een bruikbare wagen |

*Alle waarden zijn voorbeelden. De terminal of de fabrikant stelt ze in.*

## De regelmotor

De regelmotor loopt:
1. **bij elke nieuwe meting** (controle of einde van een laadsessie);
2. **elke nacht** voor alle wagens op het terrein;
3. **bij een wijziging** van de vertrekplanning of het profiel.

### Regels (V1)

| Code | Regel | Ernst | Voorgestelde actie |
|---|---|---|---|
| `SOC_ONDER_MIN` | Laatste laadtoestand < `MinOpslagSoc` | Hoog | Laadopdracht |
| `SOC_KRITIEK` | Laatste laadtoestand < `KritiekSoc` | Kritiek | Onmiddellijk laden en 12V controleren |
| `SOC_VOORSPELD_ONDER_MIN` | Voorspelde laadtoestand bij vertrek, of binnen X dagen, < `MinOpslagSoc` | Middel | Laden inplannen |
| `CONTROLE_TE_LAAT` | Dagen sinds de laatste controle > `ControleIntervalDagen` | Middel | Controle inplannen |
| `TWAALFVOLT_TE_LAAT` | Dagen sinds de laatste 12V-controle > interval | Middel | 12V controleren of onderhoudsladen |
| `VERTREK_SOC_TE_HOOG` | Vertrek binnen X dagen en laadtoestand > max. voor die bestemming | Hoog | Niet laden, eventueel ontladen of een uitzondering aanvragen |
| `VERTREK_SOC_TE_LAAG` | Vertrek binnen X dagen en laadtoestand < min. voor die bestemming | Hoog | Laadopdracht met deadline |
| `QUARANTAINE_VEREIST` | Schade, verdachte batterij of incident gemeld | Kritiek | Naar quarantainezone, HSE beoordeelt |
| `VERKEERDE_ZONE` | EV staat in een zone die niet voor EV's bedoeld is | Middel | Verplaatsen |
| `ZONE_DICHTHEID` | Aantal EV's in een zone > maximum van de zone | Hoog | Wagens herverdelen |
| `NIET_RIJVAARDIG` | Wagen start niet (12V dood) | Hoog | Hulpstart of trailer, en deze wagen staat op de noodlijst |

### Voorspelling (eenvoudig, V1)

```
ontlaadsnelheid = (SOC_vorige − SOC_laatste) / dagen_ertussen     (als ≥ 2 metingen zonder laden ertussen)
                  anders: profiel.StandaardOntlaadsnelheidPerDag

voorspelde_SOC(datum) = SOC_laatste − ontlaadsnelheid × (datum − datum_laatste_meting)
```

Later (V2): het gemiddelde per model over alle wagens heen, invloed van de temperatuur (koude ontlaadt sneller), en een betrouwbaarheidsinterval.

## Het juiste profiel kiezen

1. Het profiel voor fabrikant + **modelpatroon** + aandrijving, als dat bestaat;
2. anders het profiel voor fabrikant + aandrijving;
3. anders het **standaardprofiel van de terminal** (veilige standaardwaarden).

Wagens met een standaardprofiel worden gemarkeerd, zodat de account manager de fabrikant kan vragen om de eigen regels.

## Waarom dit het verschil maakt

- **Voor de opleiding:** het toont echte domeinlogica, testbaar met unit tests, en veel meer dan CRUD.
- **Voor het product:** het is de kern van de "ondersteuning voor meerdere merken" die in de markt ontbreekt (zie de [concurrentieanalyse](../02-onderzoek/concurrentie.md)).
- **Voor later:** fabrikanten kunnen hun profiel zelf aanleveren, en er groeit een **bibliotheek met regelprofielen** die met elke klant waardevoller wordt.
