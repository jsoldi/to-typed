"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../src/index.js");
// ---------------- Type guarding ----------------
// Create a `Guard` based on an object, which may include other guards
const guard = index_js_1.Guard.is({
    integer: index_js_1.Guard.isInteger,
    number: 0,
    boolean: false,
    tuple: [20, 'default', false],
    arrayOfNumbers: index_js_1.Guard.isArrayOf(index_js_1.Guard.isFinite),
    even: index_js_1.Guard.isInteger.if(n => n % 2 === 0),
    object: {
        union: index_js_1.Guard.some(index_js_1.Guard.isConst(null), index_js_1.Guard.isString, index_js_1.Guard.isNumber),
        intersection: index_js_1.Guard.every(index_js_1.Guard.is({ int: 0 }), index_js_1.Guard.is({ str: "" }))
    }
});
const valid = {
    integer: 123,
    number: 3.14159,
    boolean: true,
    tuple: [10, 'hello', true],
    arrayOfNumbers: [-1, 1, 2.5, Number.MAX_VALUE],
    even: 16,
    object: {
        union: null,
        intersection: { int: 100, str: 'good bye' }
    }
};
if (guard.guard(valid)) {
    // `valid` is now fully typed
    console.log(valid.object.intersection.int); // 100
}
// Alternatively, the base class' `cast` method can be used. Since this is
// just a `Guard`, no casting or cloning will actually occur.
const maybe = guard.cast(valid);
if (maybe.hasValue) {
    // In this context, `maybe.value` is available and fully typed, and it
    // points to the same instance as `valid`.
    console.log(maybe.value.object.intersection.int); // 100
}
// Or equivalently...
maybe.read(value => console.log(value.object.intersection.int)); // 100
// ---------------- Type casting / converting ----------------
// Create a `Convert` based on a sample value, from which the default
// values will also be taken if any cast fails.
const converter = index_js_1.Convert.to({
    integer: index_js_1.Convert.toInteger(1),
    number: 0,
    string: '',
    boolean: false,
    trueIfTruthyInput: index_js_1.Convert.toTruthy(),
    tuple: [0, 'default', false],
    arrayOfInts: index_js_1.Convert.toArrayOf(index_js_1.Convert.to(0)),
    percentage: index_js_1.Convert.toFinite(.5).map(x => Math.round(x * 100) + '%'),
    enum: index_js_1.Convert.toEnum('zero', 'one', 'two', 'three'),
    object: {
        originalAndConverted: index_js_1.Convert.all({
            original: index_js_1.Convert.id,
            converted: index_js_1.Convert.to('')
        }),
        strictNumberOrString: index_js_1.Guard.isNumber.or(index_js_1.Convert.to('')),
        relaxedNumberOrString: index_js_1.Cast.asNumber.or(index_js_1.Convert.to(''))
    }
});
console.log(converter.convert({ excluded: 'exclude-me' }));
// {
//     integer: 1,
//     number: 0,
//     string: '',
//     boolean: false,
//     trueIfTruthyInput: false,
//     tuple: [ 0, 'default', false ],
//     arrayOfInts: [],
//     percentage: '50%',
//     enum: 'zero',
//     object: {
//         originalAndConverted: { original: undefined, converted: '' },
//         strictNumberOrString: '',
//         relaxedNumberOrString: ''
//     }
// }
console.log(converter.convert({
    integer: 2.99,
    number: '3.14',
    string: 'hello',
    boolean: 'true',
    trueIfTruthyInput: [],
    tuple: ['10', 3.14159, 1, 'exclude-me'],
    arrayOfInts: ['10', 20, '30', false, true],
    percentage: ['0.33333'],
    enum: 'two',
    object: {
        originalAndConverted: 12345,
        strictNumberOrString: '-Infinity',
        relaxedNumberOrString: '-Infinity'
    }
}));
// {
//     integer: 3,
//     number: 3.14,
//     string: 'hello',
//     boolean: true,
//     trueIfTruthyInput: true,
//     tuple: [ 10, '3.14159', true ],
//     arrayOfInts: [ 10, 20, 30, 0, 1 ],
//     percentage: '33%',
//     enum: 'two',
//     object: {
//         originalAndConverted: { original: 12345, converted: '12345' },
//         strictNumberOrString: '-Infinity',
//         relaxedNumberOrString: -Infinity
//     }
// }
const lol = index_js_1.Convert.to({
    uno: 1,
    dos: 'rata'
});
const dales = lol.entries();
console.log(dales.dos.convert(null));
console.log(dales.dos.convert('pedo'));
console.log(dales.dos.convert(12.32));
