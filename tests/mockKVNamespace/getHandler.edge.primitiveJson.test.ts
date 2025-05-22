import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src";

describe("getHandler edge: primitive JSON values", () => {
  it("should parse JSON number string as number", async () => {
    const kv = mockKVNamespace();
    await kv.put("num", "123");
    expect(await kv.get("num", { type: "json" })).toBe(123);
  });
  it("should parse JSON boolean string as boolean", async () => {
    const kv = mockKVNamespace();
    await kv.put("bool", "true");
    expect(await kv.get("bool", { type: "json" })).toBe(true);
  });
  it("should parse JSON boolean false string as boolean false", async () => {
    const kv = mockKVNamespace();
    await kv.put("boolfalse", "false");
    expect(await kv.get("boolfalse", { type: "json" })).toBe(false);
  });
  it("should parse JSON null string as null", async () => {
    const kv = mockKVNamespace();
    await kv.put("null", "null");
    expect(await kv.get("null", { type: "json" })).toBe(null);
  });
  it("should parse JSON array string as array", async () => {
    const kv = mockKVNamespace();
    await kv.put("arr", "[1,2,3]");
    expect(await kv.get("arr", { type: "json" })).toEqual([1,2,3]);
  });
  it("should parse JSON string as string when not type: 'json'", async () => {
    const kv = mockKVNamespace();
    await kv.put("jsonstr", '"foo"');
    expect(await kv.get("jsonstr")).toBe('"foo"');
  });
});
