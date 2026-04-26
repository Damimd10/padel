#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/VoltAgent/awesome-codex-subagents.git"
TMP_DIR=".codex/.tmp/awesome-codex-subagents"
TARGET_DIR=".codex/agents"
MANIFEST=".codex/manifests/selected-voltagent-subagents.txt"
REPORT="docs/00-setup/installed-subagents.md"

mkdir -p "$TARGET_DIR" "$(dirname "$REPORT")" ".codex/.tmp"

if [ ! -d "$TMP_DIR/.git" ]; then
  git clone --depth 1 "$REPO_URL" "$TMP_DIR"
else
  git -C "$TMP_DIR" pull --ff-only
fi

echo "# Installed VoltAgent Subagents" > "$REPORT"
echo "" >> "$REPORT"

while IFS= read -r agent || [ -n "$agent" ]; do
  [ -z "$agent" ] && continue
  found="$(find "$TMP_DIR/categories" -name "$agent.toml" | head -n 1 || true)"
  if [ -n "$found" ]; then
    cp "$found" "$TARGET_DIR/$agent.toml"
    echo "- ✅ $agent — $found" >> "$REPORT"
  else
    echo "- ⚠️ Missing upstream: $agent" >> "$REPORT"
  fi
done < "$MANIFEST"

echo "Done. See $REPORT"
