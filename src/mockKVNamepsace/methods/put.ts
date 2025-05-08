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
      ? opts.expiration * 1000 // seconds to ms
      : opts?.expirationTtl
        ? now + opts.expirationTtl * 1000 // seconds to ms
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
