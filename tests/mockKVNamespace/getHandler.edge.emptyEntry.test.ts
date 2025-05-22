import { describe, it, expect } from 'vitest';
import { getHandler } from '../../src/mockKVNamespace/methods/get.js';
import { mockKVNamespace } from "../../src/index.js";

describe('getHandler edge: entry is empty object or missing value', () => {
  it('returns null if entry is empty object', async () => {
    const data: any = { foo: {} };
    const get = getHandler(data);
    const result = await get('foo');
    expect(result).toBe(null);
  });
  it('returns null if entry is missing value property', async () => {
    const data: any = { foo: { expiresAt: undefined } };
    const get = getHandler(data);
    const result = await get('foo');
    expect(result).toBe(null);
  });
});

describe("getHandler edge: empty string and falsy values", () => {
  it("should return empty string if value is empty string", async () => {
    const kv = mockKVNamespace();
    await kv.put("empty", "");
    expect(await kv.get("empty")).toBe("");
  });
  it("should return '0' if value is '0'", async () => {
    const kv = mockKVNamespace();
    await kv.put("zero", "0");
    expect(await kv.get("zero")).toBe("0");
  });
  it("should return 'false' if value is 'false'", async () => {
    const kv = mockKVNamespace();
    await kv.put("bool", "false");
    expect(await kv.get("bool")).toBe("false");
  });
  it("should return 'null' if value is 'null'", async () => {
    const kv = mockKVNamespace();
    await kv.put("nullstr", "null");
    expect(await kv.get("nullstr")).toBe("null");
  });
  it("should return 'undefined' if value is 'undefined'", async () => {
    const kv = mockKVNamespace();
    await kv.put("undefstr", "undefined");
    expect(await kv.get("undefstr")).toBe("undefined");
  });
});
