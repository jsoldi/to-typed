import { Utils, Maybe, Cast, Guard } from "./internal.js";

type ConvertObject<T extends Record<string, Convert<any>>> = { [K in keyof T]: T[K] extends Convert<infer R> ? R : never }

// Maps { b: ? => B, c: C } to { b: B, c: C }:
type CastMap<T> = 
    T extends Convert<infer R> ? R :
    T extends Array<infer I> ? Array<CastMap<I>> :
    T extends { [k in keyof T]: any } ? { [k in keyof T]: CastMap<T[k]> } :
    T

export class Convert<T> extends Cast<T> {
    public constructor(public readonly convert: (value: unknown) => T) {
        super(value => Maybe.just(convert(value)));
    }

    public static readonly id = new Convert<unknown>(value => value);

    public static unit<T>(value: T): Convert<T> {
        return new Convert(_ => value);
    }

    public compose<R>(g: Convert<R> | (() => Convert<R>)): Convert<R> {
        return new Convert(value => (g instanceof Convert ? g : g()).convert(this.convert(value)));
    }

    public static toEnum<R extends [any, ...any]>(...options: R): Convert<R[number]> {
        return Guard.isEnum(...options).else(options[0]);
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

    public static toArray<T>(convertItem: Convert<T>): Convert<T[]> {
        return Cast.asArray.map(val => val.map(convertItem.convert)).else([]);
    }
 
    public static toObject<T extends Record<string, Convert<any>>>(convertValues: T): Convert<ConvertObject<T>> {
        return new Convert<{ [k in keyof T]: T[k] extends Convert<infer R> ? R : never }>((value: unknown) => {
            const obj = (value ?? {}) as Record<string, unknown>;
            return Utils.objectMap(convertValues, (cKey, cVal) => [cKey, cVal.convert(obj[cKey])]) as ConvertObject<T>;
        });
    }

    public static to<T>(alt: T): Convert<CastMap<T>> {
        switch (typeof alt) {
            case 'string':
                return Convert.toString(alt) as Convert<CastMap<T>>
            case 'number':
                return Convert.toNumber(alt) as Convert<CastMap<T>>
            case 'boolean':
                return Convert.toBoolean(alt) as Convert<CastMap<T>>
            case 'bigint':
                return Convert.toBigInt(alt) as Convert<CastMap<T>>
            case 'symbol':
            case 'undefined':
            case 'function':
                return Convert.unit(alt) as Convert<CastMap<T>>
            case 'object': 
                if (Array.isArray(alt)) {
                    if (alt.length) 
                        return Convert.toArray(Convert.to(alt[0])) as Convert<CastMap<T>>;
                    else
                        return Convert.unit([]) as Convert<CastMap<T>> // We can't produce items of type never
                }
                else if (alt instanceof Convert)  
                    return alt;
                else if (alt === null)
                    return Convert.unit(alt) as Convert<CastMap<T>>
        }

        return Convert.toObject(Utils.objectMap(alt as any, (key, val) => [key, Convert.to(val)])) as Convert<CastMap<T>>
    }

    public toEnum<R extends [any, ...any]>(...options: R): Convert<R[number]> { return this.compose(Convert.toEnum(...options)) }
    public toString(alt: string = ''): Convert<string> { return this.compose(Convert.toString(alt)) }
    public toNumber(alt: number = 0) { return this.compose(Convert.toNumber(alt)) }
    public toBoolean(alt: boolean = false) { return this.compose(Convert.toBoolean(alt)) }
    public toBigInt(alt: bigint = BigInt(0)) { return this.compose(Convert.toBigInt(alt)) }
    public toArray<T>(convertItem: Convert<T>): Convert<T[]> { return this.compose(Convert.toArray(convertItem)) }
    public toObject<T extends Record<string, Convert<any>>>(convertValues: T): Convert<ConvertObject<T>> { return this.compose(Convert.toObject(convertValues)) }
    public to<T>(alt: T): Convert<CastMap<T>> { return this.compose(Convert.to(alt)) }
}
