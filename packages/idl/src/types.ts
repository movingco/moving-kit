export interface IDLPackage {
  name: string;
  modules: { readonly [id: string]: IDLModule };
  structs: readonly IDLStruct<string, string>[];
  aliases: { readonly [alias: string]: string };
}

export interface ModuleId<
  A extends string = string,
  N extends string = string
> {
  address: A;
  name: N;
}

export interface IDLStruct<A extends string, N extends string> {
  module_name: ModuleId<A, N>;
  name: string;
  fields: readonly IDLField[];
  type_params?: readonly string[];
  abilities: readonly IDLAbility[];
}

export interface IDLModule {
  doc?: string;
  functions: readonly IDLScriptFunction[];
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
        module_name: ModuleId;
        name: string;
      };
    };

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
