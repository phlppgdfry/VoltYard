#!/usr/bin/env bash
# Maakt het GitHub-projectbord "VoltYard" aan en zet alle open issues erop.
# Eenmalig vooraf (opent de browser):  gh auth refresh -s project,read:project
set -euo pipefail
OWNER=phlppgdfry
REPO=phlppgdfry/VoltYard

NUM=$(gh project create --owner "$OWNER" --title "VoltYard" --format json --jq .number)
gh project link "$NUM" --owner "$OWNER" --repo "$REPO"
for url in $(gh issue list --repo "$REPO" --state open --limit 200 --json url --jq '.[].url'); do
  gh project item-add "$NUM" --owner "$OWNER" --url "$url" >/dev/null
  printf '.'
done
echo
echo "Klaar: https://github.com/users/$OWNER/projects/$NUM"
echo "Tip: open het bord → View → Board, groepeer op Status; voeg een filter 'milestone:\"Fase 1 · Fundament\"' toe per sprint."
