"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guard = void 0;
const internal_js_1 = require("./internal.js");
class Was {
    constructor() { }
}
class Guard extends internal_js_1.Cast {
    constructor(_guard) {
        super((val, s) => _guard(val, s) ? internal_js_1.Maybe.just(val) : internal_js_1.Maybe.nothing());
        this._guard = _guard;
    }
    static lazy(fun) {
        return new Guard((val, s) => fun(s)._guard(val, s));
    }
    guard(input, settings) {
        return this._guard(input, settings !== null && settings !== void 0 ? settings : internal_js_1.Cast.defaults);
    }
    config(config) {
        return new Guard((value, s) => this._guard(value, { ...s, ...config }));
    }
    and(right) {
        return new Guard((val, s) => this._guard(val, s) && (right instanceof Guard ? right._guard(val, s) : right(val, s)));
    }
    or(right) {
        if (right instanceof Guard)
            return new Guard((val, s) => this._guard(val, s) || right._guard(val, s));
        else
            return super.or(right);
    }
    if(condition) {
        return new Guard((val, s) => this._guard(val, s) && !!condition(val));
    }
    /**
     * Intersects a list of guards by combining them with the `and` operator.
     * @param guards An array of guards.
     * @returns The intersection of the given guards.
     */
    static every(...guards) {
        return guards.reduce((acc, guard) => acc.and(guard), Guard.isUnknown);
    }
    static isConst(value) {
        return new Guard((val) => val === value);
    }
    static isClass(cls) {
        return new Guard((val) => val instanceof cls);
    }
    static isEnum(options) {
        return Guard.some(...options.map(Guard.isConst));
    }
    static get isPrimitiveValue() {
        return new Guard((val) => typeof val === 'string' ||
            typeof val === 'number' ||
            typeof val === 'bigint' ||
            typeof val === 'boolean' ||
            typeof val === 'symbol');
    }
    static get isNothing() {
        return new Guard((val) => val === undefined ||
            val === null);
    }
    static get isObject() {
        return new Guard((val) => (val !== null && typeof val === 'object') || typeof val === 'function');
    }
    static get isPrimitive() { return Guard.isPrimitiveValue.or(Guard.isNothing); }
    static get isSomething() { return Guard.isPrimitiveValue.or(Guard.isObject); }
    //public static get isWeirdShit() { return Guard.isNothing.or(Guard.isObject); } // For completeness
    static get isString() { return new Guard((val) => typeof val === 'string'); }
    static get isNumber() { return new Guard((val) => typeof val === 'number'); }
    static get isBigInt() { return new Guard((val) => typeof val === 'bigint'); }
    static get isBoolean() { return new Guard((val) => typeof val === 'boolean'); }
    static get isSymbol() { return new Guard((val) => typeof val === 'symbol'); }
    static get isFinite() { return Guard.isNumber.if(Number.isFinite); }
    static get isInteger() { return Guard.isNumber.if(Number.isInteger); }
    static get isSafeInteger() { return Guard.isNumber.if(Number.isSafeInteger); }
    static get isCollection() { return new Guard((val) => val !== null && typeof val === 'object'); }
    static get isStruct() { return new Guard((val) => val !== null && typeof val === 'object' && !Array.isArray(val)); }
    static get isArray() { return new Guard((val) => Array.isArray(val)); }
    static get isFunction() { return new Guard((val) => typeof val === 'function'); }
    static isInstanceOf(cls) {
        return new Guard((val) => val instanceof cls);
    }
    static isCollectionOf(guard) {
        return Guard.isCollection.and((col, s) => Object.values(col).every(a => guard._guard(a, s)));
    }
    static isArrayOf(guard) {
        return Guard.isArray.and((arr, s) => arr.every(i => guard._guard(i, s)));
    }
    static isStructOf(guard) {
        return Guard.isStruct.and((str, s) => Object.values(str).every(i => guard._guard(i, s)));
    }
    static isCollectionLike(guards) {
        const gKeys = Object.keys(guards);
        const gEntries = Object.entries(guards);
        return Guard.isCollection.and((col, s) => (s.keyGuarding === 'loose' || gKeys.length === Object.keys(col).length)
            && gEntries.every(([k, g]) => g.guard(col[k], s)));
    }
    /**
     * Creates a `Guard` based on a sample value.
     * @param alt a sample value
     * @returns a `Guard` based on the given sample value
     */
    static is(alt) {
        switch (typeof alt) {
            case 'string':
                return Guard.isString;
            case 'number':
                return Guard.isNumber;
            case 'boolean':
                return Guard.isBoolean;
            case 'bigint':
                return Guard.isBigInt;
            case 'symbol':
                return Guard.isSymbol;
            case 'undefined':
                return Guard.isConst(undefined);
            case 'function':
                return Guard.isFunction;
            case 'object':
                if (alt instanceof Guard)
                    return alt;
                else if (alt === null)
                    return Guard.isConst(null);
        }
        return Guard.isCollectionLike(internal_js_1.Utils.mapEager(alt, a => Guard.is(a)));
    }
}
exports.Guard = Guard;
Guard.isUnknown = new Guard((val) => true);
Guard.isNever = new Guard((val) => false);
