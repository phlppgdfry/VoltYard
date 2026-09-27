# API-ontwerp

## Conventies
- REST, JSON, basis-URL `/api`
- Authenticatie: `Authorization: Bearer <JWT>`
- Fouten volgens **RFC 9457 Problem Details** (`application/problem+json`)
- Paginering: `?page=1&pageSize=50` → antwoord `{ items, page, pageSize, totalCount }`
- Filters als query-parameters, sorteren met `?sort=-gemetenOp`
- Datums in **UTC**, ISO 8601
- Documentatie: OpenAPI (ingebouwd in .NET) + Scalar UI op `/scalar`
- Versiebeheer: in V1 niet nodig. Pas bij een publieke API: `/api/v1`

## Endpoints (V1)

### Auth
| Methode | Pad | Rol | Beschrijving |
|---|---|---|---|
| POST | `/api/auth/login` | – | Login → access token + refresh token |
| POST | `/api/auth/refresh` | – | Nieuw access token |
| GET | `/api/auth/me` | alle | Huidige gebruiker + rol |

### Voertuigen
| Methode | Pad | Rol | Beschrijving |
|---|---|---|---|
| GET | `/api/voertuigen` | alle intern | Lijst (filters: `status`, `zoneId`, `fabrikantId`, `metOpenWaarschuwingen`, `zoek`) |
| GET | `/api/voertuigen/{vin}` | alle intern | Detail + laatste meting + open waarschuwingen |
| GET | `/api/voertuigen/{vin}/tijdlijn` | alle intern | Metingen, verplaatsingen, waarschuwingen, laadbeurten in chronologische volgorde |
| POST | `/api/voertuigen` | Planner, Admin | Eén voertuig aanmaken |
| POST | `/api/voertuigen/import` | Planner, Admin | CSV-upload → rapport (aangemaakt / overgeslagen / fouten per rij) |
| PUT | `/api/voertuigen/{vin}/vertrek` | Planner | Vertrek plannen (datum + bestemmingstype) |
| POST | `/api/voertuigen/{vin}/verplaatsingen` | Terreinmedewerker, Planner | Naar zone verplaatsen |
| POST | `/api/voertuigen/{vin}/vertrokken` | Planner | Vertrek bevestigen (controleert de vertrekregels) |

### Controles
| Methode | Pad | Rol | Beschrijving |
|---|---|---|---|
| POST | `/api/voertuigen/{vin}/controles` | Terreinmedewerker, Planner | Controle registreren → regelmotor → antwoord met de actuele status en waarschuwingen |
| GET | `/api/voertuigen/{vin}/controles` | alle intern | Geschiedenis |
| GET | `/api/taken/controles` | Terreinmedewerker | Mijn controletaken van vandaag (per zone) |

### Regelprofielen
| Methode | Pad | Rol | Beschrijving |
|---|---|---|---|
| GET | `/api/regelprofielen` | Admin, Planner | Lijst |
| POST | `/api/regelprofielen` | Admin | Aanmaken |
| PUT | `/api/regelprofielen/{id}` | Admin | Wijzigen → **nieuwe versie** |
| POST | `/api/regelprofielen/{id}/simuleer` | Admin | "Wat als": toont welke voertuigen andere waarschuwingen zouden krijgen *(Could)* |

### Waarschuwingen
| Methode | Pad | Rol | Beschrijving |
|---|---|---|---|
| GET | `/api/waarschuwingen` | alle intern | Filters: `status`, `ernst`, `regelCode`, `zoneId` |
| POST | `/api/waarschuwingen/{id}/bevestig` | Planner, HSE | Bevestigen ("ik heb het gezien") |
| POST | `/api/waarschuwingen/{id}/oplossen` | Planner, HSE | Handmatig oplossen met reden |
| GET | `/api/dashboard` | alle intern | KPI's + aantallen per ernst en zone |

### Terrein en veiligheid
| Methode | Pad | Rol | Beschrijving |
|---|---|---|---|
| GET/POST/PUT | `/api/zones` | Admin (schrijven) | Zonebeheer |
| GET | `/api/zones/{id}/nood-overzicht` | HSE, Planner | EV's in de zone met laadtoestand en rijvaardigheid (JSON, CSV of PDF) |
| POST | `/api/voertuigen/{vin}/quarantaine` | alle intern | Quarantaine openen (reden verplicht) |
| POST | `/api/quarantaine/{id}/beslissing` | HSE | Beslissing + motivering |

### Laadmodule
| Methode | Pad | Rol | Beschrijving |
|---|---|---|---|
| GET/POST/PUT | `/api/laders` | Admin | Ladersbeheer |
| GET | `/api/laadopdrachten` | Planner, Terreinmedewerker | Voorgesteld / goedgekeurd / bezig |
| POST | `/api/laadopdrachten/{id}/goedkeuren` | Planner | |
| POST | `/api/laadopdrachten/{id}/start` | Terreinmedewerker | Met `laderId` |
| POST | `/api/laadopdrachten/{id}/stop` | Terreinmedewerker | Met `eindSoc`, optioneel `kwh` |
| GET | `/api/rapporten/laden?fabrikantId=&van=&tot=` | Account manager | Overzicht voor facturatie (JSON / CSV) |

### Rapporten
| Methode | Pad | Rol | Beschrijving |
|---|---|---|---|
| GET | `/api/voertuigen/{vin}/overdrachtsrapport` | Planner, Account manager | PDF |
| POST | `/api/rapporten/batch` | Planner, Account manager | PDF voor een lijst van VIN's |
| GET | `/api/rapporten/maand?fabrikantId=&maand=` | Account manager | Maandrapport |

## SignalR-hub `/hubs/voltyard`

| Event (server → client) | Payload |
|---|---|
| `WaarschuwingGewijzigd` | `{ waarschuwingId, vin, regelCode, ernst, status }` |
| `VoertuigStatusGewijzigd` | `{ vin, oudeStatus, nieuweStatus }` |
| `LaadSessieGewijzigd` | `{ opdrachtId, vin, status }` |

Clients zitten in een groep per terminal (`terminal:{id}`), zodat ze alleen hun eigen data zien.

## Voorbeeld: controle registreren

```http
POST /api/voertuigen/LGXCE4CB0N0123456/controles
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "soc": 24,
  "twaalfVoltStatus": "Zwak",
  "schadeGemeld": false,
  "verdachteBatterij": false,
  "opmerking": "12V traag bij opstarten"
}
```

```http
201 Created
{
  "controleId": "8c1d...",
  "voertuig": { "vin": "LGXCE4CB0N0123456", "status": "AandachtNodig" },
  "waarschuwingen": [
    { "regelCode": "SOC_ONDER_MIN", "ernst": "Hoog", "boodschap": "SOC 24% < minimum 30% (profiel BYD – standaard BEV v3)", "voorgesteldeActie": "Laden tot 50%" },
    { "regelCode": "TWAALFVOLT_ZWAK", "ernst": "Middel", "boodschap": "12V-batterij zwak", "voorgesteldeActie": "Onderhoudsladen 12V" }
  ],
  "voorspelling": { "ontlaadPerDag": 0.12, "socBijVertrek": 21 }
}
```
