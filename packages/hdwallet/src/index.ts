import { HexString } from "@movingco/core";

import type { EncryptedString } from "./encryption";
import { decryptString, encryptString } from "./encryption";
import type { MnemonicAndSeed } from "./hdwallet";

export * from "./encryption";
export * from "./hdwallet";

/**
 * Encrypts a mnemonic and seed with a password via PBKDF2.
 *
 * @param mnemonic
 * @param seed
 * @param password
 */
export const encryptMnemonicAndSeed = async (
  { mnemonic, seed }: MnemonicAndSeed,
  password: string
): Promise<EncryptedString> => {
  const seedHex = HexString.fromUint8Array(seed).hex();
  const plaintext = JSON.stringify({ mnemonic, seed: seedHex });
  return encryptString(plaintext, password);
};

/**
 * Decrypts an {@link EncryptedString} with the given password.
 * @param data
 * @param password
 * @returns
 */
export const decryptMnemonicAndSeed = async (
  data: EncryptedString,
  password: string
): Promise<MnemonicAndSeed> => {
  const decodedPlaintext = await decryptString(data, password);
  const { mnemonic, seed } = JSON.parse(decodedPlaintext) as {
    mnemonic: string;
    seed: string;
  };
  return {
    mnemonic,
    seed: HexString.ensure(seed).toUint8Array(),
  };
};
