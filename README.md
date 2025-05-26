# @variablesoftware/mock-kv 🎛️🏷️✨

[![Test Suite](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com/variablesoftware/mock-kv/actions)
[![NPM version](https://img.shields.io/npm/v/@variablesoftware/mock-kv?style=flat-square)](https://www.npmjs.com/package/@variablesoftware/mock-kv)
[![License](https://img.shields.io/github/license/variablesoftware/mock-kv?style=flat-square)](https://github.com/variablesoftware/mock-kv/blob/main/LICENSE.txt)
[![Coverage](https://img.shields.io/coveralls/github/variablesoftware/mock-kv/main)](https://coveralls.io/github/variablesoftware/mock-kv)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@variablesoftware/mock-kv)](https://bundlephobia.com/package/@variablesoftware/mock-kv)
[![Downloads](https://img.shields.io/npm/dm/@variablesoftware/mock-kv)](https://www.npmjs.com/package/@variablesoftware/mock-kv)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/variablesoftware/mock-kv/pulls)


**Mock Cloudflare KV Namespace for unit and integration testing**

🎛️🏷️✨ `@variablesoftware/mock-kv` provides an in-memory simulation of Cloudflare Workers KV. It is designed for testing key-value storage logic with expiration, metadata, and batch operations — without any external dependencies.

---

## 🔧 Installation

```bash
yarn add --dev @variablesoftware/mock-kv
```

> This package assumes a test environment with [Vitest](https://vitest.dev/) and support for ESM.

---

## 🚀 Usage

```ts
import { mockKVNamespace } from '@variablesoftware/mock-kv';

const kv = mockKVNamespace();
await kv.put('token-abc', 'value', { expirationTtl: 60 });

const result = await kv.get('token-abc');
console.log(result); // 'value'
```

---

## 🎯 Goals

- ⚙ Match Cloudflare KV behavior closely for testing
- 🧪 Support test-safe mocking of put/get/delete/list flows
- 📦 No external storage dependencies; uses only in-memory JS objects
- 📎 Logging via `@variablesoftware/logface` is required for test and runtime logging, but does not rely on any external services

## ✨ Features

Includes matching behavior for edge cases like:
- Key expiration mid-test
- `list()` with prefix collisions and limits
- Metadata preservation across put/get calls

- In-memory mock of Cloudflare `KVNamespace`
- Supports `put`, `get`, `delete`, `list`, and metadata options
- TTL-aware: honors `expirationTtl` and `expiration`
- Returns values as `string`, `ArrayBuffer`, or `null` just like real KV
- Simulates listing behavior including prefix + limit
- Supports metadata in `put()` and `getWithMetadata()`
- Compatible with Vitest and any Cloudflare Worker test setup
- Logs via `@variablesoftware/logface`
- Optional `.dump()` method for inspecting KV state during tests

---

## 🧪 Test Coverage

Tested using `vitest run`, with coverage for:
- `put()` with TTL and metadata
- `get()` and `getWithMetadata()` matching real behavior
- `delete()` and `list()` consistency
- Full `.dump()` snapshots for inspection and debugging

Run tests:
```bash
yarn test
```

---

## 🚧 Status

**This package is under active development and not yet stable.**

Once stable, it will be published as:
```json
"@variablesoftware/mock-kv": "^0.5.0"
```

---

## 📄 License

MIT © Rob Friedman / Variable Software

---

> Built with ❤️ by [@variablesoftware](https://github.com/variablesoftware)  
> Thank you for downloading and using this project. Pull requests are warmly welcomed!

---

## 🌐 Inclusive & Accessible Design

- Naming, logging, error messages, and tests avoid cultural or ableist bias
- Avoids assumptions about input/output formats or encodings
- Faithfully reflects user data — no coercion or silent transformations
- Designed for clarity, predictability, and parity with underlying platforms (e.g., Cloudflare APIs)
- Works well in diverse, multilingual, and inclusive developer environments

---
