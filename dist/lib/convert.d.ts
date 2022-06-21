import { Cast } from "./internal.js";
import { Collection, Primitive, SimpleType, SimpleTypeOf } from "./types.js";
declare type TConvertMap<T> = T extends SimpleType ? SimpleTypeOf<T> : T extends Convert<infer R> ? R : T extends {
    [k in keyof T]: any;
} ? {
    [k in keyof T]: TConvertMap<T[k]>;
} : unknown;
export declare class Convert<out T = unknown> extends Cast<T> {
    readonly convert: (value: unknown) => T;
    constructor(convert: (value: unknown) => T);
    static readonly id: Convert<unknown>;
    static unit<T>(value: T): Convert<T>;
    compose<R>(g: Convert<R>): Convert<R>;
    map<R>(fun: (value: T) => R): Convert<R>;
    static toEnum<R extends readonly [Primitive, ...Primitive[]]>(options: R): Convert<R[number]>;
    static toString(alt?: string): Convert<string>;
    static toNumber(alt?: number): Convert<number>;
    static toFinite(alt?: number): Convert<number>;
    static toInteger(alt?: number): Convert<number>;
    static toBoolean(alt?: boolean): Convert<boolean>;
    static toTruthy(alt?: boolean): Convert<boolean>;
    static toBigInt(alt?: bigint): Convert<bigint>;
    static toArray(alt?: unknown[]): Convert<unknown[]>;
    static toArrayOf<T>(convertItem: Convert<T>, alt?: T[]): Convert<T[]>;
    static toCollectionOf<T extends Collection<Convert>>(converts: T): Convert<import("./cast.js").TCastAll<T>>;
    static to<T>(alt: T): Convert<TConvertMap<T>>;
    toEnum<R extends readonly [Primitive, ...Primitive[]]>(options: R): Convert<R[number]>;
    toString(alt?: string): Convert<string>;
    toNumber(alt?: number): Convert<number>;
    toBoolean(alt?: boolean): Convert<boolean>;
    toBigInt(alt?: bigint): Convert<bigint>;
    toArray<T>(convertItem: Convert<T>, alt?: T[]): Convert<T[]>;
    toArrayOf<T>(convertItem: Convert<T>, alt?: T[]): Convert<T[]>;
    toCollectionOf<T extends Collection<Convert>>(converts: T): Convert<import("./cast.js").TCastAll<T>>;
    to<T>(alt: T): Convert<TConvertMap<T>>;
}
export {};
//# sourceMappingURL=convert.d.ts.map