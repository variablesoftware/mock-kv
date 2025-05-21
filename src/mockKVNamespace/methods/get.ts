import type { KVMap } from "../../types/MockKVNamespace";
import logface from "@variablesoftware/logface";

export function getHandler(data: KVMap) {
  return async (
    key: string,
    opts?: { type?: "text" | "json" }
  ): Promise<string | Record<string, unknown> | unknown[] | null> => {
    const entry = data[key];
    const now = Date.now();
    logface.debug('get("%s") → checking entry', key);
    if (!entry || (entry.expiresAt !== undefined && entry.expiresAt < now)) {
      logface.debug('get("%s") → expired or missing', key);
      delete data[key];
      return null;
    }
    const raw = entry.value;
    if (opts?.type === "text") {
      logface.debug('get("%s") → %s', key, raw);
      return raw;
    }
    const isJsonKey = key === "json" || key.endsWith("-json");
    if (opts?.type === "json" || isJsonKey) {
      try {
        const parsed = JSON.parse(raw);
        logface.debug('get("%s") → parsed JSON', key);
        return parsed;
      } catch {
        logface.warn('get("%s") → invalid JSON', key);
        return null;
      }
    }
    logface.debug('get("%s") → %s', key, raw);
    return raw;
  };
}