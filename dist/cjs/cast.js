"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cast = void 0;
const internal_js_1 = require("./internal.js");
class Cast {
    constructor(_cast) {
        this._cast = _cast;
    }
    static get build() {
        return typeof __filename === 'undefined' ? 'esm' : 'cjs';
    }
    static unwrapArray(arr, s) {
        switch (s.unwrapArray) {
            case 'single':
                return arr.length === 1 ? Cast.just(arr[0]) : Cast.nothing();
            case 'first':
                return arr.length > 0 ? Cast.just(arr[0]) : Cast.nothing();
            case 'last':
                return arr.length > 0 ? Cast.just(arr[arr.length - 1]) : Cast.nothing();
            case 'never':
                return Cast.nothing();
        }
    }
    static wrapArray(val, s) {
        switch (s.wrapArray) {
            case 'single':
                return Cast.just([val]);
            case 'never':
                return Cast.nothing();
        }
    }
    static lazy(fun) {
        return new Cast((val, s) => fun(s)._cast(val, s));
    }
    cast(value, settings) {
        return this._cast(value, settings !== null && settings !== void 0 ? settings : Cast.defaults);
    }
    config(config) {
        return new Cast((value, s) => this._cast(value, { ...s, ...config }));
    }
    static just(value) {
        return new Cast(_ => internal_js_1.Maybe.just(value));
    }
    static nothing() {
        return new Cast(_ => internal_js_1.Maybe.nothing());
    }
    static try(get) {
        try {
            return Cast.just(get());
        }
        catch (e) {
            return Cast.nothing();
        }
    }
    bind(next) {
        return new Cast((value, s) => this._cast(value, s).bind(t => next(t, s)._cast(value, s)));
    }
    compose(next) {
        return this.bind(value => new Cast((_, s) => next.cast(value, s)));
    }
    or(right) {
        if (right instanceof internal_js_1.Convert)
            return new internal_js_1.Convert((value, s) => this._cast(value, s).else(() => right.convert(value, s)));
        else
            return new Cast((value, s) => this.cast(value, s).or(right.cast(value, s)));
    }
    /**
     * Unions a list of casts by combining them with the `or` operator.
     * @param options An array of casts.
     * @returns The union of the given casts.
     */
    static some(...options) {
        return options.reduce((acc, option) => acc.or(option), internal_js_1.Guard.isNever);
    }
    static all(casts) {
        if (internal_js_1.Guard.isCollectionOf(internal_js_1.Guard.isInstanceOf(internal_js_1.Convert)).guard(casts)) {
            const map = internal_js_1.Utils.mapLazy(casts);
            return new internal_js_1.Convert((value, s) => map((conv) => conv.convert(value, s)));
        }
        else {
            const map = internal_js_1.Utils.mapLazy(casts);
            return new Cast((value, s) => internal_js_1.Maybe.all(map((cast) => cast.cast(value, s))));
        }
    }
    /**
     * Creates a convert that outputs an array containing the successful results of applying each cast in the given collection to the input value.
     * @param casts An array of casts.
     * @returns A convert that outputs an array of successfully results
     */
    static any(casts) {
        return new internal_js_1.Convert((value, s) => internal_js_1.Maybe.any(casts.map(cast => cast.cast(value, s))));
    }
    if(condition) {
        return this.bind(value => condition(value) ? Cast.just(value) : Cast.nothing());
    }
    and(guard) {
        return this.bind((value, s) => guard.guard(value, s) ? Cast.just(value) : Cast.nothing());
    }
    map(next) {
        return this.bind(value => Cast.just(next(value)));
    }
    else(other) {
        return this.or(new internal_js_1.Convert(_ => other));
    }
    elseThrow(getError = () => new Error('Cast has no value')) {
        return this.or(new internal_js_1.Convert(_ => { throw getError(); }));
    }
    get toMaybe() {
        return this.map(internal_js_1.Maybe.just).else(internal_js_1.Maybe.nothing());
    }
    static get asPrimitiveValue() {
        return internal_js_1.Guard.isPrimitiveValue.or(internal_js_1.Guard.isArray
            .bind(Cast.unwrapArray)
            .compose(internal_js_1.Guard.isPrimitiveValue));
    }
    static get asString() {
        return internal_js_1.Guard.isString.or(Cast.asPrimitiveValue.map(s => s.toString()));
    }
    static get asNumber() {
        return Cast.asPrimitiveValue.compose(Cast.some(internal_js_1.Guard.isNumber, internal_js_1.Guard.isConst('NaN').map(() => NaN), internal_js_1.Guard.isString.map(parseFloat).if(n => !isNaN(n)), internal_js_1.Guard.isBigInt.if(n => Number.MIN_SAFE_INTEGER <= n && n <= Number.MAX_SAFE_INTEGER).map(n => Number(n)), internal_js_1.Guard.isBoolean.map(b => b ? 1 : 0)));
    }
    static get asFinite() {
        return Cast.asNumber.and(internal_js_1.Guard.isFinite);
    }
    static get asInteger() {
        return Cast.asFinite.map(Math.round);
    }
    static get asBigInt() {
        return Cast.asPrimitiveValue.compose(Cast.some(internal_js_1.Guard.isBigInt, internal_js_1.Guard.isString.bind(s => Cast.try(() => BigInt(s))), internal_js_1.Guard.isSafeInteger.map(n => BigInt(n)), internal_js_1.Guard.isBoolean.map(b => BigInt(b ? 1 : 0))));
    }
    static get asBoolean() {
        return internal_js_1.Guard.isBoolean.or(Cast.asString.bind((v, s) => {
            if (s.booleanNames.true.includes(v))
                return Cast.just(true);
            else if (s.booleanNames.false.includes(v))
                return Cast.just(false);
            else
                return Cast.nothing();
        }));
    }
    static get asDate() {
        return internal_js_1.Guard.some(internal_js_1.Guard.isInstanceOf(Date), internal_js_1.Guard.isString, internal_js_1.Guard.isSafeInteger)
            .bind(s => Cast.try(() => new Date(s)))
            .if(d => !isNaN(d.getTime()));
    }
    static get asArray() {
        return internal_js_1.Guard.isArray.or(internal_js_1.Guard.isSomething.bind(Cast.wrapArray));
    }
    static asConst(value) {
        return internal_js_1.Guard.isConst(value).or(Cast.just(value).asString.bind(str1 => Cast.asString.if(str2 => str1 === str2)).map(_ => value));
    }
    static asEnum(...options) {
        return Cast.some(...options.map(Cast.asConst));
    }
    static makeCollectionOf(cast) {
        return col => Cast.all(internal_js_1.Utils.mapEager(col, i => Cast.just(i).compose(cast)));
    }
    static asArrayOf(cast) {
        return Cast.asArray.bind(Cast.makeCollectionOf(cast));
    }
    static asStructOf(cast) {
        return internal_js_1.Guard.isStruct.bind(Cast.makeCollectionOf(cast));
    }
    static makeCollectionLike(casts) {
        const map = internal_js_1.Utils.mapLazy(casts);
        return col => Cast.all(map((cast, k) => Cast.just(col[k]).compose(cast)));
    }
    static asCollectionLike(casts) {
        return Array.isArray(casts) ?
            Cast.asArray.bind(Cast.makeCollectionLike(casts)) :
            internal_js_1.Guard.isStruct.bind(Cast.makeCollectionLike(casts));
    }
    static asArrayWhere(cast) {
        return Cast.asArray.bind(val => Cast.any(val.map(v => Cast.just(v).compose(cast))));
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
                return Cast.asNumber;
            case 'boolean':
                return Cast.asBoolean;
            case 'bigint':
                return Cast.asBigInt;
            case 'symbol':
                return internal_js_1.Guard.isSymbol;
            case 'undefined':
                return internal_js_1.Guard.isConst(undefined);
            case 'function':
                return internal_js_1.Guard.isFunction;
            case 'object':
                if (alt instanceof Cast)
                    return alt;
                else if (alt === null)
                    return internal_js_1.Guard.isConst(null);
        }
        return Cast.asCollectionLike(internal_js_1.Utils.mapEager(alt, Cast.as));
    }
    get asPrimitiveValue() { return this.compose(Cast.asPrimitiveValue); }
    get asString() { return this.compose(Cast.asString); }
    get asNumber() { return this.compose(Cast.asNumber); }
    get asFinite() { return this.compose(Cast.asFinite); }
    get asInteger() { return this.compose(Cast.asInteger); }
    get asBigInt() { return this.compose(Cast.asBigInt); }
    get asBoolean() { return this.compose(Cast.asBoolean); }
    get asDate() { return this.compose(Cast.asDate); }
    get asArray() { return this.compose(Cast.asArray); }
    asConst(value) { return this.compose(Cast.asConst(value)); }
    asEnum(...options) { return this.compose(Cast.asEnum(...options)); }
    asArrayOf(cast) { return this.compose(Cast.asArrayOf(cast)); }
    asStructOf(cast) { return this.compose(Cast.asStructOf(cast)); }
    asCollectionLike(casts) { return this.compose(Cast.asCollectionLike(casts)); }
    asArrayWhere(cast) { return this.compose(Cast.asArrayWhere(cast)); }
    as(alt) { return this.compose(Cast.as(alt)); }
}
exports.Cast = Cast;
Cast.defaults = {
    keyGuarding: 'loose',
    booleanNames: {
        true: ['true', 'on', '1'],
        false: ['false', 'off', '0']
    },
    unwrapArray: 'single',
    wrapArray: 'single'
};
Cast.asUnknown = new Cast(value => internal_js_1.Maybe.just(value));
Cast.asNever = new Cast(_ => internal_js_1.Maybe.nothing());
//# sourceMappingURL=cast.js.map