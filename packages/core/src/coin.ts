import type { BigintIsh, Token as UToken } from "@ubeswap/token-math";
import {
  parseAmountFromString,
  TokenAmount as UTokenAmount,
} from "@ubeswap/token-math";

import type { CoinInfo } from "./coinList";

/**
 * An Aptos Coin.
 */
export class Coin implements UToken<Coin> {
  constructor(readonly info: CoinInfo) {}

  get name(): string {
    return this.info.name;
  }

  get symbol(): string {
    return this.info.symbol;
  }

  get decimals(): number {
    return this.info.decimals;
  }

  /**
   * The type of the token. I.e. for a `Coin<T>`, this is `T`.
   */
  get address(): string {
    return this.info.address;
  }

  get icon(): string | undefined {
    return this.info.logoURI;
  }

  equals(other: Coin): boolean {
    return this.address === other.address;
  }

  toString(): string {
    return `Token[address=${this.address}, decimals=${this.decimals}]`;
  }
}

/**
 * A positive quantity of Aptos coins.
 */
export class CoinAmount extends UTokenAmount<Coin> {
  new(token: Coin, amount: BigintIsh): this {
    return new CoinAmount(token, amount) as this;
  }

  static parse(token: Coin, amount: string) {
    return new CoinAmount(token, parseAmountFromString(token, amount));
  }
}
