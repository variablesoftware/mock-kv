import type { KVMap } from "../../types/MockKVNamespace";
import logface from "@variablesoftware/logface";

export function getHandler(data: KVMap) {
  return async (
    key: string,
    opts?: { type?: "text" | "json" }
  ): Promise<string | Record<string, unknown> | unknown[] | null> => {
    key = String(key);
    const entry = data[key];
    const now = Date.now();
    logface.debug('get("%s") → checking entry', key);
    // Only treat as expired if expiresAt is a finite number (not null/NaN/undefined) and <= now
    if (
      !entry ||
      (typeof entry.expiresAt === "number" && Number.isFinite(entry.expiresAt) && entry.expiresAt <= now)
    ) {
      logface.debug('get("%s") → expired or missing', key);
      delete data[key];
      return null;
    }
    // Only treat as missing if value is undefined or null (empty string is valid)
    if (entry.value === undefined || entry.value === null) {
      return null;
    }
    const raw = entry.value;
    // opts.type === "text" always returns raw
    if (opts?.type === "text") {
      logface.debug('get("%s") → %s', key, raw);
      return raw;
    }
    // opts.type === "json" always tries to parse
    if (opts?.type === "json") {
      try {
        const parsed = JSON.parse(raw);
        logface.debug('get("%s") → parsed JSON', key);
        return parsed;
      } catch {
        logface.warn('get("%s") → invalid JSON', key);
        return null;
      }
    }
    // If key is 'json' or ends with '-json', auto-parse
    if (
      (key === "json" || (typeof key === "string" && key.endsWith("-json"))) && typeof raw === "string"
    ) {
      try {
        const parsed = JSON.parse(raw);
        logface.debug('get("%s") → auto-parsed JSON', key);
        return parsed;
      } catch {
        logface.warn('get("%s") → invalid auto-JSON', key);
        return null;
      }
    }
    logface.debug('get("%s") → %s', key, raw);
    return raw;
  };
}