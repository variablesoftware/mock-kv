import { describe, it, expect } from 'vitest';
import { getHandler } from '../../../src/mockKVNamespace/methods/get';

describe('getHandler edge: rapid calls and expiration', () => {
  it('returns value before expiration and null after expiration', async () => {
    const key = 'foo';
    const data: any = { [key]: { value: 'bar', expiresAt: Date.now() + 10 } };
    const get = getHandler(data);
    // Should return value before expiration
    const before = await get(key);
    expect(before).toBe('bar');
    // Simulate expiration
    data[key].expiresAt = Date.now() - 10;
    const after = await get(key);
    expect(after).toBeNull();
  });
});
