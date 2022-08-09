import { Cast, CastSettings, TCastAll } from "./internal.js";
import { Collection, Primitive, SimpleType, SimpleTypeOf, Struct } from "./types.js";
export declare type TConvertMap<T> = T extends SimpleType ? SimpleTypeOf<T> : T extends Convert<infer R> ? R : T extends {
    [k in keyof T]: any;
} ? {
    [k in keyof T]: TConvertMap<T[k]>;
} : unknown;
declare type ConvertObject<T> = {
    readonly [k in keyof T]: Convert<T[k]>;
};
export declare class Convert<T = unknown> extends Cast<T> {
    private readonly _convert;
    private _obj;
    constructor(_convert: (value: unknown, settings: CastSettings) => T);
    static lazy<T>(fun: (s: CastSettings) => Convert<T>): Convert<T>;
    convert(value: unknown): T;
    convert(value: unknown, settings: CastSettings): T;
    get obj(): ConvertObject<T>;
    config(config: Partial<CastSettings>): Convert<T>;
    static readonly id: Convert<unknown>;
    static toConst<T>(value: T): Convert<T>;
    compose<R>(g: Convert<R>): Convert<R>;
    map<R>(fun: (value: T) => R): Convert<R>;
    /**
     * Converts to a union of the given options, and defaults to the first option.
     * @param options an array of options to choose from, where the first option is the default
     * @returns a `Convert` that converts to a union
     */
    static toEnum<R extends readonly [
        Primitive,
        ...Primitive[]
    ]>(...options: R): Convert<R[number]>;
    static toString(alt?: string): Convert<string>;
    static toNumber(alt?: number): Convert<number>;
    static toFinite(alt?: number): Convert<number>;
    static toInteger(alt?: number): Convert<number>;
    static toBoolean(alt?: boolean): Convert<boolean>;
    static toTruthy(): Convert<boolean>;
    static toBigInt(alt?: bigint): Convert<bigint>;
    static toDate(alt?: Date): Convert<Date>;
    static toArray(alt?: unknown[]): Convert<unknown[]>;
    static toArrayOf<T>(convertItem: Convert<T>, alt?: T[]): Convert<T[]>;
    static toStructOf<T>(convertItem: Convert<T>, alt?: Struct<T>): Convert<Struct<T>>;
    /**
     * Given an object or tuple of converts, it produces a convert that outputs an object or tuple having the same shape as the given converts.
     * @param casts an object or tuple of converts
     * @returns a convert that produces an object or tuple matching the shape of the given converts
     */
    static toCollectionLike<T extends Collection<Convert>>(converts: T): Convert<TCastAll<T>>;
    /**
     * Produces a convert that filters out values from the input that could not be casted by the given cast.
     * @param cast the cast to use for filtering
     * @returns a convert that filters out values that could not be casted by the given cast
     */
    static toArrayWhere<T>(cast: Cast<T>): Convert<T[]>;
    /**
     * Creates a `Convert` based on the given sample value, which is also used as the set of default values.
     * @param alt a sample value which also serves as the set of default values
     * @returns a `Convert` based on the given sample value
     */
    static to<T>(alt: T): Convert<TConvertMap<T>>;
    toEnum<R extends readonly [
        Primitive,
        ...Primitive[]
    ]>(...options: R): Convert<R[number]>;
    toString(alt?: string): Convert<string>;
    toNumber(alt?: number): Convert<number>;
    toBoolean(alt?: boolean): Convert<boolean>;
    toBigInt(alt?: bigint): Convert<bigint>;
    toDate(alt?: Date): Convert<Date>;
    toArray<T>(convertItem: Convert<T>, alt?: T[]): Convert<T[]>;
    toArrayOf<T>(convertItem: Convert<T>, alt?: T[]): Convert<T[]>;
    toStructOf<T>(convertItem: Convert<T>, alt?: Struct<T>): Convert<Struct<T>>;
    toCollectionLike<T extends Collection<Convert>>(converts: T): Convert<TCastAll<T>>;
    toArrayWhere<T>(cast: Cast<T>): Convert<T[]>;
    to<T>(alt: T): Convert<TConvertMap<T>>;
}
export {};
