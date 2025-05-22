import { describe, it, expect } from 'vitest';
import { getHandler } from '../../../src/mockKVNamespace/methods/get';

describe('getHandler', () => {
  it('should return raw value when opts.type is "text"', async () => {
    const data = { foo: { value: 'bar' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'text' });
    expect(result).toBe('bar');
  });

  it('should return raw value when opts.type is not set and key is not json-like', async () => {
    const data = { foo: { value: 'baz' } };
    const get = getHandler(data);
    const result = await get('foo');
    expect(result).toBe('baz');
  });

  it('should return raw value when opts is undefined (default branch)', async () => {
    const data = { foo: { value: 'baz' } };
    const get = getHandler(data);
    // Use a key that is not 'json' and does not end with '-json'
    const result = await get('foo', undefined);
    expect(result).toBe('baz');
  });
});
