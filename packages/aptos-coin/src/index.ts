/**
 * This module provides the foundation for typesafe Coins.
 *
 * @module
 */
import * as p from "@movingco/prelude";

/** Main structure representing a coin/token in an account's custody. */
export type CoinData<_CoinType = unknown> = {
  /** Amount of coin this address has. */
  value: p.U64;
};

/** Capability required to burn coins. */
export type BurnCapabilityData<_CoinType = unknown> = {
  dummy_field: boolean;
};

/**
 * Core data structures
 * Central coin events that are emitted for all coin stores.
 */
export type CoinEventsData = {
  register_events: {
    /** Total number of events emitted to this event stream. */
    counter: p.U64;

    /** A globally unique ID for this event stream. */
    guid: {
      len_bytes: number;
      guid: {
        id: {
          /** If creation_num is `i`, this is the `i+1`th GUID created by `addr` */
          creation_num: p.U64;

          /** Address that created the GUID */
          addr: p.HexStringArg;
        };
      };
    };
  };
};

/** Information about a specific coin type. Stored on the creator of the coin's account. */
export type CoinInfoData<_CoinType = unknown> = {
  name: {
    bytes: p.HexStringArg;
  };

  /**
   * Symbol of the coin, usually a shorter version of the name.
   * For example, Singapore Dollar is SGD.
   */
  symbol: {
    bytes: p.HexStringArg;
  };

  /**
   * Number of decimals used to get its user representation.
   * For example, if `decimals` equals `2`, a balance of `505` coins should
   * be displayed to a user as `5.05` (`505 / 10 ** 2`).
   */
  decimals: p.U64;

  /** Amount of this coin type in existence. */
  supply: {
    vec: ReadonlyArray<p.U64>;
  };
};

/**
 * A holder of a specific coin types and associated event handles.
 * These are kept in a single resource to ensure locality of data.
 */
export type CoinStoreData<_CoinType = unknown> = {
  coin: {
    /** Amount of coin this address has. */
    value: p.U64;
  };
  deposit_events: {
    /** Total number of events emitted to this event stream. */
    counter: p.U64;

    /** A globally unique ID for this event stream. */
    guid: {
      len_bytes: number;
      guid: {
        id: {
          /** If creation_num is `i`, this is the `i+1`th GUID created by `addr` */
          creation_num: p.U64;

          /** Address that created the GUID */
          addr: p.HexStringArg;
        };
      };
    };
  };
  withdraw_events: {
    /** Total number of events emitted to this event stream. */
    counter: p.U64;

    /** A globally unique ID for this event stream. */
    guid: {
      len_bytes: number;
      guid: {
        id: {
          /** If creation_num is `i`, this is the `i+1`th GUID created by `addr` */
          creation_num: p.U64;

          /** Address that created the GUID */
          addr: p.HexStringArg;
        };
      };
    };
  };
};

/** Event emitted when some amount of a coin is deposited into an account. */
export type DepositEventData = {
  amount: p.U64;
};

/** Capability required to mint coins. */
export type MintCapabilityData<_CoinType = unknown> = {
  dummy_field: boolean;
};

/** Set of data sent to the event stream when a new coin store is registered. */
export type RegisterEventData = {
  type_info: {
    account_address: p.HexStringArg;
    module_name: p.HexStringArg;
    struct_name: p.HexStringArg;
  };
};

/** Event emitted when some amount of a coin is withdrawn from an account. */
export type WithdrawEventData = {
  amount: p.U64;
};

/**
 * Payload arguments for {@link CoinModule.register}.
 */
export type RegisterPayload = {
  typeArgs: {
    CoinType: string;
  };
};

/**
 * Payload arguments for {@link CoinModule.transfer}.
 */
export type TransferPayload = {
  args: {
    /** IDL type: `Address` */
    to: p.HexStringArg;
    /** IDL type: `U64` */
    amount: p.U64;
  };
  typeArgs: {
    CoinType: string;
  };
};

/** Entrypoint builders. */
export const entrypoints = {
  /**
   * Script function to register to receive a specific `CoinType`. An account that wants to hold a coin type
   * has to explicitly registers to do so. The register creates a special `CoinStore`
   * to hold the specified `CoinType`.
   */
  register: ({ typeArgs }: RegisterPayload): p.ScriptFunctionPayload => ({
    type: "script_function_payload",
    function: "0x1::Coin::register",
    type_arguments: [typeArgs.CoinType],
    arguments: [],
  }),

  /** Transfers `amount` of coins `CoinType` from `from` to `to`. */
  transfer: ({ args, typeArgs }: TransferPayload): p.ScriptFunctionPayload => ({
    type: "script_function_payload",
    function: "0x1::Coin::transfer",
    type_arguments: [typeArgs.CoinType],
    arguments: [
      p.serializers.hexString(args.to),
      p.serializers.u64(args.amount),
    ],
  }),
} as const;

/** The IDL of the module. */
export const idl = {
  module_id: "0x1::Coin",
  doc: "This module provides the foundation for typesafe Coins.",
  functions: [
    {
      name: "register",
      doc: "Script function to register to receive a specific `CoinType`. An account that wants to hold a coin type\nhas to explicitly registers to do so. The register creates a special `CoinStore`\nto hold the specified `CoinType`.",
      ty_args: ["CoinType"],
      args: [],
    },
    {
      name: "transfer",
      doc: "Transfers `amount` of coins `CoinType` from `from` to `to`.",
      ty_args: ["CoinType"],
      args: [
        { name: "to", ty: "address" },
        { name: "amount", ty: "u64" },
      ],
    },
  ],
  structs: [
    {
      module_id: "0x1::Coin",
      name: "Coin",
      doc: "Main structure representing a coin/token in an account's custody.",
      fields: [
        { name: "value", doc: "Amount of coin this address has.", ty: "u64" },
      ],
      type_params: ["CoinType"],
      abilities: ["store"],
    },
    {
      module_id: "0x1::Coin",
      name: "BurnCapability",
      doc: "Capability required to burn coins.",
      fields: [{ name: "dummy_field", ty: "bool" }],
      type_params: ["CoinType"],
      abilities: ["copy", "store", "key"],
    },
    {
      module_id: "0x1::Coin",
      name: "CoinEvents",
      doc: "Core data structures\nCentral coin events that are emitted for all coin stores.",
      fields: [
        {
          name: "register_events",
          ty: {
            struct: {
              module_id: "0x1::Event",
              name: "EventHandle",
              ty_args: [
                { struct: { module_id: "0x1::Coin", name: "RegisterEvent" } },
              ],
            },
          },
        },
      ],
      abilities: ["key"],
    },
    {
      module_id: "0x1::Coin",
      name: "CoinInfo",
      doc: "Information about a specific coin type. Stored on the creator of the coin's account.",
      fields: [
        {
          name: "name",
          ty: { struct: { module_id: "0x1::ASCII", name: "String" } },
        },
        {
          name: "symbol",
          doc: "Symbol of the coin, usually a shorter version of the name.\nFor example, Singapore Dollar is SGD.",
          ty: { struct: { module_id: "0x1::ASCII", name: "String" } },
        },
        {
          name: "decimals",
          doc: "Number of decimals used to get its user representation.\nFor example, if `decimals` equals `2`, a balance of `505` coins should\nbe displayed to a user as `5.05` (`505 / 10 ** 2`).",
          ty: "u64",
        },
        {
          name: "supply",
          doc: "Amount of this coin type in existence.",
          ty: {
            struct: {
              module_id: "0x1::Option",
              name: "Option",
              ty_args: ["u64"],
            },
          },
        },
      ],
      type_params: ["CoinType"],
      abilities: ["key"],
    },
    {
      module_id: "0x1::Coin",
      name: "CoinStore",
      doc: "A holder of a specific coin types and associated event handles.\nThese are kept in a single resource to ensure locality of data.",
      fields: [
        {
          name: "coin",
          ty: {
            struct: {
              module_id: "0x1::Coin",
              name: "Coin",
              ty_args: [{ type_param: 0 }],
            },
          },
        },
        {
          name: "deposit_events",
          ty: {
            struct: {
              module_id: "0x1::Event",
              name: "EventHandle",
              ty_args: [
                { struct: { module_id: "0x1::Coin", name: "DepositEvent" } },
              ],
            },
          },
        },
        {
          name: "withdraw_events",
          ty: {
            struct: {
              module_id: "0x1::Event",
              name: "EventHandle",
              ty_args: [
                { struct: { module_id: "0x1::Coin", name: "WithdrawEvent" } },
              ],
            },
          },
        },
      ],
      type_params: ["CoinType"],
      abilities: ["key"],
    },
    {
      module_id: "0x1::Coin",
      name: "DepositEvent",
      doc: "Event emitted when some amount of a coin is deposited into an account.",
      fields: [{ name: "amount", ty: "u64" }],
      abilities: ["drop", "store"],
    },
    {
      module_id: "0x1::Coin",
      name: "MintCapability",
      doc: "Capability required to mint coins.",
      fields: [{ name: "dummy_field", ty: "bool" }],
      type_params: ["CoinType"],
      abilities: ["copy", "store", "key"],
    },
    {
      module_id: "0x1::Coin",
      name: "RegisterEvent",
      doc: "Set of data sent to the event stream when a new coin store is registered.",
      fields: [
        {
          name: "type_info",
          ty: { struct: { module_id: "0x1::TypeInfo", name: "TypeInfo" } },
        },
      ],
      abilities: ["drop", "store"],
    },
    {
      module_id: "0x1::Coin",
      name: "WithdrawEvent",
      doc: "Event emitted when some amount of a coin is withdrawn from an account.",
      fields: [{ name: "amount", ty: "u64" }],
      abilities: ["drop", "store"],
    },
  ],
  errors: {
    "0": {
      name: "ECOIN_INFO_ADDRESS_MISMATCH",
      doc: "When address of account which is used to initilize a coin `CoinType`\n doesn't match the deployer of module containining `CoinType`.",
    },
    "1": {
      name: "ECOIN_INFO_ALREADY_PUBLISHED",
      doc: "When `CoinType` is already initilized as a coin.",
    },
    "2": {
      name: "ECOIN_INFO_NOT_PUBLISHED",
      doc: "When `CoinType` hasn't been initialized as a coin.",
    },
    "3": {
      name: "ECOIN_STORE_ALREADY_PUBLISHED",
      doc: "When an account already has `CoinStore` registered for `CoinType`.",
    },
    "4": {
      name: "ECOIN_STORE_NOT_PUBLISHED",
      doc: "When an account hasn't registered `CoinStore` for `CoinType`.",
    },
    "5": {
      name: "EINSUFFICIENT_BALANCE",
      doc: "When there's not enough funds to withdraw from an account or from `Coin` resource.",
    },
    "6": {
      name: "EDESTRUCTION_OF_NONZERO_TOKEN",
      doc: "When destruction of `Coin` resource contains non-zero value attempted.",
    },
  },
} as const;

/** Module ID information. */
export const id = {
  /** The address of the module. */
  ADDRESS: "0x1",
  /** The full module name. */
  FULL_NAME: "0x1::Coin",
  /** The name of the module. */
  NAME: "Coin",
} as const;

/** Module errors. */
export const errors = {
  ECOIN_INFO_ADDRESS_MISMATCH: {
    code: 0,
    name: "ECOIN_INFO_ADDRESS_MISMATCH",
    doc: "When address of account which is used to initilize a coin `CoinType`\n doesn't match the deployer of module containining `CoinType`.",
  },
  ECOIN_INFO_ALREADY_PUBLISHED: {
    code: 1,
    name: "ECOIN_INFO_ALREADY_PUBLISHED",
    doc: "When `CoinType` is already initilized as a coin.",
  },
  ECOIN_INFO_NOT_PUBLISHED: {
    code: 2,
    name: "ECOIN_INFO_NOT_PUBLISHED",
    doc: "When `CoinType` hasn't been initialized as a coin.",
  },
  ECOIN_STORE_ALREADY_PUBLISHED: {
    code: 3,
    name: "ECOIN_STORE_ALREADY_PUBLISHED",
    doc: "When an account already has `CoinStore` registered for `CoinType`.",
  },
  ECOIN_STORE_NOT_PUBLISHED: {
    code: 4,
    name: "ECOIN_STORE_NOT_PUBLISHED",
    doc: "When an account hasn't registered `CoinStore` for `CoinType`.",
  },
  EDESTRUCTION_OF_NONZERO_TOKEN: {
    code: 6,
    name: "EDESTRUCTION_OF_NONZERO_TOKEN",
    doc: "When destruction of `Coin` resource contains non-zero value attempted.",
  },
  EINSUFFICIENT_BALANCE: {
    code: 5,
    name: "EINSUFFICIENT_BALANCE",
    doc: "When there's not enough funds to withdraw from an account or from `Coin` resource.",
  },
} as const;

/** Module error codes. */
export const errorCodes = {
  "0": {
    name: "ECOIN_INFO_ADDRESS_MISMATCH",
    doc: "When address of account which is used to initilize a coin `CoinType`\n doesn't match the deployer of module containining `CoinType`.",
  },
  "1": {
    name: "ECOIN_INFO_ALREADY_PUBLISHED",
    doc: "When `CoinType` is already initilized as a coin.",
  },
  "2": {
    name: "ECOIN_INFO_NOT_PUBLISHED",
    doc: "When `CoinType` hasn't been initialized as a coin.",
  },
  "3": {
    name: "ECOIN_STORE_ALREADY_PUBLISHED",
    doc: "When an account already has `CoinStore` registered for `CoinType`.",
  },
  "4": {
    name: "ECOIN_STORE_NOT_PUBLISHED",
    doc: "When an account hasn't registered `CoinStore` for `CoinType`.",
  },
  "5": {
    name: "EINSUFFICIENT_BALANCE",
    doc: "When there's not enough funds to withdraw from an account or from `Coin` resource.",
  },
  "6": {
    name: "EDESTRUCTION_OF_NONZERO_TOKEN",
    doc: "When destruction of `Coin` resource contains non-zero value attempted.",
  },
} as const;

/** All module function IDLs. */
export const functions = {
  register: {
    name: "register",
    doc: "Script function to register to receive a specific `CoinType`. An account that wants to hold a coin type\nhas to explicitly registers to do so. The register creates a special `CoinStore`\nto hold the specified `CoinType`.",
    ty_args: ["CoinType"],
    args: [],
  },
  transfer: {
    name: "transfer",
    doc: "Transfers `amount` of coins `CoinType` from `from` to `to`.",
    ty_args: ["CoinType"],
    args: [
      {
        name: "to",
        ty: "address",
      },
      {
        name: "amount",
        ty: "u64",
      },
    ],
  },
} as const;

/** All struct types with ability `key`. */
export const resources = {
  BurnCapability: "0x1::Coin::BurnCapability",
  CoinEvents: "0x1::Coin::CoinEvents",
  CoinInfo: "0x1::Coin::CoinInfo",
  CoinStore: "0x1::Coin::CoinStore",
  MintCapability: "0x1::Coin::MintCapability",
} as const;

/** All struct types. */
export const structs = {
  BurnCapability: "0x1::Coin::BurnCapability",
  Coin: "0x1::Coin::Coin",
  CoinEvents: "0x1::Coin::CoinEvents",
  CoinInfo: "0x1::Coin::CoinInfo",
  CoinStore: "0x1::Coin::CoinStore",
  DepositEvent: "0x1::Coin::DepositEvent",
  MintCapability: "0x1::Coin::MintCapability",
  RegisterEvent: "0x1::Coin::RegisterEvent",
  WithdrawEvent: "0x1::Coin::WithdrawEvent",
} as const;

/** Payload generators for module `0x1::Coin`. */
const moduleImpl = {
  ...id,
  errors,
  errorCodes,
  functions,
  resources,
  structs,

  ...entrypoints,
} as const;

/** This module provides the foundation for typesafe Coins. */
export const CoinModule = moduleImpl as p.MoveModuleDefinition<
  "0x1",
  "Coin"
> as typeof moduleImpl;
