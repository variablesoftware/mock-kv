/**
 * Expiration and TTL tests for the mockKVNamespace implementation.
 *
 * These tests cover:
 * - Expiring keys using expirationTtl (relative TTL)
 * - Expiring keys using absolute expiration timestamps
 * - Ensuring expired keys are not returned by get
 * - Overwriting expiration
 * - Deleting before expiration
 * - Immediate expiration with 0 or negative TTL
 */

import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "./testUtils";

process.env.LOG = 'none' || process.env.LOG;

describe("mockKVNamespace expiration", () => {
  /**
   * Should expire a key after the specified TTL.
   */
  it("should respect expirationTtl and expire after timeout", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value = randomBase64Value();
    await kv.put(key, value, { expirationTtl: 1 }); // 1 second TTL

    const valNow = await kv.get(key);
    expect(valNow).toBe(value);

    await new Promise((res) => setTimeout(res, 1100)); // wait just over 1 second
    const valLater = await kv.get(key);
    expect(valLater).toBeNull();
  });

  /**
   * Should expire a key immediately if the expiration timestamp is in the past.
   */
  it("should respect absolute expiration timestamp", async () => {
    const now = Math.floor(Date.now() / 1000);
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    const value = randomBase64Value();
    await kv.put(key, value, { expiration: now - 1 }); // already expired
    const val = await kv.get(key);
    expect(val).toBeNull();
  });

  /**
   * Should update expiration when overwriting with new TTL.
   */
  it("should update expiration when overwriting with new TTL", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { expirationTtl: 10 });
    await kv.put(key, randomBase64Value(), { expirationTtl: 1 });
    await new Promise(res => setTimeout(res, 1100));
    expect(await kv.get(key)).toBeNull();
  });

  /**
   * Should remove expiration when overwriting without expiration.
   */
  it("should remove expiration when overwriting without expiration", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { expirationTtl: 1 });
    await kv.put(key, randomBase64Value());
    await new Promise(res => setTimeout(res, 1100));
    // Should NOT expire, since expiration was removed
    expect(await kv.get(key)).not.toBeNull();
  });

  /**
   * Should not return expired keys in list.
   */
  it("should not return expired keys in list", async () => {
    const kv = mockKVNamespace();
    const keepKey = randomSnakeCaseKey();
    const expireKey = randomSnakeCaseKey();
    await kv.put(keepKey, randomBase64Value());
    const now = Math.floor(Date.now() / 1000);
    await kv.put(expireKey, randomBase64Value(), { expiration: now - 1 });
    const { keys } = await kv.list();
    expect(keys.map(k => k.name)).toContain(keepKey);
    expect(keys.map(k => k.name)).not.toContain(expireKey);
  });

  /**
   * Should delete a key before it expires and ensure it is gone.
   */
  it("should delete before expiration", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { expirationTtl: 10 });
    await kv.delete(key);
    expect(await kv.get(key)).toBeNull();
  });

  /**
   * Should immediately expire a key with expirationTtl: 0.
   */
  it("should immediately expire a key with TTL 0", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { expirationTtl: 0 });
    expect(await kv.get(key)).toBeNull();
  });

  /**
   * Should immediately expire a key with negative TTL.
   */
  it("should immediately expire a key with negative TTL", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { expirationTtl: -1 });
    expect(await kv.get(key)).toBeNull();
  });
});