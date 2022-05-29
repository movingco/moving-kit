import type { Address } from "./address.js";

/**
 * Can sign arbitrary hex strings.
 */
export interface Signer {
  /**
   * Address of the signer.
   */
  get address(): Address;

  /**
   * Signs arbitrary data.
   * @param buffer
   */
  signData(buffer: Uint8Array): Promise<Uint8Array>;
}
