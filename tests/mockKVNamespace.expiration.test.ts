import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";

describe("mockKVNamespace expiration", () => {
  it("should respect expirationTtl and expire after timeout", async () => {
    const kv = mockKVNamespace();
    await kv.put("expiring", "soon", { expirationTtl: 1 }); // 1 second TTL

    const valNow = await kv.get("expiring");
    expect(valNow).toBe("soon");

    await new Promise((res) => setTimeout(res, 1100)); // wait just over 1 second
    const valLater = await kv.get("expiring");
    expect(valLater).toBeNull();
  });

  it("should respect absolute expiration timestamp", async () => {
    const now = Math.floor(Date.now() / 1000);
    const kv = mockKVNamespace();
    await kv.put("abs", "expire", { expiration: now - 1 }); // already expired
    const val = await kv.get("abs");
    expect(val).toBeNull();
  });
});