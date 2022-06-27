import { Maybe, Guard, Convert } from "./internal.js";
import { Collection, Primitive, PrimitiveValue, SimpleType, SimpleTypeOf, Struct } from "./types.js";
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
    /**
     * Unions a list of casts by combining them with the `or` operator.
     * @param options An array of casts.
     * @returns The union of the given casts.
     */
    static some<T extends readonly Cast<unknown>[]>(...options: T): CastSome<T>;
    /**
     * Produces a cast that applies each cast in the given collection to the input value.
     * @param casts A collection of casts.
     * @returns A cast that returns a collection of results, or nothing if any cast fails.
     */
    static all<T extends Collection<Convert>>(casts: T): Convert<TCastAll<T>>;
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
    static get asBigInt(): Cast<bigint>;
    static get asBoolean(): Cast<boolean>;
    static get asArray(): Cast<unknown[]>;
    static get asCollection(): Cast<Collection>;
    static asConst<T extends Primitive>(value: T): Cast<T>;
    static asEnum<T extends readonly Primitive[]>(options: T): Cast<T[number]>;
    protected static asCollectionOf<T>(cast: Cast<T>): Cast<Collection<T>>;
    static asArrayOf<T>(cast: Cast<T>): Cast<T[]>;
    static asStructOf<T>(cast: Cast<T>): Cast<Struct<T>>;
    protected static asCollectionLike<T extends Collection<Cast>>(casts: T): Cast<TCastAll<T>>;
    static as<T>(alt: T): Cast<TCastMap<T>>;
    get asPrimitiveValue(): Cast<PrimitiveValue>;
    get asString(): Cast<string>;
    get asNumber(): Cast<number>;
    get asBigInt(): Cast<bigint>;
    get asBoolean(): Cast<boolean>;
    get asArray(): Cast<unknown[]>;
    asConst<T extends PrimitiveValue>(value: T): Cast<T>;
    asEnum<T extends readonly Primitive[]>(options: T): Cast<T[number]>;
    protected asCollectionOf<T>(cast: Cast<T>): Cast<Collection<T>>;
    asArrayOf<T>(cast: Cast<T>): Cast<T[]>;
    asStructOf<T>(cast: Cast<T>): Cast<Struct<T>>;
    protected asCollectionLike<T extends Collection<Cast>>(casts: T): Cast<TCastAll<T>>;
    as<T>(alt: T): Cast<TCastMap<T>>;
}
export {};
//# sourceMappingURL=cast.d.ts.map