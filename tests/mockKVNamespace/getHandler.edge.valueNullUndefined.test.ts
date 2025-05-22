import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src";

describe("getHandler edge: value null/undefined", () => {
  it("should handle value = null", async () => {
    const kv = mockKVNamespace();
    const key = "foo";
    (kv as any).dump()[key] = { value: null };
    expect(await kv.get(key)).toBeNull();
  });
  it("should handle value = undefined", async () => {
    const kv = mockKVNamespace();
    const key = "foo";
    (kv as any).dump()[key] = { value: undefined };
    expect(await kv.get(key)).toBeNull();
  });
  it("should handle value = '' (empty string)", async () => {
    const kv = mockKVNamespace();
    const key = "foo";
    await kv.put(key, "");
    expect(await kv.get(key)).toBe("");
  });
});
