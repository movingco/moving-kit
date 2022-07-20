/**
 * All bytes data are represented as hex-encoded string prefixed with `0x` and fulfilled with
 * two hex digits per byte.
 *
 * Different with `Address` type, hex-encoded bytes should not trim any zeros.
 * @format hex
 * @example 0x88fbd33f54e1126269769780feb24480428179f552e2313fbe571b72e62a1ca1
 */
export type ByteStringHex = `0x${string}`;

/**
 * Hex-encoded account address.
 *
 * Prefixed with `0x` and leading zeros are trimmed.
 *
 * See [doc](https://diem.github.io/move/address.html) for more details.
 * @format address
 * @example 0xdd
 */
export type AddressHex = ByteStringHex;

/**
 * Move module id is a string representation of Move module.
 *
 * Format: "{address}::{module name}"
 *
 * `address` should be hex-encoded 16 bytes account address
 * that is prefixed with `0x` and leading zeros are trimmed.
 *
 * Module name is case-sensitive.
 *
 * See [doc](https://diem.github.io/move/modules-and-scripts.html#modules) for more details.
 * @example 0x1::Aptos
 */
export type MoveModuleId<
  TAddress extends AddressHex = AddressHex,
  TModule extends string = string
> = `${TAddress}::${TModule}`;

/**
 * Script function id is string representation of a script function defined on-chain.
 *
 * Format: `{address}::{module name}::{function name}`
 * Both `module name` and `function name` are case-sensitive.
 */
export type ScriptFunctionId<
  TAddress extends AddressHex = AddressHex,
  TModule extends string = string,
  TFunction extends string = string
> = `${MoveModuleId<TAddress, TModule>}::${TFunction}`;

/**
 * String representation of an on-chain Move type identifier defined by the Move language.
 *
 * Values:
 *   - bool
 *   - u8
 *   - u64
 *   - u128
 *   - address
 *   - signer
 *   - vector: `vector<{non-reference MoveTypeId}>`
 *   - struct: `{address}::{module_name}::{struct_name}::<{generic types}>`
 *   - reference: immutable `&` and mutable `&mut` references.
 *   - generic_type_parameter: it is always start with `T` and following an index number,
 *     which is the position of the generic type parameter in the `struct` or
 *     `function` generic type parameters definition.
 *
 * Vector type value examples:
 *   * `vector<u8>`
 *   * `vector<vector<u64>>`
 *   * `vector<0x1::AptosAccount::Balance<0x1::XDX::XDX>>`
 *
 * Struct type value examples:
 *   * `0x1::Aptos::Aptos<0x1::XDX::XDX>`
 *   * `0x1::Abc::Abc<vector<u8>, vector<u64>>`
 *   * `0x1::AptosAccount::AccountOperationsCapability`
 *
 * Reference type value examples:
 *   * `&signer`
 *   * `&mut address`
 *   * `&mut vector<u8>`
 *
 * Generic type parameter value example, the following is `0x1::TransactionFee::TransactionFee` JSON representation:
 *
 * ```json
 *     {
 *         "name": "TransactionFee",
 *         "is_native": false,
 *         "abilities": ["key"],
 *         "generic_type_params": [
 *             {"constraints": [], "is_phantom": true}
 *         ],
 *         "fields": [
 *             { "name": "balance", "type": "0x1::Aptos::Aptos<T0>" },
 *             { "name": "preburn", "type": "0x1::Aptos::Preburn<T0>" }
 *         ]
 *     }
 * ```
 *
 * It's Move source code:
 *
 * ```move
 *     module AptosFramework::TransactionFee {
 *         struct TransactionFee<phantom CoinType> has key {
 *             balance: Aptos<CoinType>,
 *             preburn: Preburn<CoinType>,
 *         }
 *     }
 * ```
 *
 * The `T0` in the above JSON representation is the generic type place holder for
 * the `CoinType` in the Move source code.
 *
 * Note:
 *   1. Empty chars should be ignored when comparing 2 struct tag ids.
 *   2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).
 * @pattern ^(bool|u8|u64|u128|address|signer|vector<.+>|0x[0-9a-zA-Z:_<, >]+|^&(mut )?.+$|T\d+)$
 * @example 0x1::AptosAccount::Balance<0x1::XUS::XUS>
 */
export type MoveTypeId = string;

type TyElement<T extends MoveTypeId> = T extends undefined ? "" : `, ${T}`;

/**
 * Struct type parameters.
 */
export type MoveStructTypeParams<
  TInner extends readonly MoveTypeId[] = readonly MoveTypeId[] & {
    length: 0;
  }
> = TInner["length"] extends 0
  ? ""
  : `<${TInner[0]}${TyElement<TInner[1]>}${TyElement<TInner[2]>}${TyElement<
      TInner[3]
    >}>`;

/**
 * String representation of an on-chain Move struct name.
 *
 * It consists of a `Move module address`, `module name` and `struct name` joined by `::`.
 *
 * @format move_type
 * @example 0x1::AptosAccount::Balance
 */
export type MoveStructFullName<
  TAddress extends AddressHex = AddressHex,
  TModule extends string = string,
  TStructName extends string = string
> = `${MoveModuleId<TAddress, TModule>}::${TStructName}`;

/**
 * String representation of an on-chain Move struct type.
 *
 * It is a combination of:
 *   1. `Move module address`, `module name` and `struct name` joined by `::`.
 *   2. `struct generic type parameters` joined by `, `.
 *
 * Examples:
 *   * `0x1::Aptos::Aptos<0x1::XDX::XDX>`
 *   * `0x1::Abc::Abc<vector<u8>, vector<u64>>`
 *   * `0x1::AptosAccount::AccountOperationsCapability`
 *
 * Note:
 *   1. Empty chars should be ignored when comparing 2 struct tag ids.
 *   2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).
 *
 * See [doc](https://diem.github.io/move/structs-and-resources.html) for more details.
 * @format move_type
 * @pattern ^0x[0-9a-zA-Z:_<>]+$
 * @example 0x1::AptosAccount::Balance<0x1::XUS::XUS>
 */
export type MoveStructTagId<
  TAddress extends AddressHex = AddressHex,
  TModule extends string = string,
  TStructName extends string = string,
  TParams extends readonly MoveTypeId[] = readonly MoveTypeId[] & { length: 0 }
> = `${MoveStructFullName<
  TAddress,
  TModule,
  TStructName
>}${MoveStructTypeParams<TParams>}`;

/**
 * Information about where a Move module is located.
 */
export interface MoveModuleInfo<A extends AddressHex, N extends string> {
  /** The address of the module. */
  readonly ADDRESS: A;
  /** The full module name. */
  readonly FULL_NAME: MoveModuleId<A, N>;
  /** The name of the module. */
  readonly NAME: N;
}

/**
 * Payload for a script function.
 */
export interface ScriptFunctionPayload<
  TFunctionId extends ScriptFunctionId = ScriptFunctionId
> {
  /**
   * Hard-coded argument showing this is a script function payload.
   */
  readonly type: "script_function_payload";
  /**
   * Script function id is string representation of a script function defined on-chain.
   *
   * Format: `{address}::{module name}::{function name}`
   * Both `module name` and `function name` are case-sensitive.
   */
  readonly function: TFunctionId;

  /** Generic type arguments required by the script function. */
  readonly type_arguments: MoveTypeId[];

  /** The script function arguments. */
  readonly arguments: unknown[];
}
