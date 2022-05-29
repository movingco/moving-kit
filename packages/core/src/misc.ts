import { MAX_U64, ZERO } from "@ubeswap/token-math";
import JSBI from "jsbi";

/**
 * Applies a function to a list of null/undefined values, unwrapping the null/undefined value or passing it through.
 */
export const mapN = <T extends unknown[], U>(
  fn: (
    ...a: {
      [K in keyof T]: NonNullable<T[K]>;
    }
  ) => U,
  ...args: T
): U | null | undefined => {
  if (!args.every((arg) => arg !== undefined)) {
    return undefined;
  }
  if (!args.every((arg) => arg !== null)) {
    return null;
  }
  return fn(
    ...(args as {
      [K in keyof T]: NonNullable<T[K]>;
    })
  );
};

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
