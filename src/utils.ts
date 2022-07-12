import { Collection } from "./types"

export class Utils {
    static mapLazy<S, C extends Collection<S> = Collection<S>>(container: C): <T>(map: (value: S, key: string) => T) => { [I in keyof C]: T } {
        if (Array.isArray(container)) {
            return <T>(map: (value: S, key: string) => T) =>
                container.map((v, i) => map(v, i.toString())) as any
        } 
        else {
            const entries = Object.entries(container)
            return <T>(map: (value: S, key: string) => T) => 
                Utils.fromEntries(entries.map(([key, value]) => [ key, map(value, key) ])) as any
        }
    }

    static mapEager<S, T, C extends Collection<S>>(container: C, map: (value: S, key: string) => T) : { [I in keyof C]: T } {
        if (Array.isArray(container)) {
            return container.map((v, i) => map(v, i.toString())) as any;
        } 
        else {
            const entries = Object.entries(container)
            return Utils.fromEntries(entries.map(([key, value]) => [ key, map(value, key) ])) as any
        }
    }

    static fromEntries<T>(entries: [string, T][]): { [s: string]: T } {
        let res = {} as any;

        for (let [key, value] of entries)
            res[key] = value;

        return res;
    }
}
