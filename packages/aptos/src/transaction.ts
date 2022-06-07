import { sleep } from "@movingco/core";
import type { AptosClient, Types } from "aptos";
import { raiseForStatus } from "aptos";
import type { AxiosResponse } from "axios";

/**
 * Helper for fetching a transaction from the API.
 */
export const fetchTransaction = async (
  aptos: AptosClient,
  txnHash: Types.HexEncodedBytes
): Promise<Types.Transaction | null> => {
  const response = await aptos.transactions.getTransaction(txnHash);
  if (response.status === 404) {
    return null;
  }
  raiseForStatus(
    200,
    response as AxiosResponse<Types.Transaction, Types.AptosError>,
    txnHash
  );
  return response.data;
};

/**
 * Attempts to confirm a transaction via polling.
 * @param aptos
 * @param txnHash
 * @param retryIntervalMs interval between retries to fetch the transaction
 * @returns
 */
export const confirmTransaction = async (
  aptos: AptosClient,
  txnHash: Types.HexEncodedBytes,
  retryIntervalMs = 500
): Promise<Types.Transaction> => {
  let count = 0;
  let tx = await fetchTransaction(aptos, txnHash);
  while (!tx || tx.type === "pending_transaction") {
    await sleep(retryIntervalMs);
    count += 1;
    if (count >= 10) {
      throw new Error(`Waiting for transaction ${txnHash} timed out!`);
    }
    tx = await fetchTransaction(aptos, txnHash);
  }
  return tx;
};
