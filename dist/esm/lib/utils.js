export class Utils {
    static mapLazy(container) {
        if (Array.isArray(container)) {
            return (map) => container.map((v, i) => map(v, i.toString()));
        }
        else {
            const entries = Object.entries(container);
            return (map) => Object.fromEntries(entries.map(([key, value]) => [key, map(value, key)]));
        }
    }
    static mapEager(container, map) {
        if (Array.isArray(container)) {
            return container.map((v, i) => map(v, i.toString()));
        }
        else {
            const entries = Object.entries(container);
            return Object.fromEntries(entries.map(([key, value]) => [key, map(value, key)]));
        }
    }
}
//# sourceMappingURL=utils.js.map