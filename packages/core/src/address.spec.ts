import { Address } from "./address.js";

describe("address", () => {
  describe("#equals", () => {
    it("should work with same string", () => {
      expect(Address.ensure("0x1234").equals("0x1234")).toBe(true);
    });

    it("should allow zero pad", () => {
      expect(Address.ensure("0x000001234").equals("0x1234")).toBe(true);
    });

    it("should fail if not equal", () => {
      expect(Address.ensure("0x1234").equals("0x1235")).toBe(false);
    });
  });
});
