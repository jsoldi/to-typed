import { Cast, Convert } from "../lib/index.js";
import { typeAssert, typeEq, typeGen } from "./tester.js";

typeAssert(typeEq(Convert.all([]), typeGen<Convert<unknown[]>>()))
typeAssert(typeEq(Convert.all({}), typeGen<Convert<{}>>()))

typeAssert(typeEq(Convert.all([ Convert.toString() ]), typeGen<Convert<string[]>>()))
typeAssert(typeEq(Convert.all({ a: Convert.toString() }), typeGen<Convert<{ a: string }>>()))

typeAssert(typeEq(Convert.all([ Cast.asString ]), typeGen<Cast<string[]>>()))
typeAssert(typeEq(Convert.all({ a: Cast.asString }), typeGen<Cast<{ a: string }>>()))

typeAssert(typeEq(Convert.all([ Cast.asString, Convert.toNumber() ] as const), typeGen<Cast<readonly [ string, number ]>>()))
typeAssert(typeEq(Convert.all({ a: Cast.asString, b: Convert.toNumber() }), typeGen<Cast<{ a: string, b: number }>>()))
