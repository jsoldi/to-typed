import { Maybe, Cast } from "./internal.js";
export class Guard extends Cast {
    constructor(guard) {
        super(val => guard(val) ? Maybe.just(val) : Maybe.nothing());
        this.guard = guard;
    }
    and(right) {
        return new Guard((val) => this.guard(val) && right.guard(val));
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
    static isConst(value) {
        return new Guard((val) => val === value);
    }
    static isClass(cls) {
        return new Guard((val) => val instanceof cls);
    }
    static isEnum(...options) {
        return Guard.some(...options.map(Guard.isConst));
    }
    // `isPrimitiveValue`, `isNothing` and `isObject` shold cover every possible type with no overlap.
    static get isPrimitiveValue() {
        return new Guard((val) => typeof val === 'string' ||
            typeof val === 'number' ||
            typeof val === 'bigint' ||
            typeof val === 'boolean' ||
            typeof val === 'symbol');
    }
    // `isPrimitiveValue`, `isNothing` and `isObject` shold cover every possible type with no overlap.
    static get isNothing() {
        return new Guard((val) => val === undefined ||
            val === null);
    }
    // `isPrimitiveValue`, `isNothing` and `isObject` shold cover every possible type with no overlap.
    static get isObject() {
        return new Guard((val) => val instanceof Object);
    }
    static get isFunction() {
        return new Guard((val) => typeof val === 'function');
    }
    static get isPrimitive() { return Guard.isPrimitiveValue.or(Guard.isNothing); }
    static get isString() { return new Guard((val) => typeof val === 'string'); }
    static get isNumber() { return new Guard((val) => typeof val === 'number'); }
    static get isBigInt() { return new Guard((val) => typeof val === 'bigint'); }
    static get isBoolean() { return new Guard((val) => typeof val === 'boolean'); }
    static get isSymbol() { return new Guard((val) => typeof val === 'symbol'); }
    static get isFinite() { return Guard.isNumber.if(Number.isFinite); }
    static get isInteger() { return Guard.isNumber.if(Number.isInteger); }
    static get isSafeInteger() { return Guard.isNumber.if(Number.isSafeInteger); }
    static get isArray() { return new Guard((val) => Array.isArray(val)); }
}
Guard.isUnknown = new Guard((val) => true);
Guard.isNever = new Guard((val) => false);
//# sourceMappingURL=guard.js.map