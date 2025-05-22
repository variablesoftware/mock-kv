import { describe, it, expect } from 'vitest';
import { getHandler } from '../../../src/mockKVNamespace/methods/get';

describe('getHandler edge: expiresAt exactly now', () => {
  it('treats expiresAt === now as expired', async () => {
    const now = Date.now();
    const data: any = { foo: { value: 'bar', expiresAt: now } };
    const get = getHandler(data);
    // Patch Date.now to return the same value
    const realNow = Date.now;
    Date.now = () => now;
    const result = await get('foo');
    Date.now = realNow;
    expect(result).toBeNull();
  });
});
