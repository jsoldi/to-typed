import { Cast, Convert, Maybe } from "../src/index.js";
import { testEq, testError, TypeAssert, TypesAreEqual } from "./tester.js";

declare const BigInt: (input: any) => bigint;

function testConvert<T>(name: string, convert: Convert<T>, value: unknown, expectedValue: T) {
    testEq(name, convert.convert(value), expectedValue);
}

testConvert('Convert.toEnum gets the right item', Convert.toEnum('a', 'b', 'c'), 'b', 'b')
testConvert('Convert.toEnum uses first item by default', Convert.toEnum('a', 'b', 'c'), null, 'a')
testConvert('Convert.toEnum compares strings (1)', Convert.toEnum(null, 'true', 'false'), true, 'true')
testConvert('Convert.toEnum compares strings (2)', Convert.toEnum(null, 'true', 'false'), false, 'false')
testConvert('Convert.toString uses only item in array', Convert.toString(), [10], '10')
testConvert('Convert.toString fails for multiple items array', Convert.toString('DEF'), [true, false], 'DEF')
testConvert('Convert.toString defaults for empty array', Convert.toString('DEF'), [], 'DEF')
testConvert('Convert.toString defaults for object', Convert.toString('DEF'), {}, 'DEF')
testConvert('Convert.toString defaults for null', Convert.toString('DEF'), null, 'DEF')
testConvert('Convert.toString defaults for undefined', Convert.toString('DEF'), undefined, 'DEF')

testConvert('Convert.toNumber uses only item in array', Convert.toNumber(-1), ['10'], 10)
testConvert('Convert.toNumber defaults for multiple items array', Convert.toNumber(-1), [true, false], -1)
testConvert('Convert.toNumber defaults for empty array', Convert.toNumber(-1), [], -1)
testConvert('Convert.toNumber defaults for null', Convert.toNumber(-1), null, -1)
testConvert('Convert.toNumber converts from true', Convert.toNumber(-1), true, 1)
testConvert('Convert.toNumber converts from false', Convert.toNumber(-1), false, 0)
testConvert('Convert.toNumber converts from string', Convert.toNumber(-1), '123.45', 123.45)
testConvert('Convert.toNumber converts from string with spaces', Convert.toNumber(-1), ' 123.45 ', 123.45)
testConvert('Convert.toNumber converts infinity from string', Convert.toNumber(-1), 'Infinity', Infinity)
testConvert('Convert.toNumber converts -infinity from string', Convert.toNumber(-1), '-Infinity', -Infinity)
testConvert('Convert.toNumber converts NaN from string', Convert.toNumber(-1), 'NaN', NaN)
testConvert('Convert.toNumber converts infinity', Convert.toNumber(-1), Infinity, Infinity)
testConvert('Convert.toNumber converts -infinity', Convert.toNumber(-1), -Infinity, -Infinity)
testConvert('Convert.toNumber converts NaN', Convert.toNumber(-1), NaN, NaN)
testConvert('Convert.toNumber defaults for empty string', Convert.toNumber(-1), '', -1)
testConvert('Convert.toNumber defaults for invalid string', Convert.toNumber(-1), 'foo', -1)
testConvert('Convert.toNumber converts from object', Convert.toNumber(-1), {}, -1)
testConvert('Convert.toNumber converts from bigint', Convert.toNumber(-1), BigInt(12345), 12345)
testConvert('Convert.toNumber defaults for too large bigint', Convert.toNumber(-1), BigInt(Number.MAX_SAFE_INTEGER.toString() + '0'), -1)
testConvert('Convert.toNumber defaults for too small bigint', Convert.toNumber(-1), BigInt(Number.MIN_SAFE_INTEGER.toString() + '0'), -1)

testConvert('Convert.toFinite gets only item in array', Convert.toFinite(-1), ['-3.14'], -3.14)
testConvert('Convert.toFinite fails for multiple items array', Convert.toFinite(-1), ['-3.14', 2], -1)
testConvert('Convert.toFinite defaults for Infinity', Convert.toFinite(-1), Infinity, -1)
testConvert('Convert.toFinite defaults for NaN', Convert.toFinite(-1), NaN, -1)
testConvert('Convert.toFinite defaults for string Infinity', Convert.toFinite(-1), 'Infinity', -1)
testConvert('Convert.toFinite defaults for string NaN', Convert.toFinite(-1), 'NaN', -1)
testConvert('Convert.toFinite parses float', Convert.toFinite(-1), '123.45', 123.45)
testConvert('Convert.toInteger gets only item in array', Convert.toInteger(-1), ['1.2'], 1)
testConvert('Convert.toInteger fails for multiple items asrray', Convert.toInteger(-1), ['1.2', '2.3'], -1)
testConvert('Convert.toInteger rounds down', Convert.toInteger(-1), '123.45', 123)
testConvert('Convert.toInteger rounds up', Convert.toInteger(-1), '123.65', 124)
testConvert('Convert.toInteger converts from bigint', Convert.toInteger(-1), BigInt(123), 123)
testConvert('Convert.toInteger defaults for too large bigint', Convert.toInteger(-1), BigInt(Number.MAX_SAFE_INTEGER.toString() + '0'), -1)
testConvert('Convert.toBoolean parses true', Convert.toBoolean(null as any as boolean), 'true', true)
testConvert('Convert.toBoolean parses false', Convert.toBoolean(null as any as boolean), 'false', false)
testConvert('Convert.toBoolean does not coerce to true', Convert.toBoolean(null as any as boolean), 'aaaaaaaa', null)
testConvert('Convert.toBoolean does not coerce to false', Convert.toBoolean(null as any as boolean), '', null)
testConvert('Convert.toTruthy coerces to false', Convert.toTruthy(), null, false)
testConvert('Convert.toTruthy coerces to true', Convert.toTruthy(), [], true)
testConvert('Convert.toBigInt parses large integer', Convert.toBigInt(null as any as bigint), Number.MAX_SAFE_INTEGER.toString() + '0', BigInt(Number.MAX_SAFE_INTEGER.toString() + '0'))
testConvert('Convert.toBigInt passes through bigint', Convert.toBigInt(null as any as bigint), BigInt(33), BigInt(33))

testConvert('Convert.toArray accepts empty array', Convert.toArray(null as any as any[]), [], [])
testConvert('Convert.toArray accepts array', Convert.toArray(null as any as any[]), [1, 2, 3], [1, 2, 3])
testConvert('Convert.toArray defaults for null', Convert.toArray('DEF' as any as any[]), null, 'DEF' as any)
testConvert('Convert.toArray defaults for undefined', Convert.toArray('DEF' as any as any[]), null, 'DEF' as any)
testConvert('Convert.toArray wraps object', Convert.toArray(null as any as any[]), { hi: 123 }, [{ hi: 123 }])
testConvert('Convert.toArray wraps primitive', Convert.toArray(null as any as any[]), 123, [123])

testConvert('Convert.toArrayOf converts empty array', Convert.toArrayOf(Convert.toString(), null as any), [], [])
testConvert('Convert.toArrayOf converts array contents', Convert.toArrayOf(Convert.toString(), null as any), [1, 2, 3], ['1', '2', '3'])
testConvert('Convert.toArrayOf wraps primitive', Convert.toArrayOf(Convert.id, 'DEF' as any), 'hello', ['hello'] as any)
testConvert('Convert.toArrayOf wraps object', Convert.toArrayOf(Convert.id, 'DEF' as any), { hi: 123 }, [{ hi: 123 }] as any)
testConvert('Convert.toArrayOf defaults for null', Convert.toArrayOf(Convert.id, 'DEF' as any), null, 'DEF' as any)
testConvert('Convert.toArrayOf defaults for undefined', Convert.toArrayOf(Convert.id, 'DEF' as any), undefined, 'DEF' as any)

testConvert('Convert.toStructOf converts empty struct', Convert.toStructOf(Convert.toString(), null as any), {}, {});
testConvert('Convert.toStructOf converts struct contents', Convert.toStructOf(Convert.toString(), null as any), { uno: 10, dos: '20' }, { uno: '10', dos: '20' });
testConvert('Convert.toStructOf defaults for array', Convert.toStructOf(Convert.id, 'DEF' as any), [], 'DEF' as any)
testConvert('Convert.toStructOf defaults for primitive', Convert.toStructOf(Convert.id, 'DEF' as any), 123, 'DEF' as any)
testConvert('Convert.toStructOf defaults for null', Convert.toStructOf(Convert.id, 'DEF' as any), null, 'DEF' as any)
testConvert('Convert.toStructOf defaults for undefined', Convert.toStructOf(Convert.id, 'DEF' as any), undefined, 'DEF' as any)

testConvert('Convert.to empty array produces empty array on success', Convert.to([]), [1, 2, 3], [])
testConvert('Convert.to empty array produces empty array on error', Convert.to([]), null, [])
testConvert('Convert.to array converts array items', Convert.to([Convert.toString('DEF'), Convert.toNumber()]), [{}, 'NaN', 20], ['DEF', NaN])

testConvert('Convert.to empty object produces empty object on success', Convert.to({}), { hi: 1 }, {})
testConvert('Convert.to empty object produces empty object on error', Convert.to({}), null, {})
testConvert('Convert.to object converts object items', Convert.to({ hi: Convert.toString('DEF'), bye: Convert.toNumber() }), { hi: {}, bye: '22.3' }, { hi: 'DEF', bye: 22.3 })

testConvert('Convert.toNumber converts false to 0', Convert.toNumber(-1), false, 0)
testConvert('Convert.toNumber converts true to 1', Convert.toNumber(-1), true, 1)
testConvert('Convert.toFinite converts false to 0', Convert.toFinite(-1), false, 0)
testConvert('Convert.toFinite converts true to 1', Convert.toFinite(-1), true, 1)
testConvert('Convert.toInteger converts false to 0', Convert.toInteger(-1), false, 0)
testConvert('Convert.toInteger converts true to 1', Convert.toInteger(-1), true, 1)
testConvert('Convert.toBigInt converts false to 0', Convert.toBigInt(BigInt(-1)), false, BigInt(0))
testConvert('Convert.toBigInt converts true to 1', Convert.toBigInt(BigInt(-1)), true, BigInt(1))

const convertAllEmptyArray = Convert.all([])
const convertAllEmptyStruct = Convert.all({})
const convertAllStringInArray = Convert.all([Convert.toString()])
const convertAllStringInStruct = Convert.all({ a: Convert.toString() })
const convertAllCastInArray = Convert.all([Cast.asString])
const convertAllCastInStruct = Convert.all({ a: Cast.asString })
const convertAllCastAndConvertInArray = Convert.all([Convert.toString(), Cast.asNumber])
const convertAllCastAndConvertInTuple = Convert.all([Convert.toString(), Cast.asNumber] as const)
const convertAllCastAndConvertInStruct = Convert.all({ a: Convert.toString(), b: Cast.asNumber })

type ConvertAllEmptyArrayIsConvert = TypeAssert<TypesAreEqual<typeof convertAllEmptyArray, Convert<unknown[]>>>
type ConvertAllEmptyStructIsConvert = TypeAssert<TypesAreEqual<typeof convertAllEmptyStruct, Convert<{}>>>
type ConvertAllStringInArrayIsConvert = TypeAssert<TypesAreEqual<typeof convertAllStringInArray, Convert<string[]>>>
type ConvertAllStringInStructIsConvert = TypeAssert<TypesAreEqual<typeof convertAllStringInStruct, Convert<{ a: string }>>>
type ConvertAllCastInArrayIsCast = TypeAssert<TypesAreEqual<typeof convertAllCastInArray, Cast<string[]>>>
type ConvertAllCastInStructIsCast = TypeAssert<TypesAreEqual<typeof convertAllCastInStruct, Cast<{ a: string }>>>
type ConvertAllCastAndConvertInArrayIsCast = TypeAssert<TypesAreEqual<typeof convertAllCastAndConvertInArray, Cast<(string | number)[]>>>
type ConvertAllCastAndConvertInTupleIsCast = TypeAssert<TypesAreEqual<typeof convertAllCastAndConvertInTuple, Cast<readonly [string, number]>>>
type ConvertAllCastAndConvertInStructIsCast = TypeAssert<TypesAreEqual<typeof convertAllCastAndConvertInStruct, Cast<{ a: string, b: number }>>>

testEq('Convert.all empty array produces a Convert', Convert.all([]).constructor.name, Convert.prototype.constructor.name)
testEq('Convert.all empty struct produces a Convert', Convert.all({}).constructor.name, Convert.prototype.constructor.name)
testEq('Convert.all with Cast in array produces a Cast', Convert.all([Cast.asString]).constructor.name, Cast.prototype.constructor.name)
testEq('Convert.all with Cast in struct produces a Cast', Convert.all({ hi: Cast.asString }).constructor.name, Cast.prototype.constructor.name)
testEq('Convert.all with Convert in array produces a Convert', Convert.all([Convert.toString()]).constructor.name, Convert.prototype.constructor.name)
testEq('Convert.all with Convert in struct produces a Convert', Convert.all({ hi: Convert.toString() }).constructor.name, Convert.prototype.constructor.name)
testEq('Convert.all with both in array produces a Cast', Convert.all([Convert.toString(), Cast.asString]).constructor.name, Cast.prototype.constructor.name)
testEq('Convert.all with both in struct produces a Cast', Convert.all({ hi: Convert.toString(), bye: Cast.asString }).constructor.name, Cast.prototype.constructor.name)

testConvert('Convert.all converts null to empty array', Convert.all([]).else('DEF'), null, [])
testConvert('Convert.all converts null to empty struct', Convert.all({}).else('DEF'), null, {})

testConvert('Convert.toDate defaults for null', Convert.toDate('DEF' as any), null, 'DEF' as any)
testConvert('Convert.toDate defaults for undefined', Convert.toDate('DEF' as any), undefined, 'DEF' as any)
testConvert('Convert.toDate defaults for invalid date', Convert.toDate('DEF' as any), new Date(NaN), 'DEF' as any)
testConvert('Convert.toDate converts valid date', Convert.toDate('DEF' as any), new Date('2020-01-02T03:04:05.678+01:00'), new Date('2020-01-02T03:04:05.678+01:00'))
testConvert('Convert.toDate converts string', Convert.toDate('DEF' as any), '2020-01-02T03:04:05.678+01:00', new Date('2020-01-02T03:04:05.678+01:00'))
testConvert('Convert.toDate fails for invalid string', Convert.toDate('DEF' as any), 'invalid', 'DEF' as any)
testConvert('Convert.toDate converts valid number', Convert.toDate('DEF' as any), 1577836800000, new Date('2020-01-01T00:00:00.000Z'))
testConvert('Convert.toDate fails for float', Convert.toDate('DEF' as any), 1577836800000.1, 'DEF' as any)
testConvert('Convert.toDate fails for unsafe integer', Convert.toDate('DEF' as any), 999999999999999 * 10, 'DEF' as any)

testConvert('Cast.elseNothing returns nothing on fail', Cast.asInteger.toMaybe, [], Maybe.nothing())
testConvert('Cast.elseNothing returns something on success', Cast.asInteger.toMaybe, '123', Maybe.just(123))

testEq('Cast.elseThrow returns a convert', Cast.asInteger.elseThrow().constructor.name, Convert.prototype.constructor.name);
testConvert('Cast.elseThrow converts valid value', Cast.asInteger.elseThrow(), '123', 123);
testError('Cast.elseThrow throws for invalid value with default message', 'Cast has no value', () => Cast.asInteger.elseThrow().convert('bad'));
testError('Cast.elseThrow throws for invalid value with custom message', 'Bad number', () => Cast.asInteger.elseThrow(() => new Error('Bad number')).convert('bad'));

const structConvert = Convert.to({
    int: Convert.toInteger(),
    str: Convert.toString('DEFAULT'),
    tup: [100, '200']
})

testEq('Convert.props returns keys', Object.keys(structConvert.obj), ['int', 'str', 'tup']);
testEq('Convert.props member 1 behaves as original (1)', structConvert.obj.int.convert(1.9), 2);
testEq('Convert.props member 1 behaves as original (2)', structConvert.obj.int.convert(null), 0);
testEq('Convert.props member 2 behaves as original (1)', structConvert.obj.str.convert(1.9), '1.9');
testEq('Convert.props member 2 behaves as original (2)', structConvert.obj.str.convert(null), 'DEFAULT');
testEq('Convert.props member 3 behaves as original (1)', structConvert.obj.tup.convert(null), [100, '200']);
testEq('Convert.props member 3 behaves as original (2)', structConvert.obj.tup.convert(['123', '321']), [123, '321']);

testEq('Convert.props can handle hidden keys',
    Object.entries(Cast.as({ uno: 1 }).else({ uno: 10, dos: 'hey' }).obj).map(([key, convert]) => [key, convert.convert(null)]),
    [['uno', 10], ['dos', 'hey']]
);
