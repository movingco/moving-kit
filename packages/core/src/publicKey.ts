import { sha3_256 } from "@movingco/sha3";
import BN from "bn.js";
import { Buffer } from "buffer/index.js";

import { Address } from "./address.js";
import type { HexStringLike } from "./hexString.js";
import { HexString } from "./hexString.js";

/**
 * Value to be converted into public key
 */
export type PublicKeyInitData =
  | number
  | string
  | Buffer
  | Uint8Array
  | Array<number>
  | PublicKeyData;

/**
 * JSON object representation of PublicKey class
 */
export type PublicKeyData = {
  /** @internal */
  _bn: BN;
};

export const PUBLIC_KEY_SIZE = 32;

function isPublicKeyData(value: PublicKeyInitData): value is PublicKeyData {
  return (value as PublicKeyData)._bn !== undefined;
}

/**
 * An ED25519 public key.
 *
 * Based on: <https://github.com/solana-labs/solana-web3.js/blob/master/src/publickey.ts>
 */
export class PublicKey implements HexStringLike {
  /** @internal */
  private _bn: BN;

  /**
   * Create a new PublicKey object
   * @param value ed25519 public key as buffer or base-64 encoded string
   */
  constructor(value: PublicKeyInitData) {
    if (isPublicKeyData(value)) {
      this._bn = value._bn;
    } else {
      if (typeof value === "string") {
        const buffer = Buffer.from(value, "base64");
        if (buffer.length !== 32) {
          throw new Error(
            `Invalid public key input. Expected 32 bytes, got ${buffer.length}`
          );
        }
        this._bn = new BN(buffer);
      } else {
        this._bn = new BN(value);
      }
      if (this._bn.byteLength() > PUBLIC_KEY_SIZE) {
        throw new Error(`Invalid public key input`);
      }
    }
  }

  /**
   * Checks if two publicKeys are equal
   */
  equals(publicKey: PublicKey): boolean {
    return this._bn.eq(publicKey._bn);
  }

  /**
   * Return a {@link HexString} representing this public key.
   */
  toHexString(): HexString {
    return HexString.fromBuffer(this.toBuffer());
  }

  hex(): string {
    return `0x${this.toBuffer().toString("hex")}`;
  }

  /**
   * Return the base-64 representation of the public key
   */
  toBase64(): string {
    return this.toBuffer().toString("base64");
  }

  /**
   * Return the byte array representation of the public key
   */
  toBytes(): Uint8Array {
    return this.toBuffer();
  }

  /**
   * Return the Buffer representation of the public key
   */
  toBuffer(): Buffer {
    const b = Buffer.from(this._bn.toArray());
    if (b.length === PUBLIC_KEY_SIZE) {
      return b;
    }
    const zeroPad = Buffer.alloc(PUBLIC_KEY_SIZE);
    b.copy(zeroPad, PUBLIC_KEY_SIZE - b.length);
    return zeroPad;
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
    const publicKeyBytes = new BN(hexHash, 16).toArray(undefined, 32);
    // Only take the first 20 bytes
    const addressBytes = publicKeyBytes.slice(0, 20);
    return Address.fromUint8Array(Uint8Array.from(addressBytes));
  }

  /**
   * Returns the authKey for the associated account
   * See here for more info: https://aptos.dev/basics/basics-accounts#single-signer-authentication
   */
  toAptosAuthKey(): Address {
    const hash = sha3_256.create();
    hash.update(this.toBytes());
    hash.update("\x00");
    return new Address(hash.hex());
  }
}
