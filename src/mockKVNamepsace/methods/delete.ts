import type { KVMap } from "../../types/MockKVNamespace";
import type { Logger } from "@variablesoftware/logface";

export function deleteHandler(data: KVMap, logger: Logger) {
  return async (key: string) => {
    const existed = key in data;
    delete data[key];
    logger.debug('delete("%s") → existed: %s', key, existed);
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