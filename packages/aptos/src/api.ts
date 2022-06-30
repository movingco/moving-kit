import { Accounts, HttpClient, Transactions } from "@movingco/aptos-api";
import { default as fetchAdapter } from "@vespaiach/axios-fetch-adapter";
import type { AxiosRequestConfig } from "axios";

import { APTOS_DEVNET_FULL_NODE_URL } from "./constants.js";

export type APIClientConfig = Omit<
  AxiosRequestConfig,
  "data" | "cancelToken" | "method"
>;

/**
 * Lightweight alternative wrapper to the official Aptos client.
 */
export class AptosAPI {
  readonly client: HttpClient;

  readonly accounts: Accounts;
  readonly transactions: Transactions;

  constructor(readonly nodeUrl: string, config: APIClientConfig = {}) {
    // `withCredentials` ensures cookie handling
    this.client = new HttpClient({
      withCredentials: false,
      baseURL: nodeUrl,
      validateStatus: () => true, // Don't explode here on error responses; let our code handle it
      adapter: fetchAdapter,
      ...config,
    });

    this.accounts = new Accounts(this.client);
    this.transactions = new Transactions(this.client);
  }
}

/**
 * Aptos network configuration.
 */
export interface NetworkConfig {
  /**
   * Name of the network.
   */
  name: string;
  /**
   * URL to the Aptos node. This is also the network.
   */
  nodeUrl: string;
}

export const APTOS_DEVNET: NetworkConfig = {
  name: "Devnet",
  nodeUrl: APTOS_DEVNET_FULL_NODE_URL,
};
