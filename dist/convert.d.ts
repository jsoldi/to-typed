import { Cast } from "./internal.js";
declare type TConvertMap<T> = T extends Convert<infer R> ? R : T extends Array<infer I> ? Array<TConvertMap<I>> : T extends {
    [k in keyof T]: any;
} ? {
    [k in keyof T]: TConvertMap<T[k]>;
} : T;
export declare class Convert<out T = unknown> extends Cast<T> {
    readonly convert: (value: unknown) => T;
    constructor(convert: (value: unknown) => T);
    static readonly id: Convert<unknown>;
    static unit<T>(value: T): Convert<T>;
    compose<R>(g: Convert<R>): Convert<R>;
    static toEnum<R extends [any, ...any]>(...options: R): Convert<R[number]>;
    static toString(alt?: string): Convert<string>;
    static toNumber(alt?: number): Convert<number>;
    static toBoolean(alt?: boolean): Convert<boolean>;
    static toBigInt(alt?: bigint): Convert<bigint>;
    static toArray(alt?: unknown[]): Convert<unknown[]>;
    static toArrayOf<T>(convertItem: Convert<T>, alt?: T[]): Convert<T[]>;
    static toCollectionOf<T extends Collection<Convert>>(converts: T): Convert<{ [I in keyof T]: T[I] extends Cast<infer V> ? V : never; }>;
    static to<T>(alt: T): Convert<TConvertMap<T>>;
    toEnum<R extends [any, ...any]>(...options: R): Convert<R[number]>;
    toString(alt?: string): Convert<string>;
    toNumber(alt?: number): Convert<number>;
    toBoolean(alt?: boolean): Convert<boolean>;
    toBigInt(alt?: bigint): Convert<bigint>;
    toArray<T>(convertItem: Convert<T>, alt?: T[]): Convert<T[]>;
    toArrayOf<T>(convertItem: Convert<T>, alt?: T[]): Convert<T[]>;
    toCollectionOf<T extends Collection<Convert>>(converts: T): Convert<{ [I in keyof T]: T[I] extends Cast<infer V> ? V : never; }>;
    to<T>(alt: T): Convert<TConvertMap<T>>;
}
export {};
//# sourceMappingURL=convert.d.ts.map