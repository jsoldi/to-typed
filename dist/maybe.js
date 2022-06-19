export class Maybe {
    constructor(hasValue, value) {
        this.hasValue = hasValue;
        this.value = value;
    }
    static just(value) {
        return new Maybe(true, value);
    }
    static nothing() {
        return new Maybe(false, null);
    }
    static all(maybes) {
        const result = (Array.isArray(maybes) ? [] : {});
        const entries = Object.entries(maybes);
        for (let [k, v] of entries) {
            if (v.hasValue)
                result[k] = v.value;
            else
                return Maybe.nothing();
        }
        return Maybe.just(result);
    }
    get elseThrow() {
        return this.read(t => t, () => { throw new Error('No value'); });
    }
    read(ifValue, ifNothing) {
        return this.hasValue ? ifValue(this.value) : ifNothing();
    }
    bind(next) {
        return this.read(next, Maybe.nothing);
    }
    map(next) {
        return this.bind(value => Maybe.just(next(value)));
    }
    or(right) {
        return this.read(t => Maybe.just(t), () => right);
    }
    else(getAlt) {
        return this.read((t) => t, () => getAlt());
    }
}
//# sourceMappingURL=maybe.js.map