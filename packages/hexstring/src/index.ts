// Taken from <https://github.com/aptos-labs/aptos-core/blob/main/ecosystem/typescript/sdk/src/hex_string.ts>

import { Buffer } from "buffer/index.js";

/**
 * A string prefixed with `0x`.
 *
 * Note: this is unsafe as one could pass in a string like
 * `0xwhatever` -- it is not checked!
 */
export type HexPrefixedString = `0x${string}`;

export type MaybeHexString = HexStringLike | string;

export interface HexStringLike {
  hex(): string;
}

/**
 * Hex string interface with more serialization methods.
 */
export interface SerializableHexString extends HexStringLike {
  noPrefix(): string;
  toString(): string;
  toUint8Array(): Uint8Array;
  toBuffer(): Buffer;
}

export const trimLeadingZeros = (hexString: string): string => {
  return hexString.replace(/^0*/, "");
};

/**
 * A hexadecimal string.
 *
 * Unlike Address, this type is not normalized.
 */
export class HexString implements SerializableHexString {
  /**
   * We want to make sure this hexString has the `0x` hex prefix
   */
  private readonly _hexString: HexPrefixedString;

  constructor(hexString: string) {
    if (hexString.startsWith("0x")) {
      this._hexString = hexString as HexPrefixedString;
    } else {
      this._hexString = `0x${hexString}`;
    }
  }

  static fromBuffer(buffer: Buffer): HexString {
    return new HexString(buffer.toString("hex"));
  }

  static fromUint8Array(arr: Uint8Array): HexString {
    return HexString.fromBuffer(Buffer.from(arr));
  }

  static ensure(hexString: MaybeHexString): HexString {
    if (typeof hexString === "string") {
      return new HexString(hexString);
    }
    if (hexString instanceof HexString) {
      return hexString;
    }
    return new HexString(hexString.hex());
  }

  hex(): HexPrefixedString {
    return this._hexString;
  }

  lowerHex(): HexPrefixedString {
    return this.hex().toLowerCase() as HexPrefixedString;
  }

  noPrefix(): string {
    return this._hexString.slice(2);
  }

  toString(): HexPrefixedString {
    return this.hex();
  }

  toShortString(): HexPrefixedString {
    return `0x${trimLeadingZeros(this.noPrefix())}`;
  }

  /**
   * Returns the hex encoded bytes of the {@link HexString}.
   * @returns
   */
  hexBytesNoPrefix(): string {
    return this._hexString.length % 2 === 1
      ? `0${this.noPrefix()}`
      : this.noPrefix();
  }

  toBuffer(): Buffer {
    return Buffer.from(this.hexBytesNoPrefix(), "hex");
  }

  toUint8Array(): Uint8Array {
    return Uint8Array.from(this.toBuffer());
  }

  /**
   * Returns true if this hex string is equivalent to the other hex string.
   * (case insensitive)
   *
   * @param other
   * @returns
   */
  equals(other: MaybeHexString): boolean {
    // hex() is normalized
    return this.lowerHex() === HexString.ensure(other).lowerHex();
  }
}
