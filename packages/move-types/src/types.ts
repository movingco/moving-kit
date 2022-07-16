/**
* Hex-encoded account address.

Prefixed with `0x` and leading zeros are trimmed.

See [doc](https://diem.github.io/move/address.html) for more details.
* @format address
* @example 0xdd
*/
export type AddressHex = `0x${string}`;

/**
* Move module id is a string representation of Move module.

Format: "{address}::{module name}"

`address` should be hex-encoded 16 bytes account address
that is prefixed with `0x` and leading zeros are trimmed.

Module name is case-sensitive.

See [doc](https://diem.github.io/move/modules-and-scripts.html#modules) for more details.
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
  readonly type_arguments: string[];

  /** The script function arguments. */
  readonly arguments: unknown[];
}
