import { Maybe, Guard, Convert } from "./internal.js";
export class Cast {
    constructor(cast) {
        this.cast = cast;
    }
    static just(value) {
        return new Cast(_ => Maybe.just(value));
    }
    static nothing() {
        return new Cast(_ => Maybe.nothing());
    }
    static try(get) {
        try {
            return Cast.just(get());
        }
        catch (e) {
            return Cast.nothing();
        }
    }
    read(ifValue, ifNothing) {
        return value => this.cast(value).read(ifValue, ifNothing);
    }
    bind(next) {
        return new Cast(value => this.cast(value).bind(t => next(t).cast(value)));
    }
    compose(next) {
        return this.bind(value => new Cast(_ => (Guard.isFunction.guard(next) ? next() : next).cast(value)));
    }
    or(right) {
        return new Cast(value => this.cast(value).or(right.cast(value)));
    }
    and(guard) {
        return this.bind(value => guard.guard(value) ? Cast.just(value) : Cast.nothing());
    }
    map(next) {
        return this.bind(value => Cast.just(next(value)));
    }
    else(other) {
        return new Convert(value => this.cast(value).else(other));
    }
    static get asPrimitiveValue() {
        return Guard.isPrimitiveValue.or(Guard.isArray.map(a => a[0]).compose(() => Cast.asPrimitiveValue));
    }
    static get asString() {
        return Cast.asPrimitiveValue.map(s => s.toString());
    }
    static get asNumber() {
        return Cast.asString.map(parseFloat).and(Guard.isFinite);
    }
    static get asBigint() {
        return Cast.asString.bind(s => Cast.try(() => BigInt(s)));
    }
    static get asBoolean() {
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
    static get asArray() {
        return Guard.isArray.or(Guard.isPrimitiveValue.map(a => [a]));
    }
}
//# sourceMappingURL=cast.js.map