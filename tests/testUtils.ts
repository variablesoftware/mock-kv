export function randomLength(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

export function randomBase64Value(length = randomLength(8, 64)): string {
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; ++i) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return Buffer.from(bytes).toString("base64");
}