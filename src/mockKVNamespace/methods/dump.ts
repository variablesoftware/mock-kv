import type { KVMap, KVEntry } from '../../types/MockKVNamespace';
import logface from '@variablesoftware/logface';

// Add this for Node.js/ES2021+ environments where structuredClone is available but not globally typed
declare const structuredClone: <T>(_obj: T) => T;

/**
 * Returns a deep clone of the KV data for inspection/testing.
 */
export function dumpHandler(data: KVMap): () => Record<string, KVEntry> {
  return () => {
    logface.debug('dump called');
    const result = structuredClone(data);
    logface.info('dump success', { keys: Object.keys(result) });
    return result;
  };
}
