import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "../testUtils";

describe("mockKVNamespace zero and negative TTL", () => {
  it("should immediately expire a key with TTL 0", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { expirationTtl: 0 });
    expect(await kv.get(key)).toBeNull();
  });

  it("should immediately expire a key with negative TTL", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { expirationTtl: -1 });
    expect(await kv.get(key)).toBeNull();
  });
});