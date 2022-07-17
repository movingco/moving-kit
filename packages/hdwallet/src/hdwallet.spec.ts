import "./types.d";
import "bip39-light";

import { generateMnemonic, HDWallet } from "./hdwallet.js";

describe("HDWallet", () => {
  it("should derive", () => {
    const { wallet } = HDWallet.generate();
    expect(wallet.derivePath("0'/0'")).toStrictEqual(wallet.deriveIndex());

    // This one shouldn't work because it is different
    expect(wallet.derivePath("0'/1'")).not.toStrictEqual(wallet.deriveIndex());
  });

  it("makes mnemonics", () => {
    const mnemonic = generateMnemonic();
    expect(mnemonic.split(" ").length).toEqual(12);
  });
});
