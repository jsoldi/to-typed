export declare function test(name: string, action: () => void): void;
export declare function testEq<T>(name: string, actual: T, expected: T): void;
export declare type TypesAreEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
export declare const typeEq: <X, Y>(x: X, y: Y) => TypesAreEqual<X, Y>;
export declare const typeAssert: (value: true) => void;
export declare const typeGen: <T>() => T;
export declare type TypeAssert<T extends true> = T;
//# sourceMappingURL=tester.d.ts.map