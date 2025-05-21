import fc from "fast-check";

const chars = "abcdefghijklmnopqrstuvwxyz_";

// Arbitrary for a random snake_case key (4-16 chars, no leading/trailing/duplicate underscores)
export const snakeCaseKeyArb = fc
  .array(fc.constantFrom(...chars), { minLength: 4, maxLength: 16 })
  .map(a => a.join(""))
  .filter(s =>
    s.length >= 4 &&
    !s.startsWith("_") &&
    !s.endsWith("_") &&
    !s.includes("__")
  );

// Arbitrary for a random base64 string (8-64 bytes before encoding)
export const base64ValueArb = fc.uint8Array({ minLength: 8, maxLength: 64 }).map(arr => Buffer.from(arr).toString("base64"));

// For legacy tests that expect a function, provide wrappers
export function randomSnakeCaseKey() {
  return fc.sample(snakeCaseKeyArb, 1)[0];
}
export function randomBase64Value() {
  return fc.sample(base64ValueArb, 1)[0];
}