type MaybeValues = { readonly [k: string]: Maybe<unknown> } | readonly Maybe<unknown>[]
type TMaybeAll<T extends MaybeValues> = { [I in keyof T]: T[I] extends Maybe<infer V> ? V : never }

interface Just<out T> extends MaybeBase<T> { 
    hasValue: true, 
    value: T 
}

interface Nothing<out T> extends MaybeBase<T> { 
    hasValue: false 
    error: Error
}

export type Maybe<T> = Just<T> | Nothing<T>

class MaybeBase<out T> {
    private static readonly defaultError = new Error("Maybe has no value");

    private constructor(private readonly data: { hasValue: true, value: T } | { hasValue: false, error: Error }) { }

    static just<T>(value: T) { 
        return new MaybeBase({ hasValue: true, value }) as Maybe<T>
    }

    static nothing<T = never>(error: Error = MaybeBase.defaultError) {
        return new MaybeBase<T>({ hasValue: false, error }) as Maybe<T>
    }

    get hasValue() {
        return this.data.hasValue;
    }

    get value() {
        return this.else(() => undefined);
    }

    get error() {
        return this.read(() => undefined, e => e);
    }

    static all<T extends MaybeValues>(maybes: T, error: Error = Maybe.defaultError): Maybe<TMaybeAll<T>> {
        const result = (Array.isArray(maybes) ? [] : {}) as any;
        const entries = Object.entries(maybes);

        for (let [k, v] of entries) {
            if (v.hasValue)
                result[k] = v.value;
            else
                return MaybeBase.nothing(error);
        }

        return MaybeBase.just(result);
    }

    public static any<T>(maybes: Maybe<T>[]): T[] {
        const result = [] as T[];

        for (let maybe of maybes) {
            if (maybe.hasValue)
                result.push(maybe.value);
        }

        return result;
    }

    public read<R>(ifValue: (left: T) => R): R | void
    public read<R>(ifValue: (left: T) => R, ifNothing: (error: Error) => R): R
    public read<R>(ifValue: (left: T) => R, ifNothing?: (error: Error) => R): R | void {
        return this.data.hasValue ? ifValue(this.data.value) : ifNothing ? ifNothing(this.data.error) : undefined;
    }

    public bind<R>(next: (value: T) => Maybe<R>): Maybe<R> {
        return this.read(next, MaybeBase.nothing);
    }

    public map<R>(next: (value: T) => R): Maybe<R> {
        return this.bind(value => MaybeBase.just(next(value)));
    }

    public or<R>(right: Maybe<R>): Maybe<T | R> {
        return this.read(t => MaybeBase.just<T | R>(t), () => right);
    }

    public else<R>(getAlt: (error: Error) => R): T | R {
        return this.read((t: T | R) => t, e => getAlt(e));
    }

    public elseThrow(getError: (error: Error) => Error = e => e): T {
        return this.read((t: T) => t, e => { throw getError(e); });
    }
}

export const Maybe = MaybeBase;
