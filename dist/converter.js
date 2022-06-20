import { Cast, Guard, Convert } from "./internal.js";
class Convertor extends Convert {
    constructor(guardOnly, castOnly, convertOnly) {
        super(guardOnly.or(castOnly).or(convertOnly).convert);
        this.guardOnly = guardOnly;
        this.castOnly = castOnly;
        this.convertOnly = convertOnly;
    }
    get chain() {
        return {
            guard: this.guardOnly,
            cast: this.guardOnly.or(this.castOnly),
            convert: this.guardOnly.or(this.castOnly).or(this.convertOnly)
        };
    }
    static toNumber(alt = 0) {
        return new Convertor(Guard.isNumber, Cast.asNumber, Convert.toNumber(alt));
    }
}
//# sourceMappingURL=converter.js.map