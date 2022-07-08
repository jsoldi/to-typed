export declare type PrimitiveValue = string | number | bigint | boolean | symbol;
export declare type Nothing = undefined | null;
export declare type Primitive = PrimitiveValue | Nothing;
export declare type Struct<S = unknown> = {
    readonly [k: string]: S;
};
export declare type Collection<S = unknown> = Struct<S> | readonly S[];
export declare type SimpleType = PrimitiveValue | Nothing | Function;
export declare type SimpleTypeOf<T extends SimpleType> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T extends bigint ? bigint : T extends symbol ? symbol : T extends undefined ? undefined : T extends Function ? Function : T extends null ? null : never;
//# sourceMappingURL=types.d.ts.map