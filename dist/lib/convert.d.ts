import { Cast } from "./internal.js";
import { Collection, Primitive, SimpleType, SimpleTypeOf, Struct } from "./types.js";
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
    /**
     * Converts to a union of the given options, and defaults to the first option.
     * @param options an array of options to choose from, where the first option is the default
     * @returns a `Convert` that converts to a union
     */
    static toEnum<R extends readonly [Primitive, ...Primitive[]]>(...options: R): Convert<R[number]>;
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
    protected static toCollectionLike<T extends Collection<Convert>>(converts: T): Convert<T extends SimpleType ? SimpleTypeOf<T> : T extends Cast<infer R> ? R : T extends { [k in keyof T]: any; } ? T extends infer T_1 ? { [k_1 in keyof T_1]: T[k_1] extends infer T_2 ? T_2 extends T[k_1] ? T_2 extends SimpleType ? SimpleTypeOf<T_2> : T_2 extends Cast<infer R> ? R : T_2 extends { [k_2 in keyof T_2]: any; } ? T_2 extends infer T_3 ? { [k_3 in keyof T_3]: T_2[k_3] extends infer T_4 ? T_4 extends T_2[k_3] ? T_4 extends SimpleType ? SimpleTypeOf<T_4> : T_4 extends Cast<infer R> ? R : T_4 extends { [k_4 in keyof T_4]: any; } ? T_4 extends infer T_5 ? { [k_5 in keyof T_5]: T_4[k_5] extends infer T_6 ? T_6 extends T_4[k_5] ? T_6 extends SimpleType ? SimpleTypeOf<T_6> : T_6 extends Cast<infer R> ? R : T_6 extends { [k_6 in keyof T_6]: any; } ? T_6 extends infer T_7 ? { [k_7 in keyof T_7]: T_6[k_7] extends infer T_8 ? T_8 extends T_6[k_7] ? T_8 extends SimpleType ? SimpleTypeOf<T_8> : T_8 extends Cast<infer R> ? R : T_8 extends { [k_8 in keyof T_8]: any; } ? T_8 extends infer T_9 ? { [k_9 in keyof T_9]: T_8[k_9] extends infer T_10 ? T_10 extends T_8[k_9] ? T_10 extends SimpleType ? SimpleTypeOf<T_10> : T_10 extends Cast<infer R> ? R : T_10 extends { [k_10 in keyof T_10]: any; } ? T_10 extends infer T_11 ? { [k_11 in keyof T_11]: T_10[k_11] extends infer T_12 ? T_12 extends T_10[k_11] ? T_12 extends SimpleType ? SimpleTypeOf<T_12> : T_12 extends Cast<infer R> ? R : T_12 extends { [k_12 in keyof T_12]: any; } ? T_12 extends infer T_13 ? { [k_13 in keyof T_13]: T_12[k_13] extends infer T_14 ? T_14 extends T_12[k_13] ? T_14 extends SimpleType ? SimpleTypeOf<T_14> : T_14 extends Cast<infer R> ? R : T_14 extends { [k_14 in keyof T_14]: any; } ? T_14 extends infer T_15 ? { [k_15 in keyof T_15]: T_14[k_15] extends infer T_16 ? T_16 extends T_14[k_15] ? T_16 extends SimpleType ? SimpleTypeOf<T_16> : T_16 extends Cast<infer R> ? R : T_16 extends { [k_16 in keyof T_16]: any; } ? T_16 extends infer T_17 ? { [k_17 in keyof T_17]: T_16[k_17] extends infer T_18 ? T_18 extends T_16[k_17] ? T_18 extends SimpleType ? SimpleTypeOf<T_18> : T_18 extends Cast<infer R> ? R : T_18 extends { [k_18 in keyof T_18]: any; } ? T_18 extends infer T_19 ? { [k_19 in keyof T_19]: T_18[k_19] extends infer T_20 ? T_20 extends T_18[k_19] ? T_20 extends SimpleType ? SimpleTypeOf<T_20> : T_20 extends Cast<infer R> ? R : T_20 extends { [k_20 in keyof T_20]: any; } ? T_20 extends infer T_21 ? { [k_21 in keyof T_21]: any; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown>;
    /**
     * Creates a `Convert` based on the given sample value, which is also used as the set of default values.
     * @param alt a sample value which also serves as the set of default values
     * @returns a `Convert` based on the given sample value
     */
    static to<T>(alt: T): Convert<TConvertMap<T>>;
    toEnum<R extends readonly [Primitive, ...Primitive[]]>(...options: R): Convert<[...R][number]>;
    toString(alt?: string): Convert<string>;
    toNumber(alt?: number): Convert<number>;
    toBoolean(alt?: boolean): Convert<boolean>;
    toBigInt(alt?: bigint): Convert<bigint>;
    toDate(alt?: Date): Convert<Date>;
    toArray<T>(convertItem: Convert<T>, alt?: T[]): Convert<T[]>;
    toArrayOf<T>(convertItem: Convert<T>, alt?: T[]): Convert<T[]>;
    toStructOf<T>(convertItem: Convert<T>, alt?: Struct<T>): Convert<Struct<T>>;
    protected toCollectionLike<T extends Collection<Convert>>(converts: T): Convert<T extends SimpleType ? SimpleTypeOf<T> : T extends Cast<infer R> ? R : T extends { [k in keyof T]: any; } ? T extends infer T_1 ? { [k_1 in keyof T_1]: T[k_1] extends infer T_2 ? T_2 extends T[k_1] ? T_2 extends SimpleType ? SimpleTypeOf<T_2> : T_2 extends Cast<infer R> ? R : T_2 extends { [k_2 in keyof T_2]: any; } ? T_2 extends infer T_3 ? { [k_3 in keyof T_3]: T_2[k_3] extends infer T_4 ? T_4 extends T_2[k_3] ? T_4 extends SimpleType ? SimpleTypeOf<T_4> : T_4 extends Cast<infer R> ? R : T_4 extends { [k_4 in keyof T_4]: any; } ? T_4 extends infer T_5 ? { [k_5 in keyof T_5]: T_4[k_5] extends infer T_6 ? T_6 extends T_4[k_5] ? T_6 extends SimpleType ? SimpleTypeOf<T_6> : T_6 extends Cast<infer R> ? R : T_6 extends { [k_6 in keyof T_6]: any; } ? T_6 extends infer T_7 ? { [k_7 in keyof T_7]: T_6[k_7] extends infer T_8 ? T_8 extends T_6[k_7] ? T_8 extends SimpleType ? SimpleTypeOf<T_8> : T_8 extends Cast<infer R> ? R : T_8 extends { [k_8 in keyof T_8]: any; } ? T_8 extends infer T_9 ? { [k_9 in keyof T_9]: T_8[k_9] extends infer T_10 ? T_10 extends T_8[k_9] ? T_10 extends SimpleType ? SimpleTypeOf<T_10> : T_10 extends Cast<infer R> ? R : T_10 extends { [k_10 in keyof T_10]: any; } ? T_10 extends infer T_11 ? { [k_11 in keyof T_11]: T_10[k_11] extends infer T_12 ? T_12 extends T_10[k_11] ? T_12 extends SimpleType ? SimpleTypeOf<T_12> : T_12 extends Cast<infer R> ? R : T_12 extends { [k_12 in keyof T_12]: any; } ? T_12 extends infer T_13 ? { [k_13 in keyof T_13]: T_12[k_13] extends infer T_14 ? T_14 extends T_12[k_13] ? T_14 extends SimpleType ? SimpleTypeOf<T_14> : T_14 extends Cast<infer R> ? R : T_14 extends { [k_14 in keyof T_14]: any; } ? T_14 extends infer T_15 ? { [k_15 in keyof T_15]: T_14[k_15] extends infer T_16 ? T_16 extends T_14[k_15] ? T_16 extends SimpleType ? SimpleTypeOf<T_16> : T_16 extends Cast<infer R> ? R : T_16 extends { [k_16 in keyof T_16]: any; } ? T_16 extends infer T_17 ? { [k_17 in keyof T_17]: T_16[k_17] extends infer T_18 ? T_18 extends T_16[k_17] ? T_18 extends SimpleType ? SimpleTypeOf<T_18> : T_18 extends Cast<infer R> ? R : T_18 extends { [k_18 in keyof T_18]: any; } ? T_18 extends infer T_19 ? { [k_19 in keyof T_19]: T_18[k_19] extends infer T_20 ? T_20 extends T_18[k_19] ? T_20 extends SimpleType ? SimpleTypeOf<T_20> : T_20 extends Cast<infer R> ? R : T_20 extends { [k_20 in keyof T_20]: any; } ? T_20 extends infer T_21 ? { [k_21 in keyof T_21]: any; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown : never : never; } : never : unknown>;
    to<T>(alt: T): Convert<TConvertMap<T>>;
}
export {};
//# sourceMappingURL=convert.d.ts.map