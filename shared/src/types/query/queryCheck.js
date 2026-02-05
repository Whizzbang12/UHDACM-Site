"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkQueryResponse = checkQueryResponse;
exports.checkQueryMessage = checkQueryMessage;
const vectorDBCheck_1 = require("../vectorDB/vectorDBCheck");
function checkQueryResponse(obj) {
    if (!obj || typeof obj != "object") {
        throw new Error("Input is not an object");
    }
    const { response, relevant_actions, quick_replies } = obj;
    if (typeof response != "string") {
        throw new Error("response is not a string");
    }
    if (!Array.isArray(relevant_actions)) {
        throw new Error("relevant_actions is not an array");
    }
    for (let i = 0; i < relevant_actions.length; i++) {
        const action = relevant_actions[i];
        try {
            (0, vectorDBCheck_1.checkVectorDBPageMetadataAction)(action);
        }
        catch (e) {
            throw new Error(`Item ${i} is not a VectorDBPageMetadataAction: ${e.message}`);
        }
    }
    if (!Array.isArray(quick_replies)) {
        throw new Error("quick_replies is not an array");
    }
    for (const [i, reply] of quick_replies.entries()) {
        if (typeof reply.label !== "string") {
            throw new Error(`quick_replies[${i}].label is not a string`);
        }
        if (typeof reply.value !== "string") {
            throw new Error(`quick_replies[${i}].value is not a string`);
        }
    }
}
function checkQueryMessage(obj) {
    if (!obj || typeof obj !== "object") {
        throw new Error("Input is not an object");
    }
    checkQueryResponse(obj);
    const { sender, timestamp } = obj;
    if (sender !== "user" && sender !== "bot") {
        throw new Error("sender is not 'user' or 'bot'");
    }
    if (isNaN(Date.parse(timestamp))) {
        throw new Error("timestamp is not a valid Date string");
    }
}
//# sourceMappingURL=queryCheck.js.map