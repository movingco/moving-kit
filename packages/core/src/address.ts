import { bytesToHex } from "@movingco/bytes-to-hex";
import type { MaybeHexString } from "@movingco/hexstring";
import { HexString, trimLeadingZeros } from "@movingco/hexstring";
import { sha3_256 } from "@movingco/sha3";
import { default as invariant } from "tiny-invariant";

import { zeroPadBuffer } from "./misc.js";

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

  static override fromBuffer(buffer: Uint8Array): Address {
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

  toJSON() {
    return {
      __typename: "Address",
      hex: this.hex(),
    };
  }
}

/**
 * Returns the checksum version of an address.
 * @returns
 */
export const checksumAddress = (address: Address): string => {
  const bytes = zeroPadBuffer(address.toUint8Array(), 32);
  const chars = bytesToHex(bytes).split("");

  const hash = sha3_256.create();
  hash.update(bytes);

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
  return `0x${trimLeadingZeros(chars.join(""))}`;
};

/**
 * Shortened version of an address as a checksum address.
 * @param leading
 * @param trailing
 * @returns
 */
export const shortenAddress = (
  address: Address,
  leading = 5,
  trailing = 3
): string => {
  const hex = checksumAddress(address);
  const last = leading + 2;
  return (
    hex.substring(0, leading + 2) +
    "…" +
    hex.substring(Math.max(hex.length - trailing, last))
  );
};
