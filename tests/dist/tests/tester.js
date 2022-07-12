import assert from "assert";
const testInfo = {
    started: false,
    passed: 0,
    failed: 0,
    tests: new Set()
};
export function test(name, action) {
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
export function testEq(name, actual, expected) {
    test(name, () => assert.deepStrictEqual(actual, expected));
}
export function testError(name, expectedError, action) {
    test(name, () => {
        try {
            action();
            throw new Error(`Expected error, but no error was thrown`);
        }
        catch (e) {
            assert.equal(e.message, expectedError);
        }
    });
}
