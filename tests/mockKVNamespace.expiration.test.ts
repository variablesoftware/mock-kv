import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "./testUtils";

describe("mockKVNamespace expiration", () => {
  it("should respect expirationTtl and expire after timeout", async () => {
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

  it("should respect absolute expiration timestamp", async () => {
    const now = Math.floor(Date.now() / 1000);
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value = randomBase64Value();
    await kv.put(key, value, { expiration: now - 1 }); // already expired
    const val = await kv.get(key);
    expect(val).toBeNull();
  });
});