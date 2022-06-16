export class Utils {
    static objectMap(obj, map) {
        return Object.fromEntries(Object.entries(obj).map(([key, value]) => map(key, value)));
    }
}
//# sourceMappingURL=utils.js.map