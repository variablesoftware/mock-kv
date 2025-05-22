import { describe, it, expect } from 'vitest';
import { getHandler } from '../../../src/mockKVNamespace/methods/get';

describe('getHandler edge: value is undefined or null', () => {
  it('returns undefined if value is undefined', async () => {
    const data: any = { foo: { value: undefined } };
    const get = getHandler(data);
    const result = await get('foo');
    expect(result).toBe(undefined);
  });
  it('returns null if value is null', async () => {
    const data: any = { foo: { value: null } };
    const get = getHandler(data);
    const result = await get('foo');
    expect(result).toBe(null);
  });
});
