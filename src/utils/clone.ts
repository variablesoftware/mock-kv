/**
 * Deep clones an object using structuredClone if available, otherwise falls back to JSON.
 * @param obj - The object to clone.
 * @returns A deep copy of the object.
 */
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