# ADR-0005: Regels van fabrikanten als data, niet als code

- **Status:** Aanvaard
- **Datum:** 2026-09-27

## Context
Elke fabrikant (en soms elk model) heeft andere grenzen voor laadtoestand, controle-intervallen en vertrek. Terminals werken met tientallen merken, en de regels veranderen (bv. verwachte IMO-regels rond 2027).

## Opties
1. **Hardcoded per merk (`if merk == "BYD"`):** snel, maar elke wijziging vraagt een release. Onhoudbaar.
2. **Generieke regelmotor met een DSL of scripts:** maximaal flexibel, maar complex en een risico voor de veiligheid.
3. **Vaste set regeltypes in code + parameters als data (regelprofielen):** de *logica* zit in geteste klassen (`IRegel`), de *waarden* zitten in de database per profiel.

## Beslissing
**Optie 3.** Een vaste set geteste regelklassen, geparametriseerd door **regelprofielen met versies**. Het meest specifieke profiel wint (fabrikant + model > fabrikant > standaard van de terminal).

## Gevolgen
- ✅ Een nieuwe fabrikant toevoegen = data invoeren, geen release.
- ✅ Elke meting verwijst naar een profielversie, dus volledig traceerbaar.
- ✅ Regelklassen zijn klein en afzonderlijk unit-testbaar.
- ⚠️ Een nieuw *soort* regel vraagt nog altijd code. Dat is aanvaardbaar, want het gebeurt zelden.
