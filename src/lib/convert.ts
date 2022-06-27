import { Utils, Maybe, Cast, Guard } from "./internal.js";
import { Collection, Primitive, SimpleType, SimpleTypeOf, Struct } from "./types.js";

// Maps { b: ? => B, c: C } to { b: B, c: C }:
type TConvertMap<T> = 
    T extends SimpleType ? SimpleTypeOf<T> :
    T extends Convert<infer R> ? R :
    T extends { [k in keyof T]: any } ? { [k in keyof T]: TConvertMap<T[k]> } :
    unknown;

export class Convert<out T = unknown> extends Cast<T> {
    public constructor(public readonly convert: (value: unknown) => T) {
        super(value => Maybe.just(convert(value)));
    }

    public static readonly id = new Convert<unknown>(value => value);

    public static unit<T>(value: T): Convert<T> {
        return new Convert(_ => value);
    }

    public compose<R>(g: Convert<R>): Convert<R> {
        return new Convert(value => g.convert(this.convert(value)));
    }

    public map<R>(fun: (value: T) => R): Convert<R> {
        return new Convert(value => fun(this.convert(value)));
    }

    public static toEnum<R extends readonly [Primitive, ...Primitive[]]>(options: R): Convert<R[number]> {
        return Cast.asEnum(options).else(options[0]);
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

    public static toArray(alt: unknown[] = []) {
        return Cast.asArray.else(alt);
    }

    public static toArrayOf<T>(convertItem: Convert<T>, alt: T[] = []): Convert<T[]> {
        return Cast.asArrayOf(convertItem).else(alt);
    }
 
    public static toStructOf<T>(convertItem: Convert<T>, alt: Struct<T> = {}): Convert<Struct<T>> {
        return Cast.asStructOf(convertItem).else(alt);
    }

    protected static toCollectionLike<T extends Collection<Convert>>(converts: T) {
        return Guard.isCollection.or(Cast.just(Array.isArray(converts) ? [] : {})).as(converts).elseThrow;
    }

    public static to<T>(alt: T): Convert<TConvertMap<T>> {
        switch (typeof alt) {
            case 'string':
                return Convert.toString(alt) as Convert<TConvertMap<T>>
            case 'number':
                if (Number.isInteger(alt))
                    return Convert.toInteger(alt) as Convert<TConvertMap<T>>
                else if (Number.isFinite(alt))
                    return Convert.toFinite(alt) as Convert<TConvertMap<T>>
                else
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
                return Convert.unit(undefined) as Convert<TConvertMap<T>>
            case 'object': 
                if (alt instanceof Convert)  
                    return alt;
                else if (alt === null)
                    return Convert.unit(null) as Convert<TConvertMap<T>>
        }

        return Convert.toCollectionLike(Utils.map(Convert.to)(alt as any)) as Convert<TConvertMap<T>>
    }

    public toEnum<R extends readonly [Primitive, ...Primitive[]]>(options: R) { return this.compose(Convert.toEnum(options)) }
    public toString(alt: string = '') { return this.compose(Convert.toString(alt)) }
    public toNumber(alt: number = 0) { return this.compose(Convert.toNumber(alt)) }
    public toBoolean(alt: boolean = false) { return this.compose(Convert.toBoolean(alt)) }
    public toBigInt(alt: bigint = BigInt(0)) { return this.compose(Convert.toBigInt(alt)) }
    public toArray<T>(convertItem: Convert<T>, alt: T[] = []) { return this.compose(Convert.toArrayOf(convertItem, alt)) }
    public toArrayOf<T>(convertItem: Convert<T>, alt: T[] = []) { return this.compose(Convert.toArrayOf(convertItem, alt)) }
    public toStructOf<T>(convertItem: Convert<T>, alt: Struct<T> = {}) { return this.compose(Convert.toStructOf(convertItem, alt)) }
    protected toCollectionLike<T extends Collection<Convert>>(converts: T) { return this.compose(Convert.toCollectionLike(converts)) }
    public to<T>(alt: T) { return this.compose(Convert.to(alt)) }
}
