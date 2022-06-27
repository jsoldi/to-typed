import { Cast, Convert } from "../lib/index.js";
import { typeAssert, typeEq, typeGen } from "./tester.js";
typeAssert(typeEq(Convert.all([]), typeGen()));
typeAssert(typeEq(Convert.all({}), typeGen()));
typeAssert(typeEq(Convert.all([Convert.toString()]), typeGen()));
typeAssert(typeEq(Convert.all({ a: Convert.toString() }), typeGen()));
typeAssert(typeEq(Convert.all([Cast.asString]), typeGen()));
typeAssert(typeEq(Convert.all({ a: Cast.asString }), typeGen()));
typeAssert(typeEq(Convert.all([Cast.asString, Convert.toNumber()]), typeGen()));
typeAssert(typeEq(Convert.all({ a: Cast.asString, b: Convert.toNumber() }), typeGen()));
//# sourceMappingURL=type-tests.js.map