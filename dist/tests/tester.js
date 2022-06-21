export function test(name, action) {
    try {
        action();
        console.log(`✅ ${name}: passed`);
    }
    catch (e) {
        console.error(`❌ ${name}: ${e}`);
    }
}
//# sourceMappingURL=tester.js.map