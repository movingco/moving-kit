import type { HexString } from "./hexString";

/**
 * Can sign arbitrary hex strings.
 */
export interface Signer {
  /**
   * Address of the signer.
   */
  get address(): HexString;

  /**
   * Signs arbitrary data.
   * @param buffer
   */
  signData(buffer: Uint8Array): Promise<Uint8Array>;
}
