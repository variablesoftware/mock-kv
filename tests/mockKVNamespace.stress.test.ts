/**
 * Stress tests for the mockKVNamespace implementation.
 *
 * These tests cover:
 * - Handling a high volume of random parallel operations
 * - Ensuring store consistency under concurrent put/get/delete
 * - Robustness against race conditions and random access patterns
 */

import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value, randomLength } from "./testUtils";

process.env.LOG = 'none' || process.env.LOG;

describe("mockKVNamespace stress", () => {
  /**
   * Should handle random parallel operations without errors and maintain valid state.
   */
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

describe("mockKVNamespace size limits", () => {
  it("should allow a key of exactly 512 bytes", async () => {
    const kv = mockKVNamespace();
    const key = "a".repeat(512);
    await expect(kv.put(key, "ok")).resolves.not.toThrow();
  });

  it("should reject a key longer than 512 bytes", async () => {
    const kv = mockKVNamespace();
    const key = "a".repeat(513);
    await expect(kv.put(key, "fail")).rejects.toThrow(/Key length exceeds/);
  });

  it("should allow a value of exactly 25MB", async () => {
    const kv = mockKVNamespace();
    const value = "a".repeat(25 * 1024 * 1024);
    await expect(kv.put("maxval", value)).resolves.not.toThrow();
  });

  it("should reject a value larger than 25MB", async () => {
    const kv = mockKVNamespace();
    const value = "a".repeat(25 * 1024 * 1024 + 1);
    await expect(kv.put("toolarge", value)).rejects.toThrow(/Value length exceeds/);
  });
});