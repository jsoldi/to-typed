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
    static unit<T>(value: T): Convert<T>;
    static toEnum<T extends [any, ...any]>(...options: T): Convert<T[number]>;
    static toString(alt?: string): Convert<string>;
    static toNumber(alt?: number): Convert<number>;
    static toBoolean(alt?: boolean): Convert<boolean>;
    static toBigInt(alt?: bigint): Convert<bigint>;
    static toArray<T>(convertItem: Convert<T>): Convert<T[]>;
    static toObject<T extends Record<string, Convert<any>>>(convertValues: T): Convert<ConvertObject<T>>;
    static to<T>(alt: T): Convert<CastMap<T>>;
}
export {};
//# sourceMappingURL=convert.d.ts.map