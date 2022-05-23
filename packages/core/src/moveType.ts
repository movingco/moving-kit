import invariant from "tiny-invariant";

import { Address } from "./address";

/**
 * Serializable representation of a {@link MoveModule}.
 */
export interface MoveModuleRaw {
  readonly __typename?: "MoveModule";
  readonly addressHex: string;
  readonly identifier: string;
}

/**
 * Raw representation of a {@link MoveType}.
 */
export interface MoveTypeRaw {
  readonly __typename?: "MoveType";
  readonly module: MoveModuleRaw;
  readonly name: string;
  /**
   * Type arguments for the generic, if applicable.
   */
  readonly typeArguments?: readonly MoveTypeRaw[];
}

export class MoveModule implements MoveModuleRaw {
  /**
   * Address of the module.
   */
  readonly address: Address;

  constructor(readonly raw: MoveModuleRaw) {
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

  equals(other: MoveModuleRaw): boolean {
    return checkModulesEqual(this, other);
  }

  toJSON(): MoveModuleRaw {
    return {
      __typename: "MoveModule",
      ...this.raw,
    };
  }
}

const checkModulesEqual = (a: MoveModuleRaw, b: MoveModuleRaw): boolean =>
  a.addressHex === b.addressHex && a.identifier === b.identifier;

const checkTypesEqual = (a: MoveTypeRaw, b: MoveTypeRaw): boolean => {
  return (
    checkModulesEqual(a.module, b.module) &&
    a.name === b.name &&
    checkTypeArgumentsEqual(a.typeArguments, b.typeArguments)
  );
};

const checkTypeArgumentsEqual = (
  a: readonly MoveTypeRaw[] | undefined,
  b: readonly MoveTypeRaw[] | undefined
) => {
  if (a === undefined || b === undefined) {
    return a === b;
  }
  return checkTypeListsEqual(a, b);
};

const checkTypeListsEqual = (
  a: readonly MoveTypeRaw[],
  b: readonly MoveTypeRaw[]
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
 * Represents a Move type.
 */
export class MoveType implements MoveTypeRaw {
  readonly module: MoveModule;
  readonly typeArguments?: readonly MoveType[];

  constructor(readonly raw: MoveTypeRaw) {
    this.module = new MoveModule(raw.module);
    this.typeArguments = raw.typeArguments?.map((t) => new MoveType(t));
  }

  /**
   * Parse the {@link MoveType} from the fullyQualifiedName.
   * @param fullyQualifiedName
   * @returns
   */
  static parse(fullyQualifiedName: string) {
    return parseMoveType(fullyQualifiedName);
  }

  get name(): string {
    return this.raw.name;
  }

  /**
   * The fully qualified name of the module.
   */
  get fullyQualifiedName(): string {
    return renderMoveType(this);
  }

  equals(other: MoveTypeRaw): boolean {
    return checkTypesEqual(this, other);
  }

  toJSON(): MoveTypeRaw {
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

const parseName = (tokens: TypeTokenInfo[]): MoveTypeRaw => {
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

  const typeArguments: MoveTypeRaw[] = [];
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

  const ret: MoveTypeRaw = {
    module: { addressHex: address.value, identifier: identifier.value },
    name: name.value,
  };
  if (typeArguments.length > 0) {
    return {
      ...ret,
      typeArguments,
    };
  }
  return ret;
};

/**
 * Parses a string into a Move type.
 */
export const parseMoveType = (fullyQualifiedName: string): MoveType => {
  const tokens = tokenize(fullyQualifiedName);
  return new MoveType(parseName(tokens));
};

/**
 * Renders a {@link MoveTypeRaw}.
 * @param type
 * @returns
 */
export const renderMoveType = (type: MoveTypeRaw): string => {
  return `${type.module.addressHex}::${type.module.identifier}::${type.name}${
    type.typeArguments
      ? `<${type.typeArguments.map(renderMoveType).join(", ")}>`
      : ""
  }`;
};
