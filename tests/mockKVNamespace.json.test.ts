/**
 * JSON parsing tests for the mockKVNamespace implementation.
 *
 * These tests cover:
 * - Retrieving and parsing stored JSON values
 * - Handling invalid JSON gracefully
 */

import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "./testUtils";

process.env.LOG = 'none' || process.env.LOG;

describe("mockKVNamespace JSON", () => {
  /**
   * Should parse stored JSON when type is "json".
   */
  it('should parse stored JSON when type is "json"', async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const obj = { foo: "bar", count: 5, random: randomBase64Value() };
    await kv.put(key, JSON.stringify(obj));
    const result = await kv.get(key, { type: "json" });
    expect(result).toEqual(obj);
  });

  /**
   * Should handle invalid JSON parsing gracefully.
   */
  it("should handle invalid JSON parsing gracefully", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, "not-valid-json");
    const result = await kv.get(key, { type: "json" });
    expect(result).toBeNull();
  });
});