export class Utils {
    static map(map) {
        return (container) => {
            return Array.isArray(container) ?
                container.map((v, i) => map(v, i.toString())) :
                Object.fromEntries(Object.entries(container).map(([key, value]) => [key, map(value, key)]));
        };
    }
}
// const uno = Utils.mapper((s: number) => s.toString());
// const sale1 = uno([10, 20, 30]);
// const sale2 = uno([10, 20, 30] as const);
// const sale3 = uno({ uno: 10, dos: 20, tres: 30 });
//# sourceMappingURL=utils.js.map