import { test } from 'vitest';

// Quick smoke test for npm package installability and importability from the npm registry
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

var isDebug = typeof process !== 'undefined' && process.env && process.env.DEBUG === '1';
var isCI = typeof process !== 'undefined' && process.env && process.env.CI === '1';

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

const shouldRunSmoke = process.env.KV_SMOKE_REGISTRY === '1';

test.skipIf(!shouldRunSmoke)('npm package can be installed and imported from registry (smoke test)', async () => {
  // Use a temp directory for the test
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mock-kv-smoke-registry-'));
  const origCwd = process.cwd();
  try {
    process.chdir(tmpDir);
    run('npm init -y');
    // Install the package from the registry (latest version)
    run('npm install @variablesoftware/mock-kv');
    // Read the installed package's package.json to find the entry point
    const pkgJson = require(path.join(tmpDir, 'node_modules', '@variablesoftware', 'mock-kv', 'package.json'));
    const entry = pkgJson.main || 'index.js';
    const entryPath = path.join(tmpDir, 'node_modules', '@variablesoftware', 'mock-kv', entry);
    await import(entryPath);
    if (isDebug || isCI) {
      // eslint-disable-next-line no-console
      console.log('Smoke test passed: package can be installed and imported from registry.');
    }
  } catch (e) {
    if (isDebug || isCI) {
      // eslint-disable-next-line no-console
      console.error('Smoke test from registry failed:', e);
    }
    throw e;
  } finally {
    process.chdir(origCwd);
    // Clean up temp dir (optional, not deleting for debugging)
  }
}, 180_000);
