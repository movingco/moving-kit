export enum ChainId {
  AptosMainnet = 200,
  AptosDevnet = 201,
  SuiMainnet = 300,
  SuiDevnet = 301,
}

export interface MovingExtensions {
  readonly website?: string;
  /**
   * The CoinGecko API ID of the coin.
   */
  readonly coingeckoId?: string;
}

export interface CoinInfo<E = MovingExtensions> {
  readonly chainId: number;
  readonly address: string;
  readonly name: string;
  readonly decimals: number;
  readonly symbol: string;
  readonly logoURI?: string;
  readonly tags?: readonly string[];
  readonly extensions?: E;
}

export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export interface Tags {
  readonly [tagId: string]: {
    readonly name: string;
    readonly description: string;
  };
}

/**
 * List of known coins. Follows the Uniswap token list standard.
 */
export interface CoinList {
  readonly name: string;
  readonly timestamp: string;
  readonly version: Version;
  /**
   * Named `tokens` for backwards compatibility with the Uniswap standard.
   */
  readonly tokens: readonly CoinInfo<MovingExtensions>[];
  readonly keywords?: readonly string[];
  readonly tags?: Tags;
  readonly logoURI?: string;
}
