// tests/helpers/mockKVNamespace.ts
import type { MockKVNamespace } from "./types/MockKVNamespace";

import { log } from "@variablesoftware/logface";
/**
 * mockKVNamespace()
 *
 * Returns an in-memory mock implementation of the KVNamespace interface for use in tests.
 * It supports:
 *   - get / put / delete
 *   - TTL and absolute expiration
 *   - typed JSON parsing (via `{ type: 'json' }`)
 *   - key listing with limit
 *   - .dump() for test inspection
 *
 * All expiration values are normalized into milliseconds using the `expiresAt` field.
 * Logging is verbose and respects LOG_VERBOSE / DEBUG via log.debug().
 *
 * Example usage:
 * ```ts
 * const kv = mockKVNamespace()
 * await kv.put('foo', 'bar', { expirationTtl: 60 })
 * const val = await kv.get('foo') // 'bar'
 * ```
 */

// If structuredClone is not available, fall back to JSON
const clone = <T>(obj: T): T => {
  try {
    return structuredClone(obj);
  } catch {
    return JSON.parse(JSON.stringify(obj));
  }
};

/**
 * Internal value structure for each stored KV entry
 */
type KVEntry = {
  value: string;
  expiresAt?: number;
};

/**
 * Underlying storage map (key → KVEntry)
 */
type KVMap = Record<string, KVEntry>;

export const mockKVNamespace = (data: KVMap = {}) => {
  const logger = log.withTag("mockKV");

  logger.info(
    "Instantiating mockKVNamespace with %d key(s)",
    Object.keys(data).length,
  );

  const kv: MockKVNamespace & {
    dump: () => Record<string, KVEntry>;
    list: (opts?: {
      limit?: number;
    }) => Promise<{ keys: { name: string }[]; list_complete: boolean }>;
  } = {
    async get(key: string, opts?: { type?: "text" | "json" }) {
      const entry = data[key];
      const now = Date.now();

      logger.debug('get("%s") → checking entry', key);

      if (!entry) {
        logger.debug('get("%s") → undefined', key);
        return null;
      }

      const expired = entry.expiresAt && entry.expiresAt < now;

      if (expired) {
        logger.debug('get("%s") → expired', key);
        delete data[key];
        return null;
      }

      const raw = entry.value;

      if (opts?.type === "json") {
        try {
          return JSON.parse(raw);
        } catch {
          logger.warn('get("%s") → invalid JSON', key);
          return null;
        }
      }

      logger.debug('get("%s") → %s', key, raw);
      return raw;
    },

    async put(
      key: string,
      value: string,
      opts?: { expirationTtl?: number; expiration?: number },
    ) {
      const now = Date.now();
      const expiresAt = opts?.expiration
        ? opts.expiration * 1000
        : opts?.expirationTtl
          ? now + opts.expirationTtl * 1000
          : undefined;

      data[key] = { value, expiresAt };

      logger.debug(
        'put("%s", "%s", ttl: %s, exp: %s)',
        key,
        value,
        opts?.expirationTtl ?? "none",
        opts?.expiration ?? "none",
      );
    },

    async delete(key: string) {
      const existed = key in data;
      delete data[key];
      logger.debug('delete("%s") → existed: %s', key, existed);
    },

    async list(opts?: { limit?: number }) {
      const limit = opts?.limit ?? Infinity;
      const keys = Object.keys(data)
        .slice(0, limit)
        .map((key) => ({ name: key }));
      logger.debug("list() → returning %d key(s)", keys.length);
      return { keys, list_complete: true };
    },

    dump() {
      logger.debug("dump() → %d keys", Object.keys(data).length);
      return clone(data);
    },
  };

  return kv;
};
