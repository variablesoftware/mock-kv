import type { KVMap } from "../../types/MockKVNamespace";
import type { Logger } from "@variablesoftware/logface";

export function getHandler(data: KVMap, logger: Logger) {
  return async (
    key: string,
    opts?: { type?: "text" | "json" }
  ): Promise<string | Record<string, unknown> | unknown[] | null> => {
    const entry = data[key];
    const now = Date.now();
    logger.debug('get("%s") → checking entry', key);

    if (!entry || (entry.expiresAt !== undefined && entry.expiresAt < now)) {
      logger.debug('get("%s") → expired or missing', key);
      delete data[key];
      return null;
    }

    const raw = entry.value;
    if (opts?.type === "text") {
      logger.debug('get("%s") → %s', key, raw);
      return raw;
    }
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
    logger.debug('get("%s") → %s', key, raw);
    return raw;
  };
}

export function listHandler(data: KVMap, logger: Logger) {
  return async (_opts?: { limit?: number }) => {
    const limit = _opts?.limit ?? Infinity;
    const keys = Object.keys(data)
      .slice(0, limit)
      .map((key) => ({ name: key }));
    logger.debug("list() → returning %d key(s)", keys.length);
    return { keys, list_complete: true };
  };
}