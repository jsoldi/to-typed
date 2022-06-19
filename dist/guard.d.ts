import { Cast, Convert } from "./internal.js";
declare type TGuardEvery<A extends Guard<any>[]> = A extends Array<infer T> ? ((g: T) => void) extends ((g: Guard<infer I>) => void) ? I : unknown : never;
export declare class Guard<out T> extends Cast<T> {
    readonly guard: (input: unknown) => input is T;
    constructor(guard: (input: unknown) => input is T);
    static readonly isUnknown: Guard<unknown>;
    static readonly isNever: Guard<never>;
    and<R>(right: Guard<R> | ((val: T) => Guard<R>)): Guard<T & R>;
    or<R>(right: Guard<R>): Guard<T | R>;
    or<R>(right: Convert<R>): Convert<T | R>;
    or<R>(right: Cast<R>): Cast<T | R>;
    if(condition: (input: T) => boolean): Guard<T>;
    static every<T extends Guard<any>[]>(...guards: T): Guard<TGuardEvery<T>>;
    static isConst<T>(value: T): Guard<T>;
    static isClass<T>(cls: new (...args: any[]) => T): Guard<T>;
    static isEnum<T extends [any, ...any]>(...options: T): Guard<T[number]>;
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
    static isInstanceOf<T>(cls: new (...args: any[]) => T): Guard<T>;
    static isArrayOf<T>(guard: Guard<T>): Guard<T[]>;
}
export {};
//# sourceMappingURL=guard.d.ts.map