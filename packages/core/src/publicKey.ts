import { bytesToHex, hexToBytes } from "@movingco/bytes-to-hex";
import type { HexStringLike } from "@movingco/hexstring";
import { HexString } from "@movingco/hexstring";
import { sha3_256 } from "@movingco/sha3";

import { Address } from "./address.js";
import { zeroPadBuffer } from "./misc.js";

export const byteArrayEquals = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

/**
 * Value to be converted into public key
 */
export type PublicKeyInitData = string | Uint8Array | number[] | PublicKeyData;

/**
 * JSON object representation of PublicKey class
 */
export type PublicKeyData = {
  /** @internal */
  _buffer: Uint8Array;
};

export const PUBLIC_KEY_SIZE = 32;

function isPublicKeyData(value: PublicKeyInitData): value is PublicKeyData {
  return (value as PublicKeyData)._buffer !== undefined;
}

/**
 * Gets the {@link Buffer} of the {@link PublicKeyInitData}.
 * @param value
 * @returns
 */
const parsePublicKeyInitDataUnchecked = (
  value: PublicKeyInitData
): Uint8Array => {
  if (isPublicKeyData(value)) {
    return value._buffer;
  }
  if (typeof value === "string") {
    const buffer = hexToBytes(value);
    if (buffer.length !== PUBLIC_KEY_SIZE) {
      throw new Error(
        `Invalid public key input. Expected ${PUBLIC_KEY_SIZE} bytes, got ${buffer.length}`
      );
    }
    return buffer;
  } else if (value instanceof Uint8Array) {
    return value;
  } else if (Array.isArray(value)) {
    return Uint8Array.from(value);
  }
  return Uint8Array.from(value);
};

/**
 * An ED25519 public key.
 *
 * Based on: <https://github.com/solana-labs/solana-web3.js/blob/master/src/publickey.ts>
 */
export class PublicKey implements HexStringLike {
  /**
   * Buffer backing the {@link PublicKey}.
   */
  private readonly _buffer: Uint8Array;

  /**
   * Create a new PublicKey object
   * @param value ed25519 public key as buffer or hex encoded string
   */
  constructor(value: PublicKeyInitData) {
    const bufferUnchecked = parsePublicKeyInitDataUnchecked(value);
    if (bufferUnchecked.length > PUBLIC_KEY_SIZE) {
      throw new Error(`Invalid public key input`);
    }
    this._buffer = zeroPadBuffer(bufferUnchecked, PUBLIC_KEY_SIZE);
  }

  /**
   * Checks if two publicKeys are equal
   */
  equals(publicKey: PublicKey): boolean {
    return byteArrayEquals(this._buffer, publicKey._buffer);
  }

  /**
   * Return a {@link HexString} representing this public key.
   */
  toHexString(): HexString {
    return new HexString(this.hex());
  }

  hex(): string {
    return `0x${bytesToHex(this._buffer)}`;
  }

  /**
   * Return the (copied) byte array representation of the public key
   */
  toBytes(): Uint8Array {
    return this._buffer.slice();
  }

  /**
   * Return the hex representation of the public key
   */
  toString(): string {
    return this.hex();
  }

  /**
   * Return the Sui address associated with this public key
   */
  toSuiAddress(): Address {
    const hexHash = sha3_256(this.toBytes());
    const publicKeyBytes = zeroPadBuffer(hexToBytes(hexHash), PUBLIC_KEY_SIZE);
    // Only take the first 20 bytes
    const addressBytes = publicKeyBytes.slice(0, 20);
    return Address.fromUint8Array(Uint8Array.from(addressBytes));
  }

  /**
   * Returns the authKey for the associated account
   * See here for more info: <https://aptos.dev/basics/basics-accounts#single-signer-authentication>
   */
  toAptosAuthKey(): Address {
    const hash = sha3_256.create();
    hash.update(this.toBytes()).update("\x00");
    return new Address(hash.hex());
  }

  toJSON() {
    return {
      __typename: "PublicKey",
      hex: this.hex(),
    };
  }
}
