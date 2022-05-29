import type { Buffer } from "buffer/";

import type { MaybeHexString } from "./hexString.js";
import { HexString } from "./hexString.js";

/**
 * An address, backed by a hex string.
 */
export class Address extends HexString {
  static override ensure(hexString: MaybeHexString): Address {
    if (hexString instanceof Address) {
      return hexString;
    }
    if (typeof hexString === "string") {
      return new Address(hexString);
    }
    return new Address(hexString.hex());
  }

  static override fromBuffer(buffer: Buffer): Address {
    return Address.ensure(HexString.fromBuffer(buffer));
  }

  static override fromUint8Array(arr: Uint8Array): Address {
    return Address.ensure(HexString.fromUint8Array(arr));
  }

  toJSON() {
    return {
      __typename: "Address",
      hex: this.hex(),
    };
  }
}
