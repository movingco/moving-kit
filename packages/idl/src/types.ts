export interface IDLPackage {
  name: string;
  modules: { [id: string]: IDLModule<string, string> };
  aliases: { readonly [alias: string]: string };
  dependencies: { [id: string]: IDLModule<string, string> };
  structs: readonly IDLStruct<string, string>[];
}

export interface ModuleId<
  A extends string = string,
  N extends string = string
> {
  address: A;
  name: N;
}

export interface IDLStruct<A extends string, N extends string> {
  name: `${A}::${N}::${string}`;
  fields: readonly IDLField[];
  type_params?: readonly string[];
  abilities: readonly IDLAbility[];
}

export interface IDLError {
  name: string;
  doc?: string;
}

export interface IDLModule<A extends string, N extends string> {
  module_id: `${A}::${N}`;
  doc?: string;
  functions: readonly IDLScriptFunction[];
  structs: readonly IDLStruct<A, N>[];
  errors: {
    [code: string]: IDLError;
  };
}

export type IDLAbility = "copy" | "drop" | "store" | "key";

export interface IDLField {
  name: string;
  doc?: string;
  ty: IDLType;
}

export type IDLType =
  | "bool"
  | "u8"
  | "u64"
  | "u128"
  | "address"
  | "signer"
  | {
      struct: {
        name: string;
        ty_args?: readonly IDLType[];
      };
    }
  | { vector: IDLType }
  | { tuple: readonly IDLType[] };

export interface IDLField {
  name: string;
  doc?: string;
  ty: IDLType;
}

export interface IDLArgument {
  name: string;
  ty: IDLType;
}

export interface IDLScriptFunction {
  name: string;
  doc?: string;
  ty_args: readonly string[];
  args: readonly IDLArgument[];
}
