declare const structuredClone: (<T>(_obj: T) => T) | undefined;

export function clone<T>(obj: T): T {
  try {
    // @ts-expect-error: structuredClone may not be available in all environments
    if (typeof structuredClone === "function") {
      return structuredClone(obj);
    }
  } catch {
    // ignore
  }
  return JSON.parse(JSON.stringify(obj));
}