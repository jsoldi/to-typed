/*
    There are 8 values that typeof can return: string, number, bigint, boolean, symbol, undefined, object, and function.
    Values that are typeof object can be further split into null and non-null object.
    
    I'm partitioning these 9 sets into 3 groups:

    - PrimitiveValue: string, number, bigint, boolean, symbol. 
        - TS Type: PrimitiveValues
        - Guard: isPrimitiveValue
    - Nothing: undefined and null
        - TS Type: Nothing
        - Guard: isNothing
    - object: non-null object and function
        - TS Type: object
        - Guard: isObject

    So far, the TypeScript object type seems to exactly match values that are typeof function or non-null object.
*/

export type PrimitiveValue = string | number | bigint | boolean | symbol
export type Nothing = undefined | null
type Anything = PrimitiveValue | Nothing | object // The 3 main type partitions

export type Primitive = PrimitiveValue | Nothing
export type Struct<S = unknown> = { readonly [k: string]: S };
export type Collection<S = unknown> = Struct<S> | readonly S[]

export type SimpleType = PrimitiveValue | Nothing | Function;

export type SimpleTypeOf<T extends SimpleType> = 
    T extends string ? string :
    T extends number ? number :
    T extends boolean ? boolean :
    T extends bigint ? bigint :
    T extends symbol ? symbol :
    T extends undefined ? undefined :
    T extends Function ? Function :
    T extends null ? null :
    never;
