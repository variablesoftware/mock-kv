import { describe, it, expect } from 'vitest';
import { getHandler } from '../../../src/mockKVNamespace/methods/get';

describe('getHandler edge: value looks like JSON but is invalid', () => {
  it('returns null for value like {foo:bar}', async () => {
    const data: any = { foo: { value: '{foo:bar}' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'json' });
    expect(result).toBeNull();
  });
  it('returns null for value like [1,2,]', async () => {
    const data: any = { foo: { value: '[1,2,]' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'json' });
    expect(result).toBeNull();
  });
});
