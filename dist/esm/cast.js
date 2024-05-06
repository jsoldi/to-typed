import { Maybe, Guard, Convert, Utils } from "./internal.js";
export class Cast {
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
        return new Cast(_ => Maybe.just(value));
    }
    static nothing(error = Cast.castError) {
        return new Cast(_ => Maybe.nothing(error));
    }
    static try(get) {
        try {
            return Cast.just(get());
        }
        catch (e) {
            return Cast.nothing(e instanceof Error ? e : typeof e === 'string' ? new Error(e) : Cast.castError);
        }
    }
    parse(json) {
        try {
            return this.cast(JSON.parse(json));
        }
        catch (e) {
            return Maybe.nothing(e instanceof Error ? e : new Error('Unknown JSON.parse error'));
        }
    }
    bind(next) {
        return new Cast((value, s) => this._cast(value, s).bind(t => next(t, s)._cast(value, s)));
    }
    compose(next) {
        return this.bind(value => new Cast((_, s) => next.cast(value, s)));
    }
    or(right) {
        if (right instanceof Convert)
            return new Convert((value, s) => this._cast(value, s).else(() => right.convert(value, s)));
        else
            return new Cast((value, s) => this.cast(value, s).or(right.cast(value, s)));
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
        if (Guard.isCollectionOf(Guard.isInstanceOf(Convert)).guard(casts)) {
            const map = Utils.mapLazy(casts);
            return new Convert((value, s) => map((conv) => conv.convert(value, s)));
        }
        else {
            const map = Utils.mapLazy(casts);
            return new Cast((value, s) => Maybe.all(map((cast) => cast.cast(value, s))));
        }
    }
    /**
     * Creates a convert that outputs an array containing the successful results of applying each cast in the given collection to the input value.
     * @param casts An array of casts.
     * @returns A convert that outputs an array of successfully results
     */
    static any(casts) {
        return new Convert((value, s) => Maybe.any(casts.map(cast => cast.cast(value, s))));
    }
    if(condition) {
        return this.bind(value => condition(value) ? Cast.just(value) : Cast.nothing());
    }
    and(guard) {
        return this.bind((value, s) => guard.guard(value, s) ? Cast.just(value) : Cast.nothing());
    }
    merge(cast) {
        return this.bind(self => cast.bind(other => Cast.just({ ...self, ...other })));
    }
    map(next) {
        return this.bind(value => Cast.just(next(value)));
    }
    else(other) {
        return this.or(new Convert(_ => other));
    }
    elseThrow(getError = e => e) {
        return new Convert((value, s) => this._cast(value, s).else(e => { throw getError(e); }));
    }
    get toMaybe() {
        return new Convert(value => this.cast(value));
    }
    static get asPrimitiveValue() {
        return Guard.isPrimitiveValue.or(Guard.isArray
            .bind(Cast.unwrapArray)
            .compose(Guard.isPrimitiveValue));
    }
    static get asString() {
        return Guard.isString.or(Cast.asPrimitiveValue.map(s => s.toString()));
    }
    static get asNumber() {
        return Cast.asPrimitiveValue.compose(Cast.some(Guard.isNumber, Guard.isConst('NaN').map(() => NaN), Guard.isString.map(parseFloat).if(n => !isNaN(n)), Guard.isBigInt.if(n => Number.MIN_SAFE_INTEGER <= n && n <= Number.MAX_SAFE_INTEGER).map(n => Number(n)), Guard.isBoolean.map(b => b ? 1 : 0)));
    }
    static get asFinite() {
        return Cast.asNumber.and(Guard.isFinite);
    }
    static get asInteger() {
        return Cast.asFinite.map(Math.round);
    }
    static get asBigInt() {
        return Cast.asPrimitiveValue.compose(Cast.some(Guard.isBigInt, Guard.isString.bind(s => Cast.try(() => BigInt(s))), Guard.isSafeInteger.map(n => BigInt(n)), Guard.isBoolean.map(b => BigInt(b ? 1 : 0))));
    }
    static get asBoolean() {
        return Guard.isBoolean.or(Cast.asString.bind((v, s) => {
            if (s.booleanNames.true.includes(v))
                return Cast.just(true);
            else if (s.booleanNames.false.includes(v))
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
        return Guard.isArray.or(Guard.isSomething.bind(Cast.wrapArray));
    }
    static asConst(value) {
        return Guard.isConst(value).or(Cast.just(value).asString.bind(str1 => Cast.asString.if(str2 => str1 === str2)).map(_ => value));
    }
    static asEnum(...options) {
        return Cast.some(...options.map(Cast.asConst));
    }
    static makeCollectionOf(cast) {
        return col => Cast.all(Utils.mapEager(col, i => Cast.just(i).compose(cast)));
    }
    static asArrayOf(cast) {
        return Cast.asArray.bind(Cast.makeCollectionOf(cast));
    }
    static asStructOf(cast) {
        return Guard.isStruct.bind(Cast.makeCollectionOf(cast));
    }
    static makeCollectionLike(casts) {
        const map = Utils.mapLazy(casts);
        return col => Cast.all(map((cast, k) => Cast.just(col[k]).compose(cast)));
    }
    /**
     * Given an object or tuple of casts, it produces a cast that outputs an object or tuple having the same shape as the given casts.
     * @param casts an object or tuple of casts
     * @returns a cast that produces an object or tuple matching the shape of the given casts
     */
    static asCollectionLike(casts) {
        return Array.isArray(casts) ?
            Cast.asArray.bind(Cast.makeCollectionLike(casts)) :
            Guard.isStruct.bind(Cast.makeCollectionLike(casts));
    }
    /**
     * Produces a cast that filters out values from the input that could not be casted by the given cast.
     * @param cast the cast to use for filtering
     * @returns a cast that filters out values that could not be casted by the given cast
     */
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
        return Cast.asCollectionLike(Utils.mapEager(alt, Cast.as));
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
Cast.castError = new Error('Cast has no value');
Cast.defaults = {
    keyGuarding: 'loose',
    booleanNames: {
        true: ['true', 'on', '1'],
        false: ['false', 'off', '0']
    },
    unwrapArray: 'single',
    wrapArray: 'single'
};
Cast.asUnknown = new Cast(value => Maybe.just(value));
Cast.asNever = new Cast(_ => Maybe.nothing(Cast.castError));
//# sourceMappingURL=cast.js.map