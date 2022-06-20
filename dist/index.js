export { Maybe, Cast, Guard, Convert } from "./internal.js";
import { Cast } from "./internal.js";
function test() {
    const g = Cast.as([33, 'rata', false]);
    console.log(g.cast([323, 4343, 4334]));
    console.log(g.cast(['111', '333', '']));
    console.log(g.cast(['111', '333']));
}
test();
//# sourceMappingURL=index.js.map