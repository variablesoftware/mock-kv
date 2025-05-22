import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/index.js";
import { isDebug, isCI } from "../testUtils";

import { randomSnakeCaseKey, randomBase64Value } from "../testUtils";

describe("mockKVNamespace delete before expiration", () => {
  it("should delete a key before it expires and ensure it is gone", async () => {
    const kv = mockKVNamespace();
    const key = randomSnakeCaseKey();
    await kv.put(key, randomBase64Value(), { expirationTtl: 10 });
    await kv.delete(key);
    expect(await kv.get(key)).toBeNull();
  });
});