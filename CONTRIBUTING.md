# Contributing

Read [AGENTS.md](AGENTS.md) and the capability matrix before changing code. Keep changes focused, preserve historical observations and update the API/dossier when behaviour changes.

Use .NET 10 and Python 3. Edit the UI template rather than generated HTML. Run the repository checker, .NET tests and the relevant HTTP/browser flow against an independent data store. Explain the problem, resulting behaviour, validation and limitations in a pull request.

Do not commit runtime data, secrets, real VINs, personal interview notes or generated build outputs. Material architecture decisions need an ADR. No additional open-source license is granted by this contribution guide; clarify licensing with the repository owner before redistribution.
