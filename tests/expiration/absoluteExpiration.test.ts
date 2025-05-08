import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "../testUtils";

describe("mockKVNamespace absolute expiration", () => {
  it("should expire a key immediately if the expiration timestamp is in the past", async () => {
    const now = Math.floor(Date.now() / 1000);
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value = randomBase64Value();
    await kv.put(key, value, { expiration: now - 1 }); // already expired
    const val = await kv.get(key);
    expect(val).toBeNull();
  });
});