/**
 * Listing tests for the mockKVNamespace implementation.
 *
 * These tests cover:
 * - Limiting the number of results returned by list()
 */

import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../src/mockKVNamespace";
import { randomSnakeCaseKey, randomBase64Value } from "./testUtils";

process.env.LOG = 'none' || process.env.LOG;

describe("mockKVNamespace listing", () => {
  /**
   * Should limit the number of results returned by list({ limit }).
   */
  it("should limit results with list({ limit })", async () => {
    const kv = mockKVNamespace();
    const key1 = randomSnakeCaseKey();
    const key2 = randomSnakeCaseKey();
    const key3 = randomSnakeCaseKey();
    await kv.put(key1, randomBase64Value());
    await kv.put(key2, randomBase64Value());
    await kv.put(key3, randomBase64Value());

    const { keys } = await kv.list({ limit: 2 });
    expect(keys.length).toBe(2);
  });
});