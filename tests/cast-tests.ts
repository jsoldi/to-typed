import { Cast } from "../dist/esm/index.js";
import { testEq, testError, TypeAssert, TypesAreEqual } from "./tester.js";

const customBooleans = {
    booleanNames: {
        true: ["yup"],
        false: ["nope"]
    }
}

function testCastYes<T>(name: string, cast: Cast<T>, value: unknown, expectedValue: T) {
    const result = cast.cast(value);
    testEq(name, { hasValue: result.hasValue, value: result.else(() => null) }, { hasValue: true, value: expectedValue });
}

function testCastNo<T>(name: string, cast: Cast<T>, value: unknown) {
    const result = cast.cast(value);
    testEq(name, result.hasValue, false);
}

testCastYes('Cast uses default settings', Cast.asArrayWhere(Cast.asBoolean), ['true', 'false', 'nope', 'yup'], [true, false]);
testCastYes('Cast.asArrayWhere propagates settings', Cast.asArrayWhere(Cast.asBoolean).config(customBooleans), ['true', 'false', 'nope', 'yup'], [false, true]);

testCastYes('Cast deep propagates settings', Cast.as({
    a: [Cast.asBoolean],
    b: {
        c: [Cast.asBoolean],
        d: Cast.asArrayWhere(Cast.as({
            e: Cast.asBoolean,
            f: Cast.asArrayWhere(Cast.asBoolean)
        }))
    }
}).config(customBooleans), {
    a: ['yup'],
    b: {
        c: ['nope'],
        d: [{
            e: 'true',
            f: []
        }, {
            e: 'nope',
            f: []
        }, {
            e: 'yup',
            f: ['true', 'false', 'nope', 'yup']
        }]
    }
}, {
    a: [true],
    b: {
        c: [false],
        d: [{
            e: false,
            f: []
        }, {
            e: true,
            f: [false, true]
        }]
    }
});
