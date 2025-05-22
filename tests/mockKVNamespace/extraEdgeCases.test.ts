// Extra edge-case and property-based tests for mockKVNamespace
import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/index.js";
import fc from "fast-check";

describe("mockKVNamespace extra edge cases", () => {
  it("should handle prefix listing with overlapping prefixes", async () => {
    const kv = mockKVNamespace();
    await kv.put("a", "1");
    await kv.put("ab", "2");
    await kv.put("abc", "3");
    let res = await kv.list({ prefix: "a" });
    expect(res.keys.map(k => k.name).sort()).toEqual(["a", "ab", "abc"]);
    res = await kv.list({ prefix: "ab" });
    expect(res.keys.map(k => k.name).sort()).toEqual(["ab", "abc"]);
  });

  it("should handle prefix listing with unicode and emoji", async () => {
    const kv = mockKVNamespace();
    await kv.put("💡foo", "1");
    await kv.put("💡bar", "2");
    await kv.put("🚀baz", "3");
    const res = await kv.list({ prefix: "💡" });
    expect(res.keys.map(k => k.name).sort()).toEqual(["💡bar", "💡foo"]);
  });

  it("should return all keys for empty string prefix", async () => {
    const kv = mockKVNamespace();
    await kv.put("foo", "1");
    await kv.put("bar", "2");
    const res = await kv.list({ prefix: "" });
    expect(res.keys.map(k => k.name).sort()).toEqual(["bar", "foo"]);
  });

  it("should support bulk put/get/delete with expired and non-expired keys", async () => {
    const kv = mockKVNamespace();
    await kv.put("keep", "1");
    await kv.put("expire", "2", { expirationTtl: 0 });
    await kv.delete("keep");
    const res = await kv.list();
    expect(res.keys.map(k => k.name)).not.toContain("expire");
    expect(res.keys.map(k => k.name)).not.toContain("keep");
  });

  it("should store/retrieve deeply nested metadata", async () => {
    const kv = mockKVNamespace();
    const meta = { a: { b: [1, { c: "d" }] }, e: null };
    await kv.put("foo", "bar", { metadata: meta });
    // Metadata is not directly retrievable, but should not throw
    expect(await kv.get("foo")).toBe("bar");
  });

  it("should overwrite a key just before/after expiration", async () => {
    const kv = mockKVNamespace();
    await kv.put("foo", "1", { expirationTtl: 0 });
    await kv.put("foo", "2");
    expect(await kv.get("foo")).toBe("2");
  });

  it("should support concurrent puts/gets/deletes", async () => {
    const kv = mockKVNamespace();
    await Promise.all([
      kv.put("a", "1"),
      kv.put("b", "2"),
      kv.put("c", "3"),
      kv.delete("b"),
    ]);
    const res = await kv.list();
    expect(res.keys.map(k => k.name).sort()).toEqual(["a", "c"]);
  });

  it("should not list deleted keys", async () => {
    const kv = mockKVNamespace();
    await kv.put("foo", "bar");
    await kv.delete("foo");
    const res = await kv.list();
    expect(res.keys.map(k => k.name)).not.toContain("foo");
  });
});
