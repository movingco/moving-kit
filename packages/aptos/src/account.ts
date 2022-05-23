import type { HexStringLike, Signer } from "@movingco/core";
import { Address, PublicKey } from "@movingco/core";
import { AptosAccount } from "aptos";
import { Buffer } from "buffer/";

/**
 * Backed by a signing key.
 */
export class Account implements Signer {
  readonly address: Address;
  readonly pubKey: PublicKey;

  private _authKeyCached: Address | null = null;

  constructor(readonly account: AptosAccount) {
    this.address = new Address(account.address().hex());
    this.pubKey = new PublicKey(this.account.pubKey().toBuffer());
  }

  /**
   * Loads a {@link Account} from a private (signing) key.
   *
   * @param seed The seed of the private key.
   * @param address The address of the account, in hex.
   * @returns
   */
  static fromSeed(seed: Uint8Array, address?: HexStringLike) {
    return new Account(
      new AptosAccount(
        seed,
        address
          ? typeof address === "string"
            ? address
            : address.hex()
          : undefined
      )
    );
  }

  /**
   * Generates a random {@link Account}.
   * @returns
   */
  static generate(): Account {
    return new Account(new AptosAccount());
  }

  /**
   * Gets the authKey.
   */
  get authKey(): Address {
    return (
      this._authKeyCached ??
      (this._authKeyCached = this.pubKey.toAptosAuthKey())
    );
  }

  signData(buffer: Uint8Array): Promise<Uint8Array> {
    return Promise.resolve(
      this.account.signBuffer(Buffer.from(buffer)).toUint8Array()
    );
  }
}
