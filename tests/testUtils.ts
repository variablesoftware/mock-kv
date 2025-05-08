/**
 * Returns a random integer between min and max, inclusive.
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 */
export function randomLength(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random snake_case key of the given length.
 * By default, the length is randomized between 4 and 16.
 * @param length - Length of the key (optional)
 * @returns A random snake_case string
 */
export function randomSnakeCaseKey(length = randomLength(4, 16)): string {
  const chars = "abcdefghijklmnopqrstuvwxyz_";
  let result = "";
  for (let i = 0; i < length; ++i) {
    const c = chars[Math.floor(Math.random() * chars.length)];
    if (
      (i === 0 && c === "_") ||
      (i === length - 1 && c === "_") ||
      (result.endsWith("_") && c === "_")
    ) {
      i--;
      continue;
    }
    result += c;
  }
  return result;
}

/**
 * Generates a random base64-encoded string of the given length.
 * By default, the length is randomized between 8 and 64.
 * @param length - Number of bytes before encoding (optional)
 * @returns A random base64 string
 */
export function randomBase64Value(length = randomLength(8, 64)): string {
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; ++i) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return Buffer.from(bytes).toString("base64");
}