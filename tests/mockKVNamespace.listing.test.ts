import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";

describe("mockKVNamespace listing", () => {
  it("should limit results with list({ limit })", async () => {
    const kv = mockKVNamespace();
    await kv.put("one", "1");
    await kv.put("two", "2");
    await kv.put("three", "3");

    const { keys } = await kv.list({ limit: 2 });
    expect(keys.length).toBe(2);
  });
});