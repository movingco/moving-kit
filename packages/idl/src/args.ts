/**
 * Can be converted into a HexString.
 */
export interface HexStringLike {
  hex(): string;
}

/**
 * Hex string argument.
 */
export type HexStringArg = string | HexStringLike;

/**
 * Unsigned 64-bit integer.
 */
export type U64 = string;

/**
 * Unsigned 128-bit integer.
 */
export type U128 = string;
