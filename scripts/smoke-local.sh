#!/usr/bin/env bash
# scripts/smoke-local.sh - Automated local smoke test for @variablesoftware/mock-kv
# Usage: ./scripts/smoke-local.sh
set -xeuo pipefail

# Robust cleanup on exit or Ctrl+C
cleanup() {
  if [[ -n "${TMPDIR:-}" && -d "$TMPDIR" ]]; then
    rm -rf "$TMPDIR"
  fi
  cd "$OLDPWD"
}
trap cleanup EXIT INT TERM

PKG_NAME="@variablesoftware/mock-kv"
PKG_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$PKG_DIR"

# Build and pack the local package
pnpm build
PKG_TGZ=$(npm pack --loglevel warn | tail -n1)

# Create temp dir and install the tarball
TMPDIR=$(mktemp -d)
cd "$TMPDIR"
pnpm init -y > /dev/null
# Use node_modules linker for compatibility
pnpm config set node-linker=hoisted

pnpm add "$PKG_DIR/$PKG_TGZ"

# Diagnostics: list files in dist and show entry
ls -lR "node_modules/@variablesoftware/mock-kv/dist"
cat "node_modules/@variablesoftware/mock-kv/package.json"

# Get the installed package name from package.json
PKG_JSON="node_modules/@variablesoftware/mock-kv/package.json"
PKG_NAME=$(node -p "require('./$PKG_JSON').name")

# Create a minimal ESM test file using the dynamic package name
cat > test.mjs <<EOF
import { mockKVNamespace } from "$PKG_NAME";
const kv = mockKVNamespace();
await kv.put("foo", "bar");
const val = await kv.get("foo");
if (val !== "bar") throw new Error("KV put/get failed");
console.log("[I][test.mjs] mock-kv smoke test ok");
EOF

# Run the test
node --version
node test.mjs

# Success message
echo '✅ Local smoke test succeeded'
