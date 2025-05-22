import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src";

describe("getHandler edge: expiresAt exactly now", () => {
  it("should treat expiresAt === now as expired", async () => {
    const kv = mockKVNamespace();
    const key = "foo";
    const now = Date.now();
    (kv as any).dump()[key] = { value: "bar", expiresAt: now };
    expect(await kv.get(key)).toBeNull();
  });
});
