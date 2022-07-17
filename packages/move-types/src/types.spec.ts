import type { AddressHex, MoveStructTagId } from "./types.js";

describe("types", () => {
  it("can generate types", () => {
    type ConstructedType = MoveStructTagId<
      "0x1",
      "Tester",
      "Test",
      [
        MoveStructTagId<
          "0x1",
          "Coin",
          "Coin",
          [MoveStructTagId<"0x323", "MyModule", "MyStruct">]
        >
      ]
    >;
    // should compile
    const _myValue: ConstructedType =
      "0x1::Tester::Test<0x1::Coin::Coin<0x323::MyModule::MyStruct>>";
  });

  it("can parse addresses", () => {
    type AddressOf<T extends MoveStructTagId> = T extends MoveStructTagId<
      infer A
    >
      ? A
      : never;

    const _0x1: AddressOf<"0x1::Tester::Test<0x1::Coin::Coin<0x323::MyModule::MyStruct>>"> =
      "0x1";

    // Type '"0x2"' is not assignable to type '"0x1"'.
    // const _0x2: AddressOf<"0x1::Tester::Test<0x1::Coin::Coin<0x323::MyModule::MyStruct>>"> =
    //   "0x2";
  });

  it("can parse struct names", () => {
    type NameOf<T extends MoveStructTagId> = T extends MoveStructTagId<
      AddressHex,
      string,
      infer N
    >
      ? N
      : never;
    const _test: NameOf<"0x1::Tester::Test"> = "Test";

    // fails with Type '"0x2"' is not assignable to type '"Test"'.
    // const _fails: NameOf<"0x1::Tester::Test"> = "0x2";
  });
});
