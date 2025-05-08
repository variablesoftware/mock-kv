import { describe, it, expect, vi } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";

describe("mockKVNamespace basic", () => {
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

  it("should overwrite values", async () => {
    const kv = mockKVNamespace();
    await kv.put("dup", "one");
    await kv.put("dup", "two");
    expect(await kv.get("dup")).toBe("two");
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
});