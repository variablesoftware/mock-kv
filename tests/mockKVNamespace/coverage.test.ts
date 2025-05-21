import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/mockKVNamespace";

// Test for defensive data normalization branch

describe("mockKVNamespace defensive data normalization", () => {
  it("should normalize data with non-null prototype", async () => {
    // Pass a plain object (has Object prototype)
    const initial = { foo: { value: "bar", expiration: null, metadata: undefined } };
    const kv = mockKVNamespace(initial);
    // Should still work as normal
    expect(await kv.get("foo")).toBe("bar");
    // Should be able to put/get/delete as usual
    await kv.put("baz", "qux");
    expect(await kv.get("baz")).toBe("qux");
    await kv.delete("baz");
    expect(await kv.get("baz")).toBeNull();
  });
});
