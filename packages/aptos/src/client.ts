import { default as fetchAdapter } from "@vespaiach/axios-fetch-adapter";
import { AptosClient } from "aptos";

/**
 * Creates an {@link AptosClient} with an Axios adapter that uses `fetch` instead of XHR.
 * @param fullNodeURL
 * @returns
 */
export const createAptosClient = (fullNodeURL: string) =>
  new AptosClient(fullNodeURL, {
    adapter: typeof fetch !== "undefined" ? fetchAdapter : undefined,
  });
