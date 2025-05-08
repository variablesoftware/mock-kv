// src/types/MockKVNamespace.ts
/**
 * Represents a value stored in the KV store, including optional metadata and expiration.
 */
export type KVStoredValue = {
  /** The string value stored for the key. */
  value: string;
  /** Optional metadata associated with the value. */
  metadata?: unknown;
  /** Optional expiration time as a UNIX timestamp (seconds). */
  expiration?: number;
};

/**
 * Interface for the mock KVNamespace, matching the Cloudflare KV API.
 */
export type MockKVNamespace = {
  /**
   * Stores a value under the given key.
   * @param _key - The key to store the value under.
   * @param _value - The value to store.
   * @param _options - Optional expiration and metadata.
   */
  put: (
    _key: string,
    _value: string,
    _options?: { expirationTtl?: number; expiration?: number; metadata?: unknown }
  ) => Promise<void>;

  /**
   * Retrieves a value by key.
   * @param _key - The key to retrieve.
   * @param _opts - Optional type hint for JSON parsing.
   * @returns The value as a string, parsed JSON, or null if not found or expired.
   */
  get: (
    _key: string,
    _opts?: { type?: "text" | "json" }
  ) => Promise<string | Record<string, unknown> | unknown[] | null>;

  /**
   * Deletes a key from the store.
   * @param _key - The key to delete.
   */
  delete: (_key: string) => Promise<void>;

  /**
   * Lists keys in the store, optionally filtered by prefix and/or limited in count.
   * @param _options - Optional prefix and limit.
   * @returns An object containing the list of key names and a completion flag.
   */
  list: (
    _options?: { prefix?: string; limit?: number }
  ) => Promise<{ keys: { name: string }[]; list_complete: boolean }>;

  /**
   * Dumps the entire store for inspection.
   * @returns An object mapping keys to their stored values.
   */
  dump: () => Record<string, KVStoredValue>;
};

/**
 * Internal value structure for each stored KV entry.
 */
export type KVEntry = {
  /** The string value stored for the key. */
  value: string;
  /** Optional expiration time as a UNIX timestamp in milliseconds. */
  expiresAt?: number;
};

/**
 * Underlying storage map (key → KVEntry).
 */
export type KVMap = Record<string, KVEntry>;
