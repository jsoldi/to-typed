"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../src/index.js");
const tester_js_1 = require("./tester.js");
const customBooleans = {
    booleanNames: {
        true: ["yup"],
        false: ["nope"]
    }
};
function testCastYes(name, cast, value, expectedValue) {
    const result = cast.cast(value);
    (0, tester_js_1.testEq)(name, { hasValue: result.hasValue, value: result.else(() => null) }, { hasValue: true, value: expectedValue });
}
function testCastNo(name, cast, value) {
    const result = cast.cast(value);
    (0, tester_js_1.testEq)(name, result.hasValue, false);
}
testCastYes('Cast uses default settings', index_js_1.Cast.asArrayWhere(index_js_1.Cast.asBoolean), ['true', 'false', 'nope', 'yup'], [true, false]);
testCastYes('Cast.asArrayWhere propagates settings', index_js_1.Cast.asArrayWhere(index_js_1.Cast.asBoolean).config(customBooleans), ['true', 'false', 'nope', 'yup'], [false, true]);
testCastYes('Cast deep propagates settings', index_js_1.Cast.as({
    a: [index_js_1.Cast.asBoolean],
    b: {
        c: [index_js_1.Cast.asBoolean],
        d: index_js_1.Cast.asArrayWhere(index_js_1.Cast.as({
            e: index_js_1.Cast.asBoolean,
            f: index_js_1.Cast.asArrayWhere(index_js_1.Cast.asBoolean)
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
(0, tester_js_1.testEq)('Cast can set error', index_js_1.Cast.asNumber.or(index_js_1.Cast.nothing(new Error('FAILED'))).cast({}), index_js_1.Maybe.nothing(new Error('FAILED')));
(0, tester_js_1.testEq)('Cast.parse works', index_js_1.Cast.asArrayOf(index_js_1.Cast.asNumber).parse('[10, "20", 30]'), index_js_1.Maybe.just([10, 20, 30]));
(0, tester_js_1.testEq)('Cast.parse fails', index_js_1.Cast.asUnknown.parse('Invalid JSON').hasValue, false);
testCastYes('Cast.merge works', new index_js_1.Cast(_ => index_js_1.Maybe.just({ a: 1 })).merge(new index_js_1.Cast(_ => index_js_1.Maybe.just({ b: 2 }))), {}, { a: 1, b: 2 });
