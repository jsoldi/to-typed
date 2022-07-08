"use strict";
/*
    There are 8 values that typeof can return: string, number, bigint, boolean, symbol, undefined, object, and function.
    Values that are typeof object can be further split into null and non-null object.
    
    I'm partitioning these 9 sets into 3 groups:

    - PrimitiveValue: string, number, bigint, boolean, symbol.
        - TS Type: PrimitiveValues
        - Guard: isPrimitiveValue
    - Nothing: undefined and null
        - TS Type: Nothing
        - Guard: isNothing
    - object: non-null object and function
        - TS Type: object
        - Guard: isObject

    So far, the TypeScript object type seems to exactly match values that are typeof function or non-null object.
*/
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map