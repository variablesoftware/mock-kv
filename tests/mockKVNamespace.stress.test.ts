import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "./testUtils";

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