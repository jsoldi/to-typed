import { Collection } from "./types";
export declare class Utils {
    static map<S, T>(map: (value: S, key: string) => T): <C extends Collection<S>>(container: C) => { [I in keyof C]: T; };
}
//# sourceMappingURL=utils.d.ts.map