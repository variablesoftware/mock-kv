import type { KVMap } from "../../types/MockKVNamespace";
import logface from "@variablesoftware/logface";

export function listHandler(data: KVMap) {
  return async (_opts?: { prefix?: string; limit?: number }) => {
    const now = Date.now();
    // Remove expired keys from the store
    for (const [key, entry] of Object.entries(data)) {
      if (entry.expiresAt !== undefined && entry.expiresAt < now) {
        delete data[key];
      }
    }
    const prefix = _opts?.prefix;
    let keys = Object.keys(data);
    if (typeof prefix === "string") {
      keys = keys.filter((key) => key.startsWith(prefix));
    }
    const limit = _opts?.limit ?? Infinity;
    const result = keys.slice(0, limit).map((key) => ({ name: key }));
    logface.debug("list() → returning %d key(s)", result.length);
    return { keys: result, list_complete: true };
  };
}