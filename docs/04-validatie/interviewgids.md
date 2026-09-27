# Interviewgids

## Doel
Begrijpen hoe car terminals, compounds en PDI-centra vandaag omgaan met EV's, **zonder onze oplossing te verkopen**. We willen horen wat ze *doen*, niet wat ze *zouden willen*.

## Wie interviewen? (doel: 5 gesprekken)

| Profiel | Aantal | Waar vinden? |
|---|---|---|
| Yard planner / operationeel verantwoordelijke car terminal | 2 | LinkedIn (ICO, Wallenius Wilhelmsen, DP World Zeebrugge), eigen netwerk in Zeebrugge |
| HSE-verantwoordelijke terminal | 1 | LinkedIn, via de operationele contacten |
| PDI-centrum / compound (eventueel in het binnenland) | 1 | LinkedIn, lijsten van vervoerders van nieuwe wagens |
| Logistiek bij een fabrikant of importeur | 1 | LinkedIn (EV-importeurs in de Benelux) |
| *(Bonus)* Leverancier van terreinsoftware | 0–1 | Beurzen (RoRo Congress Zeebrugge) |

## Bericht om contact te leggen (LinkedIn / e-mail)

> Dag [naam],
>
> Ik ben Philippe, student Full Stack Development, en ik werk aan een eindproject rond het beheer van elektrische wagens op car terminals: batterijtoestand, laden en veiligheid. Omdat Zeebrugge de grootste autohaven van Europa is, wil ik vertrekken van hoe het er in de praktijk aan toegaat, en niet van wat ik online lees.
>
> Zou je 20 minuten tijd hebben voor een kort gesprek (online of ter plaatse)? Ik verkoop niets. Ik wil alleen begrijpen hoe jullie dit vandaag aanpakken.
>
> Alvast bedankt!
> Philippe

## Tijdens het gesprek
- **Opnemen:** alleen met toestemming. Anders notities.
- **Houding:** open vragen stellen, doorvragen ("Kan je een voorbeeld geven van de laatste keer dat...?"), stiltes laten vallen.
- **Niet doen:** onze oplossing uitleggen voor het einde, suggestieve vragen stellen ("Zou het niet handig zijn als..."), vragen naar de toekomst in plaats van het verleden.
- **Vertrouwelijkheid:** geen bedrijfsgegevens in de repo zetten zonder toestemming. Notities anonimiseren.

## Vragen

### Introductie (2 min)
1. Wat is je rol, en hoe ziet een typische dag eruit?
2. Hoeveel wagens staan er gemiddeld op jullie terrein, en welk deel daarvan is elektrisch?
3. Hoe lang blijft een EV gemiddeld staan? Wat is de langste die je gezien hebt?
4. Met hoeveel verschillende merken of fabrikanten werken jullie?

### Batterijtoestand (5 min)
5. Hoe weten jullie vandaag wat de laadtoestand van een EV op het terrein is?
6. Wie controleert dat, hoe vaak, en waar wordt het genoteerd?
7. Welke software gebruiken jullie op het terrein? Houdt die iets bij over batterijen?
8. Wat gebeurt er met die gegevens? Wie kijkt ernaar?

### Lege wagens (3 min)
9. Vertel over de laatste keer dat een EV niet meer startte of te leeg was. Wat gebeurde er?
10. Hoe vaak gebeurt dat, ongeveer? Wat kost het (tijd, trailers, vertraging)?

### Regels van fabrikanten (3 min)
11. Krijgen jullie instructies van fabrikanten over laadtoestand, controles of laden? In welke vorm?
12. Hoe zorgen jullie dat die per merk gevolgd worden?

### Veiligheid (3 min)
13. Hoe gaan jullie om met het brandrisico van EV's op het terrein? Zijn er aparte zones?
14. Wat gebeurt er als een EV schade heeft of verdacht lijkt?
15. Als er morgen brand uitbreekt in een zone, hoe snel weet je welke EV's daar staan?

### Bewijs en klanten (2 min)
16. Vragen fabrikanten, rederijen of verzekeraars om rapporten of bewijs over de batterijtoestand?

### Laden (3 min)
17. Laden jullie wagens op het terrein? Met welke laders (vast, mobiel), en hoeveel?
18. Wordt laden gefactureerd aan de klant? Hoe?
19. Hoe beslis je welke wagen wanneer geladen wordt?

### Afsluiting (2 min)
20. Als je één ding kon veranderen aan hoe jullie met EV's omgaan, wat zou dat zijn?
21. Bestaat er budget voor tools op dit vlak? Wie zou daarover beslissen?
22. Ken je iemand anders met wie ik hierover zou moeten praten?

*(Pas na vraag 22, als er tijd is: kort het idee VoltYard toelichten en de eerste reactie noteren.)*

## Notitiesjabloon (per gesprek)

Maak per gesprek een bestand `docs/04-validatie/gesprekken/YYYY-MM-DD-profiel.md` (geanonimiseerd):

```markdown
# Gesprek – [profiel], [datum]
- Type organisatie:
- Aantal wagens / % EV:
- Huidige werkwijze laadtoestand:
- Belangrijkste pijnpunten (citaten!):
- Laden: ja/nee, hoe, gefactureerd?
- Veiligheid:
- Bevestigt / weerlegt hypotheses: P1 ✅, P2 ❓, ...
- Verrassingen:
- Vervolg / doorverwijzing:
```
