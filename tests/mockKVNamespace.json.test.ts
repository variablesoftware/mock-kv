import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "./testUtils";

describe("mockKVNamespace JSON", () => {
  it('should parse stored JSON when type is "json"', async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const obj = { foo: "bar", count: 5, random: randomBase64Value() };
    await kv.put(key, JSON.stringify(obj));
    const result = await kv.get(key, { type: "json" });
    expect(result).toEqual(obj);
  });

  it("should handle invalid JSON parsing gracefully", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, "not-valid-json");
    const result = await kv.get(key, { type: "json" });
    expect(result).toBeNull();
  });
});