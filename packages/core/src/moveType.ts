import { default as invariant } from "tiny-invariant";

import { Address } from "./address.js";

/**
 * Parses a string into a Move type.
 */
const parseStructTag = (fullyQualifiedName: string): StructTag => {
  const tokens = tokenize(fullyQualifiedName);
  return new StructTag(parseName(tokens));
};

/**
 * Formats and renders a {@link StructTagRaw}.
 * @param type
 * @returns
 */
const formatStructTag = (type: StructTagRaw): string => {
  return `${type.module.addressHex}::${type.module.identifier}::${type.name}${
    type.typeParams
      ? `<${type.typeParams.map(formatStructTag).join(", ")}>`
      : ""
  }`;
};

/**
 * Serializable representation of a {@link ModuleId}.
 */
export interface ModuleIdRaw {
  readonly __typename?: "MoveModule";
  readonly addressHex: string;
  readonly identifier: string;
}

/**
 * Raw representation of a {@link StructTag}.
 */
export interface StructTagRaw {
  readonly __typename?: "MoveType";
  readonly module: ModuleIdRaw;
  readonly name: string;
  /**
   * Type arguments for the generic, if applicable.
   */
  readonly typeParams?: readonly StructTagRaw[];
}

export class ModuleId implements ModuleIdRaw {
  /**
   * Address of the module.
   */
  readonly address: Address;

  constructor(readonly raw: ModuleIdRaw) {
    this.address = new Address(raw.addressHex);
  }

  /**
   * Address as a hex string. (raw)
   */
  get addressHex(): string {
    return this.raw.addressHex;
  }

  get identifier(): string {
    return this.raw.identifier;
  }

  equals(other: ModuleIdRaw): boolean {
    return checkModulesEqual(this, other);
  }

  toJSON(): ModuleIdRaw {
    return {
      __typename: "MoveModule",
      ...this.raw,
    };
  }
}

const checkModulesEqual = (a: ModuleIdRaw, b: ModuleIdRaw): boolean =>
  a.addressHex === b.addressHex && a.identifier === b.identifier;

const checkTypesEqual = (a: StructTagRaw, b: StructTagRaw): boolean => {
  return (
    checkModulesEqual(a.module, b.module) &&
    a.name === b.name &&
    checkTypeArgumentsEqual(a.typeParams, b.typeParams)
  );
};

const checkTypeArgumentsEqual = (
  a: readonly StructTagRaw[] | undefined,
  b: readonly StructTagRaw[] | undefined
) => {
  if (a === undefined || b === undefined) {
    return a === b;
  }
  return checkTypeListsEqual(a, b);
};

const checkTypeListsEqual = (
  a: readonly StructTagRaw[],
  b: readonly StructTagRaw[]
) => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    const at = a[i];
    const bt = b[i];
    invariant(at && bt, "type lists zip");
    if (!checkTypesEqual(at, bt)) {
      return false;
    }
  }
  return true;
};

/**
 * Represents a Struct type.
 *
 * This is analogous to `move_core_types::language_storage::StructTag` in Move.
 */
export class StructTag implements StructTagRaw {
  /**
   * Module information.
   */
  readonly module: ModuleId;
  /**
   * Type parameters.
   *
   * TODO(igm): this should support more than just {@link StructTag}s.
   */
  readonly typeParams?: readonly StructTag[];

  constructor(readonly raw: StructTagRaw) {
    this.module = new ModuleId(raw.module);
    this.typeParams = raw.typeParams?.map((t) => new StructTag(t));
  }

  /**
   * Parse the {@link StructTag} from the fullyQualifiedName.
   * @param fullyQualifiedName
   * @returns
   */
  static parse(fullyQualifiedName: string) {
    return parseStructTag(fullyQualifiedName);
  }

  /**
   * Name of the struct.
   */
  get name(): string {
    return this.raw.name;
  }

  /**
   * Formats the module name.
   */
  format(): string {
    return formatStructTag(this);
  }

  equals(other: StructTagRaw): boolean {
    return checkTypesEqual(this, other);
  }

  toJSON(): StructTagRaw {
    return {
      __typename: "MoveType",
      ...this.raw,
    };
  }
}

const TOKENS = {
  NAMESPACE: /^::/,
  START_GENERIC: /^</,
  END_GENERIC: /^>/,
  COMMA: /^,/,
  IDENT: /^\w+/,
};

type TypeToken = keyof typeof TOKENS;

type TypeTokenInfo =
  | { type: Exclude<TypeToken, "IDENT"> }
  | {
      type: "IDENT";
      value: string;
    };

const tokenize = (fqn: string) => {
  let buf = fqn;
  const tokens: TypeTokenInfo[] = [];
  while (buf) {
    for (const [name, token] of Object.entries(TOKENS) as [
      TypeToken,
      RegExp
    ][]) {
      const match = buf.match(token);
      if (match) {
        const value = match[0] ?? "";
        if (name === "IDENT") {
          tokens.push({ type: name, value });
        } else {
          tokens.push({ type: name });
        }
        buf = buf.slice(value.length - 1);
        break;
      }
    }
    buf = buf.slice(1);
  }
  return tokens;
};

const parseName = (tokens: TypeTokenInfo[]): StructTagRaw => {
  const [address, ns1, identifier, ns2, name, ...rest] = tokens;
  if (ns1?.type !== "NAMESPACE") {
    throw new Error(`expected namespace`);
  }
  if (ns2?.type !== "NAMESPACE") {
    throw new Error(`expected namespace`);
  }
  if (address?.type !== "IDENT") {
    throw new Error(`missing address`);
  }
  if (identifier?.type !== "IDENT") {
    throw new Error(`missing identifier`);
  }
  if (name?.type !== "IDENT") {
    throw new Error(`missing name`);
  }

  const typeArguments: StructTagRaw[] = [];
  if (rest.length > 0) {
    if (rest[0]?.type !== "START_GENERIC") {
      throw new Error(`expected START_GENERIC`);
    }
    if (rest[rest.length - 1]?.type !== "END_GENERIC") {
      throw new Error(`expected END_GENERIC`);
    }
    const inner = rest.slice(1, rest.length - 1);

    // get generic parts
    let parts = [] as TypeTokenInfo[];
    let stackDepth = 0;
    inner.forEach((el) => {
      if (el.type === "START_GENERIC") {
        stackDepth += 1;
      } else if (el.type === "END_GENERIC") {
        stackDepth -= 1;
      }
      if (el.type === "COMMA" && stackDepth === 0) {
        typeArguments.push(parseName(parts));
        parts = [];
      } else {
        parts.push(el);
      }
    });
    typeArguments.push(parseName(parts));
  }

  const ret: StructTagRaw = {
    module: { addressHex: address.value, identifier: identifier.value },
    name: name.value,
  };
  if (typeArguments.length > 0) {
    return {
      ...ret,
      typeParams: typeArguments,
    };
  }
  return ret;
};
