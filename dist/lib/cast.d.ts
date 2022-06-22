import { Maybe, Guard, Convert } from "./internal.js";
import { Collection, Primitive, PrimitiveValue, SimpleType, SimpleTypeOf } from "./types.js";
declare type CastSome<T extends readonly Cast<unknown>[]> = T extends Guard<any>[] ? Guard<T[number] extends Guard<infer R> ? R : never> : T extends Cast<any>[] ? Cast<T[number] extends Cast<infer R> ? R : never> : never;
export declare type TCastAll<T extends Collection<Cast>> = {
    [I in keyof T]: T[I] extends Cast<infer V> ? V : never;
};
declare type TCastMap<T> = T extends SimpleType ? SimpleTypeOf<T> : T extends Cast<infer R> ? R : T extends {
    [k in keyof T]: any;
} ? {
    [k in keyof T]: TCastMap<T[k]>;
} : unknown;
export declare class Cast<out T = unknown> {
    readonly cast: (value: unknown) => Maybe<T>;
    constructor(cast: (value: unknown) => Maybe<T>);
    static readonly asUnknown: Cast<unknown>;
    static readonly asNever: Cast<never>;
    static maybe<T>(maybe: Maybe<T>): Cast<T>;
    static just<T>(value: T): Cast<T>;
    static nothing<T = never>(): Cast<T>;
    static try<T>(get: () => T): Cast<T>;
    read<R>(ifValue: (left: T) => R, ifNothing: () => R): (value: unknown) => R;
    bind<R>(next: (t: T) => Cast<R>): Cast<R>;
    compose<R>(next: Cast<R>): Cast<R>;
    or<R>(right: Convert<R>): Convert<T | R>;
    or<R>(right: Cast<R>): Cast<T | R>;
    static some<T extends readonly Cast<unknown>[]>(options: T): CastSome<T>;
    static all<T extends Collection<Cast>>(casts: T): Cast<TCastAll<T>>;
    if(condition: (input: T) => boolean): Cast<T>;
    and<R>(guard: Guard<R>): Cast<T & R>;
    map<R>(next: (t: T) => R): Cast<R>;
    else<R>(other: R): Convert<T | R>;
    get elseThrow(): Convert<T>;
    static get asPrimitiveValue(): Cast<PrimitiveValue>;
    static get asString(): Cast<string>;
    static get asNumber(): Cast<number>;
    static get asFinite(): Cast<number>;
    static get asInteger(): Cast<number>;
    static get asBigint(): Cast<bigint>;
    static get asBoolean(): Cast<boolean>;
    static get asArray(): Cast<unknown[]>;
    static get asCollection(): Cast<Collection>;
    static asConst<T extends Primitive>(value: T): Cast<T>;
    static asEnum<T extends readonly Primitive[]>(options: T): Cast<T[number]>;
    static asArrayOf<T>(cast: Cast<T>): Cast<T[]>;
    static asCollectionOf<T extends Collection<Cast>>(casts: T): Cast<TCastAll<T>>;
    static as<T>(alt: T): Cast<TCastMap<T>>;
    get asPrimitiveValue(): Cast<PrimitiveValue>;
    get asString(): Cast<string>;
    get asNumber(): Cast<number>;
    get asBigint(): Cast<bigint>;
    get asBoolean(): Cast<boolean>;
    get asArray(): Cast<unknown[]>;
    asConst<T extends PrimitiveValue>(value: T): Cast<T>;
    asEnum<T extends readonly Primitive[]>(options: T): Cast<T[number]>;
    asArrayOf<T>(cast: Cast<T>): Cast<T[]>;
    asCollectionOf<T extends Collection<Cast>>(casts: T): Cast<TCastAll<T>>;
    as<T>(alt: T): Cast<TCastMap<T>>;
}
export {};
//# sourceMappingURL=cast.d.ts.map