// src/helpers/mockKVNamespace.ts
import type { MockKVNamespace, KVEntry, KVMap } from "./types/MockKVNamespace";
import { log } from "@variablesoftware/logface";
import { clone } from "./utils/clone";
import { listHandler } from "./mockKVNamepsace/methods/list";

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

export const mockKVNamespace = (data: KVMap = {}): MockKVNamespace & {
  dump: () => Record<string, KVEntry>;
  list: (_opts?: { limit?: number }) => Promise<{ keys: { name: string }[]; list_complete: boolean }>;
} => {
  const logger = log.withTag("mockKV");

  logger.info(
    "Instantiating mockKVNamespace with %d key(s)",
    Object.keys(data).length,
  );

  const kv: MockKVNamespace & {
    dump: () => Record<string, KVEntry>;
    list: (_opts?: {
      limit?: number;
    }) => Promise<{ keys: { name: string }[]; list_complete: boolean }>;
  } = {
    async get(
      key: string,
      opts?: { type?: "text" | "json" }
    ): Promise<string | Record<string, unknown> | unknown[] | null> {
      const entry = data[key];
      const now = Date.now();
      logger.debug('get("%s") → checking entry', key);

      if (!entry || (entry.expiresAt !== undefined && entry.expiresAt < now)) {
        logger.debug('get("%s") → expired or missing', key);
        delete data[key];
        return null;
      }

      const raw = entry.value;
      // Explicit text mode
      if (opts?.type === "text") {
        logger.debug('get("%s") → %s', key, raw);
        return raw;
      }
      // JSON mode: explicit or key-named
      const isJsonKey = key === "json" || key.endsWith("-json");
      if (opts?.type === "json" || isJsonKey) {
        try {
          const parsed = JSON.parse(raw);
          logger.debug('get("%s") → parsed JSON', key);
          return parsed;
        } catch {
          logger.warn('get("%s") → invalid JSON', key);
          return null;
        }
      }
      // default: plain text
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

    list: listHandler(data, logger),

    dump() {
      logger.debug("dump() → %d keys", Object.keys(data).length);
      return clone(data);
    },
  };

  return kv;
};
