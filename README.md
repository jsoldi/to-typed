# cast-as

Type-guards, casts and converts unknowns into typed values. 


## Demo


```typescript
import { Guard, Convert } from "./internal.js";

const guard = Guard.is({
    integer: 10,
    float: Number.EPSILON,
    string: 'default',
    boolean: false,
    tuple: [ 10, 'default', false ] as const,
    arrayOfInts: Guard.isArrayOf(Guard.isInteger),
    object: {
        includeInfinityAndNaN: Guard.isNumber,
        excludeInfinityOrNaN: Guard.isFinite
    }
})

const valid: unknown = {
    integer: 2,
    float: 3.14,
    string: 'hello',
    boolean: true,
    tuple: [ 10, 'hello', true, 'unimportant' ],
    arrayOfInts: [ 10, 20, 30 ],
    object: {
        includeInfinityAndNaN: -Infinity,
        excludeInfinityOrNaN: 3.14
    }
}

if (guard.guard(valid)) {
    // In this context, `valid` has type:
    // const valid: {
    //     integer: number;
    //     float: number;
    //     string: string;
    //     boolean: boolean;
    //     tuple: readonly [number, string, boolean];
    //     arrayOfInts: number[];
    //     object: {
    //         includeInfinityAndNaN: number;
    //         excludeInfinityOrNaN: number;
    //     };
    // }        
    console.log('valid')
}
else
    console.log('invalid')

const converter = Convert.to({
    integer: 0,
    floatDefaultToEPSILON: Number.EPSILON,
    floatDefaultToZero: Convert.toFinite(0),
    string: '',
    boolean: false,
    ifTruthy: Convert.toTruthy(),
    tuple: [ 0, '', false ] as const,
    arrayOfInts: Convert.toArrayOf(Convert.to(0)),
    percentage: Convert.toFinite(.5).map(x => Math.round(x * 100) + '%'),
    object: {
        includeInfinityAndNaN: Convert.toNumber(),
        roundToInteger: Convert.toInteger()
    }
})

const defaults = converter.convert({ ignored: 'ignored' })

console.log(defaults)

const samples = converter.convert({
    integer: 2.99,
    floatDefaultToEPSILON: '3.14',
    floatDefaultToZero: 'cannot parse this',
    string: 'hello',
    boolean: 'true',
    ifTruthy: [],
    tuple: [ '10', 3.14159, 1, 'ignored' ],
    arrayOfInts: [ '10', 20, '30', false, true ],
    percentage: [ '0.251' ],
    object: {
        includeInfinityAndNaN: '-Infinity',
        roundToInteger: '3.14'
    }
})

console.log(samples)
```