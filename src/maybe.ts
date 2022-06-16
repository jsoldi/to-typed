export class Maybe<T> {
    private constructor(public readonly hasValue: boolean, private readonly value: T) { }

    static just<T>(value: T): Maybe<T> { 
        return new Maybe(true, value);
    }

    static nothing<T = never>() {
        return new Maybe<T>(false, null as unknown as T);
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

    public else<R>(other: R): T | R {
        return this.read((t: T | R) => t, () => other);
    }
}
