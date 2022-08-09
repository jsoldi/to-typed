import { Utils, Maybe, Cast, Guard, CastSettings, TCastAll } from "./internal.js";
import { Collection, Primitive, SimpleType, SimpleTypeOf, Struct } from "./types.js";

export type TConvertMap<T> =
    T extends SimpleType ? SimpleTypeOf<T> :
    T extends Convert<infer R> ? R :
    T extends { [k in keyof T]: any } ? { [k in keyof T]: TConvertMap<T[k]> } :
    unknown;

type ConvertObject<T> = { readonly [k in keyof T]: Convert<T[k]> };

declare const BigInt: (input: any) => bigint;

export class Convert<out T = unknown> extends Cast<T> {
    private _obj: ConvertObject<T> | undefined;

    public constructor(private readonly _convert: (value: unknown, settings: CastSettings) => T) {
        super((value, s) => Maybe.just(_convert(value, s)));
    }

    public static lazy<T>(fun: (s: CastSettings) => Convert<T>): Convert<T> {
        return new Convert((val, s) => fun(s)._convert(val, s));
    }

    public convert(value: unknown): T
    public convert(value: unknown, settings: CastSettings): T
    public convert(value: unknown, settings?: CastSettings) {
        return this._convert(value, settings ?? Cast.defaults);
    }

    public get obj(): ConvertObject<T> {
        if (this._obj === undefined) {
            this._obj = Object.defineProperties({}, Utils.fromEntries(Object.keys(this.convert(undefined)).map(key => [
                key,
                {
                    enumerable: true,
                    get: () => new Convert((value, settings) => {
                        const obj = this._convert({ [key]: value }, settings);
                        return key in obj ? obj[key as keyof T] : undefined;
                    })
                }
            ]))) as ConvertObject<T>
        }

        return this._obj;
    }

    public config(config: Partial<CastSettings>) {
        return new Convert((value, s) => this._convert(value, { ...s, ...config }));
    }

    public static readonly id = new Convert<unknown>(value => value);

    public static toConst<T>(value: T): Convert<T> {
        return new Convert(_ => value);
    }

    public compose<R>(g: Convert<R>): Convert<R> {
        return new Convert((value, s) => g._convert(this._convert(value, s), s));
    }

    public map<R>(fun: (value: T) => R): Convert<R> {
        return new Convert((value, s) => fun(this._convert(value, s)));
    }

    /**
     * Converts to a union of the given options, and defaults to the first option. 
     * @param options an array of options to choose from, where the first option is the default
     * @returns a `Convert` that converts to a union
     */
    public static toEnum<R extends readonly [Primitive, ...Primitive[]]>(...options: R): Convert<R[number]> {
        return Cast.asEnum(...options).else(options[0]);
    }

    public static toString(alt: string = '') {
        return Cast.asString.else(alt);
    }

    public static toNumber(alt: number = 0) {
        return Cast.asNumber.else(alt);
    }

    public static toFinite(alt: number = 0) {
        return Cast.asFinite.else(alt);
    }

    public static toInteger(alt: number = 0) {
        return Cast.asInteger.else(alt);
    }

    public static toBoolean(alt: boolean = false) {
        return Cast.asBoolean.else(alt);
    }

    public static toTruthy() {
        return new Convert(value => !!value);
    }

    public static toBigInt(alt: bigint = BigInt(0)) {
        return Cast.asBigInt.else(alt);
    }

    public static toDate(alt: Date = new Date(0)) {
        return Cast.asDate.else(alt);
    }

    public static toArray(alt: unknown[] = []) {
        return Cast.asArray.else(alt);
    }

    public static toArrayOf<T>(convertItem: Convert<T>, alt: T[] = []): Convert<T[]> {
        return Cast.asArrayOf(convertItem).else(alt);
    }

    public static toStructOf<T>(convertItem: Convert<T>, alt: Struct<T> = {}): Convert<Struct<T>> {
        return Cast.asStructOf(convertItem).else(alt);
    }

    /**
     * Given an object or tuple of converts, it produces a convert that outputs an object or tuple having the same shape as the given converts.
     * @param casts an object or tuple of converts
     * @returns a convert that produces an object or tuple matching the shape of the given converts
     */
    public static toCollectionLike<T extends Collection<Convert>>(converts: T): Convert<TCastAll<T>> {
        return Guard.isCollection.or(Cast.just(Array.isArray(converts) ? [] : {})).asCollectionLike(converts).elseThrow();
    }

    /**
     * Produces a convert that filters out values from the input that could not be casted by the given cast.
     * @param cast the cast to use for filtering
     * @returns a convert that filters out values that could not be casted by the given cast
     */
    public static toArrayWhere<T>(cast: Cast<T>): Convert<T[]> {
        return Cast.asArrayWhere(cast).else([] as T[]);
    }

    /**
     * Creates a `Convert` based on the given sample value, which is also used as the set of default values.
     * @param alt a sample value which also serves as the set of default values
     * @returns a `Convert` based on the given sample value
     */
    public static to<T>(alt: T): Convert<TConvertMap<T>> {
        switch (typeof alt) {
            case 'string':
                return Convert.toString(alt) as Convert<TConvertMap<T>>
            case 'number':
                return Convert.toNumber(alt) as Convert<TConvertMap<T>>
            case 'boolean':
                return Convert.toBoolean(alt) as Convert<TConvertMap<T>>
            case 'bigint':
                return Convert.toBigInt(alt) as Convert<TConvertMap<T>>
            case 'symbol':
                Guard.isSymbol.else(alt);
            case 'function':
                return Guard.isFunction.else(alt) as Convert<TConvertMap<T>>
            case 'undefined':
                return Convert.toConst(undefined) as Convert<TConvertMap<T>>
            case 'object':
                if (alt instanceof Convert)
                    return alt;
                else if (alt === null)
                    return Convert.toConst(null) as Convert<TConvertMap<T>>
        }

        return Convert.toCollectionLike(Utils.mapEager(alt as any, Convert.to)) as Convert<TConvertMap<T>>
    }

    public toEnum<R extends readonly [Primitive, ...Primitive[]]>(...options: R): Convert<R[number]> { return this.compose(Convert.toEnum(...options)) }
    public toString(alt: string = '') { return this.compose(Convert.toString(alt)) }
    public toNumber(alt: number = 0) { return this.compose(Convert.toNumber(alt)) }
    public toBoolean(alt: boolean = false) { return this.compose(Convert.toBoolean(alt)) }
    public toBigInt(alt: bigint = BigInt(0)) { return this.compose(Convert.toBigInt(alt)) }
    public toDate(alt: Date = new Date(0)) { return this.compose(Convert.toDate(alt)) }
    public toArray<T>(convertItem: Convert<T>, alt: T[] = []): Convert<T[]> { return this.compose(Convert.toArrayOf(convertItem, alt)) }
    public toArrayOf<T>(convertItem: Convert<T>, alt: T[] = []): Convert<T[]> { return this.compose(Convert.toArrayOf(convertItem, alt)) }
    public toStructOf<T>(convertItem: Convert<T>, alt: Struct<T> = {}): Convert<Struct<T>> { return this.compose(Convert.toStructOf(convertItem, alt)) }
    public toCollectionLike<T extends Collection<Convert>>(converts: T): Convert<TCastAll<T>> { return this.compose(Convert.toCollectionLike(converts)) }
    public toArrayWhere<T>(cast: Cast<T>): Convert<T[]> { return this.compose(Convert.toArrayWhere(cast)) }
    public to<T>(alt: T): Convert<TConvertMap<T>> { return this.compose(Convert.to(alt)) }
}
