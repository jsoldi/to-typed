"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../src/index.js");
function guardsAreOneSided(value) {
    if (typeof value === "string" || typeof value === "number") {
        if (index_js_1.Guard.isInteger.guard(value)) {
            if (index_js_1.Guard.isSafeInteger.guard(value)) {
            }
            else {
            }
        }
        else {
        }
        if (typeof value === "string" || index_js_1.Guard.isFinite.guard(value)) {
            if (index_js_1.Guard.isInteger.guard(value)) {
                if (index_js_1.Guard.isSafeInteger.guard(value)) {
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
    if (index_js_1.Guard.isUnknown.guard(unknown)) {
    }
    else {
    }
    if (index_js_1.Guard.isUnknown.guard(never)) {
    }
    else {
    }
    if (typeof unknown === 'string' || index_js_1.Guard.isInteger.guard(unknown)) {
        const outer = unknown;
        if (index_js_1.Guard.isUnknown.guard(unknown)) {
        }
        else {
        }
    }
}
function neverGuardWorks(unknown, never) {
    if (index_js_1.Guard.isNever.guard(unknown)) {
    }
    else {
    }
    if (index_js_1.Guard.isNever.guard(never)) {
    }
    else {
    }
    if (typeof unknown === 'string' || index_js_1.Guard.isInteger.guard(unknown)) {
        const outer = unknown;
        if (index_js_1.Guard.isNever.guard(unknown)) {
        }
        else {
        }
    }
}
function nothingGuardsWork(unknown) {
    if (index_js_1.Guard.isConst(null).guard(unknown)) {
    }
    else {
    }
    if (index_js_1.Guard.isConst(undefined).guard(unknown)) {
    }
    else {
    }
    if (index_js_1.Guard.isNothing.guard(unknown)) {
    }
    else {
    }
    if (typeof unknown === "string" || index_js_1.Guard.isInteger.guard(unknown) || unknown === null || unknown === undefined) {
        if (index_js_1.Guard.isConst(null).guard(unknown)) {
            if (index_js_1.Guard.isConst(undefined).guard(unknown)) {
            }
            else {
            }
        }
        else {
        }
        if (index_js_1.Guard.isConst(undefined).guard(unknown)) {
        }
        else {
        }
        if (index_js_1.Guard.isNothing.guard(unknown)) {
        }
        else {
        }
    }
}
