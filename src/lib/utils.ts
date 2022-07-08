import { Collection, Struct } from "./types"

export class Utils {
    static mapLazy<S, C extends Collection<S> = Collection<S>>(container: C): <T>(map: (value: S, key: string) => T) => { [I in keyof C]: T } {
        if (Array.isArray(container)) {
            return <T>(map: (value: S, key: string) => T) =>
                container.map((v, i) => map(v, i.toString())) as any
        } 
        else {
            const entries = Object.entries(container)
            return <T>(map: (value: S, key: string) => T) => 
                Object.fromEntries(entries.map(([key, value]) => [ key, map(value, key) ])) as any
        }
    }

    static mapEager<S, T, C extends Collection<S>>(container: C, map: (value: S, key: string) => T) : { [I in keyof C]: T } {
        if (Array.isArray(container)) {
            return container.map((v, i) => map(v, i.toString())) as any;
        } 
        else {
            const entries = Object.entries(container)
            return Object.fromEntries(entries.map(([key, value]) => [ key, map(value, key) ])) as any
        }
    }
}
