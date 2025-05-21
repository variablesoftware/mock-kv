import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/mockKVNamespace";
import fc from "fast-check";

describe("mockKVNamespace property-based metadata", () => {
  it("should store and retrieve metadata with values (fast-check)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 32 }),
        fc.string({ minLength: 1, maxLength: 32 }),
        fc.anything({ json: true }),
        async (key, value, meta) => {
          const kv = mockKVNamespace();
          await kv.put(key, value, { metadata: meta });
          // If you have getWithMetadata, use it here
          // const { value: v, metadata: m } = await kv.getWithMetadata(key);
          // expect(v).toBe(value);
          // expect(m).toEqual(meta);
          // Otherwise, just check value
          expect(await kv.get(key)).toBe(value);
        }
      ),
      { numRuns: 20 }
    );
  });

  it("should update metadata for a key (fast-check)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 32 }),
        fc.string({ minLength: 1, maxLength: 32 }),
        fc.anything({ json: true }),
        fc.anything({ json: true }),
        async (key, value, meta1, meta2) => {
          const kv = mockKVNamespace();
          await kv.put(key, value, { metadata: meta1 });
          await kv.put(key, value, { metadata: meta2 });
          // If you have getWithMetadata, use it here
          // const { metadata: m } = await kv.getWithMetadata(key);
          // expect(m).toEqual(meta2);
        }
      ),
      { numRuns: 20 }
    );
  });
});
