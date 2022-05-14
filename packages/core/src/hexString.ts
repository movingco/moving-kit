// Taken from <https://github.com/aptos-labs/aptos-core/blob/main/ecosystem/typescript/sdk/src/hex_string.ts>

import invariant from "tiny-invariant";
import { sha3_256 } from "js-sha3";

export type MaybeHexString = HexString | string;

export class HexString {
  /// We want to make sure this hexString has the `0x` hex prefix
  private readonly hexString: string;

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
    return hexString;
  }

  constructor(hexString: string) {
    if (hexString.startsWith("0x")) {
      this.hexString = hexString;
    } else {
      this.hexString = `0x${hexString}`;
    }
  }

  hex(): string {
    return this.hexString;
  }

  noPrefix(): string {
    return this.hexString.slice(2);
  }

  toString(): string {
    return this.hex();
  }

  toShortString(): string {
    const trimmed = this.hexString.replace(/^0x0*/, "");
    return `0x${trimmed}`;
  }

  toBuffer(): Buffer {
    return Buffer.from(this.noPrefix(), "hex");
  }

  toUint8Array(): Uint8Array {
    return Uint8Array.from(this.toBuffer());
  }

  getChecksumAddress(): string {
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
}
