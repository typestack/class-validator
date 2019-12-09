"use strict";
// https://github.com/TylorS/typed-is-promise/blob/abf1514e1b6961adfc75765476b0debb96b2c3ae/src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
function isPromise(p) {
    return p !== null && typeof p === "object" && typeof p.then === "function";
}
exports.isPromise = isPromise;
/**
 * Convert Map, Set to Array
 */
function convertToArray(val) {
    if (val instanceof Map) {
        return Array.from(val.values());
    }
    return Array.isArray(val) ? val : Array.from(val);
}
exports.convertToArray = convertToArray;

//# sourceMappingURL=utils.js.map
