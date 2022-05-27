export interface IDLPackage {
  name: string;
  modules: Record<string, IDLModule>;
  structs: readonly IDLStruct[];
  aliases: Record<string, string>;
}

export interface ModuleId {
  address: string;
  name: string;
}

export interface IDLStruct {
  module_name: ModuleId;
  name: string;
  fields: readonly IDLField[];
  type_params?: readonly string[];
  abilities: readonly IDLAbility[];
}

export interface IDLModule {
  doc?: string;
  functions: IDLScriptFunction[];
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
  type_tag: string;
}

export interface IDLScriptFunction {
  name: string;
  doc?: string;
  ty_args: readonly string[];
  args: readonly IDLArgument[];
}
