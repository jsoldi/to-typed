export { Maybe, Cast, Guard, Convert } from "./internal.js";

// import { Cast, Convert, Guard, Maybe, Utils } from "./internal.js";

// function tela<T>(value: T) {
//     return Cast.just(value).asString.bind(str1 => Cast.asString.if(str2 => {
//         console.log(`str1: ${str1}, str2: ${str2}`);
//         return str1 === str2;
//     })).map(_ => value);
// }

// function testea(value: unknown) {
//     const test = Convert.toArray().map(ar => ar[0]);

//     const may = test.cast(value);

//     if (may.hasValue) {
//         console.log('has value');
//         return may.elseThrow();
//     }
//     else {
//         console.log('has no value');
//         return 'NOPOPO';
//     }
// }

// function test() {
//     const palas = testea(123);
//     debugger;
// }

// test();
