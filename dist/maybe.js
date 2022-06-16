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
    else(other) {
        return this.read((t) => t, () => other);
    }
}
//# sourceMappingURL=maybe.js.map