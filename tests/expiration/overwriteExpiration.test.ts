import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/index.js";
import { isDebug, isCI, randomSnakeCaseKey, randomBase64Value } from "../testUtils";

describe("mockKVNamespace overwrite expiration", () => {
  it("should update expiration when overwriting with new TTL", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { expirationTtl: 10 });
    await kv.put(key, randomBase64Value(), { expirationTtl: 1 });
    await new Promise(res => setTimeout(res, 1100));
    expect(await kv.get(key)).toBeNull();
  });

  it("should remove expiration when overwriting without expiration", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { expirationTtl: 1 });
    await kv.put(key, randomBase64Value());
    await new Promise(res => setTimeout(res, 1100));
    // Should NOT expire, since expiration was removed
    expect(await kv.get(key)).not.toBeNull();
  });
});