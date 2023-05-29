"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../src/index.js");
// ---------------- Type guarding ----------------
const exe = [{
        "role": "user",
        "content": {
            "from": "user",
            "to": "bot",
            "text": "When was Napoleon born?"
        }
    }, {
        "role": "assistant",
        "content": {
            "from": "bot",
            "to": "user",
            "text": "Napoleon Bonaparte was born on 15 August 1769 in Ajaccio, Corsica, France."
        }
    }];
const examples = index_js_1.Guard.isArrayOf(index_js_1.Guard.is({
    role: index_js_1.Guard.isConst('user').or(index_js_1.Guard.isConst('assistawefant')),
    content: index_js_1.Guard.is({
        from: index_js_1.Guard.isEnum(['user', 'bot', 'evaluator']),
        to: index_js_1.Guard.isEnum(['user', 'bot', 'evaluator']),
        text: index_js_1.Guard.isString
    })
}))
    .parse(JSON.stringify(exe)).elseThrow(() => new Error('Invalid examples.json'));
console.log(`Length: ${examples.length}`);
