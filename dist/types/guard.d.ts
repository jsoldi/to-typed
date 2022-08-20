import { Cast, Convert, TCastAll, CastSettings } from "./internal.js";
import { Collection, Nothing, PrimitiveValue, SimpleType, SimpleTypeOf, Struct } from "./types.js";
declare type TGuardEvery<A extends readonly Guard<unknown>[]> = A extends Array<infer T> ? ((g: T) => void) extends ((g: Guard<infer I>) => void) ? I : unknown : never;
declare abstract class Was<in out U> {
    protected type: U | undefined;
    private constructor();
}
declare type SubtypeOf<T, U> = unknown extends T ? T & U : T extends never ? T & U : T extends null ? T & U : T extends undefined ? T & U : T & U & Was<U>;
export declare type TGuardMap<T> = T extends SimpleType ? SimpleTypeOf<T> : T extends Guard<infer R> ? R : T extends {
    [k in keyof T]: any;
} ? {
    [k in keyof T]: TGuardMap<T[k]>;
} : unknown;
export declare class Guard<out T = unknown> extends Cast<T> {
    private readonly _guard;
    private static readonly guardError;
    constructor(_guard: (input: unknown, settings: CastSettings) => input is T);
    static readonly isUnknown: Guard<unknown>;
    static readonly isNever: Guard<never>;
    static lazy<T>(fun: (s: CastSettings) => Guard<T>): Guard<T>;
    guard<U>(input: U): input is SubtypeOf<T, U>;
    guard<U>(input: U, settings: CastSettings): input is SubtypeOf<T, U>;
    config(config: Partial<CastSettings>): Guard<T>;
    and<R>(right: Guard<R>): Guard<T & R>;
    and<R>(right: (t: T, s: CastSettings) => t is T & R): Guard<T & R>;
    or<R>(right: Guard<R>): Guard<T | R>;
    or<R>(right: Convert<R>): Convert<T | R>;
    or<R>(right: Cast<R>): Cast<T | R>;
    if(condition: (input: T) => unknown): Guard<T>;
    /**
     * Intersects a list of guards by combining them with the `and` operator.
     * @param guards An array of guards.
     * @returns The intersection of the given guards.
     */
    static every<T extends readonly Guard<unknown>[]>(...guards: T): Guard<TGuardEvery<T>>;
    static isConst<T>(value: T): Guard<T>;
    static isClass<T>(cls: new (...args: any[]) => T): Guard<T>;
    static isEnum<T extends readonly unknown[]>(options: T): Guard<T[number]>;
    static get isPrimitiveValue(): Guard<PrimitiveValue>;
    static get isNothing(): Guard<Nothing>;
    static get isObject(): Guard<object>;
    static get isPrimitive(): Guard<PrimitiveValue | Nothing>;
    static get isSomething(): Guard<object | PrimitiveValue>;
    static get isString(): Guard<string>;
    static get isNumber(): Guard<number>;
    static get isBigInt(): Guard<bigint>;
    static get isBoolean(): Guard<boolean>;
    static get isSymbol(): Guard<symbol>;
    static get isFinite(): Guard<number>;
    static get isInteger(): Guard<number>;
    static get isSafeInteger(): Guard<number>;
    static get isCollection(): Guard<Collection>;
    static get isStruct(): Guard<Struct>;
    static get isArray(): Guard<Array<unknown>>;
    static get isFunction(): Guard<Function>;
    static isInstanceOf<T>(cls: new (...args: any[]) => T): Guard<T>;
    static isCollectionOf<T>(guard: Guard<T>): Guard<Collection<T>>;
    static isArrayOf<T>(guard: Guard<T>): Guard<T[]>;
    static isStructOf<T>(guard: Guard<T>): Guard<Struct<T>>;
    /**
     * Given an object or tuple of guards, it produces a guard that guards for an object or tuple that has the same shape as the given guards.
     * @param casts an object or tuple of guards
     * @returns a guard that guards for an object or tuple matching the shape of the given guards
     */
    static isCollectionLike<T extends Collection<Guard>>(guards: T): Guard<TCastAll<T>>;
    /**
     * Creates a `Guard` based on a sample value.
     * @param alt a sample value
     * @returns a `Guard` based on the given sample value
     */
    static is<T>(alt: T): Guard<TGuardMap<T>>;
}
export {};
