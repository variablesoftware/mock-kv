// src/helpers/mockKVNamespace.ts
import type { MockKVNamespace, KVEntry, KVMap } from "./types/MockKVNamespace";
import { log as baseLog } from '@variablesoftware/logface';
import { listHandler } from "./mockKVNamespace/methods/list.js";
import { getHandler } from "./mockKVNamespace/methods/get.js";
import { putHandler } from "./mockKVNamespace/methods/put.js";
import { deleteHandler } from "./mockKVNamespace/methods/delete.js";
import { expireKeyNowHandler } from "./mockKVNamespace/methods/expireKeyNow.js";
import { dumpHandler } from "./mockKVNamespace/methods/dump.js";

const isDebug = process.env.DEBUG === '1';

const log = {
  ...baseLog,
  debug: (...args: unknown[]) => {
    if (isDebug) baseLog.debug(...args);
  },
};

/**
 * Creates an in-memory mock implementation of the Cloudflare KVNamespace interface for use in tests.
 *
 * Features:
 * - get / put / delete operations
 * - TTL and absolute expiration support
 * - Typed JSON parsing (via `{ type: 'json' }`)
 * - Key listing with limit
 * - .dump() for test inspection
 *
 * All expiration values are normalized into milliseconds using the `expiresAt` field.
 *
 * @example
 * ```ts
 * const kv = mockKVNamespace();
 * await kv.put('foo', 'bar', { expirationTtl: 60 });
 * const val = await kv.get('foo'); // 'bar'
 * ```
 *
 * @param data - Optional initial KV data to populate the store.
 * @returns A mock KVNamespace instance with Cloudflare-like API.
 */
export const mockKVNamespace = (data: KVMap = Object.create(null)): MockKVNamespace & {
  dump: () => Record<string, KVEntry>;
  list: (_opts?: { limit?: number }) => Promise<{ keys: { name: string }[]; list_complete: boolean }>;
  expireKeyNow: (key: string) => void;
} => {
  // Defensive: always use a clean object for data
  if (Object.getPrototypeOf(data) !== null) {
    data = Object.assign(Object.create(null), data);
  }
  // Compose the namespace using modular handlers
  return {
    get: getHandler(data),
    put: putHandler(data),
    delete: deleteHandler(data),
    list: listHandler(data),
    dump: dumpHandler(data),
    expireKeyNow: expireKeyNowHandler(data),
  };
};
