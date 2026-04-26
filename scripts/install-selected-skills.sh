#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/VoltAgent/awesome-agent-skills.git"
TMP_DIR=".codex/.tmp/awesome-agent-skills"
REPORT="docs/00-setup/skills-source-report.md"

mkdir -p ".codex/.tmp" "$(dirname "$REPORT")"

if [ ! -d "$TMP_DIR/.git" ]; then
  git clone --depth 1 "$REPO_URL" "$TMP_DIR"
else
  git -C "$TMP_DIR" pull --ff-only
fi

cat > "$REPORT" <<'EOF'
# Selected Skills Source Report

The repo has been cloned locally for inspection.

Source:
https://github.com/VoltAgent/awesome-agent-skills

Review `.codex/manifests/selected-agent-skills.md` and copy/install only the skills you trust.

This template already includes project-specific skills under `.codex/skills`.
EOF

echo "Done. See $REPORT"
