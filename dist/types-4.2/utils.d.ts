import { Collection } from "./types";
export declare class Utils {
    static mapLazy<S, C extends Collection<S> = Collection<S>>(container: C): <T>(map: (value: S, key: string) => T) => {
        [I in keyof C]: T;
    };
    static mapEager<S, T, C extends Collection<S>>(container: C, map: (value: S, key: string) => T): {
        [I in keyof C]: T;
    };
    static fromEntries<T>(entries: [
        string,
        T
    ][]): {
        [s: string]: T;
    };
}
