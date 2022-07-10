import { Maybe, Guard, Convert, Utils, CastSettings } from "./internal.js";
import { Collection, Primitive, PrimitiveValue, SimpleType, SimpleTypeOf, Struct } from "./types.js";

type CastSome<T extends readonly Cast<unknown>[]> =
    T extends Guard<any>[] ? Guard<T[number] extends Guard<infer R> ? R : never> :
    T extends Cast<any>[] ? Cast<T[number] extends Cast<infer R> ? R : never> :
    never

export type TCastAll<T extends Collection<Cast>> = { [I in keyof T]: T[I] extends Cast<infer V> ? V : never }

// Maps { b: ? => B, c: C } to { b: B, c: C }:
type TCastMap<T> = 
    T extends SimpleType ? SimpleTypeOf<T> :
    T extends Cast<infer R> ? R :
    T extends { [k in keyof T]: any } ? { [k in keyof T]: TCastMap<T[k]> } :
    unknown; 

export class Cast<out T = unknown> {
    protected static readonly defaults: CastSettings = {
        keyGuarding: 'loose',
        booleanNames: {
            true: ['true', 'on', '1'],
            false: ['false', 'off', '0']            
        },
        unwrapArray: 'single',
        wrapArray: 'single'
    }

    public constructor(private readonly _cast: (value: unknown, settings: CastSettings) => Maybe<T>) { }
    
    private static get build() {
        return typeof __filename === 'undefined' ? 'esm' : 'cjs';
    }

    public static readonly asUnknown = new Cast<unknown>(value => Maybe.just(value));
    public static readonly asNever = new Cast<never>(_ => Maybe.nothing());

    private static unwrapArray<T>(arr: T[], s: CastSettings) {
        switch (s.unwrapArray) {
            case 'single':
                return arr.length === 1 ? Cast.just(arr[0]) : Cast.nothing();
            case 'first':
                return arr.length > 0 ? Cast.just(arr[0]) : Cast.nothing();
            case 'last':
                return arr.length > 0 ? Cast.just(arr[arr.length - 1]) : Cast.nothing();
            case 'never':
                return Cast.nothing();
        }
    }

    private static wrapArray<T>(val: T, s: CastSettings) {
        switch (s.wrapArray) {
            case 'single':
                return Cast.just([val]);
            case 'never':
                return Cast.nothing();
        }
    }

    public static lazy<T>(fun: (s: CastSettings) => Cast<T>): Cast<T> {
        return new Cast((val, s) => fun(s)._cast(val, s));
    }

    public cast(value: unknown): Maybe<T>
    public cast(value: unknown, settings: CastSettings): Maybe<T>
    public cast(value: unknown, settings?: CastSettings) {
        return this._cast(value, settings ?? Cast.defaults);
    }

    public config(config: Partial<CastSettings>) {
        return new Cast((value, s) => this._cast(value, { ...s, ...config }));
    }

    public static just<T>(value: T): Cast<T> {
        return new Cast(_ => Maybe.just(value));
    }

    public static nothing<T = never>() {
        return new Cast<T>(_ => Maybe.nothing());
    }

    public static try<T>(get: () => T) {
        try {
            return Cast.just(get());
        }
        catch (e) {
            return Cast.nothing();
        }
    }

    public bind<R>(next: (t: T, s: CastSettings) => Cast<R>): Cast<R> {
        return new Cast((value, s) => this._cast(value, s).bind(t => next(t, s)._cast(value, s)));
    }

    public compose<R>(next: Cast<R>): Cast<R> {
        return this.bind(value => new Cast((_, s) => next.cast(value, s)));
    }

    public or<R>(right: Convert<R>): Convert<T | R>
    public or<R>(right: Cast<R>): Cast<T | R>
    public or<R>(right: Cast<R>): Cast<T | R> {
        if (right instanceof Convert)
            return new Convert((value, s) => this._cast(value, s).else(() => right.convert(value, s)));
        else
            return new Cast((value, s) => this.cast(value, s).or(right.cast(value, s)));
    }

    /**
     * Unions a list of casts by combining them with the `or` operator.
     * @param options An array of casts.
     * @returns The union of the given casts.
     */
    public static some<T extends readonly Cast<unknown>[]>(...options: T): CastSome<T> {
        return options.reduce((acc, option) => acc.or(option), Guard.isNever) as CastSome<T>;
    }

    /**
     * Creates a cast that outputs a collection by applying each cast in the given collection to the input value.
     * @param casts A collection of casts.
     * @returns A cast that outputs a collection of results, or nothing if any cast fails.
     */
    public static all<T extends Collection<Convert>>(casts: T): Convert<TCastAll<T>>
    public static all<T extends Collection<Cast>>(casts: T): Cast<TCastAll<T>>
    public static all<T extends Collection<Cast>>(casts: T): Convert<TCastAll<T>> | Cast<TCastAll<T>> {
        if (Guard.isCollectionOf(Guard.isInstanceOf(Convert)).guard(casts)) {
            const map = Utils.mapLazy<Convert>(casts);
            return new Convert((value: unknown, s) => map((conv: Convert) => conv.convert(value, s))) as Cast<TCastAll<T>>
        }
        else {
            const map = Utils.mapLazy<Cast>(casts);
            return new Cast((value, s) => Maybe.all(map((cast: Cast) => cast.cast(value, s)))) as Cast<TCastAll<T>>
        }
    }

    /**
     * Creates a convert that outputs an array containing the successful results of applying each cast in the given collection to the input value.
     * @param casts An array of casts.
     * @returns A convert that outputs an array of successfully results
     */
     public static any<T>(casts: Cast<T>[]): Convert<T[]> {
        return new Convert((value, s) => Maybe.any(casts.map(cast => cast.cast(value, s))));
    }

    public if(condition: (input: T) => unknown): Cast<T> {
        return this.bind(value => condition(value) ? Cast.just(value) : Cast.nothing());
    }

    public and<R>(guard: Guard<R>): Cast<T & R> {
        return this.bind((value, s) => guard.guard(value, s) ? Cast.just(value) : Cast.nothing());
    }

    public map<R>(next: (t: T) => R): Cast<R> {
        return this.bind(value => Cast.just(next(value)));
    }

    public else<R>(other: R): Convert<T | R> {
        return this.or(new Convert(_ => other));
    }

    public elseThrow(getError: () => Error = () => new Error('Cast has no value')): Convert<T> {
        return this.or(new Convert(_ => { throw getError(); }));
    }

    public get toMaybe(): Convert<Maybe<T>> {
        return this.map(Maybe.just).else(Maybe.nothing());
    }

    public static get asPrimitiveValue(): Cast<PrimitiveValue> {
        return Guard.isPrimitiveValue.or(
            Guard.isArray
                .bind(Cast.unwrapArray)
                .compose(Guard.isPrimitiveValue)
        );
    }

    public static get asString(): Cast<string> {
        return Guard.isString.or(Cast.asPrimitiveValue.map(s => s.toString()));
    }

    public static get asNumber(): Cast<number> {
        return Cast.asPrimitiveValue.compose(Cast.some(
            Guard.isNumber,
            Guard.isConst('NaN').map(() => NaN),
            Guard.isString.map(parseFloat).if(n => !isNaN(n)),
            Guard.isBigInt.if(n => Number.MIN_SAFE_INTEGER <= n && n <= Number.MAX_SAFE_INTEGER).map(n => Number(n)),
            Guard.isBoolean.map(b => b ? 1 : 0),
        ));
    }

    public static get asFinite(): Cast<number> {
        return Cast.asNumber.and(Guard.isFinite);
    }

    public static get asInteger(): Cast<number> {
        return Cast.asFinite.map(Math.round);
    }

    public static get asBigInt(): Cast<bigint> {
        return Cast.asPrimitiveValue.compose(Cast.some(
            Guard.isBigInt,
            Cast.asString.bind(s => Cast.try(() => BigInt(s))),
            Cast.asInteger.map(n => BigInt(n)),
            Guard.isBoolean.map(b => BigInt(b ? 1 : 0)),
        ));
    }

    public static get asBoolean(): Cast<boolean> {
        return Guard.isBoolean.or(Cast.asString.bind((v, s) => {
            if (s.booleanNames.true.includes(v))
                return Cast.just(true);
            else if (s.booleanNames.false.includes(v))
                return Cast.just(false);
            else
                return Cast.nothing();
        }));
    }

    public static get asDate(): Cast<Date> {
        return Guard.some(
            Guard.isInstanceOf(Date),
            Guard.isString, 
            Guard.isSafeInteger
        )
        .bind(s => Cast.try(() => new Date(s)))
        .if(d => !isNaN(d.getTime()))        
    }

    public static get asArray(): Cast<unknown[]> {
        return Guard.isArray.or(Guard.isSomething.bind(Cast.wrapArray));
    }

    public static get asCollection(): Cast<Collection> {
        return Guard.isCollection.or(Guard.isSomething.bind(Cast.wrapArray));
    }

    public static asConst<T extends Primitive>(value: T): Cast<T> {
        return Guard.isConst(value).or(
            Cast.just(value).asString.bind(str1 => Cast.asString.if(str2 => str1 === str2)).map(_ => value)
        );
    }

    public static asEnum<T extends readonly Primitive[]>(...options: T): Cast<T[number]> {
        return Cast.some(...options.map(Cast.asConst));
    }

    public static asCollectionOf<T>(cast: Cast<T>): Cast<Collection<T>> {
        return Cast.asCollection.bind(a => Cast.all(Utils.mapEager(a, i => Cast.just(i).compose(cast))));
    }

    public static asArrayOf<T>(cast: Cast<T>) {
        return Cast.asArray.compose(Cast.asCollectionOf(cast)) as Cast<T[]>
    }

    public static asStructOf<T>(cast: Cast<T>) {
        return Guard.isStruct.compose(Cast.asCollectionOf(cast)) as Cast<Struct<T>>
    }

    protected static asCollectionLike<T extends Collection<Cast>>(casts: T): Cast<TCastAll<T>> {
        const map = Utils.mapLazy<Cast>(casts);

        return Cast.asCollection.bind(val => 
            Cast.all(map((cast: Cast, k) => Cast.just((val as Struct)[k]).compose(cast)))
        ) as Cast<TCastAll<T>>
    }
    
    public static asArrayWhere<T>(cast: Cast<T>): Cast<T[]> {
        return Cast.asArray.bind(val => Cast.any(val.map(v => Cast.just(v).compose(cast))))
    }

    /**
     * Creates a `Cast` based on a sample value.
     * @param alt a sample value
     * @returns a `Cast` based on the given sample value
     */
    public static as<T>(alt: T): Cast<TCastMap<T>> {
        switch (typeof alt) {
            case 'string':
                return Cast.asString as Cast<TCastMap<T>>;
            case 'number':
                return Cast.asNumber as Cast<TCastMap<T>>;
            case 'boolean':
                return Cast.asBoolean as Cast<TCastMap<T>>;
            case 'bigint':
                return Cast.asBigInt as Cast<TCastMap<T>>;
            case 'symbol':
                return Guard.isSymbol as Guard<TCastMap<T>>;
            case 'undefined':
                return Guard.isConst(undefined) as Guard<TCastMap<T>>;
            case 'function':
                return Guard.isFunction as Guard<TCastMap<T>>;
            case 'object': 
                if (alt instanceof Cast)
                    return alt;
                else if (alt === null)
                    return Guard.isConst(null) as Guard<TCastMap<T>>;
        }

        return Cast.asCollectionLike(Utils.mapEager(alt as any, Cast.as)) as Cast<TCastMap<T>>
    }   

    public get asPrimitiveValue() { return this.compose(Cast.asPrimitiveValue) }
    public get asString() { return this.compose(Cast.asString) }
    public get asNumber() { return this.compose(Cast.asNumber) }
    public get asFinite() { return this.compose(Cast.asFinite) }
    public get asInteger() { return this.compose(Cast.asInteger) }    
    public get asBigInt() { return this.compose(Cast.asBigInt) }
    public get asBoolean() { return this.compose(Cast.asBoolean) }
    public get asDate() { return this.compose(Cast.asDate) }
    public get asArray() { return this.compose(Cast.asArray) }
    public asConst<T extends PrimitiveValue>(value: T) { return this.compose(Cast.asConst(value)) }
    public asEnum<T extends readonly Primitive[]>(...options: T) { return this.compose(Cast.asEnum(...options)) }
    public asCollectionOf<T>(cast: Cast<T>) { return this.compose(Cast.asCollectionOf(cast)) }
    public asArrayOf<T>(cast: Cast<T>) { return this.compose(Cast.asArrayOf(cast)) }
    public asStructOf<T>(cast: Cast<T>) { return this.compose(Cast.asStructOf(cast)) }
    protected asCollectionLike<T extends Collection<Cast>>(casts: T) { return this.compose(Cast.asCollectionLike(casts)) }    
    public asArrayWhere<T>(cast: Cast<T>) { return this.compose(Cast.asArrayWhere(cast)) }
    public as<T>(alt: T) { return this.compose(Cast.as(alt)) }
}
