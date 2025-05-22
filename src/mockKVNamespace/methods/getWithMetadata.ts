import type { KVMap } from "../../types/MockKVNamespace";
import logface from "@variablesoftware/logface";

export function getWithMetadataHandler(data: KVMap) {
  return async (
    key: string,
    opts?: { type?: "text" | "json" }
  ): Promise<{ value: string | Record<string, unknown> | unknown[] | null, metadata: unknown } | null> => {
    const entry = data[key];
    const now = Date.now();
    logface.debug('getWithMetadata("%s") → checking entry', key);
    if (!entry || (entry.expiresAt !== undefined && entry.expiresAt < now)) {
      logface.debug('getWithMetadata("%s") → expired or missing', key);
      delete data[key];
      return null;
    }
    const raw = entry.value;
    let value: string | Record<string, unknown> | unknown[] | null = raw;
    if (opts?.type === "json") {
      try {
        value = JSON.parse(raw);
        logface.debug('getWithMetadata("%s") → parsed JSON', key);
      } catch {
        logface.warn('getWithMetadata("%s") → invalid JSON', key);
        value = null;
      }
    }
    return { value, metadata: entry.metadata ?? null };
  };
}
