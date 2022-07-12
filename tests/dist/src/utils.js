export class Utils {
    static mapLazy(container) {
        if (Array.isArray(container)) {
            return (map) => container.map((v, i) => map(v, i.toString()));
        }
        else {
            const entries = Object.entries(container);
            return (map) => Utils.fromEntries(entries.map(([key, value]) => [key, map(value, key)]));
        }
    }
    static mapEager(container, map) {
        if (Array.isArray(container)) {
            return container.map((v, i) => map(v, i.toString()));
        }
        else {
            const entries = Object.entries(container);
            return Utils.fromEntries(entries.map(([key, value]) => [key, map(value, key)]));
        }
    }
    static fromEntries(entries) {
        let res = {};
        for (let [key, value] of entries)
            res[key] = value;
        return res;
    }
}
