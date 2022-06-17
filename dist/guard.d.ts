import { Cast, Convert } from "./internal.js";
export declare class Guard<T> extends Cast<T> {
    readonly guard: (input: unknown) => input is T;
    constructor(guard: (input: unknown) => input is T);
    static readonly isUnknown: Guard<unknown>;
    static readonly isNever: Guard<never>;
    and<R>(right: Guard<R>): Guard<T & R>;
    or<R>(right: Guard<R>): Guard<T | R>;
    or<R>(right: Convert<R>): Convert<T | R>;
    or<R>(right: Cast<R>): Cast<T | R>;
    if(condition: (input: T) => boolean): Guard<T>;
    static isConst<T>(value: T): Guard<T>;
    static isClass<T>(cls: new (...args: any[]) => T): Guard<T>;
    static isEnum<T extends [any, ...any]>(...options: T): Guard<T[number]>;
    static get isPrimitiveValue(): Guard<PrimitiveValue>;
    static get isNothing(): Guard<Nothing>;
    static get isObject(): Guard<Object>;
    static get isFunction(): Guard<Function>;
    static get isPrimitive(): Guard<Primitive>;
    static get isString(): Guard<string>;
    static get isNumber(): Guard<number>;
    static get isBigInt(): Guard<bigint>;
    static get isBoolean(): Guard<boolean>;
    static get isSymbol(): Guard<symbol>;
    static get isFinite(): Guard<number>;
    static get isInteger(): Guard<number>;
    static get isSafeInteger(): Guard<number>;
    static get isArray(): Guard<Array<unknown>>;
}
//# sourceMappingURL=guard.d.ts.map