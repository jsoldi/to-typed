import { Maybe, Guard, Convert, Utils } from "./internal.js";
export class Cast {
    constructor(cast) {
        this.cast = cast;
    }
    static maybe(maybe) {
        return new Cast(_ => maybe);
    }
    static just(value) {
        return Cast.maybe(Maybe.just(value));
    }
    static nothing() {
        return Cast.maybe(Maybe.nothing());
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
        return this.bind(value => Cast.maybe(next.cast(value)));
    }
    or(right) {
        if (right instanceof Convert)
            return new Convert(value => this.cast(value).else(() => right.convert(value)));
        else
            return new Cast(value => this.cast(value).or(right.cast(value)));
    }
    static some(options) {
        return options.reduce((acc, option) => acc.or(option), Guard.isNever);
    }
    static all(casts) {
        return new Cast(value => Maybe.all(Utils.map((cast) => cast.cast(value))(casts)));
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
        return this.or(new Convert(_ => other));
    }
    get elseThrow() {
        return this.or(new Convert(_ => { throw new Error('Cast has no value.'); }));
    }
    static get asPrimitiveValue() {
        return Guard.isPrimitiveValue.or(Guard.isArray
            .if(a => a.length > 0) // Should equal 1 but, as a collection, an array with > 1 items extends and array with 1 item.
            .map(a => a[0])
            .compose(Guard.isPrimitiveValue));
    }
    static get asString() {
        return Guard.isString.or(Cast.asPrimitiveValue.map(s => s.toString()));
    }
    static get asNumber() {
        return Cast.asPrimitiveValue.compose(Cast.some([
            Guard.isNumber,
            Guard.isString.map(parseFloat),
            Guard.isBigInt.if(n => Number.MIN_SAFE_INTEGER <= n && n <= Number.MAX_SAFE_INTEGER).map(n => Number(n)),
            Guard.isBoolean.map(b => b ? 1 : 0),
        ]));
    }
    static get asFinite() {
        return Cast.asNumber.and(Guard.isFinite);
    }
    static get asInteger() {
        return Cast.asFinite.map(Math.round);
    }
    static get asBigint() {
        return Cast.asPrimitiveValue.compose(Cast.some([
            Guard.isBigInt,
            Cast.asString.bind(s => Cast.try(() => BigInt(s))),
            Cast.asInteger.map(n => BigInt(n)),
            Guard.isBoolean.map(b => BigInt(b ? 1 : 0)),
        ]));
    }
    static get asBoolean() {
        return Guard.isBoolean.or(Cast.asString.bind(v => {
            if (['true', 'on', '1'].includes(v))
                return Cast.just(true);
            else if (['false', 'off', '0'].includes(v))
                return Cast.just(false);
            else
                return Cast.nothing();
        }));
    }
    static get asTruthy() {
        return Guard.isBoolean.or(Cast.asPrimitiveValue.map(v => !!v));
    }
    static get asArray() {
        return Guard.isArray.or(Guard.isPrimitiveValue.map(a => [a]));
    }
    static get asCollection() {
        return Guard.isCollection.or(Guard.isPrimitiveValue.map(a => [a]));
    }
    static asConst(value) {
        return Guard.isConst(value).or(Cast.just(value).asString.bind(str1 => Cast.asString.if(str2 => str1 === str2)).map(_ => value));
    }
    static asEnum(options) {
        return Cast.some(options.map(Cast.asConst));
    }
    static asArrayOf(cast) {
        return Cast.asArray.bind(a => Cast.all(Utils.map(i => Cast.just(i).compose(cast))(a)));
    }
    static asCollectionOf(casts) {
        return Cast.asCollection.bind(val => Cast.all(Utils.map((cast, k) => Cast.just(val[k]).compose(cast))(casts)));
    }
    static as(alt) {
        switch (typeof alt) {
            case 'string':
                return Cast.asString;
            case 'number':
                if (Number.isInteger(alt))
                    return Cast.asInteger;
                else if (Number.isFinite(alt))
                    return Cast.asFinite;
                else
                    return Cast.asNumber;
            case 'boolean':
                return Cast.asBoolean;
            case 'bigint':
                return Cast.asBigint;
            case 'symbol':
                return Guard.isSymbol;
            case 'undefined':
                return Guard.isConst(undefined);
            case 'function':
                return Guard.isFunction;
            case 'object':
                if (alt instanceof Cast)
                    return alt;
                else if (alt === null)
                    return Guard.isConst(null);
        }
        return Cast.asCollectionOf(Utils.map(Cast.as)(alt));
    }
    get asPrimitiveValue() { return this.compose(Cast.asPrimitiveValue); }
    get asString() { return this.compose(Cast.asString); }
    get asNumber() { return this.compose(Cast.asNumber); }
    get asBigint() { return this.compose(Cast.asBigint); }
    get asBoolean() { return this.compose(Cast.asBoolean); }
    get asArray() { return this.compose(Cast.asArray); }
    asConst(value) { return this.compose(Cast.asConst(value)); }
    asEnum(options) { return this.compose(Cast.asEnum(options)); }
    asArrayOf(cast) { return this.compose(Cast.asArrayOf(cast)); }
    asCollectionOf(casts) { return this.compose(Cast.asCollectionOf(casts)); }
    as(alt) { return this.compose(Cast.as(alt)); }
}
Cast.asUnknown = new Cast(value => Maybe.just(value));
Cast.asNever = new Cast(_ => Maybe.nothing());
//# sourceMappingURL=cast.js.map