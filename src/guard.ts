import { Maybe, Cast } from "./internal.js";

export class Guard<T> extends Cast<T> {
    constructor(public readonly guard: (input: unknown) => input is T) { 
        super(val => guard(val) ? Maybe.just(val) : Maybe.nothing());
    }

    public static readonly isUnknown = new Guard<unknown>((val): val is unknown => true);
    public static readonly isNever = new Guard<never>((val): val is never => false);

    public and<R>(right: Guard<R>): Guard<T & R> {
        return new Guard<T & R>((val): val is T & R => this.guard(val) && right.guard(val));
    }

    public or<R>(right: Guard<R>): Guard<T | R>
    public or<R>(right: Cast<R>): Cast<T | R>
    public or<R>(right: Guard<R> | Cast<R>): Guard<T | R> | Cast<T | R> {
        if (right instanceof Guard) 
            return new Guard<T | R>((val): val is T | R => this.guard(val) || right.guard(val));            
        else
            return super.or(right);
    }

    public static some<T extends Guard<any>[]>(...options: T): Guard<T[number] extends Guard<infer R> ? R : never> {
        if (options.length)
            return options[0].or(Guard.some(...options.slice(1)));
        else
            return Guard.isNever;
    }

    public if(condition: (input: T) => boolean): Guard<T> {
        return new Guard((val): val is T => this.guard(val) && condition(val));
    }

    public static isConst<T>(value: T) {
        return new Guard((val): val is T => val === value);
    }

    public static isClass<T>(cls: new (...args: any[]) => T): Guard<T> {
        return new Guard((val): val is T => val instanceof cls);
    }

    // `isPrimitiveValue`, `isNothing` and `isObject` shold cover every possible type with no overlap.
    public static get isPrimitiveValue(): Guard<PrimitiveValue> {
        return new Guard((val): val is PrimitiveValue => 
            typeof val === 'string' ||
            typeof val === 'number' ||
            typeof val === 'bigint' ||
            typeof val === 'boolean' ||
            typeof val === 'symbol'
        );
    }

    // `isPrimitiveValue`, `isNothing` and `isObject` shold cover every possible type with no overlap.
    public static get isNothing(): Guard<Nothing> {
        return new Guard((val): val is Nothing => 
            val === undefined ||
            val === null
        );
    }

    // `isPrimitiveValue`, `isNothing` and `isObject` shold cover every possible type with no overlap.
    public static get isObject(): Guard<Object> {
        return new Guard((val): val is Object => val instanceof Object);
    }

    public static get isFunction(): Guard<Function> {
        return new Guard((val): val is Function => typeof val === 'function');
    }

    public static get isPrimitive(): Guard<Primitive> { return Guard.isPrimitiveValue.or(Guard.isNothing); }
    public static get isString(): Guard<string> { return new Guard((val): val is string => typeof val === 'string') }
    public static get isNumber(): Guard<number> { return new Guard((val): val is number => typeof val === 'number') }
    public static get isBigInt(): Guard<bigint> { return new Guard((val): val is bigint => typeof val === 'bigint') }
    public static get isBoolean(): Guard<boolean> { return new Guard((val): val is boolean => typeof val === 'boolean') }
    public static get isSymbol(): Guard<symbol> { return new Guard((val): val is symbol => typeof val === 'symbol') }
    public static get isFinite(): Guard<number> { return Guard.isNumber.if(Number.isFinite) }
    public static get isInteger(): Guard<number> { return Guard.isNumber.if(Number.isInteger) as any as Guard<number> }
    public static get isSafeInteger(): Guard<number> { return Guard.isNumber.if(Number.isSafeInteger) }
    public static get isArray(): Guard<Array<unknown>> { return new Guard((val): val is Array<unknown> => Array.isArray(val)) }
}
