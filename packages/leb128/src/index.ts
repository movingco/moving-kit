/**
 * Serializes a U32 as a ULEB128 value.
 * @param value
 * @returns
 */
export const encodeU32 = (value: number): Uint8Array => {
  const valueArray = [];
  while (value >>> 7 !== 0) {
    valueArray.push((value & 0x7f) | 0x80);
    value = value >>> 7;
  }
  valueArray.push(value);
  return Uint8Array.from(valueArray);
};

const MAX_UINT_32 = 2 ** 32 - 1;

/**
 * Decodes a ULEB128 value as a U32.
 * @param arr
 * @returns
 */
export const decodeU32 = (arr: Uint8Array): number => {
  let offset = 0;
  let value = 0;
  for (let shift = 0; shift < 32; shift += 7) {
    const x = arr[offset];
    offset += 1;
    if (typeof x !== "number") {
      throw new Error(
        "index overflow while parsing uleb128-encoded uint32 value"
      );
    }
    const digit = x & 0x7f;
    value = value | (digit << shift);
    if (value < 0 || value > MAX_UINT_32) {
      throw new Error("Overflow while parsing uleb128-encoded uint32 value");
    }
    if (digit === x) {
      if (shift > 0 && digit === 0) {
        throw new Error("Invalid uleb128 number (unexpected zero digit)");
      }
      return value;
    }
  }
  throw new Error("Overflow while parsing uleb128-encoded uint32 value");
};
