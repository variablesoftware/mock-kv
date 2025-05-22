import { describe, it, expect } from 'vitest';
import { getHandler } from '../../src/mockKVNamespace/methods/get.js';
import { mockKVNamespace } from "../../src/index.js";

describe('getHandler edge: opts.type is unknown or undefined', () => {
  it('falls through to default branch for unknown type', async () => {
    const data: any = { foo: { value: 'bar' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'xml' } as any);
    expect(result).toBe('bar');
  });
  it('falls through to default branch for type: undefined', async () => {
    const data: any = { foo: { value: 'bar' } };
    const get = getHandler(data);
    const result = await get('foo', { type: undefined });
    expect(result).toBe('bar');
  });
  it('falls through to default branch for opts: {}', async () => {
    const data: any = { foo: { value: 'bar' } };
    const get = getHandler(data);
    const result = await get('foo', {});
    expect(result).toBe('bar');
  });
});

describe("getHandler edge: unknown opts.type", () => {
  it("should return raw string for unknown opts.type", async () => {
    const kv = mockKVNamespace();
    await kv.put("foo", "bar");
    expect(await kv.get("foo", { type: "foo" as any })).toBe("bar");
  });
  it("should return raw string for opts.type with wrong casing", async () => {
    const kv = mockKVNamespace();
    await kv.put("foo", "bar");
    expect(await kv.get("foo", { type: "Text" as any })).toBe("bar");
    expect(await kv.get("foo", { type: "JSON" as any })).toBe("bar");
  });
  it("should return raw string for opts = {{}}", async () => {
    const kv = mockKVNamespace();
    await kv.put("foo", "bar");
    expect(await kv.get("foo", {})).toBe("bar");
  });
  it("should return raw string for opts = null", async () => {
    const kv = mockKVNamespace();
    await kv.put("foo", "bar");
    expect(await kv.get("foo", null as any)).toBe("bar");
  });
});
