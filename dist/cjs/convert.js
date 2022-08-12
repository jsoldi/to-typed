"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = void 0;
const internal_js_1 = require("./internal.js");
class Convert extends internal_js_1.Cast {
    constructor(_convert) {
        super((value, s) => internal_js_1.Maybe.just(_convert(value, s)));
        this._convert = _convert;
    }
    static lazy(fun) {
        return new Convert((val, s) => fun(s)._convert(val, s));
    }
    convert(value, settings) {
        return this._convert(value, settings !== null && settings !== void 0 ? settings : internal_js_1.Cast.defaults);
    }
    decons() {
        const def = this.convert(undefined);
        if (def !== null && typeof def === 'object' && !(def instanceof Date)) {
            const replaceProperty = (key, value) => new Proxy(def, {
                get: (...args) => args[1] === key ? value : Reflect.get(...args)
            });
            const convertGetter = (key) => new Convert((value, settings) => {
                const t = this._convert(replaceProperty(key, value), settings);
                return t ? t[key] : undefined;
            });
            return new Proxy(def, {
                get: (...args) => {
                    if (args[0].propertyIsEnumerable(args[1]))
                        return convertGetter(args[1]);
                    return Reflect.get(...args);
                }
            });
        }
        else
            return def;
    }
    config(config) {
        return new Convert((value, s) => this._convert(value, { ...s, ...config }));
    }
    static toConst(value) {
        return new Convert(_ => value);
    }
    compose(g) {
        return new Convert((value, s) => g._convert(this._convert(value, s), s));
    }
    map(fun) {
        return new Convert((value, s) => fun(this._convert(value, s)));
    }
    /**
     * Converts to a union of the given options, and defaults to the first option.
     * @param options an array of options to choose from, where the first option is the default
     * @returns a `Convert` that converts to a union
     */
    static toEnum(...options) {
        return internal_js_1.Cast.asEnum(...options).else(options[0]);
    }
    static toString(alt = '') {
        return internal_js_1.Cast.asString.else(alt);
    }
    static toNumber(alt = 0) {
        return internal_js_1.Cast.asNumber.else(alt);
    }
    static toFinite(alt = 0) {
        return internal_js_1.Cast.asFinite.else(alt);
    }
    static toInteger(alt = 0) {
        return internal_js_1.Cast.asInteger.else(alt);
    }
    static toBoolean(alt = false) {
        return internal_js_1.Cast.asBoolean.else(alt);
    }
    static toTruthy() {
        return new Convert(value => !!value);
    }
    static toBigInt(alt = BigInt(0)) {
        return internal_js_1.Cast.asBigInt.else(alt);
    }
    static toDate(alt = new Date(0)) {
        return internal_js_1.Cast.asDate.else(alt);
    }
    static toArray(alt = []) {
        return internal_js_1.Cast.asArray.else(alt);
    }
    static toArrayOf(convertItem, alt = []) {
        return internal_js_1.Cast.asArrayOf(convertItem).else(alt);
    }
    static toStructOf(convertItem, alt = {}) {
        return internal_js_1.Cast.asStructOf(convertItem).else(alt);
    }
    /**
     * Given an object or tuple of converts, it produces a convert that outputs an object or tuple having the same shape as the given converts.
     * @param casts an object or tuple of converts
     * @returns a convert that produces an object or tuple matching the shape of the given converts
     */
    static toCollectionLike(converts) {
        return internal_js_1.Guard.isCollection.or(internal_js_1.Cast.just(Array.isArray(converts) ? [] : {})).asCollectionLike(converts).elseThrow();
    }
    /**
     * Produces a convert that filters out values from the input that could not be casted by the given cast.
     * @param cast the cast to use for filtering
     * @returns a convert that filters out values that could not be casted by the given cast
     */
    static toArrayWhere(cast) {
        return internal_js_1.Cast.asArrayWhere(cast).else([]);
    }
    /**
     * Creates a `Convert` based on the given sample value, which is also used as the set of default values.
     * @param alt a sample value which also serves as the set of default values
     * @returns a `Convert` based on the given sample value
     */
    static to(alt) {
        switch (typeof alt) {
            case 'string':
                return Convert.toString(alt);
            case 'number':
                return Convert.toNumber(alt);
            case 'boolean':
                return Convert.toBoolean(alt);
            case 'bigint':
                return Convert.toBigInt(alt);
            case 'symbol':
                internal_js_1.Guard.isSymbol.else(alt);
            case 'function':
                return internal_js_1.Guard.isFunction.else(alt);
            case 'undefined':
                return Convert.toConst(undefined);
            case 'object':
                if (alt instanceof Convert)
                    return alt;
                else if (alt === null)
                    return Convert.toConst(null);
        }
        return Convert.toCollectionLike(internal_js_1.Utils.mapEager(alt, Convert.to));
    }
    toEnum(...options) { return this.compose(Convert.toEnum(...options)); }
    toString(alt = '') { return this.compose(Convert.toString(alt)); }
    toNumber(alt = 0) { return this.compose(Convert.toNumber(alt)); }
    toBoolean(alt = false) { return this.compose(Convert.toBoolean(alt)); }
    toBigInt(alt = BigInt(0)) { return this.compose(Convert.toBigInt(alt)); }
    toDate(alt = new Date(0)) { return this.compose(Convert.toDate(alt)); }
    toArray(convertItem, alt = []) { return this.compose(Convert.toArrayOf(convertItem, alt)); }
    toArrayOf(convertItem, alt = []) { return this.compose(Convert.toArrayOf(convertItem, alt)); }
    toStructOf(convertItem, alt = {}) { return this.compose(Convert.toStructOf(convertItem, alt)); }
    toCollectionLike(converts) { return this.compose(Convert.toCollectionLike(converts)); }
    toArrayWhere(cast) { return this.compose(Convert.toArrayWhere(cast)); }
    to(alt) { return this.compose(Convert.to(alt)); }
}
exports.Convert = Convert;
Convert.id = new Convert(value => value);
//# sourceMappingURL=convert.js.map