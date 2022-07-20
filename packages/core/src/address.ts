import type { MaybeHexString } from "@movingco/hexstring";
import { HexString } from "@movingco/hexstring";
import { sha3_256 } from "@movingco/sha3";
import type { Buffer } from "buffer/index.js";
import { default as invariant } from "tiny-invariant";

/**
 * An address, backed by a hex string.
 *
 * This type is normalized.
 */
export class Address extends HexString {
  /**
   * Creates a new Address from a hex string.
   * @param raw
   */
  constructor(raw: string) {
    super(HexString.ensure(raw).toShortString().toLowerCase());
  }

  /**
   * Create a new Address object.
   */
  static override ensure(hexString: MaybeHexString): Address {
    if (hexString instanceof Address) {
      return hexString;
    }
    return new Address(
      typeof hexString === "string" ? hexString : hexString.hex()
    );
  }

  static override fromBuffer(buffer: Buffer): Address {
    return Address.ensure(HexString.fromBuffer(buffer));
  }

  static override fromUint8Array(arr: Uint8Array): Address {
    return Address.ensure(HexString.fromUint8Array(arr));
  }

  /**
   * Returns true if this address is equivalent to the other address.
   *
   * @param other
   * @returns
   */
  override equals(other: MaybeHexString): boolean {
    // hex() is normalized
    return this.hex() === Address.ensure(other).hex();
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

  toJSON() {
    return {
      __typename: "Address",
      hex: this.hex(),
    };
  }
}
