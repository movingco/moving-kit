type ExtensionValue = string | number | boolean | null;

export enum ChainId {
  AptosMainnet = 200,
  AptosDevnet = 201,
  SuiMainnet = 300,
  SuiDevnet = 301,
}

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
  readonly tokens: CoinInfo[];
  readonly keywords?: string[];
  readonly tags?: Tags;
  readonly logoURI?: string;
}
