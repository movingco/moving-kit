import type { BigintIsh, HexStringLike } from "@movingco/core";
import {
  HexString,
  parseBigintIsh,
  validateU64,
  validateU128,
} from "@movingco/core";
import type { IDLModule, IDLScriptFunction } from "@movingco/idl";

/**
 * Definition of a Move module as defined in generated types.
 */
export interface MoveModuleDefinition<A extends string, N extends string> {
  /** The address of the module. */
  readonly ADDRESS: A;
  /** The full module name. */
  readonly FULL_NAME: `${A}::${N}`;
  /** The name of the module. */
  readonly NAME: N;
  /** The IDL of the module. */
  readonly IDL: IDLModule;
  /** All module function IDLs. */
  readonly functions: Record<string, IDLScriptFunction>;
  /** All struct types with ability `key`. */
  readonly resources: Record<string, `${A}::${N}::${string}`>;
  /** All struct types. */
  readonly structs: Record<string, `${A}::${N}::${string}`>;
}

/**
 * Hex string argument.
 */
export type HexStringArg = string | HexStringLike;

/**
 * Unsigned 64-bit integer.
 */
export type U64 = BigintIsh;

/**
 * Unsigned 128-bit integer.
 */
export type U128 = BigintIsh;

/**
 * Payload for a script function.
 */
export interface ScriptFunctionPayload {
  type: "script_function_payload";

  /**
   * Script function id is string representation of a script function defined on-chain.
   *
   * Format: `{address}::{module name}::{function name}`
   * Both `module name` and `function name` are case-sensitive.
   */
  function: string;

  /** Generic type arguments required by the script function. */
  type_arguments: string[];

  /** The script function arguments. */
  arguments: unknown[];
}

/**
 * Serializes and validates a value.
 */
export const serializers = {
  hexString: (arg: HexStringArg) => {
    const str = typeof arg === "string" ? arg : arg.hex();
    return HexString.ensure(str).hex();
  },
  u64: (arg: BigintIsh) => {
    const bi = parseBigintIsh(arg);
    validateU64(bi);
    return bi.toString();
  },
  u128: (arg: BigintIsh) => {
    const bi = parseBigintIsh(arg);
    validateU128(bi);
    return bi.toString();
  },
};
