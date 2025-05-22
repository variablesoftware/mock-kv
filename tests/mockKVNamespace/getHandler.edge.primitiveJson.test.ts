import { describe, it, expect } from 'vitest';
import { getHandler } from '../../../src/mockKVNamespace/methods/get';

describe('getHandler edge: value is primitive JSON', () => {
  it('parses and returns number as JSON', async () => {
    const data: any = { foo: { value: '123' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'json' });
    expect(result).toBe(123);
  });
  it('parses and returns boolean as JSON', async () => {
    const data: any = { foo: { value: 'true' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'json' });
    expect(result).toBe(true);
  });
  it('parses and returns null as JSON', async () => {
    const data: any = { foo: { value: 'null' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'json' });
    expect(result).toBe(null);
  });
});
