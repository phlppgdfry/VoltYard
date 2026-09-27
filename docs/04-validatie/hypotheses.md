# Hypotheses

Alles wat we **aannemen** maar nog niet **weten**. Na elk validatiegesprek de kolom "Status" bijwerken.

**Status:** ❓ Onbekend · ✅ Bevestigd · ❌ Weerlegd · ⚠️ Gedeeltelijk

## Probleem

| # | Hypothese | Hoe testen | Criterium voor bevestiging | Status |
|---|---|---|---|---|
| P1 | Terminals volgen de laadtoestand van EV's vandaag met Excel, papier of niet systematisch | Interview Q5–Q8 | ≥ 3 van de 5 gesprekken | ❓ |
| P2 | Lege EV's (12V of tractiebatterij) zorgen **wekelijks** voor verstoringen in de werking | Interview Q9–Q10 | ≥ 3 van de 5 noemen het een terugkerend probleem | ❓ |
| P3 | Verschillende regels per fabrikant zijn een echte pijn | Interview Q11–Q12 | ≥ 3 van de 5 | ❓ |
| P4 | HSE heeft onvoldoende zicht op waar EV's staan en hoe dicht op elkaar | Interview Q13–Q15 | ≥ 2 van de 3 HSE-profielen | ❓ |
| P5 | Fabrikanten vragen (of gaan vragen) om **bewijs** van correct batterijbeheer | Interview Q16 | ≥ 2 bevestigen de vraag | ❓ |

## Oplossing

| # | Hypothese | Hoe testen | Criterium | Status |
|---|---|---|---|---|
| O1 | Een controle via de gsm met VIN-scan is sneller dan de huidige manier | [Prototype](https://claude.ai/artifact/9FzRFJfQecUib1gaK1AeXj) (scherm Terrein) tonen en tijd meten | < 30 sec per wagen, gebruiker vindt het sneller | ❓ |
| O2 | Waarschuwingen met prioriteit en voorspelling helpen de planner | Prototype: dashboard | Planner zegt: "hier zou ik elke dag naar kijken" | ❓ |
| O3 | Configureerbare regelprofielen dekken de werkelijke regels | Echte regels van 2–3 fabrikanten naast ons model leggen | Past zonder grote aanpassingen | ❓ |
| O4 | De laadmodule heeft waarde, ook als terminals al laders hebben | Interview Q17–Q19 | ≥ 2 zien meerwaarde in planning en facturatie | ❓ |

## Business

| # | Hypothese | Hoe testen | Criterium | Status |
|---|---|---|---|---|
| B1 | Terminals betalen voor dit soort tool (of rekenen het door aan de fabrikant) | Interview Q20–Q21 | ≥ 2 met een concrete prijsindicatie | ❓ |
| B2 | Laden wordt (of kan) gefactureerd worden aan de fabrikant | Interview Q18 | ≥ 2 bevestigen | ❓ |
| B3 | Kleinere compounds en PDI-centra zijn makkelijker om mee te starten dan grote terminals | Gesprekken met beide types | Kortere beslissingstijd | ❓ |
| B4 | Leveranciers van terreinsoftware zien dit als een aanvulling, niet als een bedreiging | Eén gesprek met een leverancier | Openheid voor integratie | ❓ |

## Beslisregels na de validatie

- **P1–P3 grotendeels bevestigd** → doorgaan zoals gepland.
- **P1 weerlegd** (ze hebben al een goed systeem) → wat mist er? Anders **terugvallen op SlotDock** of het idee bijsturen (bv. focus op compounds of PDI-centra in plaats van grote terminals).
- **O4 weerlegd** → laadmodule naar Could, meer focus op veiligheid en bewijs.
- **Geen gesprekken mogelijk** → de finalisatie gaat gewoon door (het domein is goed genoeg gedocumenteerd), maar het productpotentieel blijft een open vraag.

> Voor de **finalisatie** is validatie *mooi om te hebben*. Het project staat ook zonder validatie. Voor een **echt product** is ze **noodzakelijk**.
