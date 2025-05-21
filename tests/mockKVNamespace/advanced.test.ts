/**
 * Advanced and stress tests for the mockKVNamespace implementation.
 * 
 * These tests cover:
 * - Overwriting keys multiple times
 * - Deleting non-existent keys
 * - Unicode and special character support in keys/values
 * - Expired key cleanup in list
 * - Store state dumping
 * - Stress testing with random parallel operations
 */

import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value, isDebug, isCI } from "../testUtils";
import fc from "fast-check";

describe("mockKVNamespace advanced", () => {
  /**
   * Should allow overwriting a key multiple times and always return the last value.
   */
  it("should handle overwriting a key multiple times", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value());
    await kv.put(key, randomBase64Value());
    const finalValue = randomBase64Value();
    await kv.put(key, finalValue);
    expect(await kv.get(key)).toBe(finalValue);
  });

  it("should allow overwriting a key multiple times (fast-check)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 32 }),
        fc.array(fc.string({ minLength: 1, maxLength: 32 }), { minLength: 2, maxLength: 6 }),
        async (key, values) => {
          const kv = mockKVNamespace();
          for (const value of values) await kv.put(key, value);
          expect(await kv.get(key)).toBe(values[values.length - 1]);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Should not throw when deleting a key that does not exist.
   */
  it("should not throw when deleting a non-existent key", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await expect(kv.delete(key)).resolves.not.toThrow();
  });

  /**
   * Should support unicode and special characters in both keys and values.
   */
  it("should support unicode and special characters in keys and values", async () => {
    const kv = mockKVNamespace();
    const key = "💡_" + randomSnakeCaseKey();
    const value = "🚀_" + randomBase64Value();
    await kv.put(key, value);
    expect(await kv.get(key)).toBe(value);
  });

  it("should support unicode and special characters in keys/values (fast-check)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 16 }),
        fc.string({ minLength: 1, maxLength: 16 }),
        async (key, value) => {
          const kv = mockKVNamespace();
          await kv.put(key, value);
          expect(await kv.get(key)).toBe(value);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Should not return expired keys in the list.
   */
  it("should not return expired keys in list", async () => {
    const kv = mockKVNamespace();
    const keepKey = randomSnakeCaseKey();
    const expireKey = randomSnakeCaseKey();
    await kv.put(keepKey, randomBase64Value());
    // Set expiration to 1 second in the past
    const now = Math.floor(Date.now() / 1000) - 4000;
    await kv.put(expireKey, randomBase64Value(), { expiration: now - 1 });
    const { keys } = await kv.list();
    expect(keys.map(k => k.name)).toContain(keepKey);
    expect(keys.map(k => k.name)).not.toContain(expireKey);
  });

  it("should not return expired keys in list (fast-check)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 16 }),
        fc.string({ minLength: 1, maxLength: 16 }),
        async (keepKey, expireKey) => {
          if (keepKey === expireKey) return;
          const kv = mockKVNamespace();
          await kv.put(keepKey, "keep");
          await kv.put(expireKey, "expire", { expiration: Math.floor(Date.now() / 1000) - 10 });
          const { keys } = await kv.list();
          expect(keys.map(k => k.name)).toContain(keepKey);
          expect(keys.map(k => k.name)).not.toContain(expireKey);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Should dump the correct state after a series of operations.
   */
  it("should dump the correct state after operations", async () => {
    const kv = mockKVNamespace();
    const keyA = randomSnakeCaseKey();
    const keyB = randomSnakeCaseKey();
    await kv.put(keyA, randomBase64Value());
    await kv.put(keyB, randomBase64Value());
    await kv.delete(keyA);
    const dump = kv.dump();
    expect(dump).toHaveProperty(keyB);
    expect(dump).not.toHaveProperty(keyA);
  });
});

/**
 * Stress test: runs many random operations in parallel to ensure robustness.
 */
describe("mockKVNamespace stress", () => {
  it("should handle random parallel operations", async () => {
    const kv = mockKVNamespace();
    const keys = Array.from({ length: 50 }, () => randomSnakeCaseKey(8));
    const values = Array.from({ length: 50 }, () => randomBase64Value(16));

    const commands = Array.from({ length: 200 }, () => {
      const op = Math.floor(Math.random() * 3);
      const key = keys[Math.floor(Math.random() * keys.length)];
      const value = values[Math.floor(Math.random() * values.length)];
      if (op === 0) {
        return () => kv.put(key, value);
      } else if (op === 1) {
        return () => kv.get(key);
      } else {
        return () => kv.delete(key);
      }
    });

    await Promise.all(commands.map(fn => fn()));

    const { keys: listed } = await kv.list();
    for (const { name } of listed) {
      const val = await kv.get(name);
      expect(typeof val === "string" || val === null).toBe(true);
    }
  });
});
