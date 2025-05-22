import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/index.js";
import { isDebug, isCI, randomSnakeCaseKey, randomBase64Value } from "../testUtils";

describe("mockKVNamespace expirationTtl", () => {
  it("should expire a key after the specified TTL", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value = randomBase64Value();
    await kv.put(key, value, { expirationTtl: 1 }); // 1 second TTL

    const valNow = await kv.get(key);
    expect(valNow).toBe(value);

    await new Promise((res) => setTimeout(res, 1100)); // wait just over 1 second
    const valLater = await kv.get(key);
    expect(valLater).toBeNull();
  });
});