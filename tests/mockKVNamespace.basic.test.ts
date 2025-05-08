import { describe, it, expect, vi } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "./testUtils";

describe("mockKVNamespace basic", () => {
  it("should store and retrieve values via put/get", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value = randomBase64Value();
    await kv.put(key, value);
    expect(await kv.get(key)).toBe(value);
  });

  it("should return null for unknown keys", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    expect(await kv.get(key)).toBeNull();
  });

  it("should delete values properly", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value = randomBase64Value();
    await kv.put(key, value);
    await kv.delete(key);
    expect(await kv.get(key)).toBeNull();
  });

  it("should overwrite values", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value1 = randomBase64Value();
    const value2 = randomBase64Value();
    await kv.put(key, value1);
    await kv.put(key, value2);
    expect(await kv.get(key)).toBe(value2);
  });

  it("should list all keys", async () => {
    const kv = mockKVNamespace();
    const keyA = randomSnakeCaseKey();
    const keyB = randomSnakeCaseKey();
    await kv.put(keyA, randomBase64Value());
    await kv.put(keyB, randomBase64Value());

    const { keys, list_complete } = await kv.list();
    const names = keys.map((k) => k.name);

    expect(list_complete).toBe(true);
    expect(names).toContain(keyA);
    expect(names).toContain(keyB);
  });

  it("should track calls with vi.fn()", async () => {
    const kv = mockKVNamespace();

    kv.put = vi.fn(kv.put);
    kv.get = vi.fn(kv.get);
    kv.delete = vi.fn(kv.delete);
    kv.list = vi.fn(kv.list);

    const key = randomSnakeCaseKey();
    const value = randomBase64Value();

    await kv.put(key, value);
    await kv.get(key);
    await kv.delete(key);
    await kv.list();

    expect(kv.put).toHaveBeenCalledWith(key, value);
    expect(kv.get).toHaveBeenCalledWith(key);
    expect(kv.delete).toHaveBeenCalledWith(key);
    expect(kv.list).toHaveBeenCalled();
  });
});