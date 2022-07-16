import type { BigintIsh, HexStringLike } from "@movingco/core";
import type { IDLScriptFunction } from "@movingco/idl";
import type {
  AddressHex,
  MoveModuleId,
  MoveModuleInfo,
} from "@movingco/move-types";

export * as IDL from "@movingco/idl";
export type { ScriptFunctionPayload } from "@movingco/move-types";
export * as Move from "@movingco/move-types";

/**
 * Serializes and validates a value.
 */
export * as serializers from "./serializers.js";

/**
 * Definition of a Move module as defined in generated types.
 */
export interface MoveModuleDefinition<A extends AddressHex, N extends string>
  extends MoveModuleInfo<A, N> {
  /** All module function IDLs. */
  readonly functions: Record<string, IDLScriptFunction>;
  /** All struct types with ability `key`. */
  readonly resources: Record<string, `${MoveModuleId<A, N>}::${string}`>;
  /** All struct types. */
  readonly structs: Record<string, `${MoveModuleId<A, N>}::${string}`>;
}

/**
 * Hex string argument.
 */
export type HexStringArg = string | HexStringLike;

/**
 * String-like address argument.
 */
export type RawAddress = HexStringArg;

/**
 * String-like address argument representing a Signer.
 */
export type RawSigner = RawAddress;

/**
 * A `vector<u8>`.
 */
export type ByteString = HexStringArg;

/**
 * Unsigned 64-bit integer.
 */
export type U64 = BigintIsh;

/**
 * Unsigned 128-bit integer.
 */
export type U128 = BigintIsh;
