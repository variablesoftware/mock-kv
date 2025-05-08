// --- Type imports ---
import type { MockKVNamespace, KVEntry, KVMap } from "../types/MockKVNamespace";

// --- Runtime imports ---
import { log } from "@variablesoftware/logface";
import { clone } from "../utils/clone";
import { getHandler } from "./methods/get";
import { putHandler } from "./methods/put";
import { deleteHandler } from "./methods/delete";
import { listHandler } from "./methods/list";

export const mockKVNamespace = (data: KVMap = {}): MockKVNamespace & {
  dump: () => Record<string, KVEntry>;
  list: (_opts?: { limit?: number }) => Promise<{ keys: { name: string }[]; list_complete: boolean }>;
} => {
  const logger = log.withTag("mockKV");
  logger.info(
    "Instantiating mockKVNamespace with %d key(s)",
    Object.keys(data).length,
  );

  return {
    get: getHandler(data, logger),
    put: putHandler(data, logger),
    delete: deleteHandler(data, logger),
    list: listHandler(data, logger),
    dump: () => {
      logger.debug("dump() → %d keys", Object.keys(data).length);
      return clone(data);
    },
  };
};