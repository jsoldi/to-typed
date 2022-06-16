import { Utils, Maybe, Cast, Guard } from "./internal.js";
export class Convert extends Cast {
    constructor(convert) {
        super(value => Maybe.just(convert(value)));
        this.convert = convert;
    }
    static unit(value) {
        return new Convert(_ => value);
    }
    static toEnum(...options) {
        return Guard.some(...options.map(Guard.isConst)).else(options[0]);
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
                        return Convert.unit([]); // We couldn't produce items of type never
                }
                else if (alt instanceof Convert)
                    return alt;
                else if (alt === null)
                    return Convert.unit(alt);
        }
        return Convert.toObject(Utils.objectMap(alt, (key, val) => [key, Convert.to(val)]));
    }
}
//# sourceMappingURL=convert.js.map