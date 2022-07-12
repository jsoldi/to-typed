"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testError = exports.testEq = exports.test = void 0;
const assert_1 = __importDefault(require("assert"));
const testInfo = {
    started: false,
    passed: 0,
    failed: 0,
    tests: new Set()
};
function test(name, action) {
    if (!testInfo.started) {
        testInfo.started = true;
        setTimeout(() => console.log(`${testInfo.failed ? '❌' : '✅'} ${testInfo.passed} passed, ${testInfo.failed} failed`), 1);
    }
    if (!testInfo.tests.has(name))
        testInfo.tests.add(name);
    else
        throw new Error(`Test "${name}" already exists`);
    try {
        action();
        testInfo.passed++;
        console.log(`✅ ${name}: passed`);
    }
    catch (e) {
        testInfo.failed++;
        console.error(`❌ ${name}: ${e}`);
    }
}
exports.test = test;
function testEq(name, actual, expected) {
    test(name, () => assert_1.default.deepStrictEqual(actual, expected));
}
exports.testEq = testEq;
function testError(name, expectedError, action) {
    test(name, () => {
        try {
            action();
            throw new Error(`Expected error, but no error was thrown`);
        }
        catch (e) {
            assert_1.default.equal(e.message, expectedError);
        }
    });
}
exports.testError = testError;
