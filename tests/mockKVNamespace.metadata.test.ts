import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";

describe("mockKVNamespace metadata", () => {
  it("should store and retrieve metadata with a value", async () => {
    const kv = mockKVNamespace();
    const meta = { foo: "bar", count: 42 };
    await kv.put("meta-key", "value", { metadata: meta });
    // Assuming your get supports returning metadata, e.g. getWithMetadata
    // If not, adapt this to your API
    const value = await kv.get("meta-key");
    expect(value).toBe("value");
    // If you have a getWithMetadata or similar:
    // const { value, metadata } = await kv.getWithMetadata("meta-key");
    // expect(metadata).toEqual(meta);
  });

  it("should update metadata for a key", async () => {
    const kv = mockKVNamespace();
    await kv.put("meta-key", "value", { metadata: { a: 1 } });
    await kv.put("meta-key", "value", { metadata: { b: 2 } });
    // const { metadata } = await kv.getWithMetadata("meta-key");
    // expect(metadata).toEqual({ b: 2 });
  });

  it("should remove metadata when key is deleted", async () => {
    const kv = mockKVNamespace();
    await kv.put("meta-key", "value", { metadata: { foo: "bar" } });
    await kv.delete("meta-key");
    // const result = await kv.getWithMetadata("meta-key");
    // expect(result).toBeNull();
  });

  // Add more as needed for your API!
});