import type { HexStringLike } from "@movingco/hexstring";
import { HexString } from "@movingco/hexstring";
import { sha3_256 } from "@movingco/sha3";
import { Buffer } from "buffer/index.js";

import { Address } from "./address.js";

/**
 * Value to be converted into public key
 */
export type PublicKeyInitData =
  | string
  | Buffer
  | Uint8Array
  | number[]
  | PublicKeyData;

/**
 * JSON object representation of PublicKey class
 */
export type PublicKeyData = {
  /** @internal */
  _buffer: Buffer;
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
const parsePublicKeyInitDataUnchecked = (value: PublicKeyInitData): Buffer => {
  if (isPublicKeyData(value)) {
    return value._buffer;
  }
  if (typeof value === "string") {
    const buffer = Buffer.from(value, "base64");
    if (buffer.length !== PUBLIC_KEY_SIZE) {
      throw new Error(
        `Invalid public key input. Expected ${PUBLIC_KEY_SIZE} bytes, got ${buffer.length}`
      );
    }
    return buffer;
  } else if (value instanceof Buffer) {
    return value;
  } else if (Array.isArray(value)) {
    return Buffer.from(Uint8Array.from(value));
  }
  return Buffer.from(value);
};

const zeroPadBufferForPubkey = (buffer: Buffer): Buffer => {
  if (buffer.length === PUBLIC_KEY_SIZE) {
    return buffer;
  }
  const zeroPad = Buffer.alloc(PUBLIC_KEY_SIZE);
  buffer.copy(zeroPad, PUBLIC_KEY_SIZE - buffer.length);
  return buffer;
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
  private readonly _buffer: Buffer;

  /**
   * Create a new PublicKey object
   * @param value ed25519 public key as buffer or base-64 encoded string
   */
  constructor(value: PublicKeyInitData) {
    const bufferUnchecked = parsePublicKeyInitDataUnchecked(value);
    if (bufferUnchecked.length > PUBLIC_KEY_SIZE) {
      throw new Error(`Invalid public key input`);
    }
    this._buffer = zeroPadBufferForPubkey(bufferUnchecked);
  }

  /**
   * Checks if two publicKeys are equal
   */
  equals(publicKey: PublicKey): boolean {
    return this._buffer.equals(publicKey._buffer);
  }

  /**
   * Return a {@link HexString} representing this public key.
   */
  toHexString(): HexString {
    return new HexString(this.hex());
  }

  hex(): string {
    return `0x${this._buffer.toString("hex")}`;
  }

  /**
   * Return the base-64 representation of the public key
   */
  toBase64(): string {
    return this._buffer.toString("base64");
  }

  /**
   * Return the byte array representation of the public key
   */
  toBytes(): Uint8Array {
    return this.toBuffer();
  }

  /**
   * Return the (cloned) Buffer representation of the public key
   */
  toBuffer(): Buffer {
    // cloned
    return Buffer.from(this._buffer);
  }

  /**
   * Return the base-64 representation of the public key
   */
  toString(): string {
    return this.toBase64();
  }

  /**
   * Return the Sui address associated with this public key
   */
  toSuiAddress(): Address {
    const hexHash = sha3_256(this.toBytes());
    const publicKeyBytes = zeroPadBufferForPubkey(Buffer.from(hexHash, "hex"));
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
