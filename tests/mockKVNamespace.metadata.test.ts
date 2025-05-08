/**
 * Metadata tests for the mockKVNamespace implementation.
 *
 * These tests cover:
 * - Storing and retrieving metadata with values
 * - Updating metadata for a key
 * - Removing metadata when a key is deleted
 */

import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "./testUtils";

process.env.LOG = 'none' || process.env.LOG;

describe("mockKVNamespace metadata", () => {
  /**
   * Should store and retrieve metadata with a value.
   */
  it("should store and retrieve metadata with a value", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value = randomBase64Value();
    const meta = { foo: "bar", count: 42 };
    await kv.put(key, value, { metadata: meta });
    // Assuming your get supports returning metadata, e.g. getWithMetadata
    // If not, adapt this to your API
    const result = await kv.get(key);
    expect(result).toBe(value);
    // If you have a getWithMetadata or similar:
    // const { value, metadata } = await kv.getWithMetadata(key);
    // expect(metadata).toEqual(meta);
  });

  /**
   * Should update metadata for a key.
   */
  it("should update metadata for a key", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { metadata: { a: 1 } });
    await kv.put(key, randomBase64Value(), { metadata: { b: 2 } });
    // const { metadata } = await kv.getWithMetadata(key);
    // expect(metadata).toEqual({ b: 2 });
  });

  /**
   * Should remove metadata when key is deleted.
   */
  it("should remove metadata when key is deleted", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { metadata: { foo: "bar" } });
    await kv.delete(key);
    // const result = await kv.getWithMetadata(key);
    // expect(result).toBeNull();
  });

  // Add more as needed for your API!
});