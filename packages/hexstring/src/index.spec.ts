import { HexString } from "./index.js";

describe("HexString", () => {
  describe("#equals", () => {
    it("should work with same string", () => {
      expect(HexString.ensure("0x1234").equals("0x1234")).toBe(true);
    });

    it("should not allow zero pad", () => {
      expect(HexString.ensure("0x000001234").equals("0x1234")).toBe(false);
    });

    it("should fail if not equal", () => {
      expect(HexString.ensure("0x1234").equals("0x1235")).toBe(false);
    });
  });

  describe("#toUint8Array", () => {
    expect(HexString.ensure("0x1234").toUint8Array()).toEqual(
      new Uint8Array([0x12, 0x34])
    );
  });
});
