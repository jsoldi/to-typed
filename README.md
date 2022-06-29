# to-typed

Type-guards, casts and converts unknown values into typed values. 

## Introduction

This package provides 3 interrelated classes: `Cast`, `Guard` and `Convert`. 

### `Cast`

The base class of `Guard` and `Convert`. It is a wrap around a `cast` function that takes an unknown value and returns a `Maybe`:

```typescript
public constructor(public readonly cast: (value: unknown) => Maybe<T>) { }
```

If the cast succeeds, the function returns [`just`](https://github.com/jsoldi/to-typed/blob/09cb2e6adc5cf684dee56c0bd01e1e21d6b94780/src/lib/maybe.ts#L7) the casted value, otherwise it returns [`nothing`](https://github.com/jsoldi/to-typed/blob/09cb2e6adc5cf684dee56c0bd01e1e21d6b94780/src/lib/maybe.ts#L11). 

`Cast` is designed to make operations chainable in a functional/declarative way:

```typescript
Cast.asArrayOf(Cast.asString)
    .map(array => array.filter(str => str.length).join(', '))
    .if(str => str.length)
    .cast([10, 20, 30, 40])
```

Every cast factory method starts with the `as` prefix, such as `asNumber` or `asUnknown`.

### `Guard`

A wrap around a `guard` function that takes an `unknown` value and returns a boolean indicating whether the input value had the expected type. It implements the `cast` function by returning `just` the input value if it has the expected type, or `nothing` otherwise:

```typescript
public constructor(public readonly guard: (input: unknown) => input is T) { 
    super(val => guard(val) ? Maybe.just(val) : Maybe.nothing());
}
```

Every guard factory method starts with the `is` prefix, such as `isEnum` or `isBoolean`.

### `Convert`

A wrap around a `convert` function that takes an `unknown` value and returns a typed value. It implements the `cast` function by always returning `just` the converted value:

```typescript
public constructor(public readonly convert: (value: unknown) => T) {
    super(value => Maybe.just(convert(value)));
}
```

Every convert factory method starts with the `to` prefix, such as `toFinite` or `toString`.

## Remarks

Note that the choice of these 3 classes is not arbitrary. `Guard` and `Convert` are complementary subclasses of `Cast` in the sense that `Guard` ranges over booleans and `Convert` ranges over typed values, while `Cast` ranges over maybes, which are pairs of booleans and typed values. So they form a nice triad, and it seems unlikely that new classes will need to be added in future versions of the package, other than perhaps some utility ones only if there's some strong justification to do so.

## Demo
 
```typescript
import { Guard, Cast, Convert } from "to-typed"

// ---------------- Type guarding ----------------

// Produce a `Guard` based on a sample value, which may also include other 
// guards.
const guard = Guard.is({
    integer: 10,
    float: Number.EPSILON,
    boolean: false,
    tuple: [ 20, 'default', false ] as const,
    arrayOfNumbers: Guard.isArrayOf(Guard.isFinite),
    even: Guard.isInteger.if(n => n % 2 === 0),
    object: {
        union: Guard.some(
            Guard.isConst(null),
            Guard.isString, 
            Guard.isNumber
        ),
        intersection: Guard.every(
            Guard.is({ int: 0 }), 
            Guard.is({ str: "" })
        )
    }
})

const valid: unknown = {
    integer: 123,
    float: 3.14159,
    boolean: true,
    tuple: [10, 'hello', true, 'ignore me'],
    arrayOfNumbers: [ -1, 1, 2.5, Number.MAX_VALUE ],
    even: 16,
    object: {
        union: null,
        intersection: { int: 100, str: 'good bye' }
    }
}

if (guard.guard(valid)) {    
    // In this context, valid has type:
    // {
    //     integer: number;
    //     float: number;
    //     boolean: boolean;
    //     tuple: readonly [number, string, boolean];
    //     arrayOfNumbers: number[];
    //     even: number;
    //     object: {
    //         union: string | number | null;
    //         intersection: { int: number } & { str: string }
    //     }
    // }
    console.log('valid') // valid
}

// ---------------- Type casting / converting ----------------

// Produce a `Convert` based on a sample value, which also serves as a set 
// of defaults.
const converter = Convert.to({
    integer: 0,
    floatDefaultToEPSILON: Number.EPSILON,
    floatDefaultToZero: Convert.toFinite(0),
    string: '',
    boolean: false,
    trueIfTruthyInput: Convert.toTruthy(), 
    tuple: [ 0, '', false ] as const,
    arrayOfInts: Convert.toArrayOf(Convert.to(0)),
    percentage: Convert.toFinite(.5).map(x => Math.round(x * 100) + '%'),
    enum: Convert.toEnum('zero', 'one', 'two', 'three'),
    object: {
        originalAndConverted: Convert.all({ 
            original: Convert.id, 
            converted: Convert.to('') 
        }),
        strictNumberOrString: Guard.isNumber.or(Convert.to('')),
        relaxedNumberOrString: Cast.asNumber.or(Convert.to(''))
    }
})

console.log(converter.convert({ ignored: 'ignored' }))
// {
//     integer: 0,
//     floatDefaultToEPSILON: 2.220446049250313e-16,
//     floatDefaultToZero: 0,
//     string: '',
//     boolean: false,
//     trueIfTruthyInput: false,
//     tuple: [ 0, '', false ],
//     arrayOfInts: [],
//     percentage: '50%',
//     enum: 'zero',
//     object: {
//         originalAndConverted: { original: undefined, converted: '' },
//         strictNumberOrString: '',
//         relaxedNumberOrString: ''
//     }
// }

console.log(converter.convert({
    integer: 2.99,
    floatDefaultToEPSILON: '3.14',
    floatDefaultToZero: 'cannot parse this',
    string: 'hello',
    boolean: 'true',
    trueIfTruthyInput: [],
    tuple: [ '10', 3.14159, 1, 'ignored' ],
    arrayOfInts: [ '10', 20, '30', false, true ],
    percentage: [ '0.33333' ],
    enum: 'two',
    object: {
        originalAndConverted: 12345,
        strictNumberOrString: '-Infinity',
        relaxedNumberOrString: '-Infinity'
    }
}))
// {
//     integer: 3,
//     floatDefaultToEPSILON: 3.14,
//     floatDefaultToZero: 0,
//     string: 'hello',
//     boolean: true,
//     trueIfTruthyInput: true,
//     tuple: [ 10, '3.14159', true ],
//     arrayOfInts: [ 10, 20, 30, 0, 1 ],
//     percentage: '33%',
//     enum: 'two',
//     object: {
//         originalAndConverted: { original: 12345, converted: '12345' },
//         strictNumberOrString: '-Infinity',
//         relaxedNumberOrString: -Infinity
//     }
// }
```
