/**
 * Basic CRUD and utility tests for the mockKVNamespace implementation.
 *
 * These tests cover:
 * - Storing and retrieving values
 * - Handling unknown keys
 * - Deleting values
 * - Overwriting values
 * - Listing all keys
 * - Tracking method calls with vi.fn()
 */

import { describe, it, expect, vi } from "vitest";
import { mockKVNamespace } from "../../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "../testUtils";

describe("mockKVNamespace basic", () => {
  /**
   * Should store and retrieve values via put/get.
   */
  it("should store and retrieve values via put/get", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value = randomBase64Value();
    await kv.put(key, value);
    expect(await kv.get(key)).toBe(value);
  });

  /**
   * Should return null for unknown keys.
   */
  it("should return null for unknown keys", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    expect(await kv.get(key)).toBeNull();
  });

  /**
   * Should delete values properly.
   */
  it("should delete values properly", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value = randomBase64Value();
    await kv.put(key, value);
    await kv.delete(key);
    expect(await kv.get(key)).toBeNull();
  });

  /**
   * Should overwrite values.
   */
  it("should overwrite values", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value1 = randomBase64Value();
    const value2 = randomBase64Value();
    await kv.put(key, value1);
    await kv.put(key, value2);
    expect(await kv.get(key)).toBe(value2);
  });

  /**
   * Should list all keys.
   */
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

  /**
   * Should track calls with vi.fn().
   */
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

  /**
   * Should return raw string when opts.type is 'text'.
   */
  it("should return raw string when opts.type is 'text'", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value = randomBase64Value();
    await kv.put(key, value);
    const result = await kv.get(key, { type: "text" });
    expect(result).toBe(value);
  });

  /**
   * Should return raw string when opts.type is not specified.
   */
  it("should return raw string when opts.type is not specified", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value = randomBase64Value();
    await kv.put(key, value);
    const result = await kv.get(key);
    expect(result).toBe(value);
  });
});