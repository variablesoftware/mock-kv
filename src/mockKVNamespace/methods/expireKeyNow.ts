import type { KVMap } from '../../types/MockKVNamespace';
import logface from '@variablesoftware/logface';

export function expireKeyNowHandler(data: KVMap) {
  return function(_key: string) {
    if (data[_key]) {
      logface.debug('expireKeyNow called', { key: _key });
      data[_key].expiresAt = Date.now() - 1000;
      logface.info('expireKeyNow success', { key: _key });
    } else {
      logface.debug('expireKeyNow called on missing key', { key: _key });
    }
  };
}
