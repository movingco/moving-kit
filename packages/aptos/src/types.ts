import type { MoveStructTagId } from "@movingco/aptos-api";

/**
 * Account resource is a Move struct value belongs to an account.
 * @example {"type":"0x1::AptosAccount::Balance<0x1::XDX::XDX>","data":{"coin":{"value":"8000000000"}}}
 */
export interface AccountResource<T> {
  /**
   * String representation of an on-chain Move struct type.
   *
   * It is a combination of:
   *   1. `Move module address`, `module name` and `struct name` joined by `::`.
   *   2. `struct generic type parameters` joined by `, `.
   * Examples:
   *   * `0x1::Aptos::Aptos<0x1::XDX::XDX>`
   *   * `0x1::Abc::Abc<vector<u8>, vector<u64>>`
   *   * `0x1::AptosAccount::AccountOperationsCapability`
   * Note:
   *   1. Empty chars should be ignored when comparing 2 struct tag ids.
   *   2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).
   * See [doc](https://diem.github.io/move/structs-and-resources.html) for more details.
   */
  type: MoveStructTagId;

  /**
   * Account resource data is JSON representation of the Move struct `type`.
   *
   * Move struct field name and value are serialized as object property name and value.
   */
  data: T;
}
