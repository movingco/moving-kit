export interface MoveModuleId {
  readonly address: string;
  readonly identifier: string;
}

export interface MoveType {
  readonly module: MoveModuleId;
  readonly name: string;
  /**
   * Type arguments for the generic, if applicable.
   */
  readonly typeArguments?: readonly MoveType[];
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

const parseName = (tokens: TypeTokenInfo[]): MoveType => {
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

  const typeArguments: MoveType[] = [];
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

  const ret: MoveType = {
    module: { address: address.value, identifier: identifier.value },
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

export const parseMoveType = (fullyQualifiedName: string): MoveType => {
  const tokens = tokenize(fullyQualifiedName);
  return parseName(tokens);
};
