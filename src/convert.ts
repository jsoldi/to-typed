import { Utils, Maybe, Cast, Guard } from "./internal.js";

// Maps { b: ? => B, c: C } to { b: B, c: C }:
type TConvertMap<T> = 
    T extends Convert<infer R> ? R :
    T extends Array<infer I> ? Array<TConvertMap<I>> :
    T extends { [k in keyof T]: any } ? { [k in keyof T]: TConvertMap<T[k]> } :
    T

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

    public static toEnum<R extends [any, ...any]>(...options: R): Convert<R[number]> {
        return Cast.asEnum(...options).else(options[0]);
    }

    public static toString(alt: string = '') {
        return Cast.asString.else(alt);
    }

    public static toNumber(alt: number = 0) {
        return Cast.asNumber.else(alt);
    }

    public static toBoolean(alt: boolean = false) {
        return Cast.asBoolean.else(alt);        
    }

    public static toBigInt(alt: bigint = BigInt(0)) {
        return Cast.asBigint.else(alt);
    }

    public static toArray(alt: unknown[] = []) {
        return Cast.asArray.else(alt);
    }

    public static toArrayOf<T>(convertItem: Convert<T>, alt: T[] = []): Convert<T[]> {
        return Cast.asArrayOf(convertItem).else(alt);
    }
 
    public static toCollectionOf<T extends Collection<Convert>>(converts: T) {
        return Guard.isCollection.or(Cast.just(Array.isArray(converts) ? [] : {})).asCollectionOf(converts).elseThrow;
    }

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
            case 'undefined':
            case 'function':
                return Convert.unit(alt) as Convert<TConvertMap<T>>
            case 'object': 
                if (Array.isArray(alt)) {
                    if (alt.length) 
                        return Convert.toArrayOf(Convert.to(alt[0])) as Convert<TConvertMap<T>>;
                    else
                        return Convert.unit([]) as Convert<TConvertMap<T>> // We can't produce items of type never
                }
                else if (alt instanceof Convert)  
                    return alt;
                else if (alt === null)
                    return Convert.unit(null) as Convert<TConvertMap<T>>
        }

        return Convert.toCollectionOf(Utils.map(Convert.to)(alt as any)) as Convert<TConvertMap<T>>
    }

    public toEnum<R extends [any, ...any]>(...options: R) { return this.compose(Convert.toEnum(...options)) }
    public toString(alt: string = '') { return this.compose(Convert.toString(alt)) }
    public toNumber(alt: number = 0) { return this.compose(Convert.toNumber(alt)) }
    public toBoolean(alt: boolean = false) { return this.compose(Convert.toBoolean(alt)) }
    public toBigInt(alt: bigint = BigInt(0)) { return this.compose(Convert.toBigInt(alt)) }
    public toArray<T>(convertItem: Convert<T>, alt: T[] = []) { return this.compose(Convert.toArrayOf(convertItem, alt)) }
    public toArrayOf<T>(convertItem: Convert<T>, alt: T[] = []) { return this.compose(Convert.toArrayOf(convertItem, alt)) }
    public toCollectionOf<T extends Collection<Convert>>(converts: T) { return this.compose(Convert.toCollectionOf(converts)) }
    public to<T>(alt: T) { return this.compose(Convert.to(alt)) }
}
