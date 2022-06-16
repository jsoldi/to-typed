import { Maybe, Guard, Convert } from "./internal.js";
export declare class Cast<T> {
    readonly cast: (value: unknown) => Maybe<T>;
    constructor(cast: (value: unknown) => Maybe<T>);
    static just<T>(value: T): Cast<T>;
    static nothing<T = never>(): Cast<T>;
    static try<T>(get: () => T): Cast<T>;
    read<R>(ifValue: (left: T) => R, ifNothing: () => R): (value: unknown) => T | R;
    bind<R>(next: (t: T) => Cast<R>): Cast<R>;
    compose<R>(next: Cast<R> | (() => Cast<R>)): Cast<R>;
    or<R>(right: Cast<R>): Cast<T | R>;
    and<R>(guard: Guard<R>): Cast<T & R>;
    map<R>(next: (t: T) => R): Cast<R>;
    else<R>(other: R): Convert<T | R>;
    static get asPrimitiveValue(): Cast<PrimitiveValue>;
    static get asString(): Cast<string>;
    static get asNumber(): Cast<number>;
    static get asBigint(): Cast<bigint>;
    static get asBoolean(): Cast<boolean>;
    static get asArray(): Cast<unknown[]>;
}
//# sourceMappingURL=cast.d.ts.map