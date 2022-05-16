type ExtensionValue = string | number | boolean | null;

export interface CoinInfo {
  readonly chainId: number;
  readonly address: string;
  readonly name: string;
  readonly decimals: number;
  readonly symbol: string;
  readonly logoURI?: string;
  readonly tags?: string[];
  readonly extensions?: {
    readonly [key: string]: { [key: string]: ExtensionValue } | ExtensionValue;
  };
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

export interface CoinList {
  readonly name: string;
  readonly timestamp: string;
  readonly version: Version;
  /**
   * Named `tokens` for backwards compatibility with the Uniswap standard.
   */
  readonly tokens: CoinInfo[];
  readonly keywords?: string[];
  readonly tags?: Tags;
  readonly logoURI?: string;
}
