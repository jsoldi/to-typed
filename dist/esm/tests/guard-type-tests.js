import { Guard } from "../lib/index.js";
function guardsAreOneSided(value) {
    if (typeof value === "string" || typeof value === "number") {
        if (Guard.isInteger.guard(value)) {
            if (Guard.isSafeInteger.guard(value)) {
            }
            else {
            }
        }
        else {
        }
        if (typeof value === "string" || Guard.isFinite.guard(value)) {
            if (Guard.isInteger.guard(value)) {
                if (Guard.isSafeInteger.guard(value)) {
                }
                else {
                }
            }
            else {
            }
        }
        else {
        }
    }
    else {
    }
}
function unknownGuardWorks(unknown, never) {
    if (Guard.isUnknown.guard(unknown)) {
    }
    else {
    }
    if (Guard.isUnknown.guard(never)) {
    }
    else {
    }
    if (typeof unknown === 'string' || Guard.isInteger.guard(unknown)) {
        const outer = unknown;
        if (Guard.isUnknown.guard(unknown)) {
        }
        else {
        }
    }
}
function neverGuardWorks(unknown, never) {
    if (Guard.isNever.guard(unknown)) {
    }
    else {
    }
    if (Guard.isNever.guard(never)) {
    }
    else {
    }
    if (typeof unknown === 'string' || Guard.isInteger.guard(unknown)) {
        const outer = unknown;
        if (Guard.isNever.guard(unknown)) {
        }
        else {
        }
    }
}
function nothingGuardsWork(unknown) {
    if (Guard.isConst(null).guard(unknown)) {
    }
    else {
    }
    if (Guard.isConst(undefined).guard(unknown)) {
    }
    else {
    }
    if (Guard.isNothing.guard(unknown)) {
    }
    else {
    }
    if (typeof unknown === "string" || Guard.isInteger.guard(unknown) || unknown === null || unknown === undefined) {
        if (Guard.isConst(null).guard(unknown)) {
            if (Guard.isConst(undefined).guard(unknown)) {
            }
            else {
            }
        }
        else {
        }
        if (Guard.isConst(undefined).guard(unknown)) {
        }
        else {
        }
        if (Guard.isNothing.guard(unknown)) {
        }
        else {
        }
    }
}
//# sourceMappingURL=guard-type-tests.js.map