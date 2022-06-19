import { Maybe, Guard, Convert, Utils } from "./internal.js";

type CastSome<T extends Cast<any>[]> =
    T extends Guard<any>[] ? Guard<T[number] extends Guard<infer R> ? R : never> :
    T extends Cast<any>[] ? Cast<T[number] extends Cast<infer R> ? R : never> :
    never

type TCastAll<T extends Collection<Cast>> = { [I in keyof T]: T[I] extends Cast<infer V> ? V : never }

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

    public read<R>(ifValue: (left: T) => R, ifNothing: () => R): (value: unknown) => T | R {
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

    public static some<T extends Cast<any>[]>(...options: T): CastSome<T> {
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
                .if(a => a.length === 1)
                .map(a => a[0])
                .compose(Guard.isPrimitiveValue)
        );
    }

    public static get asString(): Cast<string> {
        return Cast.asPrimitiveValue.map(s => s.toString());
    }

    public static get asNumber(): Cast<number> {
        return Cast.asString.map(parseFloat).and(Guard.isFinite);
    }

    public static get asBigint(): Cast<bigint> {
        return Cast.asString.bind(s => Cast.try(() => BigInt(s)));
    }

    public static get asBoolean(): Cast<boolean> {
        return Cast.asPrimitiveValue.map(v => !!v);
    }

    public static get asArray(): Cast<unknown[]> {
        return Guard.isArray.or(Guard.isPrimitiveValue.map(a => [a]));
    }

    public static asConst<T extends PrimitiveValue>(value: T): Cast<T> {
        return Cast.asString.if(str => str === value.toString()).map(_ => value);
    }

    public static asEnum<T extends [any, ...any]>(...options: T): Cast<T[number]> {
        return Cast.some(...options.map(Cast.asConst));
    }

    public static asArrayOf<T>(cast: Cast<T>) {
        return Guard.isArray.bind(a => 
            Cast.all(Utils.map(i => Cast.just(i).compose(cast))(a))
        );
    }

    public static asCollectionOf<T extends Collection<Cast>>(casts: T): Cast<TCastAll<T>> {
        return Guard.isCollection.bind(val => 
            Cast.all(Utils.map((cast: Cast, k) => Cast.just((val as any)[k]).compose(cast))(casts))
        ) as Cast<TCastAll<T>>
    }

    public get orEmpty(): Convert<T[]> {
        return this.map(t => [t]).else([]);
    }

    public get asPrimitiveValue() { return this.compose(Cast.asPrimitiveValue) }
    public get asString() { return this.compose(Cast.asString) }
    public get asNumber() { return this.compose(Cast.asNumber) }
    public get asBigint() { return this.compose(Cast.asBigint) }
    public get asBoolean() { return this.compose(Cast.asBoolean) }
    public get asArray() { return this.compose(Cast.asArray) }
    public asConst<T extends PrimitiveValue>(value: T) { return this.compose(Cast.asConst(value)) }
    public asEnum<T extends [any, ...any]>(...options: T) { return this.compose(Cast.asEnum(...options)) }
    public asArrayOf<T>(cast: Cast<T>) { return this.compose(Cast.asArrayOf(cast)) }
    public asCollectionOf<T extends Collection<Cast>>(casts: T) { return this.compose(Cast.asCollectionOf(casts)) }    
}
