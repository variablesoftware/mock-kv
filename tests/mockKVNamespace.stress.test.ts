/**
 * Stress tests for the mockKVNamespace implementation.
 *
 * These tests cover:
 * - Handling a high volume of random parallel operations
 * - Ensuring store consistency under concurrent put/get/delete
 * - Robustness against race conditions and random access patterns
 */

import {log } from "@variablesoftware/logface";
import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value, randomLength } from "./testUtils";

process.env.LOG = 'none' || process.env.LOG;

const shouldRunStress = process.env.KV_STRESS === '1';

(shouldRunStress ? describe : describe.skip)("mockKVNamespace stress", () => {
  /**
   * Should handle random parallel operations without errors and maintain valid state.
   * Also collects analytics on key/value lengths and operation distribution.
   */
  it("should handle random parallel operations", async () => {
    const kv = mockKVNamespace();
    const keyLengths: number[] = [];
    const valueLengths: number[] = [];
    const opCounts = { put: 0, get: 0, delete: 0 };

    // Polyfill for Buffer.byteLength for environments where Buffer is not available
    function byteLength(str: string): number {
      if (typeof Buffer !== 'undefined') {
        return Buffer.byteLength(str, 'utf8');
      }
      // Fallback for browsers/other: count UTF-8 bytes
      let s = 0;
      for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code < 0x80) s += 1;
        else if (code < 0x800) s += 2;
        else if (code < 0x10000) s += 3;
        else s += 4;
      }
      return s;
    }

    const keys = Array.from({ length: 50 }, () => {
      const key = randomSnakeCaseKey();
      keyLengths.push(byteLength(key));
      return key;
    });
    const values = Array.from({ length: 50 }, () => {
      const value = randomBase64Value();
      valueLengths.push(byteLength(value));
      return value;
    });

    const commands = Array.from({ length: 200 }, () => {
      const op = Math.floor(Math.random() * 3);
      const key = keys[Math.floor(Math.random() * keys.length)];
      const value = values[Math.floor(Math.random() * values.length)];
      if (op === 0) {
        opCounts.put++;
        return () => kv.put(key, value);
      } else if (op === 1) {
        opCounts.get++;
        return () => kv.get(key);
      } else {
        opCounts.delete++;
        return () => kv.delete(key);
      }
    });

    await Promise.all(commands.map(fn => fn()));

    const { keys: listed } = await kv.list();
    for (const { name } of listed) {
      const val = await kv.get(name);
      expect(typeof val === "string" || val === null).toBe(true);
    }

    // Analytics output (only at info or debug level)
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const min = (arr: number[]) => Math.min(...arr);
    const max = (arr: number[]) => Math.max(...arr);

    if (process.env.DEBUG === '1') {
      // eslint-disable-next-line no-console
      log.debug("[STRESS TEST ANALYTICS]");
      // eslint-disable-next-line no-console
      log.debug(`Key lengths: min=${min(keyLengths)}, max=${max(keyLengths)}, avg=${avg(keyLengths).toFixed(2)}`);
      // eslint-disable-next-line no-console
      log.debug(`Value lengths: min=${min(valueLengths)}, max=${max(valueLengths)}, avg=${avg(valueLengths).toFixed(2)}`);
      // eslint-disable-next-line no-console
      log.debug(`Operation counts: put=${opCounts.put}, get=${opCounts.get}, delete=${opCounts.delete}`);
    } else if (process.env.CI !== '1') {
      // Only show summary at info level if not in CI and not in debug
      // eslint-disable-next-line no-console
      log.info(`[STRESS] put=${opCounts.put}, get=${opCounts.get}, delete=${opCounts.delete}`);
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