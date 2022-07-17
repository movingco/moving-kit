import type { Buffer } from "buffer/index.js";

import type { MaybeHexString } from "./hexString.js";
import { HexString } from "./hexString.js";

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
  equals(other: MaybeHexString): boolean {
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
