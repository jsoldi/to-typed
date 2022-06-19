import { Utils, Maybe, Cast, Guard } from "./internal.js";
export class Convert extends Cast {
    constructor(convert) {
        super(value => Maybe.just(convert(value)));
        this.convert = convert;
    }
    static unit(value) {
        return new Convert(_ => value);
    }
    compose(g) {
        return new Convert(value => g.convert(this.convert(value)));
    }
    static toEnum(...options) {
        return Cast.asEnum(...options).else(options[0]);
    }
    static toString(alt = '') {
        return Cast.asString.else(alt);
    }
    static toNumber(alt = 0) {
        return Cast.asNumber.else(alt);
    }
    static toBoolean(alt = false) {
        return Cast.asBoolean.else(alt);
    }
    static toBigInt(alt = BigInt(0)) {
        return Cast.asBigint.else(alt);
    }
    static toArray(alt = []) {
        return Cast.asArray.else(alt);
    }
    static toArrayOf(convertItem, alt = []) {
        return Cast.asArrayOf(convertItem).else(alt);
    }
    static toCollectionOf(converts) {
        return Guard.isCollection.or(Cast.just(Array.isArray(converts) ? [] : {})).asCollectionOf(converts).elseThrow;
    }
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
            case 'undefined':
            case 'function':
                return Convert.unit(alt);
            case 'object':
                if (Array.isArray(alt)) {
                    if (alt.length)
                        return Convert.toArrayOf(Convert.to(alt[0]));
                    else
                        return Convert.unit([]); // We can't produce items of type never
                }
                else if (alt instanceof Convert)
                    return alt;
                else if (alt === null)
                    return Convert.unit(null);
        }
        return Convert.toCollectionOf(Utils.map(Convert.to)(alt));
    }
    toEnum(...options) { return this.compose(Convert.toEnum(...options)); }
    toString(alt = '') { return this.compose(Convert.toString(alt)); }
    toNumber(alt = 0) { return this.compose(Convert.toNumber(alt)); }
    toBoolean(alt = false) { return this.compose(Convert.toBoolean(alt)); }
    toBigInt(alt = BigInt(0)) { return this.compose(Convert.toBigInt(alt)); }
    toArray(convertItem, alt = []) { return this.compose(Convert.toArrayOf(convertItem, alt)); }
    toArrayOf(convertItem, alt = []) { return this.compose(Convert.toArrayOf(convertItem, alt)); }
    toCollectionOf(converts) { return this.compose(Convert.toCollectionOf(converts)); }
    to(alt) { return this.compose(Convert.to(alt)); }
}
Convert.id = new Convert(value => value);
//# sourceMappingURL=convert.js.map