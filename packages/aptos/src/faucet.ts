/** Faucet creates and funds accounts. This is a thin wrapper around that. */
import type { HexEncodedBytes } from "@movingco/aptos-api";
import type { MaybeHexString } from "@movingco/core";
import { HexString } from "@movingco/core";
import { default as fetchAdapter } from "@vespaiach/axios-fetch-adapter";
import type { AptosClientConfig } from "aptos";
import { AptosClient, raiseForStatus } from "aptos";
import { default as axios } from "axios";

export class FaucetClient extends AptosClient {
  faucetUrl: string;

  constructor(
    nodeUrl: string,
    faucetUrl: string,
    readonly config?: AptosClientConfig
  ) {
    super(nodeUrl, config);
    this.faucetUrl = faucetUrl;
  }

  /** This creates an account if it does not exist and mints the specified amount of
   coins into that account */
  async fundAccount(
    address: MaybeHexString,
    amount: number
  ): Promise<HexEncodedBytes[]> {
    const url = `${
      this.faucetUrl
    }/mint?amount=${amount}&address=${HexString.ensure(address).noPrefix()}`;
    const response = await axios.post<Array<string>>(
      url,
      {},
      { validateStatus: () => true, adapter: fetchAdapter }
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    raiseForStatus(200, response);

    return response.data;
  }
}
