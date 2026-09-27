# Testgevallen voor de regelmotor

Deze gevallen worden later letterlijk **xUnit-tests** (`[Theory]` met `[InlineData]`/`[MemberData]`). Ze leggen het verwachte gedrag vast **voor** de code bestaat. Dat is test-first denken.

**Referentiedatum ("vandaag"):** 2026-09-28 (via `FakeTimeProvider`)
**Instellingen van de terminal:** `VertrekVensterDagen = 7` (vertrekregels gelden als het vertrek binnen 7 dagen valt), `VoorspellingsHorizonDagen = 14`
**Profielen:** zie [regelprofielen.json](regelprofielen.json)

| Profiel | Min | Doel | Max laden | Kritiek | Controle-interval | Ontlading/dag | Verscheping |
|---|---|---|---|---|---|---|---|
| VLT-BEV (Voltara) | 30 | 50 | 60 | 15 | 14 d | 0,10 | 20–50 |
| NHV-BEV (Nordhavn) | 30 | 55 | 60 | 15 | 14 d | 0,09 | 20–**45** |
| SNL-BEV (Sunlei) | 35 | 50 | 55 | 20 | **7 d** | 0,25 | 20–50 |

## 1. Laadtoestand

| # | Profiel | Situatie | Verwacht |
|---|---|---|---|
| S1 | VLT-BEV | Laatste laadtoestand 24% | `SOC_ONDER_MIN`, Hoog |
| S2 | VLT-BEV | Laatste laadtoestand **30%** (grens) | Geen waarschuwing (grens = OK) |
| S3 | VLT-BEV | Laatste laadtoestand 12% | `SOC_KRITIEK`, Kritiek, en **niet** ook `SOC_ONDER_MIN` (kritiek vervangt) |
| S4 | VLT-BEV | Laatste laadtoestand **15%** (grens kritiek) | Alleen `SOC_ONDER_MIN` |
| S5 | SNL-BEV | Laatste laadtoestand 33% | `SOC_ONDER_MIN` (min is 35 bij Sunlei) |

## 2. Voorspelling

| # | Profiel | Situatie | Verwacht |
|---|---|---|---|
| P1 | VLT-BEV | Metingen: 34% op 09-18, 32% op 09-28 (dus 0,2%/dag). Vertrek 2026-10-20 | Horizon = min(vertrek, vandaag+14) = 10-12 → 32 − 0,2×14 = **29,2** < 30 → `SOC_VOORSPELD_ONDER_MIN`, Middel |
| P2 | VLT-BEV | Eén meting: 31% vandaag, geen vertrek | Standaard 0,10/dag → 31 − 1,4 = 29,6 → `SOC_VOORSPELD_ONDER_MIN` |
| P3 | VLT-BEV | Eén meting: 33% vandaag | 33 − 1,4 = 31,6 → geen waarschuwing |
| P4 | VLT-BEV | Metingen: 30% op 09-10, **laadsessie** op 09-12 naar 50%, 49% op 09-28 | Ontlaadsnelheid alleen **na** het laden berekenen (50→49 over 16 d). Geen waarschuwing |
| P5 | VLT-BEV | Laatste laadtoestand al < min | Alleen `SOC_ONDER_MIN`, geen dubbele voorspellingswaarschuwing |

## 3. Controles

| # | Profiel | Situatie | Verwacht |
|---|---|---|---|
| C1 | VLT-BEV | Laatste controle 2026-09-10 (18 d) | `CONTROLE_TE_LAAT`, Middel |
| C2 | VLT-BEV | Laatste controle 2026-09-14 (**14 d**, grens) | Geen waarschuwing |
| C3 | SNL-BEV | Laatste controle 2026-09-20 (8 d) | `CONTROLE_TE_LAAT` (interval 7 d) |
| C4 | VLT-BEV | 12V-status "Zwak" | `TWAALFVOLT_ZWAK`, Middel |
| C5 | VLT-BEV | 12V-status "Dood" | `NIET_RIJVAARDIG`, Hoog, en het voertuig krijgt `Rijvaardig = false` |

## 4. Vertrek

| # | Profiel | Situatie | Verwacht |
|---|---|---|---|
| V1 | VLT-BEV | Laadtoestand 58%, vertrek Verscheping op 10-02 (over 4 d) | `VERTREK_SOC_TE_HOOG`, Hoog (max. 50) |
| V2 | VLT-BEV | Laadtoestand 58%, vertrek Verscheping op 10-20 (over 22 d) | Geen waarschuwing (buiten het venster van 7 d) |
| V3 | VLT-BEV | Laadtoestand 42%, vertrek Dealer op 10-01 | `VERTREK_SOC_TE_LAAG`, Hoog (min. 50) |
| V4 | NHV-BEV | Laadtoestand 48%, vertrek Verscheping op 10-01 | `VERTREK_SOC_TE_HOOG` (Nordhavn: max. **45**) |
| V5 | VLT-BEV | Laadtoestand 48%, vertrek Verscheping op 10-01 | Geen waarschuwing (Voltara: max. 50) |
| V6 | VLT-BEV | Vertrek bevestigen terwijl `VERTREK_SOC_TE_HOOG` open staat | API geeft **409 Conflict** met Problem Details, tenzij de planner een uitzondering met reden opgeeft |

## 5. Veiligheid en terrein

| # | Situatie | Verwacht |
|---|---|---|
| T1 | Controle met `VerdachteBatterij = true` | `QUARANTAINE_VEREIST`, Kritiek. Status → `Quarantaine vereist` |
| T2 | Controle met `SchadeGemeld = true`, batterij niet verdacht | `QUARANTAINE_VEREIST`, Hoog *(te valideren met HSE: is gewone carrosserieschade genoeg?)* |
| T3 | EV in zone `A-STD` (type Standaard) | `VERKEERDE_ZONE`, Middel |
| T4 | Zone `C-EV-3`: 516 EV's, max. 480 | `ZONE_DICHTHEID`, Hoog (waarschuwing op **zoneniveau**, niet per voertuig) |
| T5 | Voertuig verplaatst naar `Q-QUAR` | `QUARANTAINE_VEREIST` opgelost. Status → `In quarantaine` |

## 6. Levenscyclus van waarschuwingen

| # | Situatie | Verwacht |
|---|---|---|
| W1 | Er staat al een open `SOC_ONDER_MIN`, een nieuwe controle geeft 22% | Dezelfde waarschuwing wordt **bijgewerkt** (geen tweede) |
| W2 | Open `SOC_ONDER_MIN`, een nieuwe controle na het laden geeft 50% | Waarschuwing **automatisch opgelost**, reden "Automatisch: regel niet meer geschonden" |
| W3 | De nachtelijke taak draait twee keer na elkaar | Hetzelfde resultaat (idempotent), geen duplicaten |

## 7. Profielkeuze

| # | Voertuig | Verwacht profiel |
|---|---|---|
| K1 | Voltara V7 Long Range, BEV | `VLT-V7` (modelpatroon wint) |
| K2 | Voltara V5, BEV | `VLT-BEV` |
| K3 | Kestrel K5 Hybrid, PHEV | `KST-PHEV` |
| K4 | Onbekend merk "Zephyr", BEV | `TERMINAL-DEFAULT` + markering "standaardprofiel" |

## 8. Doel-laadtoestand bij laadopdrachten

`doel = min(DoelOpslagSoc, MaxLaadSoc, maxSoc van de bestemming als het vertrek binnen het venster valt)`

| # | Profiel | Situatie | Doel |
|---|---|---|---|
| L1 | VLT-BEV | Geen vertrek gepland | 50 |
| L2 | VLT-BEV | Vertrek Verscheping over 5 d | min(50, 60, 50) = **50** |
| L3 | NHV-BEV | Vertrek Verscheping over 5 d | min(55, 60, 45) = **45** |
| L4 | NHV-BEV | Geen vertrek | min(55, 60) = **55** |
| L5 | VLT-BEV | Vertrek Dealer over 3 d (min. 50) | 50. Als de wagen 50 moet halen voor vertrek → deadline = vertrekdatum |
