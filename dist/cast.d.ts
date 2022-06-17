import { Maybe, Guard, Convert } from "./internal.js";
declare type CastSomeOf<T extends Cast<any>[]> = T extends Guard<any>[] ? Guard<T[number] extends Guard<infer R> ? R : never> : T extends Cast<any>[] ? Cast<T[number] extends Cast<infer R> ? R : never> : never;
export declare class Cast<T> {
    readonly cast: (value: unknown) => Maybe<T>;
    constructor(cast: (value: unknown) => Maybe<T>);
    static readonly asUnknown: Cast<unknown>;
    static readonly asNever: Cast<never>;
    static just<T>(value: T): Cast<T>;
    static nothing<T = never>(): Cast<T>;
    static try<T>(get: () => T): Cast<T>;
    read<R>(ifValue: (left: T) => R, ifNothing: () => R): (value: unknown) => T | R;
    bind<R>(next: (t: T) => Cast<R>): Cast<R>;
    compose<R>(next: Cast<R> | (() => Cast<R>)): Cast<R>;
    or<R>(right: Convert<R>): Convert<T | R>;
    or<R>(right: Cast<R>): Cast<T | R>;
    static some<T extends Cast<any>[]>(...options: T): CastSomeOf<T>;
    if(condition: (input: T) => boolean): Cast<T>;
    and<R>(guard: Guard<R>): Cast<T & R>;
    map<R>(next: (t: T) => R): Cast<R>;
    else<R>(other: R): Convert<T | R>;
    static get asPrimitiveValue(): Cast<PrimitiveValue>;
    static get asString(): Cast<string>;
    static get asNumber(): Cast<number>;
    static get asBigint(): Cast<bigint>;
    static get asBoolean(): Cast<boolean>;
    static get asArray(): Cast<unknown[]>;
    get orDont(): Convert<unknown>;
    get asPrimitiveValue(): Cast<PrimitiveValue>;
    get asString(): Cast<string>;
    get asNumber(): Cast<number>;
    get asBigint(): Cast<bigint>;
    get asBoolean(): Cast<boolean>;
    get asArray(): Cast<unknown[]>;
}
export {};
//# sourceMappingURL=cast.d.ts.map