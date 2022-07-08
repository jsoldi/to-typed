# to-typed

Type-guards, casts and converts unknown values into typed values. 

## Installation

```
npm install to-typed
```

## Introduction

This package provides 3 interrelated classes: `Cast`, `Guard` and `Convert`. 

### Cast

The base class of `Guard` and `Convert`. It is a wrap around a `cast` function that takes an unknown value and returns a `Maybe`:

```typescript
cast: (value: unknown) => Maybe<T>
```

If the cast succeeds, the function returns [`just`](https://github.com/jsoldi/to-typed/blob/3304df454a9721f6b3b65b90c1ff4a0953537d36/src/lib/maybe.ts#L4) the casted value, otherwise it returns [`nothing`](https://github.com/jsoldi/to-typed/blob/3304df454a9721f6b3b65b90c1ff4a0953537d36/src/lib/maybe.ts#L9). 

`Cast` and its derived classes are designed to make operations chainable in a functional/declarative way:

```typescript
console.log(Convert
    .toArrayWhere(Cast
        .asString
        .if(str => str.length)
    )
    .map(arr => arr.join(' '))
    .convert([1, null, 'hello', '', 'world', {}, true])
) // "1 hello world true"
```

Cast factory methods start with the `as` prefix, such as `asNumber` or `asUnknown`.

### Guard

A wrap around a `guard` function that takes an `unknown` value and returns a boolean indicating whether the input value has the expected type:

```typescript
guard: (input: unknown) => input is T
```

It implements the `cast` method by returning `just` the input value if it has the expected type, or `nothing` otherwise:

```typescript
value => guard(value) ? Maybe.just(value) : Maybe.nothing()
```

Guard factory methods start with the `is` prefix, such as `isEnum` or `isBoolean`.

### Convert

A wrap around a `convert` function that takes an `unknown` value and returns a typed value:

```typescript
convert: (value: unknown) => T
```

It implements the `cast` method by always returning `just` the converted value:

```typescript
value => Maybe.just(convert(value))
```

Convert factory methods start with the `to` prefix, such as `toFinite` or `toString`.

## Remarks

Note that `Guard` and `Convert` are complementary subclasses of `Cast` in the sense that `Guard` never provides an alternative to the input value, while `Convert` always provides one. The base class `Cast` lies in the middle by including both possibilities.

A `Guard` can produce a `Cast` by calling some value mapping method:

```typescript
const guard = Guard.is({ value: Guard.isUnknown }); // Guard<{ value: unknown }>
const cast = guard.map(obj => obj.value).asInteger; // Cast<number>
```

And a `Cast` can produce a `Convert` by providing a default value:

```typescript
const convert = cast.if(x => x > 0).else(1); // Convert<number>
console.log(convert.convert({ value: '33.3'})); // 33
```

## Quick Start
 
```typescript
import { Guard, Cast, Convert } from "to-typed"

// ---------------- Type guarding ----------------

// Create a `Guard` based on an object, which may include other guards
const guard = Guard.is({
    integer: Guard.isInteger,
    number: 0,
    boolean: false,
    tuple: [20, 'default', false] as const,
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
    number: 3.14159,
    boolean: true,
    tuple: [10, 'hello', true],
    arrayOfNumbers: [-1, 1, 2.5, Number.MAX_VALUE],
    even: 16,
    object: {
        union: null,
        intersection: { int: 100, str: 'good bye' }
    }
}

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
const converter = Convert.to({
    integer: Convert.toInteger(1),
    number: 0,
    string: '',
    boolean: false,
    trueIfTruthyInput: Convert.toTruthy(),
    tuple: [0, 'default', false] as const,
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

console.log(converter.convert({ excluded: 'exclude-me' }))
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
}))
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
```
