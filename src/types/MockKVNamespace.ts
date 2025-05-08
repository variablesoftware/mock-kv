// src/types/MockKVNamespace.ts
export type KVStoredValue = {
  value: string;
  metadata?: unknown;
  expiration?: number;
};

export type MockKVNamespace = {
  put: (_key: string, _value: string, _options?: { expirationTtl?: number; expiration?: number; metadata?: unknown }) => Promise<void>;
  get: (
    _key: string,
    _opts?: { type?: "text" | "json" }
  ) => Promise<string | Record<string, unknown> | unknown[] | null>;
  delete: (_key: string) => Promise<void>;
  list: (_options?: { prefix?: string; limit?: number }) => Promise<{ keys: { name: string }[]; list_complete: boolean }>;
  dump: () => Record<string, KVStoredValue>;
};


/**
 * Internal value structure for each stored KV entry
 */
export type KVEntry = {
  value: string;
  expiresAt?: number;
};

/**
 * Underlying storage map (key → KVEntry)
 */
export type KVMap = Record<string, KVEntry>;
