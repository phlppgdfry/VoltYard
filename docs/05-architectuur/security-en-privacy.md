# Security en privacy

## Rollen en rechten

| Recht | Admin | Planner | Terreinmedewerker | HSE | Account manager | Fabrikant (fase 2) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Voertuigen bekijken | ✅ | ✅ | ✅ | ✅ | ✅ | alleen eigen merk |
| Voertuigen aanmaken / importeren | ✅ | ✅ | – | – | – | – |
| Controle registreren | ✅ | ✅ | ✅ | ✅ | – | – |
| Verplaatsen naar zone | ✅ | ✅ | ✅ | ✅ | – | – |
| Quarantaine openen | ✅ | ✅ | ✅ | ✅ | – | – |
| Quarantainebeslissing | ✅ | – | – | ✅ | – | – |
| Waarschuwingen oplossen | ✅ | ✅ | – | ✅ | – | – |
| Regelprofielen beheren | ✅ | lezen | – | lezen | lezen | voorstellen (C) |
| Laadopdrachten goedkeuren | ✅ | ✅ | – | – | – | – |
| Laadsessie starten / stoppen | ✅ | ✅ | ✅ | – | – | – |
| Rapporten en facturatie | ✅ | ✅ | – | ✅ | ✅ | eigen rapporten |
| Gebruikers, zones en laders beheren | ✅ | – | – | – | – | – |

Implementatie: **policy-based authorization** in ASP.NET Core (`[Authorize(Policy = "KanQuarantaineBeslissen")]`), met policies die op rollen gebaseerd zijn. Autorisatie wordt aan de serverkant gecontroleerd, **nooit alleen in de frontend**.

## Authenticatie
- ASP.NET Core Identity (wachtwoorden gehasht met PBKDF2, standaard in Identity)
- JWT access token (15 min) + refresh token (7 dagen, roterend, opgeslagen als hash)
- Lockout na 5 foute pogingen
- Wachtwoordbeleid: minimaal 12 tekens
- Later: 2FA (TOTP) en SSO via Microsoft Entra ID (terminals werken vaak met Microsoft 365)

## Multi-tenancy (isolatie per terminal)
- Elke tabel die tot een terminal behoort, heeft een `TerminalId`
- **EF Core Global Query Filter** op `TerminalId` uit de claim van de ingelogde gebruiker
- Integratietest: *"gebruiker van terminal A kan voertuig van terminal B niet opvragen"* → 404
- SignalR-groepen per terminal

## OWASP Top 10: maatregelen

| Risico | Maatregel |
|---|---|
| Broken Access Control | Policies op elk endpoint, tenant-filter, tests per rol |
| Injection | EF Core met geparametriseerde queries, geen ruwe SQL met invoer van gebruikers |
| CSV-injectie (bij export) | Cellen die beginnen met `= + - @` escapen |
| Uploads (CSV, foto's) | Maximale grootte, controle van het MIME-type, opslaan in Blob (niet op de webserver), bestandsnaam genereren |
| Security misconfiguration | HTTPS verplicht, HSTS, security headers, CORS alleen voor het frontenddomein |
| Gevoelige data | Secrets in Azure Key Vault / user-secrets, nooit in de repo |
| Logging | Geen tokens of wachtwoorden in de logs. Auditlog voor businessacties |
| Rate limiting | Ingebouwde rate limiter van ASP.NET Core op login en import |

## Privacy (GDPR)

| Gegeven | Persoonsgegeven? | Maatregel |
|---|---|---|
| VIN, merk, model, laadtoestand | Nee: bedrijfsvoorraad, nog niet aan een persoon gekoppeld | – |
| Gebruikers (naam, e-mail, wie deed welke controle) | **Ja** | Dataminimalisatie, alleen voor werking en audit; bewaartermijn afspreken met de klant |
| Foto's van schade | Mogelijk (als er mensen of nummerplaten op staan) | Richtlijn: alleen het voertuig fotograferen; bewaartermijn |

- VoltYard is een **verwerker**, de terminal is de **verwerkingsverantwoordelijke** → een verwerkersovereenkomst is nodig bij een echt product.
- Hosting in een **EU-regio** van Azure (bv. West Europe). Controleer bij het opzetten welke regio's in België beschikbaar zijn.

## Bedrijfsgevoeligheid
Volumes en merken per terminal zijn **commercieel gevoelig** (concurrerende terminals, fabrikanten). Daarom:
- strikte tenant-isolatie;
- fabrikanten zien alleen hun eigen merk;
- geen gedeelde analyses tussen terminals zonder expliciete toestemming.
