import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src";
import fc from "fast-check";

describe("mockKVNamespace property-based metadata", () => {
  it("should store and retrieve metadata with values (fast-check)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 32 }),
        fc.string({ minLength: 1, maxLength: 32 }),
        fc.anything(),
        async (key, value, meta) => {
          const kv = mockKVNamespace();
          await kv.put(key, value, { metadata: meta });
          let expected;
          try {
            expected = meta === undefined ? null : JSON.parse(JSON.stringify(meta));
          } catch {
            expected = null;
          }
          const { value: v, metadata: m } = await kv.getWithMetadata(key) ?? {};
          expect(v).toBe(value);
          expect(m).toEqual(expected);
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
        fc.anything(),
        fc.anything(),
        async (key, value, meta1, meta2) => {
          const kv = mockKVNamespace();
          await kv.put(key, value, { metadata: meta1 });
          let expected;
          try {
            expected = meta2 === undefined ? null : JSON.parse(JSON.stringify(meta2));
          } catch {
            expected = null;
          }
          await kv.put(key, value, { metadata: meta2 });
          const { metadata: m } = await kv.getWithMetadata(key) ?? {};
          expect(m).toEqual(expected);
        }
      ),
      { numRuns: 20 }
    );
  });
});
