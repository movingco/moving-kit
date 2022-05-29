// Taken from <https://github.com/aptos-labs/aptos-core/blob/main/ecosystem/typescript/sdk/src/hex_string.ts>

import { sha3_256 } from "js-sha3";
import invariant from "tiny-invariant";

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

/**
 * A hexadecimal string.
 */
export class HexString implements SerializableHexString {
  /// We want to make sure this hexString has the `0x` hex prefix
  private readonly _hexString: string;

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

  constructor(hexString: string) {
    if (hexString.startsWith("0x")) {
      this._hexString = hexString;
    } else {
      this._hexString = `0x${hexString}`;
    }
  }

  hex(): string {
    return this._hexString;
  }

  noPrefix(): string {
    return this._hexString.slice(2);
  }

  toString(): string {
    return this.hex();
  }

  toShortString(): string {
    const trimmed = this._hexString.replace(/^0x0*/, "");
    return `0x${trimmed}`;
  }

  toBuffer(): Buffer {
    return Buffer.from(this.noPrefix(), "hex");
  }

  toUint8Array(): Uint8Array {
    return Uint8Array.from(this.toBuffer());
  }

  /**
   * Returns the checksum version of this HexString.
   * @returns
   */
  checksum(): string {
    const chars = this.noPrefix().toLowerCase().split("");

    const expanded = new Uint8Array(chars.map((char) => char.charCodeAt(0)));

    const hash = sha3_256.create();
    hash.update(expanded);

    const hashed = hash.digest();

    for (let i = 0; i < chars.length; i += 2) {
      const hiByte = hashed[i >> 1];
      invariant(hiByte !== undefined);
      if (hiByte >> 4 >= 8) {
        const hiChar = chars[i];
        invariant(hiChar !== undefined);
        chars[i] = hiChar.toUpperCase();
      }
      if ((hiByte & 0x0f) >= 8) {
        const loChar = chars[i + 1];
        invariant(loChar !== undefined);
        chars[i + 1] = loChar.toUpperCase();
      }
    }

    return "0x" + chars.join("");
  }

  /**
   * Shortened version of this string as a checksum address.
   * @param leading
   * @param trailing
   * @returns
   */
  shortened(leading = 5, trailing = 3): string {
    const hex = this.checksum();
    const last = leading + 2;
    return (
      hex.substring(0, leading + 2) +
      "…" +
      hex.substring(Math.max(hex.length - trailing, last))
    );
  }
}
