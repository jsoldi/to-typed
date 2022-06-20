declare type PrimitiveValue = string | number | bigint | boolean | symbol;
declare type Nothing = undefined | null;
declare type Anything = PrimitiveValue | Nothing | object;
declare type Struct<S = unknown> = {
    readonly [k: string]: S;
};
declare type Collection<S = unknown> = Struct<S> | readonly S[];
declare type SimpleType = PrimitiveValue | Nothing | Function;
declare type SimpleTypeOf<T extends SimpleType> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T extends bigint ? bigint : T extends symbol ? symbol : T extends undefined ? undefined : T extends Function ? Function : T extends null ? null : never;
//# sourceMappingURL=types.d.ts.map