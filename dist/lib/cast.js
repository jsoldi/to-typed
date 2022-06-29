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
    /**
     * Unions a list of casts by combining them with the `or` operator.
     * @param options An array of casts.
     * @returns The union of the given casts.
     */
    static some(...options) {
        return options.reduce((acc, option) => acc.or(option), Guard.isNever);
    }
    static all(casts) {
        if (Guard.isCollectionOf(Guard.isInstanceOf(Convert)).guard(casts))
            return new Convert((value) => Utils.map((conv) => conv.convert(value))(casts));
        else
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
    elseThrow(getError = () => new Error('Cast has no value')) {
        return this.or(new Convert(_ => { throw getError(); }));
    }
    get elseNothing() {
        return this.map(Maybe.just).else(Maybe.nothing());
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
        return Cast.asPrimitiveValue.compose(Cast.some(Guard.isNumber, Guard.isString.map(parseFloat), Guard.isBigInt.if(n => Number.MIN_SAFE_INTEGER <= n && n <= Number.MAX_SAFE_INTEGER).map(n => Number(n)), Guard.isBoolean.map(b => b ? 1 : 0)));
    }
    static get asFinite() {
        return Cast.asNumber.and(Guard.isFinite);
    }
    static get asInteger() {
        return Cast.asFinite.map(Math.round);
    }
    static get asBigInt() {
        return Cast.asPrimitiveValue.compose(Cast.some(Guard.isBigInt, Cast.asString.bind(s => Cast.try(() => BigInt(s))), Cast.asInteger.map(n => BigInt(n)), Guard.isBoolean.map(b => BigInt(b ? 1 : 0))));
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
    static get asDate() {
        return Guard.some(Guard.isInstanceOf(Date), Guard.isString, Guard.isSafeInteger)
            .bind(s => Cast.try(() => new Date(s)))
            .if(d => !isNaN(d.getTime()));
    }
    static get asArray() {
        return Guard.isArray.or(Guard.isSomething.map(a => [a]));
    }
    static get asCollection() {
        return Guard.isCollection.or(Guard.isSomething.map(a => [a]));
    }
    static asConst(value) {
        return Guard.isConst(value).or(Cast.just(value).asString.bind(str1 => Cast.asString.if(str2 => str1 === str2)).map(_ => value));
    }
    static asEnum(...options) {
        return Cast.some(...options.map(Cast.asConst));
    }
    static asCollectionOf(cast) {
        return Cast.asCollection.bind(a => Cast.all(Utils.map(i => Cast.just(i).compose(cast))(a)));
    }
    static asArrayOf(cast) {
        return Cast.asArray.compose(Cast.asCollectionOf(cast));
    }
    static asStructOf(cast) {
        return Guard.isStruct.compose(Cast.asCollectionOf(cast));
    }
    static asCollectionLike(casts) {
        return Cast.asCollection.bind(val => Cast.all(Utils.map((cast, k) => Cast.just(val[k]).compose(cast))(casts)));
    }
    /**
     * Creates a `Cast` based on a sample value.
     * @param alt a sample value
     * @returns a `Cast` based on the given sample value
     */
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
                return Cast.asBigInt;
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
        return Cast.asCollectionLike(Utils.map(Cast.as)(alt));
    }
    get asPrimitiveValue() { return this.compose(Cast.asPrimitiveValue); }
    get asString() { return this.compose(Cast.asString); }
    get asNumber() { return this.compose(Cast.asNumber); }
    get asBigInt() { return this.compose(Cast.asBigInt); }
    get asBoolean() { return this.compose(Cast.asBoolean); }
    get asDate() { return this.compose(Cast.asDate); }
    get asArray() { return this.compose(Cast.asArray); }
    asConst(value) { return this.compose(Cast.asConst(value)); }
    asEnum(...options) { return this.compose(Cast.asEnum(...options)); }
    asCollectionOf(cast) { return this.compose(Cast.asCollectionOf(cast)); }
    asArrayOf(cast) { return this.compose(Cast.asArrayOf(cast)); }
    asStructOf(cast) { return this.compose(Cast.asStructOf(cast)); }
    asCollectionLike(casts) { return this.compose(Cast.asCollectionLike(casts)); }
    as(alt) { return this.compose(Cast.as(alt)); }
}
Cast.asUnknown = new Cast(value => Maybe.just(value));
Cast.asNever = new Cast(_ => Maybe.nothing());
//# sourceMappingURL=cast.js.map