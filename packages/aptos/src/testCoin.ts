import type { CoinInfo } from "@movingco/core";
import { ChainId, Coin, CoinAmount } from "@movingco/core";

const TEST_COIN_INFO: CoinInfo = {
  name: "Aptos",
  symbol: "APTOS",
  logoURI:
    "https://raw.githubusercontent.com/aptosis/aptosis-coin-list/master/assets/devnet/apt.svg",
  decimals: 4,
  address: "0x1::TestCoin::TestCoin",
  chainId: ChainId.AptosDevnet,
};

export const TEST_COIN = new Coin(TEST_COIN_INFO);

export const ZERO_TEST_COINS = new CoinAmount(TEST_COIN, 0);
