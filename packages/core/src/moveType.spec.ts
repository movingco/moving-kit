import { parseMoveType } from "./moveType";

describe("moveType", () => {
  describe("parseType", () => {
    it("simple", () => {
      expect(
        parseMoveType("0x1::Coin::Hello") //??
      ).toEqual({
        module: {
          address: "0x1",
          identifier: "Coin",
        },
        name: "Hello",
      });
    });

    it("multiple generics", () => {
      expect(
        parseMoveType("0x1::Coin::Coin<0x2::Tester::Test, 0x3::Other::Thing>")
      ).toEqual({
        module: {
          address: "0x1",
          identifier: "Coin",
        },
        name: "Coin",
        typeArguments: [
          {
            module: {
              address: "0x2",
              identifier: "Tester",
            },
            name: "Test",
          },
          {
            module: {
              address: "0x3",
              identifier: "Other",
            },
            name: "Thing",
          },
        ],
      });
    });

    it("single generic", () => {
      expect(
        parseMoveType("0x1::Coin::Coin<0x2::Tester::Test>") //??
      ).toEqual({
        module: {
          address: "0x1",
          identifier: "Coin",
        },
        name: "Coin",
        typeArguments: [
          {
            module: {
              address: "0x2",
              identifier: "Tester",
            },
            name: "Test",
          },
        ],
      });
    });

    it("nested generics", () => {
      expect(
        parseMoveType(
          "0x1::Coin::Hello<0x2::Test::Testing<0x3::A::A, 0x4::B::B>>"
        ) //??
      ).toEqual({
        module: {
          address: "0x1",
          identifier: "Coin",
        },
        name: "Hello",
        typeArguments: [
          {
            module: {
              address: "0x2",
              identifier: "Test",
            },
            name: "Testing",
            typeArguments: [
              {
                module: {
                  address: "0x3",
                  identifier: "A",
                },
                name: "A",
              },
              {
                module: {
                  address: "0x4",
                  identifier: "B",
                },
                name: "B",
              },
            ],
          },
        ],
      });
    });

    it("nested complex generics", () => {
      expect(
        parseMoveType(
          "0x1::Coin::Hello<0x2::Test::Testing<0x3::A::A, 0x4::B::B>, 0x3::A::A>"
        ) //??
      ).toEqual({
        module: {
          address: "0x1",
          identifier: "Coin",
        },
        name: "Hello",
        typeArguments: [
          {
            module: {
              address: "0x2",
              identifier: "Test",
            },
            name: "Testing",
            typeArguments: [
              {
                module: {
                  address: "0x3",
                  identifier: "A",
                },
                name: "A",
              },
              {
                module: {
                  address: "0x4",
                  identifier: "B",
                },
                name: "B",
              },
            ],
          },
          {
            module: {
              address: "0x3",
              identifier: "A",
            },
            name: "A",
          },
        ],
      });
    });
  });
});
