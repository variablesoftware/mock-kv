import { describe, it, expect } from 'vitest';
import { getHandler } from '../../src/mockKVNamespace/methods/get';

describe('getHandler (unit)', () => {
  it('returns null and deletes key if entry is missing', async () => {
    const data: any = {};
    const get = getHandler(data);
    const result = await get('missing');
    expect(result).toBeNull();
    expect('missing' in data).toBe(false);
  });

  it('returns null and deletes key if entry is expired', async () => {
    const data: any = { foo: { value: 'bar', expiresAt: Date.now() - 1000 } };
    const get = getHandler(data);
    const result = await get('foo');
    expect(result).toBeNull();
    expect('foo' in data).toBe(false);
  });

  it('returns value if entry is present and not expired (expiresAt in future)', async () => {
    const data: any = { foo: { value: 'bar', expiresAt: Date.now() + 100000 } };
    const get = getHandler(data);
    const result = await get('foo');
    expect(result).toBe('bar');
  });

  it('returns raw value if opts.type is "text"', async () => {
    const data: any = { foo: { value: 'bar' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'text' });
    expect(result).toBe('bar');
  });

  it('returns raw value if opts.type is "text" and value is falsy (empty string)', async () => {
    const data: any = { foo: { value: '' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'text' });
    expect(result).toBe('');
  });

  it('returns raw value if opts.type is "text" and value is 0', async () => {
    const data: any = { foo: { value: 0 } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'text' });
    expect(result).toBe(0);
  });

  it('returns raw value if opts.type is "text" and value is false', async () => {
    const data: any = { foo: { value: false } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'text' });
    expect(result).toBe(false);
  });

  it('returns parsed JSON if opts.type is "json" and value is valid JSON', async () => {
    const data: any = { foo: { value: '{"a":1}' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'json' });
    expect(result).toEqual({ a: 1 });
  });

  it('returns null if opts.type is "json" and value is invalid JSON', async () => {
    const data: any = { foo: { value: 'not-json' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'json' });
    expect(result).toBeNull();
  });

  it('returns parsed JSON if key is "json" and value is valid JSON', async () => {
    const data: any = { json: { value: '[1,2,3]' } };
    const get = getHandler(data);
    const result = await get('json');
    expect(result).toEqual([1,2,3]);
  });

  it('returns parsed JSON if key ends with -json and value is valid JSON', async () => {
    const data: any = { 'foo-json': { value: '{"b":2}' } };
    const get = getHandler(data);
    const result = await get('foo-json');
    expect(result).toEqual({ b: 2 });
  });

  it('returns null if key ends with -json and value is invalid JSON', async () => {
    const data: any = { 'foo-json': { value: 'oops' } };
    const get = getHandler(data);
    const result = await get('foo-json');
    expect(result).toBeNull();
  });

  it('returns raw value for all other cases (default branch)', async () => {
    const data: any = { bar: { value: 'baz' } };
    const get = getHandler(data);
    const result = await get('bar');
    expect(result).toBe('baz');
  });

  it('skips text branch if opts is undefined', async () => {
    const data: any = { foo: { value: 'bar' } };
    const get = getHandler(data);
    const result = await get('foo');
    expect(result).toBe('bar');
  });

  it('skips text branch if opts.type is not "text"', async () => {
    const data: any = { foo: { value: '{"a":1}' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'json' });
    expect(result).toEqual({ a: 1 });
  });

  it('skips text branch if opts is empty object', async () => {
    const data: any = { foo: { value: 'bar' } };
    const get = getHandler(data);
    const result = await get('foo', {});
    expect(result).toBe('bar');
  });

  it('returns raw value if opts.type is not set (default branch)', async () => {
    const data: any = { foo: { value: 'bar' } };
    const get = getHandler(data);
    const result = await get('foo');
    expect(result).toBe('bar');
  });

  it('returns raw value if opts.type is unknown', async () => {
    const data: any = { foo: { value: 'bar' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'unknown' } as any);
    expect(result).toBe('bar');
  });

  it('returns raw value if opts is empty object', async () => {
    const data: any = { foo: { value: 'bar' } };
    const get = getHandler(data);
    const result = await get('foo', {});
    expect(result).toBe('bar');
  });
});
