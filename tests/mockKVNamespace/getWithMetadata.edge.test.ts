import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/index.js";

// Edge case: getWithMetadataHandler returns value and metadata for a valid, non-expired key

describe("getWithMetadataHandler edge cases", () => {
  it("should return value and metadata for a valid, non-expired key", async () => {
    const kv = mockKVNamespace();
    const key = "edge-key";
    const value = "edge-value";
    const metadata = { foo: "bar", n: 42 };
    await kv.put(key, value, { metadata });
    const result = await kv.getWithMetadata(key);
    expect(result).toEqual({ value, metadata });
  });

  it("should return value and metadata for a valid, non-expired key with null metadata", async () => {
    const kv = mockKVNamespace();
    const key = "edge-key-null-meta";
    const value = "edge-value-null-meta";
    await kv.put(key, value, { metadata: null });
    const result = await kv.getWithMetadata(key);
    expect(result).toEqual({ value, metadata: null });
  });
});
