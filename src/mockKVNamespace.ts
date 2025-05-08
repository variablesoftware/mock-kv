// src/helpers/mockKVNamespace.ts
import type { MockKVNamespace, KVEntry, KVMap } from "./types/MockKVNamespace";
import { log } from "@variablesoftware/logface";
import { clone } from "./utils/clone";
import { listHandler } from "./mockKVNamepsace/methods/list";

const MAX_KEY_BYTES = 512;
const MAX_VALUE_BYTES = 25 * 1024 * 1024;

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
 * Logging is verbose and respects LOG_VERBOSE / DEBUG via log.debug().
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
export const mockKVNamespace = (data: KVMap = {}): MockKVNamespace & {
  /**
   * Dumps the entire store for inspection.
   * @returns An object mapping keys to their stored values.
   */
  dump: () => Record<string, KVEntry>;
  /**
   * Lists keys in the store, optionally limited in count.
   * @param _opts - Optional limit for the number of keys returned.
   * @returns An object containing the list of key names and a completion flag.
   */
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
    /**
     * Retrieves a value by key, with optional type hint for JSON parsing.
     * @param key - The key to retrieve.
     * @param opts - Optional type hint for JSON parsing.
     * @returns The value as a string, parsed JSON, or null if not found or expired.
     */
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

    /**
     * Stores a value under the given key.
     * @param key - The key to store the value under.
     * @param value - The value to store.
     * @param opts - Optional expiration options.
     */
    async put(
      key: string,
      value: string,
      opts?: { expirationTtl?: number; expiration?: number },
    ) {
      const keyBytes = Buffer.byteLength(key, "utf8");
      const valueBytes = Buffer.byteLength(value, "utf8");
      if (keyBytes > MAX_KEY_BYTES) {
        throw new TypeError(`Key length exceeds Cloudflare KV limit of ${MAX_KEY_BYTES} bytes`);
      }
      if (valueBytes > MAX_VALUE_BYTES) {
        throw new TypeError(`Value length exceeds Cloudflare KV limit of ${MAX_VALUE_BYTES} bytes`);
      }

      const now = Date.now();
      let expiresAt: number | undefined;
      if (opts?.expiration !== undefined) {
        expiresAt = opts.expiration * 1000;
      } else if (opts?.expirationTtl !== undefined) {
        // Treat 0 or negative TTL as immediate expiration
        expiresAt = opts.expirationTtl > 0 ? now + opts.expirationTtl * 1000 : now - 1;
      }
      data[key] = { value, expiresAt };

      logger.debug(
        'put("%s", "%s", ttl: %s, exp: %s)',
        key,
        value,
        opts?.expirationTtl ?? "none",
        opts?.expiration ?? "none",
      );
    },

    /**
     * Deletes a key from the store.
     * @param key - The key to delete.
     */
    async delete(key: string) {
      const existed = key in data;
      delete data[key];
      logger.debug('delete("%s") → existed: %s', key, existed);
    },

    /**
     * Lists keys in the store, optionally limited in count.
     * @param _opts - Optional limit for the number of keys returned.
     * @returns An object containing the list of key names and a completion flag.
     */
    list: listHandler(data, logger),

    /**
     * Dumps the entire store for inspection.
     * @returns An object mapping keys to their stored values.
     */
    dump() {
      logger.debug("dump() → %d keys", Object.keys(data).length);
      return clone(data);
    },
  };

  return kv;
};
