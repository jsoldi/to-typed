import { Convert } from "../lib/index.js";
import assert from "assert";
function test(name, action) {
    try {
        action();
        console.log(`✅ ${name} passed`);
    }
    catch (e) {
        console.error(`❌ ${name} failed: ${e}`);
    }
}
test('Convert.toEnum gets the right item', () => assert.equal(Convert.toEnum(['a', 'b', 'c']).convert('b'), 'b'));
test('Convert.toEnum uses first item by default', () => assert.equal(Convert.toEnum(['a', 'b', 'c']).convert(null), 'a'));
test('Convert.toEnum compares strings 1', () => assert.equal(Convert.toEnum([null, 'true', 'false']).convert(true), 'true'));
test('Convert.toEnum compares strings 2', () => assert.equal(Convert.toEnum([null, 'true', 'false']).convert(false), 'false'));
test('Convert.toString uses first item in array', () => assert.equal(Convert.toString().convert(['true', 'false']), 'true'));
test('Convert.toString fails for empty array', () => assert.equal(Convert.toString('DEF').convert([]), 'DEF'));
test('Convert.toString fails for object', () => assert.equal(Convert.toString('DEF').convert({}), 'DEF'));
test('Convert.toString fails for null', () => assert.equal(Convert.toString('DEF').convert(null), 'DEF'));
test('Convert.toString fails for undefined', () => assert.equal(Convert.toString('DEF').convert(undefined), 'DEF'));
//# sourceMappingURL=test.js.map