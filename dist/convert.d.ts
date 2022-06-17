import { Cast } from "./internal.js";
declare type ConvertObject<T extends Record<string, Convert<any>>> = {
    [K in keyof T]: T[K] extends Convert<infer R> ? R : never;
};
declare type CastMap<T> = T extends Convert<infer R> ? R : T extends Array<infer I> ? Array<CastMap<I>> : T extends {
    [k in keyof T]: any;
} ? {
    [k in keyof T]: CastMap<T[k]>;
} : T;
export declare class Convert<T> extends Cast<T> {
    readonly convert: (value: unknown) => T;
    constructor(convert: (value: unknown) => T);
    static readonly id: Convert<unknown>;
    static unit<T>(value: T): Convert<T>;
    compose<R>(g: Convert<R> | (() => Convert<R>)): Convert<R>;
    static toEnum<R extends [any, ...any]>(...options: R): Convert<R[number]>;
    static toString(alt?: string): Convert<string>;
    static toNumber(alt?: number): Convert<number>;
    static toBoolean(alt?: boolean): Convert<boolean>;
    static toBigInt(alt?: bigint): Convert<bigint>;
    static toArray<T>(convertItem: Convert<T>): Convert<T[]>;
    static toObject<T extends Record<string, Convert<any>>>(convertValues: T): Convert<ConvertObject<T>>;
    static to<T>(alt: T): Convert<CastMap<T>>;
    toEnum<R extends [any, ...any]>(...options: R): Convert<R[number]>;
    toString(alt?: string): Convert<string>;
    toNumber(alt?: number): Convert<number>;
    toBoolean(alt?: boolean): Convert<boolean>;
    toBigInt(alt?: bigint): Convert<bigint>;
    toArray<T>(convertItem: Convert<T>): Convert<T[]>;
    toObject<T extends Record<string, Convert<any>>>(convertValues: T): Convert<ConvertObject<T>>;
    to<T>(alt: T): Convert<CastMap<T>>;
}
export {};
//# sourceMappingURL=convert.d.ts.map