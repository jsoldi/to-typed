import { Maybe, Guard, Convert } from "./internal.js";

type CastSomeOf<T extends Cast<any>[]> =
    T extends Guard<any>[] ? Guard<T[number] extends Guard<infer R> ? R : never> :
    T extends Cast<any>[] ? Cast<T[number] extends Cast<infer R> ? R : never> :
    never

export class Cast<T> {
    public constructor(public readonly cast: (value: unknown) => Maybe<T>) { }

    public static readonly asUnknown = new Cast<unknown>(value => Maybe.just(value));
    public static readonly asNever = new Cast<never>(_ => Maybe.nothing());

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

    public read<R>(ifValue: (left: T) => R, ifNothing: () => R): (value: unknown) => T | R {
        return value => this.cast(value).read(ifValue, ifNothing);
    }

    public bind<R>(next: (t: T) => Cast<R>): Cast<R> {
        return new Cast(value => this.cast(value).bind(t => next(t).cast(value)));
    }

    public compose<R>(next: Cast<R> | (() => Cast<R>)): Cast<R> {
        return this.bind(value => new Cast(_ => (next instanceof Cast ? next : next()).cast(value)));
    }

    public or<R>(right: Convert<R>): Convert<T | R>
    public or<R>(right: Cast<R>): Cast<T | R>
    public or<R>(right: Cast<R>): Cast<T | R> {
        if (right instanceof Convert)
            return new Convert(value => this.cast(value).else(right.convert(value)));
        else
            return new Cast(value => this.cast(value).or(right.cast(value)));
    }

    public static some<T extends Cast<any>[]>(...options: T): CastSomeOf<T> {
        return options.reduce((acc, option) => acc.or(option), Guard.isNever) as CastSomeOf<T>;
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
        return new Convert(value => this.cast(value).else(other));
    }

    public static get asPrimitiveValue(): Cast<PrimitiveValue> {
        return Guard.isPrimitiveValue.or(Guard.isArray.map(a => a[0]).compose(() => Cast.asPrimitiveValue));
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
        return Cast.asString.bind(s => {
            const lower = s.trim().toLowerCase();

            switch (lower) {
                case 'true':
                case 'yes':
                case '1':
                case 'on':
                    return Cast.just(true);
                case 'false':
                case 'no':
                case '0':
                case 'off':
                    return Cast.just(false);
                default:
                    return Cast.nothing();
            }
        });
    }

    public static get asArray(): Cast<unknown[]> {
        return Guard.isArray.or(Guard.isPrimitiveValue.map(a => [a]));
    }

    public get orDont(): Convert<unknown> {
        return this.or(Convert.id);
    }

    public get asPrimitiveValue(): Cast<PrimitiveValue> { return this.compose(Cast.asPrimitiveValue) }
    public get asString(): Cast<string> { return this.compose(Cast.asString) }
    public get asNumber(): Cast<number> { return this.compose(Cast.asNumber) }
    public get asBigint(): Cast<bigint> { return this.compose(Cast.asBigint) }
    public get asBoolean(): Cast<boolean> { return this.compose(Cast.asBoolean) }
    public get asArray(): Cast<unknown[]> { return this.compose(Cast.asArray) }    
}
