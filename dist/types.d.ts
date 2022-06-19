declare type PrimitiveValue = string | number | bigint | boolean | symbol;
declare type Nothing = undefined | null;
declare type Anything = PrimitiveValue | Nothing | object;
declare type Struct<S = unknown> = {
    readonly [k: string]: S;
};
declare type Collection<S = unknown> = Struct<S> | readonly S[];
//# sourceMappingURL=types.d.ts.map