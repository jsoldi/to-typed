"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
class Utils {
    static map(map) {
        return (container) => {
            return Array.isArray(container) ?
                container.map((v, i) => map(v, i.toString())) :
                Object.fromEntries(Object.entries(container).map(([key, value]) => [key, map(value, key)]));
        };
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map