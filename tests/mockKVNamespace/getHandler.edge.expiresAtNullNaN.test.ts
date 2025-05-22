import { describe, it, expect } from 'vitest';
import { getHandler } from '../../../src/mockKVNamespace/methods/get';

describe('getHandler edge: expiresAt is null or NaN', () => {
  it('treats expiresAt: null as not expired', async () => {
    const data: any = { foo: { value: 'bar', expiresAt: null } };
    const get = getHandler(data);
    const result = await get('foo');
    expect(result).toBe('bar');
  });
  it('treats expiresAt: NaN as not expired', async () => {
    const data: any = { foo: { value: 'bar', expiresAt: NaN } };
    const get = getHandler(data);
    const result = await get('foo');
    expect(result).toBe('bar');
  });
});
