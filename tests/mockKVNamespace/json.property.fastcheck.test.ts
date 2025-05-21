import { describe, it, expect } from "vitest";
import { mockKVNamespace } from "../../src/mockKVNamespace";
import fc from "fast-check";

// Arbitraries for deep/nested JSON and exotic keys
const exoticKeyArb = fc.string({ minLength: 1, maxLength: 64 });
const deepJsonArb = fc.anything({ json: true });

// Helper: recursively treat null and undefined as equivalent
function deepNullishEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if ((a === null && b === undefined) || (a === undefined && b === null)) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepNullishEqual(v, b[i]));
  }
  if (typeof a === 'object' && typeof b === 'object' && a && b) {
    // JSON.stringify drops undefined properties, so ignore them in comparison
    const aKeys = Object.keys(a as object).filter(k => (a as any)[k] !== undefined);
    const bKeys = Object.keys(b as object).filter(k => (b as any)[k] !== undefined);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every(k => deepNullishEqual((a as any)[k], (b as any)[k])) &&
           bKeys.every(k => deepNullishEqual((a as any)[k], (b as any)[k]));
  }
  return false;
}

// Property-based tests for JSON round-trip and invalid JSON

describe("mockKVNamespace property-based JSON", () => {
  it("should round-trip deep/nested JSON objects (fast-check)", async () => {
    await fc.assert(
      fc.asyncProperty(exoticKeyArb, deepJsonArb, async (key, obj) => {
        // Filter out unsafe/prototype keys
        if (["toString","hasOwnProperty","valueOf","constructor","__proto__","isPrototypeOf","propertyIsEnumerable","toLocaleString"].includes(key)) return;
        // Filter out undefined, which cannot be stringified and stored
        if (typeof obj === "undefined") return;
        // Filter out values that cannot be round-tripped by JSON
        function isJsonSafe(val: unknown): boolean {
          if (typeof val === "bigint" || typeof val === "function" || typeof val === "symbol") return false;
          if (typeof val === "number" && (!Number.isFinite(val) || Number.isNaN(val))) return false;
          if (Array.isArray(val)) return val.every(isJsonSafe);
          if (val && typeof val === "object") return Object.values(val).every(isJsonSafe);
          return true;
        }
        if (!isJsonSafe(obj)) return;
        const kv = mockKVNamespace();
        await kv.put(key, JSON.stringify(obj));
        const result = await kv.get(key, { type: "json" });
        // Use deepNullishEqual to treat null/undefined as equivalent everywhere
        expect(deepNullishEqual(result, obj)).toBe(true);
      }),
      { numRuns: 30 }
    );
  });

  it("should handle invalid JSON parsing gracefully (fast-check)", async () => {
    await fc.assert(
      fc.asyncProperty(exoticKeyArb, async (key) => {
        if (["toString","hasOwnProperty","valueOf","constructor","__proto__","isPrototypeOf","propertyIsEnumerable","toLocaleString"].includes(key)) return;
        const kv = mockKVNamespace();
        await kv.put(key, "not-valid-json");
        const result = await kv.get(key, { type: "json" });
        expect(result).toBeNull();
      }),
      { numRuns: 30 }
    );
  });
});
