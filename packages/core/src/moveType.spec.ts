import { StructTag } from "./moveType.js";

describe("moveType", () => {
  describe("parseType", () => {
    it("simple", () => {
      expect(StructTag.parse("0x1::Coin::Hello").toJSON()).toEqual(
        new StructTag({
          module: {
            addressHex: "0x1",
            identifier: "Coin",
          },
          name: "Hello",
        }).toJSON()
      );
    });

    it("multiple generics", () => {
      expect(
        StructTag.parse(
          "0x1::Coin::Coin<0x2::Tester::Test, 0x3::Other::Thing>"
        ).toJSON()
      ).toEqual(
        new StructTag({
          module: {
            addressHex: "0x1",
            identifier: "Coin",
          },
          name: "Coin",
          typeParams: [
            {
              module: {
                addressHex: "0x2",
                identifier: "Tester",
              },
              name: "Test",
            },
            {
              module: {
                addressHex: "0x3",
                identifier: "Other",
              },
              name: "Thing",
            },
          ],
        }).toJSON()
      );
    });

    it("single generic", () => {
      expect(
        StructTag.parse("0x1::Coin::Coin<0x2::Tester::Test>").toJSON()
      ).toEqual(
        new StructTag({
          module: {
            addressHex: "0x1",
            identifier: "Coin",
          },
          name: "Coin",
          typeParams: [
            {
              module: {
                addressHex: "0x2",
                identifier: "Tester",
              },
              name: "Test",
            },
          ],
        }).toJSON()
      );
    });

    it("nested generics", () => {
      expect(
        StructTag.parse(
          "0x1::Coin::Hello<0x2::Test::Testing<0x3::A::A, 0x4::B::B>>"
        ).toJSON()
      ).toEqual(
        new StructTag({
          module: {
            addressHex: "0x1",
            identifier: "Coin",
          },
          name: "Hello",
          typeParams: [
            {
              module: {
                addressHex: "0x2",
                identifier: "Test",
              },
              name: "Testing",
              typeParams: [
                {
                  module: {
                    addressHex: "0x3",
                    identifier: "A",
                  },
                  name: "A",
                },
                {
                  module: {
                    addressHex: "0x4",
                    identifier: "B",
                  },
                  name: "B",
                },
              ],
            },
          ],
        }).toJSON()
      );
    });

    it("nested complex generics", () => {
      expect(
        StructTag.parse(
          "0x1::Coin::Hello<0x2::Test::Testing<0x3::A::A, 0x4::B::B>, 0x3::A::A>"
        ).toJSON() //??
      ).toEqual(
        new StructTag({
          module: {
            addressHex: "0x1",
            identifier: "Coin",
          },
          name: "Hello",
          typeParams: [
            {
              module: {
                addressHex: "0x2",
                identifier: "Test",
              },
              name: "Testing",
              typeParams: [
                {
                  module: {
                    addressHex: "0x3",
                    identifier: "A",
                  },
                  name: "A",
                },
                {
                  module: {
                    addressHex: "0x4",
                    identifier: "B",
                  },
                  name: "B",
                },
              ],
            },
            {
              module: {
                addressHex: "0x3",
                identifier: "A",
              },
              name: "A",
            },
          ],
        }).toJSON()
      );
    });
  });

  describe("fullyQualifiedName", () => {
    it("works without generics", () => {
      const name = "0x1::Coin::Coin";
      expect(StructTag.parse(name).format()).toEqual(name);
    });

    it("works with generics", () => {
      const name = "0x1::Coin::Coin<0x2::Tester::Test>";
      expect(StructTag.parse(name).format()).toEqual(name);
    });

    it("works with nested generics", () => {
      const name =
        "0x1::Coin::Coin<0x2::A::B, 0x3::B::C<0x4::D::E, 0x5::F::G>>";
      expect(StructTag.parse(name).format()).toEqual(name);
    });
  });
});
