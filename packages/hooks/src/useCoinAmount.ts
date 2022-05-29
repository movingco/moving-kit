import type { Coin } from "@movingco/core";
import { CoinAmount, mapN } from "@movingco/core";
import { useMemo } from "react";

/**
 * Parses a {@link CoinAmount}.
 * @param token The token.
 * @param valueStr The string representation of the amount.
 * @returns
 */
export const useCoinAmount = (
  token: Coin | null | undefined,
  valueStr: string | null | undefined
): CoinAmount | null | undefined => {
  return useMemo(() => {
    return mapN(
      (token, valueStr) => {
        if (!valueStr) {
          return null;
        }
        try {
          return CoinAmount.parse(token, valueStr);
        } catch (e) {
          return null;
        }
      },
      token,
      valueStr
    );
  }, [token, valueStr]);
};
