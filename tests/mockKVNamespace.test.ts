// tests/helpers/mockKVNamespace.test.ts
import { describe, it, expect, vi } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";

describe("mockKVNamespace()", () => {
  it("should store and retrieve values via put/get", async () => {
    const kv = mockKVNamespace();
    await kv.put("test-key", "test-value");
    const value = await kv.get("test-key");
    expect(value).toBe("test-value");
  });

  it("should return null for unknown keys", async () => {
    const kv = mockKVNamespace();
    const value = await kv.get("missing-key");
    expect(value).toBeNull();
  });

  it("should delete values properly", async () => {
    const kv = mockKVNamespace();
    await kv.put("temp", "value");
    await kv.delete("temp");
    const value = await kv.get("temp");
    expect(value).toBeNull();
  });

  it("should list all keys", async () => {
    const kv = mockKVNamespace();
    await kv.put("a", "1");
    await kv.put("b", "2");

    const { keys, list_complete } = await kv.list();
    const names = keys.map((k) => k.name);

    expect(list_complete).toBe(true);
    expect(names).toContain("a");
    expect(names).toContain("b");
  });

  it("should track calls with vi.fn()", async () => {
    const kv = mockKVNamespace();

    kv.put = vi.fn(kv.put);
    kv.get = vi.fn(kv.get);
    kv.delete = vi.fn(kv.delete);
    kv.list = vi.fn(kv.list);

    await kv.put("x", "1");
    await kv.get("x");
    await kv.delete("x");
    await kv.list();

    expect(kv.put).toHaveBeenCalledWith("x", "1");
    expect(kv.get).toHaveBeenCalledWith("x");
    expect(kv.delete).toHaveBeenCalledWith("x");
    expect(kv.list).toHaveBeenCalled();
  });

  it("should respect expirationTtl and expire after timeout", async () => {
    const kv = mockKVNamespace();
    await kv.put("expiring", "soon", { expirationTtl: 1 }); // 1 second TTL

    const valNow = await kv.get("expiring");
    expect(valNow).toBe("soon");

    await new Promise((res) => setTimeout(res, 1100)); // wait just over 1 second
    const valLater = await kv.get("expiring");
    expect(valLater).toBeNull();
  });

  it("should respect absolute expiration timestamp", async () => {
    const now = Math.floor(Date.now() / 1000);
    const kv = mockKVNamespace();
    await kv.put("abs", "expire", { expiration: now - 1 }); // already expired
    const val = await kv.get("abs");
    expect(val).toBeNull();
  });

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

  it("should limit results with list({ limit })", async () => {
    const kv = mockKVNamespace();
    await kv.put("one", "1");
    await kv.put("two", "2");
    await kv.put("three", "3");

    const { keys } = await kv.list({ limit: 2 });
    expect(keys.length).toBe(2);
  });
});
