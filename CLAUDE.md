# VoltYard – afspraken voor AI-assistenten

- Documentatie en UI-teksten in het **Nederlands**; code (klassen, methodes, variabelen) mag Nederlandse domeintermen gebruiken zoals in `docs/05-architectuur/datamodel.md` (Voertuig, BatterijControle, RegelProfiel...).
- Lees eerst `README.md`, `docs/03-concept/features.md` en `docs/05-architectuur/architectuur.md` voor je code schrijft.
- Architectuur: modulaire monoliet (`Api` / `Application` / `Domain` / `Infrastructure`). `Domain` heeft **geen** afhankelijkheden; tijd via `TimeProvider`.
- Regels van fabrikanten zijn **data** (regelprofielen), nooit hardcoded per merk (ADR-0005).
- Metingen (BatterijControle) zijn append-only.
- Belangrijke beslissing → nieuwe ADR in `docs/05-architectuur/adr/`.
- Na elke wijziging: commit + push.
