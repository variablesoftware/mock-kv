import { describe, it, expect } from 'vitest';
import { mockKVNamespace } from '../../src/index.js';

describe('mockKVNamespace defensive data prototype', () => {
  it('should create a prototype-less store if given a plain object', async () => {
    // This object has a prototype
    const initial = { foo: { value: 'bar' } };
    const kv = mockKVNamespace(initial);
    // Should still work for normal keys
    expect(await kv.get('foo')).toBe('bar');
    // Should not leak prototype properties
    expect(Object.getPrototypeOf((kv as any).dump())).toBe(null);
    // Should not find toString or other prototype keys
    expect(Object.keys((kv as any).dump())).not.toContain('toString');
  });
});
