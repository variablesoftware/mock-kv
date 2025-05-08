import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";

describe("mockKVNamespace JSON", () => {
  it('should parse stored JSON when type is "json"', async () => {
    const kv = mockKVNamespace();
    const obj = { foo: "bar", count: 5 };
    await kv.put("json", JSON.stringify(obj));
    const result = await kv.get("json", { type: "json" });
    expect(result).toEqual(obj);
  });

  it("should handle invalid JSON parsing gracefully", async () => {
    const kv = mockKVNamespace();
    await kv.put("bad-json", "not-valid-json");
    const result = await kv.get("bad-json", { type: "json" });
    expect(result).toBeNull();
  });
});