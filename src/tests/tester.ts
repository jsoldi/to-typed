export function test(name: string, action: () => void) {
    try {
        action();
        console.log(`✅ ${name}: passed`);
    }
    catch (e: any) {
        console.error(`❌ ${name}: ${e}`);
    }
}
