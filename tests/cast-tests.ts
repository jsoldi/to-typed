import { Cast, Maybe } from "../src/index.js";
import { testEq } from "./tester.js";

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

testEq('Cast can set error', Cast.asNumber.or(Cast.nothing(new Error('FAILED'))).cast({}),  Maybe.nothing(new Error('FAILED')));

testEq('Cast.parse works', Cast.asArrayOf(Cast.asNumber).parse('[10, "20", 30]'), Maybe.just([10, 20, 30]));
testEq('Cast.parse fails', Cast.asUnknown.parse('Invalid JSON').hasValue, false);

testCastYes('Cast.merge works', new Cast(_ => Maybe.just({ a: 1 })).merge(new Cast(_ => Maybe.just({ b: 2 }))), {}, { a: 1, b: 2 });
