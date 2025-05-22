import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src";

describe("getHandler edge: expiresAt null/NaN/negative", () => {
  it("should treat expiresAt=null as not expired", async () => {
    const kv = mockKVNamespace();
    const key = "foo";
    await kv.put(key, "bar");
    // Manually set expiresAt to null after put
    (kv as any).dump()[key].expiresAt = null;
    expect(await kv.get(key)).toBe("bar");
  });
  it("should treat expiresAt=NaN as not expired", async () => {
    const kv = mockKVNamespace();
    const key = "foo";
    await kv.put(key, "bar");
    // Manually set expiresAt to NaN after put
    (kv as any).dump()[key].expiresAt = NaN;
    expect(await kv.get(key)).toBe("bar");
  });
  it("should treat expiresAt<0 as expired", async () => {
    const kv = mockKVNamespace();
    const key = "foo";
    // Use the public API to set an expiration in the past
    await kv.put(key, "bar", { expiration: Math.floor(Date.now() / 1000) - 100 });
    expect(await kv.get(key)).toBeNull();
  });
});
