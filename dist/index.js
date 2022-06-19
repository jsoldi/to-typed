export { Maybe, Cast, Guard, Convert } from "./internal.js";
import { Cast, Convert } from "./internal.js";
function test() {
    const t = Convert.to({
        cinco: Cast.asString.map(a => a === 'yea').else(false),
        seis: Convert.toEnum(...[100, '200', 300])
    });
    const telares = t.cast({ seis: '300' });
    console.log(telares);
}
test();
//# sourceMappingURL=index.js.map