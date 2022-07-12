"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maybe = void 0;
class MaybeBase {
    constructor(data) {
        this.data = data;
    }
    static just(value) {
        return new MaybeBase({ hasValue: true, value });
    }
    static nothing() {
        return new MaybeBase({ hasValue: false });
    }
    get hasValue() {
        return this.data.hasValue;
    }
    get value() {
        return this.else(() => undefined);
    }
    static all(maybes) {
        const result = (Array.isArray(maybes) ? [] : {});
        const entries = Object.entries(maybes);
        for (let [k, v] of entries) {
            if (v.hasValue)
                result[k] = v.value;
            else
                return MaybeBase.nothing();
        }
        return MaybeBase.just(result);
    }
    static any(maybes) {
        const result = [];
        for (let maybe of maybes) {
            if (maybe.hasValue)
                result.push(maybe.value);
        }
        return result;
    }
    read(ifValue, ifNothing) {
        return this.data.hasValue ? ifValue(this.data.value) : ifNothing ? ifNothing() : undefined;
    }
    bind(next) {
        return this.read(next, MaybeBase.nothing);
    }
    map(next) {
        return this.bind(value => MaybeBase.just(next(value)));
    }
    or(right) {
        return this.read(t => MaybeBase.just(t), () => right);
    }
    else(getAlt) {
        return this.read((t) => t, () => getAlt());
    }
    elseThrow(getError) {
        return this.read((t) => t, () => { throw getError(); });
    }
}
exports.Maybe = MaybeBase;
//# sourceMappingURL=maybe.js.map