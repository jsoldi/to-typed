export class Utils {
    static objectMap<S, T>(obj: Record<string, S>, map: (key: string, value: S) => [ string, T ]) {
        return Object.fromEntries(Object.entries(obj).map(([key, value]) => map(key, value)));
    }
}
