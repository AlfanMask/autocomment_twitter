"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = delay;
// for delaying the tasks
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
