import { Cast, CastSettings, TCastMap } from "./internal.js";
import { Collection, Primitive, SimpleType, SimpleTypeOf, Struct } from "./types.js";
declare type TConvertMap<T> = T extends SimpleType ? SimpleTypeOf<T> : T extends Convert<infer R> ? R : T extends {
    [k in keyof T]: any;
} ? {
    [k in keyof T]: TConvertMap<T[k]>;
} : unknown;
export declare class Convert<T = unknown> extends Cast<T> {
    private readonly _convert;
    constructor(_convert: (value: unknown, settings: CastSettings) => T);
    static lazy<T>(fun: (s: CastSettings) => Convert<T>): Convert<T>;
    convert(value: unknown): T;
    convert(value: unknown, settings: CastSettings): T;
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
    protected static toCollectionLike<T extends Collection<Convert>>(converts: T): Convert<TCastMap<T>>;
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
    protected toCollectionLike<T extends Collection<Convert>>(converts: T): Convert<TCastMap<T>>;
    toArrayWhere<T>(cast: Cast<T>): Convert<T[]>;
    to<T>(alt: T): Convert<TConvertMap<T>>;
}
export {};
