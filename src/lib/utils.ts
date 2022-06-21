import { Collection } from "./types"

export class Utils {
    static map<S, T>(map: (value: S, key: string) => T) {
        return <C extends Collection<S>>(container: C) : { [I in keyof C]: T } => {
            return Array.isArray(container) ?
                container.map((v, i) => map(v, i.toString())) :
                Object.fromEntries(Object.entries(container).map(([key, value]) => [ key, map(value, key) ])) as any
        }
    }
}
