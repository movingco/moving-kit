import { zeroPadBuffer } from "./misc.js";

describe("misc", () => {
  describe("zeroPadBuffer", () => {
    it("should pad", () => {
      expect(zeroPadBuffer(new Uint8Array([0x1, 0x2, 0x3]), 5)).toEqual(
        new Uint8Array([0x0, 0x0, 0x1, 0x2, 0x3])
      );
    });

    it("should not pad smaller", () => {
      expect(zeroPadBuffer(new Uint8Array([0x1, 0x2, 0x3]), 1)).toEqual(
        new Uint8Array([0x1, 0x2, 0x3])
      );
    });

    it("should not pad equal", () => {
      expect(zeroPadBuffer(new Uint8Array([0x1, 0x2, 0x3]), 3)).toEqual(
        new Uint8Array([0x1, 0x2, 0x3])
      );
    });
  });
});
