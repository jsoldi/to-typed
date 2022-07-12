import { Guard } from "../src/index.js";
import { testEq } from "./tester.js";

testEq('Guard.every returns true for empty array', Guard.every().guard(null), true)
testEq('Guard.every returns true for single good', Guard.every(Guard.isString).guard('hey'), true)
testEq('Guard.every returns false for single bad', Guard.every(Guard.isString).guard(12.3), false)
testEq('Guard.every returns true for two good', Guard.every(Guard.isString, Guard.isSomething).guard('hey'), true)
testEq('Guard.every returns false for two bad', Guard.every(Guard.isNumber, Guard.isNothing).guard('hey'), false)
testEq('Guard.every returns false for one bad (1)', Guard.every(Guard.isNothing, Guard.isString).guard('hey'), false)
testEq('Guard.every returns false for one bad (2)', Guard.every(Guard.isString, Guard.isNothing).guard('hey'), false)

testEq('Guard.some returns false for empty array', Guard.some().guard(null), false)
testEq('Guard.some returns true for single good', Guard.some(Guard.isString).guard('hey'), true)
testEq('Guard.some returns false for single bad', Guard.some(Guard.isString).guard(12.3), false)
testEq('Guard.some returns true for two good', Guard.some(Guard.isString, Guard.isSomething).guard('hey'), true)
testEq('Guard.some returns false for two bad', Guard.some(Guard.isNumber, Guard.isNothing).guard('hey'), false)
testEq('Guard.some returns true for one good (1)', Guard.some(Guard.isString, Guard.isNothing).guard('hey'), true)
testEq('Guard.some returns true for one good (2)', Guard.some(Guard.isNothing, Guard.isString).guard('hey'), true)

testEq('Guard.isCollectionOf returns false for null', Guard.isCollectionOf(Guard.isUnknown).guard(null), false)
testEq('Guard.isCollectionOf returns false for undefined', Guard.isCollectionOf(Guard.isUnknown).guard(undefined), false)
testEq('Guard.isCollectionOf returns false for primitive', Guard.isCollectionOf(Guard.isUnknown).guard(123), false)
testEq('Guard.isCollectionOf returns true for empty object', Guard.isCollectionOf(Guard.isNever).guard({}), true)
testEq('Guard.isCollectionOf returns true for empty array', Guard.isCollectionOf(Guard.isNever).guard([]), true)

testEq('Guard.isCollectionOf returns true single good array', Guard.isCollectionOf(Guard.isString).guard([ 'hey' ]), true)
testEq('Guard.isCollectionOf returns false for single bad array', Guard.isCollectionOf(Guard.isString).guard([ 123 ]), false)
testEq('Guard.isCollectionOf returns true for two good array', Guard.isCollectionOf(Guard.isString).guard([ 'hey', 'some' ]), true)
testEq('Guard.isCollectionOf returns false for two bad array', Guard.isCollectionOf(Guard.isString).guard([ 123, 456 ]), false)
testEq('Guard.isCollectionOf returns false for one bad (1) array', Guard.isCollectionOf(Guard.isString).guard([ 32, 'hey' ]), false)
testEq('Guard.isCollectionOf returns false for one bad (2) array', Guard.isCollectionOf(Guard.isString).guard([ 'hey', 32 ]), false)

testEq('Guard.isCollectionOf returns true for single good object', Guard.isCollectionOf(Guard.isString).guard({ hey: 'some' }), true)
testEq('Guard.isCollectionOf returns false for single bad object', Guard.isCollectionOf(Guard.isString).guard({ hey: 123 }), false)
testEq('Guard.isCollectionOf returns true for two good object', Guard.isCollectionOf(Guard.isString).guard({ hey: 'some', some: 'hey' }), true)
testEq('Guard.isCollectionOf returns false for two bad object', Guard.isCollectionOf(Guard.isString).guard({ hey: 123, some: 456 }), false)
testEq('Guard.isCollectionOf returns false for one bad (1) object', Guard.isCollectionOf(Guard.isString).guard({ hey: 32, some: 'hey' }), false)
testEq('Guard.isCollectionOf returns false for one bad (2) object', Guard.isCollectionOf(Guard.isString).guard({ hey: 'hey', some: 32 }), false)

testEq('Guard.isArrayOf returns false for null', Guard.isArrayOf(Guard.isUnknown).guard(null), false)
testEq('Guard.isArrayOf returns false for undefined', Guard.isArrayOf(Guard.isUnknown).guard(undefined), false)
testEq('Guard.isArrayOf returns false for primitive', Guard.isArrayOf(Guard.isUnknown).guard(123), false)
testEq('Guard.isArrayOf returns false for object', Guard.isArrayOf(Guard.isNever).guard({}), false)
testEq('Guard.isArrayOf returns true for array', Guard.isArrayOf(Guard.isNever).guard([]), true)

testEq('Guard.isArrayOf returns true single good array', Guard.isArrayOf(Guard.isString).guard([ 'hey' ]), true)
testEq('Guard.isArrayOf returns false for single bad array', Guard.isArrayOf(Guard.isString).guard([ 123 ]), false)
testEq('Guard.isArrayOf returns true for two good array', Guard.isArrayOf(Guard.isString).guard([ 'hey', 'some' ]), true)
testEq('Guard.isArrayOf returns false for two bad array', Guard.isArrayOf(Guard.isString).guard([ 123, 456 ]), false)
testEq('Guard.isArrayOf returns false for one bad (1) array', Guard.isArrayOf(Guard.isString).guard([ 32, 'hey' ]), false)
testEq('Guard.isArrayOf returns false for one bad (2) array', Guard.isArrayOf(Guard.isString).guard([ 'hey', 32 ]), false)

testEq('Guard.isStructOf returns false for null', Guard.isStructOf(Guard.isUnknown).guard(null), false)
testEq('Guard.isStructOf returns false for undefined', Guard.isStructOf(Guard.isUnknown).guard(undefined), false)
testEq('Guard.isStructOf returns false for primitive', Guard.isStructOf(Guard.isUnknown).guard(123), false)
testEq('Guard.isStructOf returns true for object', Guard.isStructOf(Guard.isNever).guard({}), true)
testEq('Guard.isStructOf returns false for array', Guard.isStructOf(Guard.isNever).guard([]), false)

testEq('Guard.isStructOf returns true single good object', Guard.isStructOf(Guard.isString).guard({ hey: 'some' }), true)
testEq('Guard.isStructOf returns false for single bad object', Guard.isStructOf(Guard.isString).guard({ hey: 123 }), false)
testEq('Guard.isStructOf returns true for two good object', Guard.isStructOf(Guard.isString).guard({ hey: 'some', some: 'hey' }), true)
testEq('Guard.isStructOf returns false for two bad object', Guard.isStructOf(Guard.isString).guard({ hey: 123, some: 456 }), false)
testEq('Guard.isStructOf returns false for one bad (1) object', Guard.isStructOf(Guard.isString).guard({ hey: 32, some: 'hey' }), false)
testEq('Guard.isStructOf returns false for one bad (2) object', Guard.isStructOf(Guard.isString).guard({ hey: 'hey', some: 32 }), false)

const strict = { keyGuarding: 'strict' } as const
const loose = { keyGuarding: 'loose' } as const

testEq('Guard.isCollectionLike strict works for tuple', Guard.is([ Guard.isString, Guard.isNumber ]).config(strict).guard([ 'hey', 23 ]), true)
testEq('Guard.isCollectionLike strict fails for smaller tuple', Guard.is([ Guard.isString, Guard.isNumber ]).config(strict).guard([ 'hey' ]), false)
testEq('Guard.isCollectionLike strict fails for larger tuple', Guard.is([ Guard.isString, Guard.isNumber ]).config(strict).guard([ 'hey', 23, true ]), false)
testEq('Guard.isCollectionLike loose works for tuple', Guard.is([ Guard.isString, Guard.isNumber ]).config(loose).guard([ 'hey', 23 ]), true)
testEq('Guard.isCollectionLike loose fails for smaller tuple', Guard.is([ Guard.isString, Guard.isNumber ]).config(loose).guard([ 'hey' ]), false)
testEq('Guard.isCollectionLike loose works for larger tuple', Guard.is([ Guard.isString, Guard.isNumber ]).config(loose).guard([ 'hey', 23, true ]), true)

testEq('Guard.isCollectionLike strict works for object', Guard.is({ a: Guard.isString, b: Guard.isNumber }).config(strict).guard({ a: 'hey', b: 9 }), true)
testEq('Guard.isCollectionLike strict fails for smaller object', Guard.is({ a: Guard.isString, b: Guard.isNumber }).config(strict).guard({ a: 'hey' }), false)
testEq('Guard.isCollectionLike strict fails for larger object', Guard.is({ a: Guard.isString, b: Guard.isNumber }).config(strict).guard({ a: 'hey', b: 9, c: true }), false)
testEq('Guard.isCollectionLike loose works for object', Guard.is({ a: Guard.isString, b: Guard.isNumber }).config(loose).guard({ a: 'hey', b: 9 }), true)
testEq('Guard.isCollectionLike loose fails for smaller object', Guard.is({ a: Guard.isString, b: Guard.isNumber }).config(loose).guard({ a: 'hey' }), false)
testEq('Guard.isCollectionLike loose works for larger object', Guard.is({ a: Guard.isString, b: Guard.isNumber }).config(loose).guard({ a: 'hey', b: 9, c: true }), true)

testEq('Guard.isArrayOf uses default settings', Guard.isArrayOf(Guard.is([ Guard.isNumber ])).guard([ [10], [20], [30, 40] ]), true)
testEq('Guard.isArrayOf propagates settings', Guard.isArrayOf(Guard.is([ Guard.isNumber ])).config(strict).guard([ [10], [20], [30, 40] ]), false)
