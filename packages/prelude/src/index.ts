import type { BigintIsh, HexStringLike } from "@movingco/core";
import type { IDLScriptFunction } from "@movingco/idl";

export * as IDL from "@movingco/idl";

/**
 * Serializes and validates a value.
 */
export * as serializers from "./serializers.js";

/**
 * An identifier for a Move module.
 */
export interface MoveModuleId<A extends string, N extends string> {
  /** The address of the module. */
  readonly ADDRESS: A;
  /** The full module name. */
  readonly FULL_NAME: `${A}::${N}`;
  /** The name of the module. */
  readonly NAME: N;
}

/**
 * Definition of a Move module as defined in generated types.
 */
export interface MoveModuleDefinition<A extends string, N extends string>
  extends MoveModuleId<A, N> {
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
 * String-like address argument.
 */
export type RawAddress = HexStringArg;

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
  function: string;

  /** Generic type arguments required by the script function. */
  type_arguments: readonly string[];

  /** The script function arguments. */
  arguments: readonly unknown[];
}
