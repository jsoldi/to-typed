export declare class Maybe<T> {
    readonly hasValue: boolean;
    private readonly value;
    private constructor();
    static just<T>(value: T): Maybe<T>;
    static nothing<T = never>(): Maybe<T>;
    read<R>(ifValue: (left: T) => R, ifNothing: () => R): R;
    bind<R>(next: (value: T) => Maybe<R>): Maybe<R>;
    map<R>(next: (value: T) => R): Maybe<R>;
    or<R>(right: Maybe<R>): Maybe<T | R>;
    else<R>(other: R): T | R;
}
//# sourceMappingURL=maybe.d.ts.map