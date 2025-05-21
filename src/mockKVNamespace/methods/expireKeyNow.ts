import type { KVMap } from '../../types/MockKVNamespace';
import logface from '@variablesoftware/logface';

export function expireKeyNowHandler(data: KVMap): (key: string) => void {
  return (key: string) => {
    if (data[key]) {
      logface.debug('expireKeyNow called', { key });
      data[key].expiresAt = Date.now() - 1000;
      logface.info('expireKeyNow success', { key });
    } else {
      logface.debug('expireKeyNow called on missing key', { key });
    }
  };
}
