"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToUrlParams = objectToUrlParams;
exports.sleep = sleep;
exports.EqualsTimed = EqualsTimed;
function objectToUrlParams(obj) {
    const params = Object.entries(obj)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => key + "=" + String(value))
        .join("&");
    return params;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * runs == operation on two values.
 * if values are equal, returns immediately.
 *
 * if values are not, ensures entire operation takes `time` ms.
 *
 * Note: doesn't work where `time` < equal operation time
 */
async function EqualsTimed(val, val2, time) {
    let end = Date.now() + time;
    if (val != val2) {
        await sleep(Math.max(1, end - Date.now())); // Max.max to avoid waiting negative time
        return false;
    }
    return true;
}
//# sourceMappingURL=tools.js.map