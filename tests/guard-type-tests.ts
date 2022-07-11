import { Guard } from "../src/index.js";
import { TypeAssert, TypesAreEqual } from "./tester.js";

function guardsAreOneSided(value: unknown) {
    if (typeof value === "string" || typeof value === "number") {
        type ExtendsNumberAndString = TypeAssert<typeof value extends number | string ? true : false>

        if (Guard.isInteger.guard(value)) {
            type ExtendsNumberAndNotString = TypeAssert<typeof value extends number ? typeof value extends string ? false : true : false>

            if (Guard.isSafeInteger.guard(value)) {
                type ExtendsNumberAndNotString = TypeAssert<typeof value extends number ? typeof value extends string ? false : true : false>                    
            } else {
                type ExtendsNumberAndNotString = TypeAssert<typeof value extends number ? typeof value extends string ? false : true : false>
            }
        } else {
            type ExtendsNumberAndString = TypeAssert<typeof value extends number | string ? true : false>
        }

        if (typeof value === "string" || Guard.isFinite.guard(value)) {
            type ExtendsNumberAndString = TypeAssert<typeof value extends number | string ? true : false>

            if (Guard.isInteger.guard(value)) {
                type ExtendsNumberAndNotString = TypeAssert<typeof value extends number ? typeof value extends string ? false : true : false>
            
                if (Guard.isSafeInteger.guard(value)) {
                    type ExtendsNumberAndNotString = TypeAssert<typeof value extends number ? typeof value extends string ? false : true : false>                    
                } else {
                    type ExtendsNumberAndNotString = TypeAssert<typeof value extends number ? typeof value extends string ? false : true : false>
                }
            } else {
                type ExtendsNumberAndString = TypeAssert<typeof value extends number | string ? true : false>
            }
        } else {
            type IsNumber = TypeAssert<TypesAreEqual<number, typeof value>>        
        }
    } else {
        type IsUnknown = TypeAssert<TypesAreEqual<unknown, typeof value>>        
    }
}

function unknownGuardWorks(unknown: unknown, never: never) {
    if (Guard.isUnknown.guard(unknown)) {
        type IsUnknown = TypeAssert<TypesAreEqual<unknown, typeof unknown>>
    } else {
        type IsNever = TypeAssert<TypesAreEqual<never, typeof unknown>>
    }

    if (Guard.isUnknown.guard(never)) {
        type IsNever = TypeAssert<TypesAreEqual<never, typeof never>>
    } else {
        type IsNever = TypeAssert<TypesAreEqual<never, typeof never>>
    }

    if (typeof unknown === 'string' || Guard.isInteger.guard(unknown)) {
        const outer = unknown;

        if (Guard.isUnknown.guard(unknown)) {
            type IsUnchanged = TypeAssert<TypesAreEqual<typeof unknown, typeof outer>>
        } else {
            type IsNever = TypeAssert<TypesAreEqual<never, typeof unknown>>
        }
    }
}

function neverGuardWorks(unknown: unknown, never: never) {
    if (Guard.isNever.guard(unknown)) {
        type IsNever = TypeAssert<TypesAreEqual<never, typeof unknown>>
    } else {
        type IsUnknown = TypeAssert<TypesAreEqual<unknown, typeof unknown>>
    }

    if (Guard.isNever.guard(never)) {
        type IsNever = TypeAssert<TypesAreEqual<never, typeof never>>
    } else {
        type IsNever = TypeAssert<TypesAreEqual<never, typeof never>>
    }

    if (typeof unknown === 'string' || Guard.isInteger.guard(unknown)) {
        const outer = unknown;

        if (Guard.isNever.guard(unknown)) {
            type IsNever = TypeAssert<TypesAreEqual<never, typeof unknown>>
        } else {
            type IsUnchanged = TypeAssert<TypesAreEqual<typeof unknown, typeof outer>>
        }
    }
}

function nothingGuardsWork(unknown: unknown) {
    if (Guard.isConst(null).guard(unknown)) {
        type IsNull = TypeAssert<TypesAreEqual<null, typeof unknown>>
    } else {
        type IsUnknown = TypeAssert<TypesAreEqual<unknown, typeof unknown>>
    }

    if (Guard.isConst(undefined).guard(unknown)) {
        type IsUndefined = TypeAssert<TypesAreEqual<undefined, typeof unknown>>
    } else {
        type IsUnknown = TypeAssert<TypesAreEqual<unknown, typeof unknown>>
    }

    if (Guard.isNothing.guard(unknown)) {
        type isNothing = TypeAssert<TypesAreEqual<null | undefined, typeof unknown>>
    } else {
        type IsUnknown = TypeAssert<TypesAreEqual<unknown, typeof unknown>>
    }

    if (typeof unknown === "string" || Guard.isInteger.guard(unknown) || unknown === null || unknown === undefined) {
        if (Guard.isConst(null).guard(unknown)) {
            type IsNull = TypeAssert<TypesAreEqual<null, typeof unknown>>

            if (Guard.isConst(undefined).guard(unknown)) {
                type IsNever = TypeAssert<TypesAreEqual<never, typeof unknown>>
            } else {
                type IsNull = TypeAssert<TypesAreEqual<null, typeof unknown>>
            }
        } else {
            type ExtendsStringNumberUndefinedAndNotNull = TypeAssert<typeof unknown extends string | number | undefined ? typeof unknown extends null ? false : true : false>
        }
    
        if (Guard.isConst(undefined).guard(unknown)) {
            type IsUndefined = TypeAssert<TypesAreEqual<undefined, typeof unknown>>
        } else {
            type ExtendsStringNumberNullAndNotUndefined = TypeAssert<typeof unknown extends string | number | null ? typeof unknown extends undefined ? false : true : false>
        }
    
        if (Guard.isNothing.guard(unknown)) {
            type isNothing = TypeAssert<TypesAreEqual<null | undefined, typeof unknown>>
        } else {
            type ExtendsStringOrNumber = TypeAssert<typeof unknown extends string | number ? true : false>
        }
    }
}
