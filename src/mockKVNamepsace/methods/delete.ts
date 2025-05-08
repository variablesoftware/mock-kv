import type { KVMap } from "../../types/MockKVNamespace";
import type { Logger } from "@variablesoftware/logface";

export function deleteHandler(data: KVMap, logger: Logger) {
  return async (key: string) => {
    const existed = key in data;
    delete data[key];
    logger.debug('delete("%s") → existed: %s', key, existed);
  };
}