type MaybeValues = { readonly [k: string]: Maybe<unknown> } | readonly Maybe<unknown>[]
type TMaybeAll<T extends MaybeValues> = { [I in keyof T]: T[I] extends Maybe<infer V> ? V : never }

export class Maybe<out T> {
    private constructor(public readonly hasValue: boolean, private readonly value: T) { }

    static just<T>(value: T): Maybe<T> { 
        return new Maybe(true, value);
    }

    static nothing<T = never>() {
        return new Maybe<T>(false, null as unknown as T);
    }

    public static all<T extends MaybeValues>(maybes: T): Maybe<TMaybeAll<T>> {
        const result = (Array.isArray(maybes) ? [] : {}) as any;
        const entries = Object.entries(maybes);

        for (let [k, v] of entries) {
            if (v.hasValue)
                result[k] = v.value;
            else
                return Maybe.nothing();
        }

        return Maybe.just(result);
    }

    public get elseThrow(): T {
        return this.read(t => t, () => { throw new Error('No value') });
    }

    public read<R>(ifValue: (left: T) => R, ifNothing: () => R): R {
        return this.hasValue ? ifValue(this.value) : ifNothing();
    }

    public bind<R>(next: (value: T) => Maybe<R>): Maybe<R> {
        return this.read(next, Maybe.nothing);
    }

    public map<R>(next: (value: T) => R): Maybe<R> {
        return this.bind(value => Maybe.just(next(value)));
    }

    public or<R>(right: Maybe<R>): Maybe<T | R> {
        return this.read(t => Maybe.just<T | R>(t), () => right);
    }

    public else<R>(getAlt: () => R): T | R {
        return this.read((t: T | R) => t, () => getAlt());
    }
}
