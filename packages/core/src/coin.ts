import type { BigintIsh, Token as UToken } from "@ubeswap/token-math";
import {
  parseAmountFromString,
  Price as UPrice,
  TokenAmount as UTokenAmount,
} from "@ubeswap/token-math";

import type { ChainId, CoinInfo } from "./coinList";
import { StructTag } from "./moveType";

/**
 * A Coin.
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
    return `Coin[address=${this.address}, decimals=${this.decimals}]`;
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
    const inner = StructTag.parse(innerType);
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
  static fromParsedType(
    chainId: ChainId,
    inner: StructTag,
    decimals = 6
  ): Coin {
    return new Coin({
      chainId,
      address: inner.format(),
      name: `${inner.name} (${inner.module.identifier})`,
      symbol: inner.name,
      decimals,
    });
  }
}

/**
 * A positive quantity of coins.
 */
export class CoinAmount extends UTokenAmount<Coin> {
  /**
   * @inheritdoc
   */
  new(token: Coin, amount: BigintIsh): this {
    return new CoinAmount(token, amount) as this;
  }

  /**
   * Alias for {@link token}.
   */
  get coin(): Coin {
    return this.token;
  }

  /**
   * Parses a {@link CoinAmount} from a string.
   * @param token
   * @param amount
   * @returns
   */
  static parse(token: Coin, amount: string): CoinAmount {
    return new CoinAmount(
      token,
      parseAmountFromString(token, amount, ".", ",")
    );
  }
}

export class Price extends UPrice<Coin> {
  new(
    baseCurrency: Coin,
    quoteCurrency: Coin,
    denominator: BigintIsh,
    numerator: BigintIsh
  ): this {
    return new Price(
      baseCurrency,
      quoteCurrency,
      denominator,
      numerator
    ) as this;
  }
}
