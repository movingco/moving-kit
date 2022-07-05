import type { BigintIsh } from "@movingco/core";
import {
  HexString,
  parseBigintIsh,
  validateU64,
  validateU128,
} from "@movingco/core";
import type { HexStringArg } from "@movingco/idl";

export const hexString = (arg: HexStringArg) => {
  const str = typeof arg === "string" ? arg : arg.hex();
  return HexString.ensure(str).hex();
};

export const u64 = (arg: BigintIsh) => {
  const bi = parseBigintIsh(arg);
  validateU64(bi);
  return bi.toString();
};

export const u128 = (arg: BigintIsh) => {
  const bi = parseBigintIsh(arg);
  validateU128(bi);
  return bi.toString();
};
