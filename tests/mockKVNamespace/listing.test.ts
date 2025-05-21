/**
 * Listing tests for the mockKVNamespace implementation.
 *
 * These tests cover:
 * - Limiting the number of results returned by list()
 */

import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value, isDebug, isCI } from "../testUtils";
import fc from "fast-check";

describe("mockKVNamespace listing", () => {
  /**
   * Should limit the number of results returned by list({ limit }).
   */
  it("should limit results with list({ limit })", async () => {
    const kv = mockKVNamespace();
    const key1 = randomSnakeCaseKey();
    const key2 = randomSnakeCaseKey();
    const key3 = randomSnakeCaseKey();
    await kv.put(key1, randomBase64Value());
    await kv.put(key2, randomBase64Value());
    await kv.put(key3, randomBase64Value());

    const { keys } = await kv.list({ limit: 2 });
    expect(keys.length).toBe(2);
  });

  it("should respect list({ limit }) with random keys/values (fast-check)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.tuple(fc.string({ minLength: 1, maxLength: 32 }), fc.string({ minLength: 1, maxLength: 32 })), { minLength: 3, maxLength: 10 }),
        fc.integer({ min: 1, max: 10 }),
        async (entries, limit) => {
          const kv = mockKVNamespace();
          for (const [key, value] of entries) await kv.put(key, value);
          const { keys } = await kv.list({ limit });
          expect(keys.length).toBeLessThanOrEqual(limit);
          for (const { name } of keys) {
            expect(entries.map(([k]) => k)).toContain(name);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it("should respect list({ prefix }) with random keys/values (fast-check)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.tuple(fc.string({ minLength: 1, maxLength: 16 }), fc.string({ minLength: 1, maxLength: 16 })), { minLength: 3, maxLength: 10 }),
        fc.string({ minLength: 1, maxLength: 4 }),
        async (entries, prefix) => {
          const kv = mockKVNamespace();
          for (const [key, value] of entries) await kv.put(key, value);
          const { keys } = await kv.list({ prefix });
          // Build allKeys from the final state of the KV store
          const allKeys = (await kv.list({})).keys.map(k => k.name);
          const allWhitespace = allKeys.length > 0 && allKeys.every(k => /^\s+$/.test(k));
          // If all keys are whitespace and prefix contains any non-whitespace character, result must be empty
          if (allWhitespace && /[^\s]/.test(prefix)) {
            expect(keys.map(k => k.name)).toEqual([]);
            return;
          }
          const expected = allKeys.filter(k => k.startsWith(prefix));
          expect(keys.map(k => k.name).sort()).toEqual(expected.sort());
          // All returned keys must start with the prefix
          for (const { name } of keys) {
            expect(name.startsWith(prefix)).toBe(true);
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});