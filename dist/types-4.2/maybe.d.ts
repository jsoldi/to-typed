declare type MaybeValues = {
    readonly [k: string]: Maybe<unknown>;
} | readonly Maybe<unknown>[];
declare type TMaybeAll<T extends MaybeValues> = {
    [I in keyof T]: T[I] extends Maybe<infer V> ? V : never;
};
interface Just<T> extends MaybeBase<T> {
    hasValue: true;
    value: T;
}
interface Nothing<T> extends MaybeBase<T> {
    hasValue: false;
    error: Error;
}
export declare type Maybe<T> = Just<T> | Nothing<T>;
declare class MaybeBase<T> {
    private readonly data;
    private static readonly defaultError;
    private constructor();
    static just<T>(value: T): Maybe<T>;
    static nothing<T = never>(error?: Error): Maybe<T>;
    get hasValue(): boolean;
    get value(): T | undefined;
    get error(): Error | undefined;
    static all<T extends MaybeValues>(maybes: T): Maybe<TMaybeAll<T>>;
    static any<T>(maybes: Maybe<T>[]): T[];
    read<R>(ifValue: (left: T) => R): R | void;
    read<R>(ifValue: (left: T) => R, ifNothing: (error: Error) => R): R;
    bind<R>(next: (value: T) => Maybe<R>): Maybe<R>;
    map<R>(next: (value: T) => R): Maybe<R>;
    or<R>(right: Maybe<R>): Maybe<T | R>;
    else<R>(getAlt: (error: Error) => R): T | R;
    elseThrow(getError?: (error: Error) => Error): T;
}
export declare const Maybe: typeof MaybeBase;
export {};
