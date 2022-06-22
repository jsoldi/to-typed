import { Maybe, Guard, Convert, Utils } from "./internal.js";
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
    public constructor(public readonly cast: (value: unknown) => Maybe<T>) { }

    public static readonly asUnknown = new Cast<unknown>(value => Maybe.just(value));
    public static readonly asNever = new Cast<never>(_ => Maybe.nothing());

    public static maybe<T>(maybe: Maybe<T>) {
        return new Cast(_ => maybe);
    }

    public static just<T>(value: T): Cast<T> {
        return Cast.maybe(Maybe.just(value));
    }

    public static nothing<T = never>() {
        return Cast.maybe<T>(Maybe.nothing());
    }

    public static try<T>(get: () => T) {
        try {
            return Cast.just(get());
        }
        catch (e) {
            return Cast.nothing();
        }
    }

    public read<R>(ifValue: (left: T) => R, ifNothing: () => R): (value: unknown) => R {
        return value => this.cast(value).read(ifValue, ifNothing);
    }

    public bind<R>(next: (t: T) => Cast<R>): Cast<R> {
        return new Cast(value => this.cast(value).bind(t => next(t).cast(value)));
    }

    public compose<R>(next: Cast<R>): Cast<R> {
        return this.bind(value => Cast.maybe(next.cast(value)));
    }

    public or<R>(right: Convert<R>): Convert<T | R>
    public or<R>(right: Cast<R>): Cast<T | R>
    public or<R>(right: Cast<R>): Cast<T | R> {
        if (right instanceof Convert)
            return new Convert(value => this.cast(value).else(() => right.convert(value)));
        else
            return new Cast(value => this.cast(value).or(right.cast(value)));
    }

    public static some<T extends readonly Cast<unknown>[]>(options: T): CastSome<T> {
        return options.reduce((acc, option) => acc.or(option), Guard.isNever) as CastSome<T>;
    }

    public static all<T extends Collection<Cast>>(casts: T): Cast<TCastAll<T>> {        
        return new Cast(value => 
            Maybe.all(Utils.map((cast: Cast) => cast.cast(value))(casts)) as Maybe<TCastAll<T>>
        );
    }

    public if(condition: (input: T) => boolean): Cast<T> {
        return this.bind(value => condition(value) ? Cast.just(value) : Cast.nothing());
    }

    public and<R>(guard: Guard<R>): Cast<T & R> {
        return this.bind(value => guard.guard(value) ? Cast.just(value) : Cast.nothing());
    }

    public map<R>(next: (t: T) => R): Cast<R> {
        return this.bind(value => Cast.just(next(value)));
    }

    public else<R>(other: R): Convert<T | R> {
        return this.or(new Convert(_ => other));
    }

    public get elseThrow(): Convert<T> {
        return this.or(new Convert(_ => { throw new Error('Cast has no value.') }));
    }

    public static get asPrimitiveValue(): Cast<PrimitiveValue> {
        return Guard.isPrimitiveValue.or(
            Guard.isArray
                .if(a => a.length > 0) // Should equal 1 but, as a collection, an array with > 1 items extends and array with 1 item.
                .map(a => a[0])
                .compose(Guard.isPrimitiveValue)
        );
    }

    public static get asString(): Cast<string> {
        return Guard.isString.or(Cast.asPrimitiveValue.map(s => s.toString()));
    }

    public static get asNumber(): Cast<number> {
        return Cast.asPrimitiveValue.compose(Cast.some([
            Guard.isNumber,
            Guard.isString.map(parseFloat),
            Guard.isBigInt.if(n => Number.MIN_SAFE_INTEGER <= n && n <= Number.MAX_SAFE_INTEGER).map(n => Number(n)),
            Guard.isBoolean.map(b => b ? 1 : 0),
        ]));
    }

    public static get asFinite(): Cast<number> {
        return Cast.asNumber.and(Guard.isFinite);
    }

    public static get asInteger(): Cast<number> {
        return Cast.asFinite.map(Math.round);
    }

    public static get asBigint(): Cast<bigint> {
        return Cast.asPrimitiveValue.compose(Cast.some([
            Guard.isBigInt,
            Cast.asString.bind(s => Cast.try(() => BigInt(s))),
            Cast.asInteger.map(n => BigInt(n)),
            Guard.isBoolean.map(b => BigInt(b ? 1 : 0)),
        ]));
    }

    public static get asBoolean(): Cast<boolean> {
        return Guard.isBoolean.or(Cast.asString.bind(v => {
            if (['true', 'on', '1'].includes(v))
                return Cast.just(true);
            else if (['false', 'off', '0'].includes(v))
                return Cast.just(false);
            else
                return Cast.nothing();
        }));
    }

    public static get asArray(): Cast<unknown[]> {
        return Guard.isArray.or(Guard.isPrimitiveValue.map(a => [a]));
    }

    public static get asCollection(): Cast<Collection> {
        return Guard.isCollection.or(Guard.isPrimitiveValue.map(a => [a]));
    }

    public static asConst<T extends Primitive>(value: T): Cast<T> {
        return Guard.isConst(value).or(
            Cast.just(value).asString.bind(str1 => Cast.asString.if(str2 => str1 === str2)).map(_ => value)
        );
    }

    public static asEnum<T extends readonly Primitive[]>(options: T): Cast<T[number]> {
        return Cast.some(options.map(Cast.asConst));
    }

    public static asArrayOf<T>(cast: Cast<T>) {
        return Cast.asArray.bind(a => 
            Cast.all(Utils.map(i => Cast.just(i).compose(cast))(a))
        );
    }

    public static asCollectionOf<T extends Collection<Cast>>(casts: T): Cast<TCastAll<T>> {
        return Cast.asCollection.bind(val => 
            Cast.all(Utils.map((cast: Cast, k) => Cast.just((val as Struct)[k]).compose(cast))(casts))
        ) as Cast<TCastAll<T>>
    }
    
    public static as<T>(alt: T): Cast<TCastMap<T>> {
        switch (typeof alt) {
            case 'string':
                return Cast.asString as Cast<TCastMap<T>>;
            case 'number':
                if (Number.isInteger(alt))
                    return Cast.asInteger as Cast<TCastMap<T>>;
                else if (Number.isFinite(alt))
                    return Cast.asFinite as Cast<TCastMap<T>>;
                else
                    return Cast.asNumber as Cast<TCastMap<T>>;
            case 'boolean':
                return Cast.asBoolean as Cast<TCastMap<T>>;
            case 'bigint':
                return Cast.asBigint as Cast<TCastMap<T>>;
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

        return Cast.asCollectionOf(Utils.map(Cast.as)(alt as any)) as Cast<TCastMap<T>>
    }   

    public get asPrimitiveValue() { return this.compose(Cast.asPrimitiveValue) }
    public get asString() { return this.compose(Cast.asString) }
    public get asNumber() { return this.compose(Cast.asNumber) }
    public get asBigint() { return this.compose(Cast.asBigint) }
    public get asBoolean() { return this.compose(Cast.asBoolean) }
    public get asArray() { return this.compose(Cast.asArray) }
    public asConst<T extends PrimitiveValue>(value: T) { return this.compose(Cast.asConst(value)) }
    public asEnum<T extends readonly Primitive[]>(options: T) { return this.compose(Cast.asEnum(options)) }
    public asArrayOf<T>(cast: Cast<T>) { return this.compose(Cast.asArrayOf(cast)) }
    public asCollectionOf<T extends Collection<Cast>>(casts: T) { return this.compose(Cast.asCollectionOf(casts)) }    
    public as<T>(alt: T) { return this.compose(Cast.as(alt)) }
}
