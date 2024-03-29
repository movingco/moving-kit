import { MAX_U64, ZERO } from "@ubeswap/token-math";
import { default as JSBI } from "jsbi";

export * from "@saberhq/option-utils";

/**
 * Blocks for the given duration.
 * @param duration
 * @returns
 */
export const sleep = (duration: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
};

/**
 * Zero pads a buffer.
 * @param buffer
 * @param length
 * @returns
 */
export const zeroPadBuffer = (
  buffer: Uint8Array,
  length: number
): Uint8Array => {
  if (buffer.length >= length) {
    return buffer;
  }
  return new Uint8Array([...new Uint8Array(length - buffer.length), ...buffer]);
};

/**
 * The maximum value of a `u128`.
 */
export const MAX_U128 = JSBI.BigInt("0xffffffffffffffffffffffffffffffff");

/**
 * Validates that a number falls within the range of `u64`.
 * @param value
 */
export function validateU64(value: JSBI): void {
  if (!JSBI.greaterThanOrEqual(value, ZERO)) {
    throw new Error(`u64: underflow`);
  }
  if (!JSBI.lessThanOrEqual(value, MAX_U64)) {
    throw new Error(`u64: overflow`);
  }
}

/**
 * Validates that a number falls within the range of `u128`.
 * @param value
 */
export function validateU128(value: JSBI): void {
  if (!JSBI.greaterThanOrEqual(value, ZERO)) {
    throw new Error(`u128: underflow`);
  }
  if (!JSBI.lessThanOrEqual(value, MAX_U128)) {
    throw new Error(`u128: overflow`);
  }
}
