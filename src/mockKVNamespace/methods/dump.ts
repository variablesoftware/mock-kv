import type { KVMap, KVEntry } from '../../types/MockKVNamespace';
import { clone } from '../../utils/clone.js';
import logface from '@variablesoftware/logface';

/**
 * Returns a deep clone of the KV data for inspection/testing.
 */
export function dumpHandler(data: KVMap): () => Record<string, KVEntry> {
  return () => {
    logface.debug('dump called');
    const result = clone(data);
    logface.info('dump success', { keys: Object.keys(result) });
    return result;
  };
}
