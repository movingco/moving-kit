import * as p from "@movingco/prelude";

export type CoinData = {
  value: p.U64;
};

export type BurnCapabilityData = {
  dummy_field: boolean;
};

export type CoinEventsData = {
  register_events: {
    counter: p.U64;
    guid: {
      len_bytes: number;
      guid: {
        id: {
          creation_num: p.U64;
          addr: p.HexStringArg;
        };
      };
    };
  };
};

export type CoinInfoData = {
  name: {
    bytes: p.HexStringArg;
  };
  symbol: {
    bytes: p.HexStringArg;
  };
  decimals: p.U64;
  supply: {
    vec: ReadonlyArray<unknown>;
  };
};

export type CoinStoreData = {
  coin: {
    value: p.U64;
  };
  deposit_events: {
    counter: p.U64;
    guid: {
      len_bytes: number;
      guid: {
        id: {
          creation_num: p.U64;
          addr: p.HexStringArg;
        };
      };
    };
  };
  withdraw_events: {
    counter: p.U64;
    guid: {
      len_bytes: number;
      guid: {
        id: {
          creation_num: p.U64;
          addr: p.HexStringArg;
        };
      };
    };
  };
};

export type DepositEventData = {
  amount: p.U64;
};

export type MintCapabilityData = {
  dummy_field: boolean;
};

export type RegisterEventData = {
  type_info: {
    account_address: p.HexStringArg;
    module_name: p.HexStringArg;
    struct_name: p.HexStringArg;
  };
};

export type WithdrawEventData = {
  amount: p.U64;
};

/**
 * Payload arguments for {@link Coin.register}.
 */
export type RegisterPayload = {
  typeArgs: {
    coin_type: string;
  };
};

/**
 * Payload arguments for {@link Coin.transfer}.
 */
export type TransferPayload = {
  args: {
    /** IDL type: `Address` */
    to: p.HexStringArg;
    /** IDL type: `U64` */
    amount: p.U64;
  };
  typeArgs: {
    coin_type: string;
  };
};

/** Function builders. */
const builders = {
  register: ({ typeArgs }: RegisterPayload): p.ScriptFunctionPayload => ({
    type: "script_function_payload",
    function: "0x1::Coin::register",
    type_arguments: [typeArgs.coin_type],
    arguments: [],
  }),

  transfer: ({ args, typeArgs }: TransferPayload): p.ScriptFunctionPayload => ({
    type: "script_function_payload",
    function: "0x1::Coin::transfer",
    type_arguments: [typeArgs.coin_type],
    arguments: [
      p.serializers.hexString(args.to),
      p.serializers.u64(args.amount),
    ],
  }),
} as const;

/** Payload generators for module `0x1::Coin`. */
const moduleImpl = {
  /** The address of the module. */
  ADDRESS: "0x1",
  /** The full module name. */
  FULL_NAME: "0x1::Coin",
  /** The name of the module. */
  NAME: "Coin",
  /** The IDL of the module. */
  IDL: {
    module_name: {
      address:
        "0000000000000000000000000000000000000000000000000000000000000001",
      name: "Coin",
    },
    functions: [
      { name: "register", ty_args: ["coin_type"], args: [] },
      {
        name: "transfer",
        ty_args: ["coin_type"],
        args: [
          { name: "to", ty: "address" },
          { name: "amount", ty: "u64" },
        ],
      },
    ],
    structs: [
      {
        module_name: {
          address:
            "0000000000000000000000000000000000000000000000000000000000000001",
          name: "Coin",
        },
        name: "Coin",
        fields: [{ name: "value", ty: "u64" }],
        type_params: ["CoinType"],
        abilities: ["store"],
      },
      {
        module_name: {
          address:
            "0000000000000000000000000000000000000000000000000000000000000001",
          name: "Coin",
        },
        name: "BurnCapability",
        fields: [{ name: "dummy_field", ty: "bool" }],
        type_params: ["CoinType"],
        abilities: ["copy", "store", "key"],
      },
      {
        module_name: {
          address:
            "0000000000000000000000000000000000000000000000000000000000000001",
          name: "Coin",
        },
        name: "CoinEvents",
        fields: [
          {
            name: "register_events",
            ty: {
              struct: {
                module_name: {
                  address:
                    "0000000000000000000000000000000000000000000000000000000000000001",
                  name: "Event",
                },
                name: "EventHandle",
              },
            },
          },
        ],
        abilities: ["key"],
      },
      {
        module_name: {
          address:
            "0000000000000000000000000000000000000000000000000000000000000001",
          name: "Coin",
        },
        name: "CoinInfo",
        fields: [
          {
            name: "name",
            ty: {
              struct: {
                module_name: {
                  address:
                    "0000000000000000000000000000000000000000000000000000000000000001",
                  name: "ASCII",
                },
                name: "String",
              },
            },
          },
          {
            name: "symbol",
            ty: {
              struct: {
                module_name: {
                  address:
                    "0000000000000000000000000000000000000000000000000000000000000001",
                  name: "ASCII",
                },
                name: "String",
              },
            },
          },
          { name: "decimals", ty: "u64" },
          {
            name: "supply",
            ty: {
              struct: {
                module_name: {
                  address:
                    "0000000000000000000000000000000000000000000000000000000000000001",
                  name: "Option",
                },
                name: "Option",
              },
            },
          },
        ],
        type_params: ["CoinType"],
        abilities: ["key"],
      },
      {
        module_name: {
          address:
            "0000000000000000000000000000000000000000000000000000000000000001",
          name: "Coin",
        },
        name: "CoinStore",
        fields: [
          {
            name: "coin",
            ty: {
              struct: {
                module_name: {
                  address:
                    "0000000000000000000000000000000000000000000000000000000000000001",
                  name: "Coin",
                },
                name: "Coin",
              },
            },
          },
          {
            name: "deposit_events",
            ty: {
              struct: {
                module_name: {
                  address:
                    "0000000000000000000000000000000000000000000000000000000000000001",
                  name: "Event",
                },
                name: "EventHandle",
              },
            },
          },
          {
            name: "withdraw_events",
            ty: {
              struct: {
                module_name: {
                  address:
                    "0000000000000000000000000000000000000000000000000000000000000001",
                  name: "Event",
                },
                name: "EventHandle",
              },
            },
          },
        ],
        type_params: ["CoinType"],
        abilities: ["key"],
      },
      {
        module_name: {
          address:
            "0000000000000000000000000000000000000000000000000000000000000001",
          name: "Coin",
        },
        name: "DepositEvent",
        fields: [{ name: "amount", ty: "u64" }],
        abilities: ["drop", "store"],
      },
      {
        module_name: {
          address:
            "0000000000000000000000000000000000000000000000000000000000000001",
          name: "Coin",
        },
        name: "MintCapability",
        fields: [{ name: "dummy_field", ty: "bool" }],
        type_params: ["CoinType"],
        abilities: ["copy", "store", "key"],
      },
      {
        module_name: {
          address:
            "0000000000000000000000000000000000000000000000000000000000000001",
          name: "Coin",
        },
        name: "RegisterEvent",
        fields: [
          {
            name: "type_info",
            ty: {
              struct: {
                module_name: {
                  address:
                    "0000000000000000000000000000000000000000000000000000000000000001",
                  name: "TypeInfo",
                },
                name: "TypeInfo",
              },
            },
          },
        ],
        abilities: ["drop", "store"],
      },
      {
        module_name: {
          address:
            "0000000000000000000000000000000000000000000000000000000000000001",
          name: "Coin",
        },
        name: "WithdrawEvent",
        fields: [{ name: "amount", ty: "u64" }],
        abilities: ["drop", "store"],
      },
    ],
    errors: {
      ECOIN_INFO_ADDRESS_MISMATCH: {
        code: 0,
        name: "ECOIN_INFO_ADDRESS_MISMATCH",
      },
      ECOIN_INFO_ALREADY_PUBLISHED: {
        code: 1,
        name: "ECOIN_INFO_ALREADY_PUBLISHED",
      },
      ECOIN_INFO_NOT_PUBLISHED: { code: 2, name: "ECOIN_INFO_NOT_PUBLISHED" },
      ECOIN_STORE_ALREADY_PUBLISHED: {
        code: 3,
        name: "ECOIN_STORE_ALREADY_PUBLISHED",
      },
      ECOIN_STORE_NOT_PUBLISHED: { code: 4, name: "ECOIN_STORE_NOT_PUBLISHED" },
      EDESTRUCTION_OF_NONZERO_TOKEN: {
        code: 6,
        name: "EDESTRUCTION_OF_NONZERO_TOKEN",
      },
      EINSUFFICIENT_BALANCE: { code: 5, name: "EINSUFFICIENT_BALANCE" },
    },
  },
  /** All module function IDLs. */
  functions: {
    register: { name: "register", ty_args: ["coin_type"], args: [] },
    transfer: {
      name: "transfer",
      ty_args: ["coin_type"],
      args: [
        { name: "to", ty: "address" },
        { name: "amount", ty: "u64" },
      ],
    },
  },
  /** All struct types with ability `key`. */
  resources: {
    BurnCapability: "0x1::Coin::BurnCapability",
    CoinEvents: "0x1::Coin::CoinEvents",
    CoinInfo: "0x1::Coin::CoinInfo",
    CoinStore: "0x1::Coin::CoinStore",
    MintCapability: "0x1::Coin::MintCapability",
  },
  /** All struct types. */
  structs: {
    BurnCapability: "0x1::Coin::BurnCapability",
    Coin: "0x1::Coin::Coin",
    CoinEvents: "0x1::Coin::CoinEvents",
    CoinInfo: "0x1::Coin::CoinInfo",
    CoinStore: "0x1::Coin::CoinStore",
    DepositEvent: "0x1::Coin::DepositEvent",
    MintCapability: "0x1::Coin::MintCapability",
    RegisterEvent: "0x1::Coin::RegisterEvent",
    WithdrawEvent: "0x1::Coin::WithdrawEvent",
  },

  ...builders,
} as const;

export const CoinModule = moduleImpl as p.MoveModuleDefinition<
  "0x1",
  "Coin"
> as typeof moduleImpl;
