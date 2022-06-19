import { Maybe, Cast, Convert } from "./internal.js";

type TGuardEvery<A extends Guard<any>[]> = A extends Array<infer T> ? 
    ((g: T) => void) extends ((g: Guard<infer I>) => void) ? I : unknown : 
never

export class Guard<out T> extends Cast<T> {
    constructor(public readonly guard: (input: unknown) => input is T) { 
        super(val => guard(val) ? Maybe.just(val) : Maybe.nothing());
    }

    public static readonly isUnknown = new Guard<unknown>((val): val is unknown => true);
    public static readonly isNever = new Guard<never>((val): val is never => false);

    public and<R>(right: Guard<R> | ((val: T) => Guard<R>)): Guard<T & R> {
        return new Guard<T & R>((val): val is T & R => this.guard(val) && (right instanceof Guard ? right : right(val)).guard(val));
    }

    public or<R>(right: Guard<R>): Guard<T | R>
    public or<R>(right: Convert<R>): Convert<T | R>
    public or<R>(right: Cast<R>): Cast<T | R>
    public or<R>(right: Cast<R>): Cast<T | R> {
        if (right instanceof Guard) 
            return new Guard<T | R>((val): val is T | R => this.guard(val) || right.guard(val));
        else
            return super.or(right);
    }

    public if(condition: (input: T) => boolean): Guard<T> {
        return new Guard((val): val is T => this.guard(val) && condition(val));
    }

    public static every<T extends Guard<any>[]>(...guards: T): Guard<TGuardEvery<T>> {
        return guards.reduce((acc, guard) => acc.and(guard), Guard.isUnknown);
    }

    public static isConst<T>(value: T) {
        return new Guard((val): val is T => val === value);
    }

    public static isClass<T>(cls: new (...args: any[]) => T): Guard<T> {
        return new Guard((val): val is T => val instanceof cls);
    }

    public static isEnum<T extends [any, ...any]>(...options: T): Guard<T[number]> {
        return Guard.some(...options.map(Guard.isConst));
    }

    public static get isPrimitiveValue(): Guard<PrimitiveValue> {
        return new Guard((val): val is PrimitiveValue => 
            typeof val === 'string' ||
            typeof val === 'number' ||
            typeof val === 'bigint' ||
            typeof val === 'boolean' ||
            typeof val === 'symbol'
        );
    }

    public static get isNothing(): Guard<Nothing> {
        return new Guard((val): val is Nothing => 
            val === undefined ||
            val === null
        );
    }

    public static get isObject(): Guard<object> {
        return new Guard((val): val is object => (val !== null && typeof val === 'object') || typeof val === 'function');
    }

    public static get isPrimitive() { return Guard.isPrimitiveValue.or(Guard.isNothing) }
    public static get isSomething() { return Guard.isPrimitiveValue.or(Guard.isObject) }
    //public static get isWeirdShit() { return Guard.isNothing.or(Guard.isObject); } // Just for completeness

    public static get isString(): Guard<string> { return new Guard((val): val is string => typeof val === 'string') }
    public static get isNumber(): Guard<number> { return new Guard((val): val is number => typeof val === 'number') }
    public static get isBigInt(): Guard<bigint> { return new Guard((val): val is bigint => typeof val === 'bigint') }
    public static get isBoolean(): Guard<boolean> { return new Guard((val): val is boolean => typeof val === 'boolean') }
    public static get isSymbol(): Guard<symbol> { return new Guard((val): val is symbol => typeof val === 'symbol') }
    public static get isFinite(): Guard<number> { return Guard.isNumber.if(Number.isFinite) }
    public static get isInteger(): Guard<number> { return Guard.isNumber.if(Number.isInteger) as any as Guard<number> }
    public static get isSafeInteger(): Guard<number> { return Guard.isNumber.if(Number.isSafeInteger) }

    public static get isCollection(): Guard<Collection> { return new Guard((val): val is Collection => val !== null && typeof val === 'object') }
    public static get isStruct(): Guard<Struct> { return new Guard((val): val is Struct => val !== null && typeof val === 'object' && !Array.isArray(val)) }
    public static get isArray(): Guard<Array<unknown>> { return new Guard((val): val is Array<unknown> => Array.isArray(val)) }

    public static isInstanceOf<T>(cls: new (...args: any[]) => T): Guard<T> {
        return new Guard((val): val is T => val instanceof cls);
    }

    public static isArrayOf<T>(guard: Guard<T>): Guard<T[]> {
        return new Guard((val): val is T[] => Array.isArray(val) && val.every(guard.guard));
    }
}
