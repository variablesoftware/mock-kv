import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src";

describe("getHandler edge: exotic values (NaN, Infinity, -Infinity)", () => {
  it("should return 'NaN' as a string, not null", async () => {
    const kv = mockKVNamespace();
    await kv.put("nan", "NaN");
    expect(await kv.get("nan")).toBe("NaN");
  });
  it("should return 'Infinity' as a string, not null", async () => {
    const kv = mockKVNamespace();
    await kv.put("inf", "Infinity");
    expect(await kv.get("inf")).toBe("Infinity");
  });
  it("should return '-Infinity' as a string, not null", async () => {
    const kv = mockKVNamespace();
    await kv.put("-inf", "-Infinity");
    expect(await kv.get("-inf")).toBe("-Infinity");
  });
  it("should return null if value is actually JS NaN (not string)", async () => {
    const kv = mockKVNamespace();
    (kv as any).dump()["jsnan"] = { value: NaN };
    expect(await kv.get("jsnan")).toBeNull();
  });
  it("should return null if value is actually JS Infinity (not string)", async () => {
    const kv = mockKVNamespace();
    (kv as any).dump()["jsinf"] = { value: Infinity };
    expect(await kv.get("jsinf")).toBeNull();
  });
  it("should return stringified object if value is '[object Object]'", async () => {
    const kv = mockKVNamespace();
    await kv.put("obj", "[object Object]");
    expect(await kv.get("obj")).toBe("[object Object]");
  });
  it("should return stringified symbol if value is 'Symbol(foo)'", async () => {
    const kv = mockKVNamespace();
    await kv.put("sym", "Symbol(foo)");
    expect(await kv.get("sym")).toBe("Symbol(foo)");
  });
  it("should return empty string if value is ''", async () => {
    const kv = mockKVNamespace();
    await kv.put("empty", "");
    expect(await kv.get("empty")).toBe("");
  });
  it("should return null if value is actually null (not string)", async () => {
    const kv = mockKVNamespace();
    (kv as any).dump()["nullval"] = { value: null };
    expect(await kv.get("nullval")).toBeNull();
  });
  it("should return null if value is actually undefined (not string)", async () => {
    const kv = mockKVNamespace();
    (kv as any).dump()["undefval"] = { value: undefined };
    expect(await kv.get("undefval")).toBeNull();
  });
});
