import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "./testUtils";

describe("mockKVNamespace advanced", () => {
  it("should handle overwriting a key multiple times", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value());
    await kv.put(key, randomBase64Value());
    const finalValue = randomBase64Value();
    await kv.put(key, finalValue);
    expect(await kv.get(key)).toBe(finalValue);
  });

  it("should not throw when deleting a non-existent key", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await expect(kv.delete(key)).resolves.not.toThrow();
  });

  it("should support unicode and special characters in keys and values", async () => {
    const kv = mockKVNamespace();
    const key = "💡_" + randomSnakeCaseKey();
    const value = "🚀_" + randomBase64Value();
    await kv.put(key, value);
    expect(await kv.get(key)).toBe(value);
  });

  it("should not return expired keys in list", async () => {
    const kv = mockKVNamespace();
    const keepKey = randomSnakeCaseKey();
    const expireKey = randomSnakeCaseKey();
    await kv.put(keepKey, randomBase64Value());
    // Set expiration to 1 second in the past
    const now = Math.floor(Date.now() / 1000)-4000;
    await kv.put(expireKey, randomBase64Value(), { expiration: now - 1 });
    const { keys } = await kv.list();
    expect(keys.map(k => k.name)).toContain(keepKey);
    expect(keys.map(k => k.name)).not.toContain(expireKey);
  });

  it("should dump the correct state after operations", async () => {
    const kv = mockKVNamespace();
    const keyA = randomSnakeCaseKey();
    const keyB = randomSnakeCaseKey();
    await kv.put(keyA, randomBase64Value());
    await kv.put(keyB, randomBase64Value());
    await kv.delete(keyA);
    const dump = kv.dump();
    expect(dump).toHaveProperty(keyB);
    expect(dump).not.toHaveProperty(keyA);
  });
});

describe("mockKVNamespace stress", () => {
  it("should handle random parallel operations", async () => {
    const kv = mockKVNamespace();
    const keys = Array.from({ length: 50 }, () => randomSnakeCaseKey(8));
    const values = Array.from({ length: 50 }, () => randomBase64Value(16));

    const commands = Array.from({ length: 200 }, () => {
      const op = Math.floor(Math.random() * 3);
      const key = keys[Math.floor(Math.random() * keys.length)];
      const value = values[Math.floor(Math.random() * values.length)];
      if (op === 0) {
        return () => kv.put(key, value);
      } else if (op === 1) {
        return () => kv.get(key);
      } else {
        return () => kv.delete(key);
      }
    });

    await Promise.all(commands.map(fn => fn()));

    const { keys: listed } = await kv.list();
    for (const { name } of listed) {
      const val = await kv.get(name);
      expect(typeof val === "string" || val === null).toBe(true);
    }
  });
});
