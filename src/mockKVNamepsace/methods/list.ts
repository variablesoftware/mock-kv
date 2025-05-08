import type { KVMap } from "../../types/MockKVNamespace";
import type { Logger } from "@variablesoftware/logface";

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