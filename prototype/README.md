# Klikbaar prototype

**Online (privé link):** https://claude.ai/artifact/9FzRFJfQecUib1gaK1AeXj
**Lokaal:** open `prototype/index.html` in je browser (één zelfstandig bestand).

Een prototype in HTML en JavaScript, **geen productiecode**. Het dient voor:
- de **validatiegesprekken** ("Wat zie je hier?"), zie de [contactlijst](../docs/04-validatie/contactlijst.md);
- een **houvast bij het bouwen** van de echte Next.js-frontend;
- **screenshots** voor het verslag.

## Wat werkt
| Scherm | Wat je kan doen |
|---|---|
| Dashboard | Waarschuwingen op ernst, zones met EV-dichtheid (C-EV-3 zit erboven), laders |
| Voertuigen | Zoeken, filteren, en doorklikken naar het detail met de grafiek van de laadtoestand + voorspelling, tijdlijn, overdrachtsrapport |
| Terrein | Gsm-weergave: takenlijst → controle registreren (laadtoestand, 12V, schade) → nieuwe waarschuwingen. Getypte VIN's worden gevalideerd (lengte, I/O/Q, controlecijfer) |
| Laden | Laadopdrachten goedkeuren → starten op een vrije lader → stoppen (kWh gaat naar de facturatie van de fabrikant) |
| Veiligheid | Quarantaine met een verplichte beslissing en motivering, noodoverzicht per zone (kopiëren als CSV) |
| Regelprofielen | Waarden aanpassen en meteen zien hoeveel voertuigen een waarschuwing krijgen (simulatie), opslaan als nieuwe versie |

De regelmotor in het prototype is een vereenvoudigde JavaScript-versie van [regelprofielen.md](../docs/03-concept/regelprofielen.md). Wijzigingen gelden alleen voor je huidige sessie. Na het herladen begint alles opnieuw.

## Aanpassen
Bewerk `index.template.html` (niet `index.html`) en draai daarna:
```bash
python3 tools/generate_demo_data.py   # genereert de data en bouwt index.html opnieuw
```
