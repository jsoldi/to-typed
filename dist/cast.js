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
        return this.bind(value => new Cast(_ => (next instanceof Cast ? next : next()).cast(value)));
    }
    or(right) {
        if (right instanceof Convert)
            return new Convert(value => this.cast(value).else(right.convert(value)));
        else
            return new Cast(value => this.cast(value).or(right.cast(value)));
    }
    static some(...options) {
        return options.reduce((acc, option) => acc.or(option), Guard.isNever);
    }
    if(condition) {
        return this.bind(value => condition(value) ? Cast.just(value) : Cast.nothing());
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
    get orDont() {
        return this.or(Convert.id);
    }
    get asPrimitiveValue() { return this.compose(Cast.asPrimitiveValue); }
    get asString() { return this.compose(Cast.asString); }
    get asNumber() { return this.compose(Cast.asNumber); }
    get asBigint() { return this.compose(Cast.asBigint); }
    get asBoolean() { return this.compose(Cast.asBoolean); }
    get asArray() { return this.compose(Cast.asArray); }
}
Cast.asUnknown = new Cast(value => Maybe.just(value));
Cast.asNever = new Cast(_ => Maybe.nothing());
//# sourceMappingURL=cast.js.map