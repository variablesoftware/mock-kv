/**
 * Metadata tests for the mockKVNamespace implementation.
 *
 * These tests cover:
 * - Storing and retrieving metadata with values
 * - Updating metadata for a key
 * - Removing metadata when a key is deleted
 */

import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "../testUtils";

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
    // Test getWithMetadata returns both value and metadata
    const result = await kv.getWithMetadata(key);
    expect(result).toEqual({ value, metadata: meta });
  });

  /**
   * Should update metadata for a key.
   */
  it("should update metadata for a key", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { metadata: { a: 1 } });
    await kv.put(key, randomBase64Value(), { metadata: { b: 2 } });
    const result = await kv.getWithMetadata(key);
    expect(result?.metadata).toEqual({ b: 2 });
  });

  /**
   * Should remove metadata when key is deleted.
   */
  it("should remove metadata when key is deleted", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { metadata: { foo: "bar" } });
    await kv.delete(key);
    const result = await kv.getWithMetadata(key);
    expect(result).toBeNull();
  });

  it("should return null for missing key (getWithMetadata)", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const result = await kv.getWithMetadata(key);
    expect(result).toBeNull();
  });

  it("should return null for expired key (getWithMetadata)", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { expirationTtl: 0 });
    // Wait a tick to ensure expiration
    await new Promise(r => setTimeout(r, 2));
    const result = await kv.getWithMetadata(key);
    expect(result).toBeNull();
  });

  it("should return parsed JSON for valid JSON value (getWithMetadata)", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const meta = { foo: "bar" };
    const obj = { a: 1, b: "x" };
    await kv.put(key, JSON.stringify(obj), { metadata: meta });
    const result = await kv.getWithMetadata(key, { type: "json" });
    expect(result).toEqual({ value: obj, metadata: meta });
  });

  it("should return null for invalid JSON value (getWithMetadata)", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const meta = { foo: "bar" };
    await kv.put(key, "not-json", { metadata: meta });
    const result = await kv.getWithMetadata(key, { type: "json" });
    expect(result).toEqual({ value: null, metadata: meta });
  });

  it("should return raw string for type 'text' or default (getWithMetadata)", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const meta = { foo: "bar" };
    const value = "plain string";
    await kv.put(key, value, { metadata: meta });
    expect(await kv.getWithMetadata(key)).toEqual({ value, metadata: meta });
    expect(await kv.getWithMetadata(key, { type: "text" })).toEqual({ value, metadata: meta });
  });

  // Add more as needed for your API!
});