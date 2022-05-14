import { HexString } from "@moving/core";
import { pbkdf2 } from "pbkdf2";
import { randomBytes, secretbox } from "tweetnacl";

export const STRING_ENCODING = "utf-8";

/**
 * An encrypted string.
 */
export interface EncryptedString {
  encrypted: string;
  nonce: string;
  kdf: string;
  salt: string;
  iterations: number;
  digest: string;
}

export const deriveEncryptionKey = async (
  password: string,
  salt: Uint8Array,
  iterations: number,
  digest: string
): Promise<Buffer> => {
  return new Promise((resolve, reject) =>
    pbkdf2(
      password,
      salt,
      iterations,
      secretbox.keyLength,
      digest,
      (err, key) => (err ? reject(err) : resolve(key))
    )
  );
};

/**
 * Encrypts a mnemonic and seed with a password via PBKDF2.
 *
 * @param mnemonic
 * @param seed
 * @param password
 */
export const encryptString = async (
  data: string,
  password: string
): Promise<EncryptedString> => {
  const salt = randomBytes(16);
  const kdf = "pbkdf2";
  const iterations = 100_000;
  const digest = "sha256";
  const key = await deriveEncryptionKey(password, salt, iterations, digest);
  const nonce = randomBytes(secretbox.nonceLength);
  const encrypted = secretbox(Buffer.from(data, STRING_ENCODING), nonce, key);

  return {
    encrypted: HexString.fromUint8Array(encrypted).hex(),
    nonce: HexString.fromUint8Array(nonce).hex(),
    kdf,
    salt: HexString.fromUint8Array(salt).hex(),
    iterations,
    digest,
  };
};

export const decryptString = async (
  data: EncryptedString,
  password: string
): Promise<string> => {
  const {
    encrypted: encodedEncrypted,
    nonce: encodedNonce,
    salt: encodedSalt,
    iterations,
    digest,
  } = data;
  const encrypted = HexString.ensure(encodedEncrypted);
  const nonce = HexString.ensure(encodedNonce);
  const salt = HexString.ensure(encodedSalt);
  const key = await deriveEncryptionKey(
    password,
    salt.toUint8Array(),
    iterations,
    digest
  );
  const plaintext = secretbox.open(
    encrypted.toUint8Array(),
    nonce.toUint8Array(),
    key
  );
  if (!plaintext) {
    throw new Error("Incorrect password");
  }
  return Buffer.from(plaintext).toString(STRING_ENCODING);
};
