export class Utils {
    static map(map) {
        return (container) => {
            return Array.isArray(container) ?
                container.map((v, i) => map(v, i.toString())) :
                Object.fromEntries(Object.entries(container).map(([key, value]) => [key, map(value, key)]));
        };
    }
}
//# sourceMappingURL=utils.js.map