import { describe, it, expect } from 'vitest';
import { getHandler } from '../../../src/mockKVNamespace/methods/get';

describe('getHandler edge: key is non-string', () => {
  it('coerces number key to string', async () => {
    const data: any = { '123': { value: 'bar' } };
    const get = getHandler(data);
    // @ts-expect-error
    const result = await get(123);
    expect(result).toBe('bar');
  });
  it('coerces boolean key to string', async () => {
    const data: any = { 'true': { value: 'baz' } };
    const get = getHandler(data);
    // @ts-expect-error
    const result = await get(true);
    expect(result).toBe('baz');
  });
});
