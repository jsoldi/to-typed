declare type MaybeValues = {
    readonly [k: string]: Maybe<unknown>;
} | readonly Maybe<unknown>[];
declare type TMaybeAll<T extends MaybeValues> = {
    [I in keyof T]: T[I] extends Maybe<infer V> ? V : never;
};
export declare class Maybe<out T> {
    readonly hasValue: boolean;
    private readonly value;
    private constructor();
    static just<T>(value: T): Maybe<T>;
    static nothing<T = never>(): Maybe<T>;
    static all<T extends MaybeValues>(maybes: T): Maybe<TMaybeAll<T>>;
    elseThrow(getError?: () => Error): T;
    read<R>(ifValue: (left: T) => R, ifNothing: () => R): R;
    bind<R>(next: (value: T) => Maybe<R>): Maybe<R>;
    map<R>(next: (value: T) => R): Maybe<R>;
    or<R>(right: Maybe<R>): Maybe<T | R>;
    else<R>(getAlt: () => R): T | R;
}
export {};
//# sourceMappingURL=maybe.d.ts.map