import type { KVMap } from "../../types/MockKVNamespace";
import type { Logger } from "@variablesoftware/logface";

export function putHandler(data: KVMap, logger: Logger) {
  return async (
    key: string,
    value: string,
    opts?: { expirationTtl?: number; expiration?: number }
  ) => {
    const now = Date.now();
    const expiresAt = opts?.expiration
      ? opts.expiration * 1000
      : opts?.expirationTtl
        ? now + opts.expirationTtl * 1000
        : undefined;

    data[key] = { value, expiresAt };

    logger.debug(
      'put("%s", "%s", ttl: %s, exp: %s)',
      key,
      value,
      opts?.expirationTtl ?? "none",
      opts?.expiration ?? "none",
    );
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