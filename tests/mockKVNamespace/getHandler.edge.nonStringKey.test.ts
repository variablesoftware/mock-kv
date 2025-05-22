import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src";

describe("getHandler edge: non-string keys", () => {
  it("should coerce number key to string", async () => {
    const kv = mockKVNamespace();
    await kv.put(123 as any, "bar");
    expect(await kv.get(123 as any)).toBe("bar");
    expect(await kv.get("123")).toBe("bar");
  });
  it("should coerce object key to string", async () => {
    const kv = mockKVNamespace();
    await kv.put({ foo: 1 } as any, "bar");
    expect(await kv.get({ foo: 1 } as any)).toBe("bar");
  });
});
