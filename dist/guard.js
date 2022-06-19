import { Maybe, Cast } from "./internal.js";
export class Guard extends Cast {
    constructor(guard) {
        super(val => guard(val) ? Maybe.just(val) : Maybe.nothing());
        this.guard = guard;
    }
    and(right) {
        return new Guard((val) => this.guard(val) && (right instanceof Guard ? right : right(val)).guard(val));
    }
    or(right) {
        if (right instanceof Guard)
            return new Guard((val) => this.guard(val) || right.guard(val));
        else
            return super.or(right);
    }
    if(condition) {
        return new Guard((val) => this.guard(val) && condition(val));
    }
    static every(...guards) {
        return guards.reduce((acc, guard) => acc.and(guard), Guard.isUnknown);
    }
    static isConst(value) {
        return new Guard((val) => val === value);
    }
    static isClass(cls) {
        return new Guard((val) => val instanceof cls);
    }
    static isEnum(...options) {
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
    //public static get isWeirdShit() { return Guard.isNothing.or(Guard.isObject); } // Just for completeness
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
    static isInstanceOf(cls) {
        return new Guard((val) => val instanceof cls);
    }
    static isArrayOf(guard) {
        return new Guard((val) => Array.isArray(val) && val.every(guard.guard));
    }
}
Guard.isUnknown = new Guard((val) => true);
Guard.isNever = new Guard((val) => false);
//# sourceMappingURL=guard.js.map