import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "../testUtils";

describe("mockKVNamespace list and expired keys", () => {
  it("should not return expired keys in list", async () => {
    const kv = mockKVNamespace();
    const keepKey = randomSnakeCaseKey();
    const expireKey = randomSnakeCaseKey();
    await kv.put(keepKey, randomBase64Value());
    const now = Math.floor(Date.now() / 1000);
    await kv.put(expireKey, randomBase64Value(), { expiration: now - 1 });
    const { keys } = await kv.list();
    expect(keys.map(k => k.name)).toContain(keepKey);
    expect(keys.map(k => k.name)).not.toContain(expireKey);
  });
});