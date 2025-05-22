import { describe, it, expect } from 'vitest';
import { getHandler } from '../../../src/mockKVNamespace/methods/get';

describe('getHandler edge: entry is empty object or missing value', () => {
  it('returns undefined if entry is empty object', async () => {
    const data: any = { foo: {} };
    const get = getHandler(data);
    const result = await get('foo');
    expect(result).toBe(undefined);
  });
  it('returns undefined if entry is missing value property', async () => {
    const data: any = { foo: { expiresAt: undefined } };
    const get = getHandler(data);
    const result = await get('foo');
    expect(result).toBe(undefined);
  });
});
