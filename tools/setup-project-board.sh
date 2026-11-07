#!/usr/bin/env bash
# Create a GitHub project and add the repository's open issues.
# Requires explicit permission to modify the GitHub project and a gh login with project scope.
set -euo pipefail
OWNER=${OWNER:-phlppgdfry}
REPO=${REPO:-phlppgdfry/VoltYard}
NUMBER=$(gh project create --owner "$OWNER" --title "VoltYard" --format json --jq .number)
gh project link "$NUMBER" --owner "$OWNER" --repo "$REPO"
gh issue list --repo "$REPO" --state open --limit 200 --json url --jq '.[].url' |
while IFS= read -r url; do
  gh project item-add "$NUMBER" --owner "$OWNER" --url "$url" >/dev/null
done
printf 'Project created: https://github.com/users/%s/projects/%s\n' "$OWNER" "$NUMBER"
