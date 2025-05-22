import { describe, it, expect } from 'vitest';
import { getHandler } from '../../../src/mockKVNamespace/methods/get';

describe('getHandler edge: opts.type is unknown or undefined', () => {
  it('falls through to default branch for unknown type', async () => {
    const data: any = { foo: { value: 'bar' } };
    const get = getHandler(data);
    const result = await get('foo', { type: 'xml' } as any);
    expect(result).toBe('bar');
  });
  it('falls through to default branch for type: undefined', async () => {
    const data: any = { foo: { value: 'bar' } };
    const get = getHandler(data);
    const result = await get('foo', { type: undefined });
    expect(result).toBe('bar');
  });
  it('falls through to default branch for opts: {}', async () => {
    const data: any = { foo: { value: 'bar' } };
    const get = getHandler(data);
    const result = await get('foo', {});
    expect(result).toBe('bar');
  });
});
