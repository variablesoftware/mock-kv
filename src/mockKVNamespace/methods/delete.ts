import type { KVMap } from "../../types/MockKVNamespace";
import logface from "@variablesoftware/logface";

export function deleteHandler(data: KVMap) {
  return async (key: string) => {
    const existed = key in data;
    delete data[key];
    logface.debug('delete("%s") → existed: %s', key, existed);
  };
}