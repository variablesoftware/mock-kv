/**
 * JSON parsing tests for the mockKVNamespace implementation.
 *
 * These tests cover:
 * - Retrieving and parsing stored JSON values
 * - Handling invalid JSON gracefully
 */

import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";
import fc from "fast-check";
import { isDebug, isCI } from "./testUtils";

// Corrected fast-check arbitraries
const snakeCaseKeyArb = fc.string({ minLength: 1, maxLength: 512 }); // Matches MAX_KEY_BYTES constraint
const jsonValueArb = fc.record({
  foo: fc.string(),
  count: fc.integer(),
  random: fc.string()
}); // Generates JSON-compatible values

describe("mockKVNamespace JSON", () => {
  it("should parse stored JSON when type is 'json'", async () => {
    await fc.assert(
      fc.asyncProperty(snakeCaseKeyArb, jsonValueArb, async (key, obj) => {
        const kv = mockKVNamespace();
        await kv.put(key, JSON.stringify(obj));
        const result = await kv.get(key, { type: "json" });
        expect(result).toEqual(obj);
      })
    );
  });

  it("should handle invalid JSON parsing gracefully", async () => {
    await fc.assert(
      fc.asyncProperty(snakeCaseKeyArb, async (key) => {
        const kv = mockKVNamespace();
        await kv.put(key, "not-valid-json");
        const result = await kv.get(key, { type: "json" });
        expect(result).toBeNull();
      })
    );
  });
});