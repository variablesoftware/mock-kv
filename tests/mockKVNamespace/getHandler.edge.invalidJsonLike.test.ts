import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src";

describe("getHandler edge: invalid JSON-like strings", () => {
  it("should return null for invalid JSON string (object)", async () => {
    const kv = mockKVNamespace();
    await kv.put("badobj", "{foo:bar}");
    expect(await kv.get("badobj", { type: "json" })).toBeNull();
  });
  it("should return null for invalid JSON string (array)", async () => {
    const kv = mockKVNamespace();
    await kv.put("badarr", "[1,2,]");
    expect(await kv.get("badarr", { type: "json" })).toBeNull();
  });
});
