export { Maybe, Cast, Guard, Convert } from "./internal.js";
import { Cast, Guard, Convert } from "./internal.js";
function samples() {
    const unknowns = {
        string: 'Hello world',
        number: 123,
        boolean: true,
        arrayOfNumbers: [4, 5, 6],
        tuple: ['One', true, 7],
        object: {
            number: 8,
            string: 'Hello'
        }
    };
    const guarded = {
        string: Guard.isString.guard(unknowns.string) ? unknowns.string : '',
        number: Guard.isNumber.guard(unknowns.number) ? unknowns.number : 0,
        finite: Guard.isFinite.guard(unknowns.number) ? unknowns.number : 0,
        integer: Guard.isInteger.guard(unknowns.number) ? unknowns.number : 0,
        boolean: Guard.isBoolean.guard(unknowns.boolean) ? unknowns.boolean : false,
        array: Guard.isArray.guard(unknowns.tuple) ? unknowns.tuple : [],
        arrayOfNumbers: Guard.isArrayOf(Guard.isNumber).guard(unknowns.arrayOfNumbers) ? unknowns.arrayOfNumbers : [],
        tuple: Guard.isCollectionOf([
            Guard.isString,
            Guard.isBoolean,
            Guard.isNumber
        ]).guard(unknowns.tuple) ? unknowns.tuple : ['', false, 0],
        object1: Guard.isCollectionOf({
            number: Guard.isNumber,
            string: Guard.isString
        }).guard(unknowns.object) ? unknowns.object : { number: 0, string: '' },
        object2: Guard.is({
            number: 0,
            string: ''
        }).guard(unknowns.object) ? unknowns.object : { number: 0, string: '' }
    };
    const template = {
        one: Convert.toInteger(),
        two: Convert.toInteger(),
        pi: Convert.toFinite(),
        infinity: Convert.toNumber()
    };
    const converter = Convert.to(template);
    const result = converter.convert({
        one: 1.001,
        two: '1.999',
        pi: '3.14159',
        infinity: 'Infinity'
    });
    const asNumber = Cast.asNumber;
    const asFinite = Cast.asFinite;
    const asInteger = Cast.asInteger;
    const asBigint = Cast.asBigint;
    console.log(asNumber);
    console.log(asFinite);
    console.log(asInteger);
    console.log(asBigint);
    debugger;
}
samples();
//# sourceMappingURL=index.js.map