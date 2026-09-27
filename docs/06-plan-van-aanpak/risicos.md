# Risico's

**Kans** en **impact**: L (laag), M (middel), H (hoog).

| # | Risico | Kans | Impact | Maatregel | Eigenaar |
|---|---|:-:|:-:|---|---|
| R1 | **Scope creep:** te veel features, de kern raakt niet af | H | H | Strikte MoSCoW. De minimale versie eerst af (M3, week 9). Could-items pas na M4 | Philippe |
| R2 | **Eisen van de opleiding** passen niet bij de gekozen stack (bv. een C#-frontend verplicht, SQL Server verplicht) | M | H | **Controleren in week 1.** Alternatieven liggen klaar in ADR-0002/0003 | Philippe |
| R3 | **Geen validatiegesprekken** mogelijk (terminals reageren niet) | M | M | Vroeg beginnen, meerdere kanalen (LinkedIn, netwerk in Zeebrugge, docenten). Het project gaat ook zonder door. Publieke bronnen dekken het domein | Philippe |
| R4 | **Het idee blijkt al opgelost** (terminals hebben een goed intern systeem) | M | M (voor de finalisatie L) | Voor de finalisatie geen probleem. Voor het product: bijsturen (compounds, PDI-centra, kleinere havens) of terugvallen op SlotDock | Philippe |
| R5 | **Te weinig domeinkennis** (verkeerde aannames over laadtoestanden en regels) | M | M | Regels als data (ADR-0005), zodat een verkeerde aanname makkelijk te corrigeren is. Waarden duidelijk als "voorbeeld" labelen | Philippe |
| R6 | **Leercurve van C#/.NET** vertraagt fase 1–2 | M | M | Fundament eenvoudig houden. Microsoft Learn-modules parallel volgen. Bekende patronen gebruiken | Philippe |
| R7 | **Kosten van Azure** lopen op | L | M | Azure for Students, schalen tot nul, budgetalert instellen, database stoppen buiten demo's | Philippe |
| R8 | **De demo faalt live** (netwerk, koude start) | M | H | `minReplicas = 1` in de demoweek. Een lokale backup via Docker. Een opgenomen video als vangnet | Philippe |
| R9 | **Performantie** bij veel voertuigen (nachtelijke taak, dashboard) | L | M | Batchverwerking, indexen, een loadtest met 10.000+ voertuigen in fase 6 | Philippe |
| R10 | **Bedrijfsgevoelige informatie** uit interviews komt in de repo | L | H | Notities anonimiseren. Geen bedrijfsnamen of cijfers zonder toestemming. Repo privé | Philippe |
| R11 | **Camera- en barcodescanning** werkt slecht op sommige toestellen (iOS Safari) | M | L | Terugvallen op handmatige invoer met validatie. Vroeg testen op echte toestellen | Philippe |
| R12 | **Ziekte of persoonlijke omstandigheden** | L | H | Buffer in fase 6. De minimale versie zo vroeg mogelijk af | Philippe |

## Top 3 om actief op te volgen
1. **R1 (scope):** elke sprint nagaan of de minimale versie op schema zit.
2. **R2 (eisen van de opleiding):** in week 1 afchecken.
3. **R8 (demo):** een draaiboek en een backupvideo in de laatste week.
