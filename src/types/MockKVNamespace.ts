export type KVStoredValue = {
  value: string;
  metadata?: any;
  expiration?: number;
};

export type MockKVNamespace = {
  put: (key: string, value: string, options?: { expirationTtl?: number; expiration?: number; metadata?: any }) => Promise<void>;
  get: (key: string) => Promise<string | null>; // NOTE: no KVNamespaceGetOptions etc
  delete: (key: string) => Promise<void>;
  list: (options?: { prefix?: string; limit?: number }) => Promise<{ keys: { name: string }[]; list_complete: boolean }>;
  dump: () => Record<string, KVStoredValue>;
};
