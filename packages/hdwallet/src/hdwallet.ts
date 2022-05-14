import * as bip39 from "bip39-light";
import { derivePath } from "ed25519-hd-key";
import invariant from "tiny-invariant";

/**
 * Coin ID for Diem-like environments.
 *
 * @todo add to <https://github.com/satoshilabs/slips/blob/master/slip-0044.md>
 */
export const BIP32_COIN_ID = 9203;

/**
 * Base wallet derivation path.
 */
export const BASE_DERIVATION_PATH = `m/44'/${BIP32_COIN_ID}'`;

/**
 * Default strength of a BIP39 HDWallet, in bits.
 */
export const DEFAULT_STRENGTH = 128;

/**
 * BIP39 mnemonic phrase.
 */
export type Mnemonic = string;

/**
 * Mnemonic and seed combo.
 */
export interface MnemonicAndSeed {
  mnemonic: Mnemonic;
  seed: Uint8Array;
}

/**
 * Generates a new BIP39 mnemonic.
 *
 * @param strength
 * @returns
 */
export const generateMnemonic = (
  strength: number = DEFAULT_STRENGTH
): Mnemonic => {
  return bip39.generateMnemonic(strength);
};

/**
 * Generate a mnemonic and seed.
 * @param strength
 * @returns
 */
export const generateMnemonicAndSeed = (
  strength: number = DEFAULT_STRENGTH
): MnemonicAndSeed => {
  const mnemonic = generateMnemonic(strength);
  const seed = bip39.mnemonicToSeed(mnemonic);
  return { mnemonic, seed };
};
/**
 * A BIP32 HDWallet.
 */
export class HDWallet {
  constructor(readonly seed: Buffer) {}

  /**
   * Generates a new HDWallet.
   * @param strength
   * @returns
   */
  static generate(strength: number = DEFAULT_STRENGTH): {
    mnemonic: Mnemonic;
    wallet: HDWallet;
  } {
    const { mnemonic, seed } = generateMnemonicAndSeed(strength);
    return { mnemonic, wallet: new HDWallet(Buffer.from(seed)) };
  }

  static fromMnemonic(mnemonic: string): HDWallet {
    const seed = bip39.mnemonicToSeed(mnemonic);
    return new HDWallet(seed);
  }

  /**
   * Derives a path on the HDWallet. You likely don't want to use this.
   * @param path
   * @returns
   */
  deriveArbitraryPath(path: string): Buffer {
    const derivedSeed = derivePath(path, this.seed.toString("hex")).key;
    invariant(derivedSeed, "derived seed");
    return derivedSeed;
  }

  /**
   * Derives a child path.
   * @param path
   * @returns
   */
  derivePath(path: string): Buffer {
    return this.deriveArbitraryPath(`${BASE_DERIVATION_PATH}/${path}`);
  }

  /**
   * Derives an account at a given index.
   * @param accountIndex
   * @returns
   */
  deriveIndex(accountIndex = 0): Buffer {
    // We align on BIP44 like the Ledger support in Solana
    // All path components are hardened (i.e with ')
    // https://github.com/solana-labs/ledger-app-solana/blob/c66543976aa8171be6ea0c0771b1e9447a857c40/examples/example-sign.js#L57-L83v
    //
    // m/44'/501'/${accountIndex}'/0'
    //
    // m / purpose' / coin_type' / account'    / change / address_index
    // m / 44'      / 501'       / [VARIABLE]' / 0'      / [ABSENT]
    return this.derivePath(`${accountIndex}'/0'`);
  }
}
