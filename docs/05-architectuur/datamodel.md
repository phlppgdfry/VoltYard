# Datamodel

## ERD (kern)

```mermaid
erDiagram
    TERMINAL ||--o{ ZONE : heeft
    TERMINAL ||--o{ GEBRUIKER : heeft
    TERMINAL ||--o{ VOERTUIG : "slaat op"
    FABRIKANT ||--o{ VOERTUIG : produceert
    FABRIKANT ||--o{ REGELPROFIEL : definieert
    REGELPROFIEL ||--o{ VERTREKREGEL : bevat
    VOERTUIG }o--|| REGELPROFIEL : "gebruikt (actueel)"
    VOERTUIG ||--o{ BATTERIJCONTROLE : heeft
    VOERTUIG ||--o{ WAARSCHUWING : heeft
    VOERTUIG ||--o{ ZONEVERPLAATSING : heeft
    VOERTUIG ||--o{ QUARANTAINEDOSSIER : heeft
    VOERTUIG ||--o| VERTREKPLANNING : heeft
    ZONE ||--o{ ZONEVERPLAATSING : "doel van"
    GEBRUIKER ||--o{ BATTERIJCONTROLE : "voert uit"
    TERMINAL ||--o{ AUDITLOG : registreert

    TERMINAL {
        uuid Id PK
        string Naam
        string Locatie
    }
    FABRIKANT {
        uuid Id PK
        string Naam
        string Code "bv. BYD"
    }
    VOERTUIG {
        uuid Id PK
        uuid TerminalId FK
        string Vin UK "17 tekens"
        uuid FabrikantId FK
        string Merk
        string Model
        enum Aandrijving "BEV|PHEV"
        decimal BatterijCapaciteitKwh
        enum Status
        uuid HuidigeZoneId FK
        uuid RegelProfielId FK
        int RegelProfielVersie
        bool Rijvaardig
        datetime AangekomenOp
        datetime VertrokkenOp
    }
    REGELPROFIEL {
        uuid Id PK
        uuid FabrikantId FK
        string Naam
        string ModelPatroon "nullable"
        enum Aandrijving
        int MinOpslagSoc
        int DoelOpslagSoc
        int MaxLaadSoc
        int KritiekSoc
        int ControleIntervalDagen
        int TwaalfVoltIntervalDagen
        decimal StandaardOntlaadPerDag
        int Versie
        datetime GeldigVanaf
        bool Actief
    }
    VERTREKREGEL {
        uuid Id PK
        uuid RegelProfielId FK
        enum BestemmingsType "Verscheping|Veerboot|Truck|Trein|Dealer"
        int MinSoc
        int MaxSoc
    }
    BATTERIJCONTROLE {
        uuid Id PK
        uuid VoertuigId FK
        datetime GemetenOp
        int Soc "0-100"
        enum TwaalfVoltStatus "OK|Zwak|Dood|NietGecontroleerd"
        decimal TwaalfVoltSpanning "nullable"
        bool SchadeGemeld
        bool VerdachteBatterij
        string Opmerking
        enum Bron "Handmatig|Lader|Telematica"
        uuid UitgevoerdDoor FK
        int RegelProfielVersie
    }
    WAARSCHUWING {
        uuid Id PK
        uuid VoertuigId FK
        string RegelCode "bv. SOC_ONDER_MIN"
        enum Ernst "Laag|Middel|Hoog|Kritiek"
        enum Status "Open|Bevestigd|Opgelost"
        string Boodschap
        string VoorgesteldeActie
        datetime AangemaaktOp
        datetime OpgelostOp
        string OplossingsReden
    }
    ZONE {
        uuid Id PK
        uuid TerminalId FK
        string Code "bv. B-EV-1"
        enum Type "Standaard|EV|Laden|Quarantaine"
        int Capaciteit
        int MaxEvs
    }
    ZONEVERPLAATSING {
        uuid Id PK
        uuid VoertuigId FK
        uuid NaarZoneId FK
        datetime Op
        uuid DoorGebruiker FK
    }
    QUARANTAINEDOSSIER {
        uuid Id PK
        uuid VoertuigId FK
        string Reden
        datetime GeopendOp
        enum Beslissing "Open|Vrijgegeven|NaarHersteller|WachtOpFabrikant"
        string Motivering
        uuid BeslistDoor FK
        datetime BeslistOp
    }
    VERTREKPLANNING {
        uuid Id PK
        uuid VoertuigId FK
        date GeplandOp
        enum BestemmingsType
        string Referentie "bv. scheepsnaam / transportnr"
    }
    GEBRUIKER {
        uuid Id PK
        uuid TerminalId FK
        string Email
        string Rol
    }
    AUDITLOG {
        bigint Id PK
        uuid TerminalId
        string EntiteitType
        uuid EntiteitId
        string Actie
        jsonb Wijzigingen
        uuid GebruikerId
        datetime Op
    }
```

De entiteiten van de laadmodule (Lader, Laadopdracht, Laadsessie) staan in [laadmodule.md](../03-concept/laadmodule.md).

## Ontwerpkeuzes

| Keuze | Reden |
|---|---|
| **Metingen zijn append-only** | Bewijswaarde: een controle wordt nooit aangepast. Een correctie is een nieuwe controle met een opmerking |
| **Controle bewaart `RegelProfielVersie`** | Achteraf aantonen welke regels op dat moment golden |
| **Zoneverplaatsingen als historiek** | Waar stond de wagen wanneer? Nodig voor het overdrachtsrapport en incidentonderzoek |
| **`TerminalId` op elke tenant-tabel** | Multi-tenant met een *global query filter* in EF Core |
| **Waarschuwing met `RegelCode`** | Er is maar één open waarschuwing per voertuig en regelcode. Ze wordt bijgewerkt in plaats van gedupliceerd |
| **SOC als integer 0–100** | Het display van de wagen toont hele procenten. Genoeg precisie |
| **`jsonb` voor de audit** | Flexibel. PostgreSQL kan erin zoeken |

## Indexen (eerste inschatting)

- `Voertuig (TerminalId, Vin)` UNIQUE
- `Voertuig (TerminalId, Status)`, `Voertuig (HuidigeZoneId)`
- `BatterijControle (VoertuigId, GemetenOp DESC)`
- `Waarschuwing (VoertuigId, RegelCode) WHERE Status <> 'Opgelost'` UNIQUE (partiële index)
- `Waarschuwing (TerminalId, Status, Ernst)`

## Seed-data voor demo en tests

- 1 terminal "Demo Terminal Zeebrugge", zones A–F (waaronder 1 quarantainezone en 1 laadzone)
- 4 fictieve fabrikanten met elk 1–2 regelprofielen
- ~2.000 voertuigen met een realistische geschiedenis (gegenereerd met **Bogus**), waarvan een deel met problemen, zodat het dashboard er echt uitziet
- Gebruikers voor elke rol
