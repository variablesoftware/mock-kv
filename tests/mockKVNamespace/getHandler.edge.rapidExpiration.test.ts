import { describe, it, expect } from 'vitest';
import { getHandler } from '../../src/mockKVNamespace/methods/get.js';
import { mockKVNamespace } from "../../src/index.js";

describe('getHandler edge: rapid calls and expiration', () => {
  it('returns value before expiration and null after expiration', async () => {
    const key = 'foo';
    const data: any = { [key]: { value: 'bar', expiresAt: Date.now() + 10 } };
    const get = getHandler(data);
    // Should return value before expiration
    const before = await get(key);
    expect(before).toBe('bar');
    // Simulate expiration
    data[key].expiresAt = Date.now() - 10;
    const after = await get(key);
    expect(after).toBeNull();
  });
});

describe("getHandler edge: rapid expiration", () => {
  it("should expire key immediately after put with TTL=0", async () => {
    const kv = mockKVNamespace();
    await kv.put("foo", "bar", { expirationTtl: 0 });
    expect(await kv.get("foo")).toBeNull();
  });
  it("should expire key with negative TTL", async () => {
    const kv = mockKVNamespace();
    await kv.put("foo", "bar", { expirationTtl: -1 });
    expect(await kv.get("foo")).toBeNull();
  });
});
