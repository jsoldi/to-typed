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
        return new Convert(value => (g instanceof Convert ? g : g()).convert(this.convert(value)));
    }
    static toEnum(...options) {
        return Guard.isEnum(...options).else(options[0]);
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
    static toArray(convertItem) {
        return Cast.asArray.map(val => val.map(convertItem.convert)).else([]);
    }
    static toObject(convertValues) {
        return new Convert((value) => {
            const obj = (value ?? {});
            return Utils.objectMap(convertValues, (cKey, cVal) => [cKey, cVal.convert(obj[cKey])]);
        });
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
                        return Convert.toArray(Convert.to(alt[0]));
                    else
                        return Convert.unit([]); // We can't produce items of type never
                }
                else if (alt instanceof Convert)
                    return alt;
                else if (alt === null)
                    return Convert.unit(alt);
        }
        return Convert.toObject(Utils.objectMap(alt, (key, val) => [key, Convert.to(val)]));
    }
    toEnum(...options) { return this.compose(Convert.toEnum(...options)); }
    toString(alt = '') { return this.compose(Convert.toString(alt)); }
    toNumber(alt = 0) { return this.compose(Convert.toNumber(alt)); }
    toBoolean(alt = false) { return this.compose(Convert.toBoolean(alt)); }
    toBigInt(alt = BigInt(0)) { return this.compose(Convert.toBigInt(alt)); }
    toArray(convertItem) { return this.compose(Convert.toArray(convertItem)); }
    toObject(convertValues) { return this.compose(Convert.toObject(convertValues)); }
    to(alt) { return this.compose(Convert.to(alt)); }
}
Convert.id = new Convert(value => value);
//# sourceMappingURL=convert.js.map