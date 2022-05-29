import type { SerializableHexString } from "@movingco/core";
import { encodeU32 } from "@movingco/leb128";
import { Buffer } from "buffer/";
import sha3 = require("js-sha3");
import type { Account } from "./account.js";

const { sha3_256 } = sha3;

const SALT = "APTOS::RawTransactionWithData";

/**
 * Constructs a multi-agent signing message.
 *
 * @param original
 * @param secondarySignerAccounts
 * @returns
 */
export const getMultiAgentSigningMessage = (
  original: SerializableHexString,
  secondarySignerAccounts: Account[]
): Uint8Array => {
  const hash = sha3_256.create();
  hash.update(Buffer.from(SALT));
  const prefix = new Uint8Array(hash.arrayBuffer());
  return Uint8Array.from([
    ...prefix,
    ...encodeU32(0),
    ...original.toUint8Array().slice(32),
    ...encodeU32(secondarySignerAccounts.length),
    ...secondarySignerAccounts.flatMap((ss) => [...ss.address.toUint8Array()]),
  ]);
};
