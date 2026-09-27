# Demodata

Alle merken, modellen, WMI-codes en VIN's zijn **fictief**. De VIN's hebben wel een geldig formaat (17 tekens, geen I/O/Q, geldig controlecijfer op positie 9), zodat de VIN-validatie in de app ermee werkt.

Opnieuw genereren (deterministisch, altijd dezelfde uitvoer):

```bash
python3 tools/generate_demo_data.py
```

**Referentiedatum:** 2026-09-28. De seed in de applicatie verschuift alle datums later relatief ten opzichte van "nu", zodat de demo altijd actueel oogt.

## Bestanden

| Bestand | Inhoud | Gebruikt voor |
|---|---|---|
| [regelprofielen.json](regelprofielen.json) | 4 fictieve fabrikanten (Voltara, Kestrel Motors, Nordhavn EV, Sunlei) met modellen en batterijcapaciteit, 7 regelprofielen (waaronder een modelspecifiek profiel en een standaardprofiel van de terminal) | Seed, testen van de profielkeuze |
| [zones.json](zones.json) | 7 zones: standaard, 4 EV-zones, laadzone, quarantaine | Seed |
| [laders.json](laders.json) | 20 vaste laders van 22 kW (L17 defect) + 2 mobiele laders van 50 kW | Seed laadmodule |
| [schip-voltara-400.csv](schip-voltara-400.csv) | Lijst van een schip met 400 Voltara's. **Rij 139 en 290 zijn bewust ongeldig** (letter "O" in de VIN, VIN van 16 tekens) | Demo van de CSV-import (stap 1 in het [demoscript](../docs/07-finalisatie/demoscript.md)) |
| [seed-voertuigen.csv](seed-voertuigen.csv) | 2.000 voertuigen op het terrein | Seed dashboard |
| [seed-controles.csv](seed-controles.csv) | ~14.000 controles (geschiedenis met realistische ontlading en vergeten controles) | Seed tijdlijnen en grafieken |
| [seed-laadsessies.csv](seed-laadsessies.csv) | ~800 laadsessies | Seed facturatieoverzicht |
| [regelmotor-testgevallen.md](regelmotor-testgevallen.md) | Verwacht gedrag van de regelmotor, inclusief grensgevallen | Later xUnit-tests |

## Ingebouwde "problemen" voor een realistische demo
- ~140 voertuigen met een laadtoestand onder het minimum, ~115 met een zwakke of dode 12V-batterij
- ~12% van de controles is te laat uitgevoerd
- 12 voertuigen in quarantaine, 25 EV's in de standaardzone (verkeerde zone)
- Zone **C-EV-3** zit boven de maximale EV-dichtheid (516 / 480)
- Lader L17 is defect
