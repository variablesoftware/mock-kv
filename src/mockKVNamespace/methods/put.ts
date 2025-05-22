import type { KVMap } from "../../types/MockKVNamespace";
import logface from "@variablesoftware/logface";

const MAX_KEY_BYTES = 512;
const MAX_VALUE_BYTES = 25 * 1024 * 1024;

export function putHandler(data: KVMap) {
  return async (
    key: string,
    value: string,
    opts?: { expirationTtl?: number; expiration?: number; metadata?: unknown }
  ) => {
    key = String(key);
    const keyBytes = Buffer.byteLength(key, "utf8");
    const valueBytes = Buffer.byteLength(value, "utf8");
    if (keyBytes > MAX_KEY_BYTES) {
      throw new TypeError(`Key length exceeds Cloudflare KV limit of ${MAX_KEY_BYTES} bytes`);
    }
    if (valueBytes > MAX_VALUE_BYTES) {
      throw new TypeError(`Value length exceeds Cloudflare KV limit of ${MAX_VALUE_BYTES} bytes`);
    }
    const now = Date.now();
    let expiresAt: number | undefined;
    if (opts?.expiration !== undefined) {
      expiresAt = opts.expiration * 1000;
    } else if (opts?.expirationTtl !== undefined) {
      // Treat 0 or negative TTL as immediate expiration
      expiresAt = opts.expirationTtl > 0 ? now + opts.expirationTtl * 1000 : now - 1;
    }
    let metadata = opts?.metadata;
    // Always store metadata property, even if undefined/null, to match test expectations and ensure coverage
    metadata = metadata === undefined ? null : JSON.parse(JSON.stringify(metadata));
    data[key] = { value, expiresAt, metadata };
    logface.debug(
      'put("%s", "%s", ttl: %s, exp: %s, meta: %s)',
      key,
      value,
      opts?.expirationTtl ?? "none",
      opts?.expiration ?? "none",
      JSON.stringify(metadata),
    );
  };
}
