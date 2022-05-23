import type { BigintIsh, Token as UToken } from "@ubeswap/token-math";
import {
  parseAmountFromString,
  TokenAmount as UTokenAmount,
} from "@ubeswap/token-math";

import type { ChainId, CoinInfo } from "./coinList";
import type { MoveType } from "./moveType";
import { parseMoveType, renderMoveType } from "./moveType";

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

  /**
   * Creates a Coin from a type.
   *
   * @param chainId
   * @param innerType
   * @param decimals
   * @returns
   */
  static fromType(chainId: ChainId, innerType: string, decimals = 6): Coin {
    const inner = parseMoveType(innerType);
    return new Coin({
      chainId,
      address: innerType,
      name: `${inner.module.identifier}::${inner.name}`,
      symbol: inner.name,
      decimals,
    });
  }

  /**
   * Creates a Coin from a type.
   *
   * @param chainId
   * @param innerType
   * @param decimals
   * @returns
   */
  static fromParsedType(chainId: ChainId, inner: MoveType, decimals = 6): Coin {
    return new Coin({
      chainId,
      address: renderMoveType(inner),
      name: `${inner.module.identifier}::${inner.name}`,
      symbol: inner.name,
      decimals,
    });
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
