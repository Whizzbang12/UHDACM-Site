"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDBTicket = checkDBTicket;
const CMSCheck_1 = require("../cms/CMSCheck");
function checkDBTicket(value) {
    if (typeof value !== "object" || value === null) {
        throw new Error("Value is not a non-null object.");
    }
    const { collection, tries, failed, id } = value;
    if (!("collection" in value)) {
        throw new Error("Missing 'collection' property in value.");
    }
    if (!(0, CMSCheck_1.isCMSCollectionSingular)(collection) && !(0, CMSCheck_1.isCMSSingleType)(collection) && !(0, CMSCheck_1.isCMSSingleTypePage)(collection)) {
        throw new Error(`'collection' property (${collection}) is not a valid CMSCollectionSingular.`);
    }
    if (!("tries" in value)) {
        throw new Error("Missing 'tries' property in value.");
    }
    if (typeof tries !== "number") {
        throw new Error("'tries' property is not a number.");
    }
    if (!("failed" in value)) {
        throw new Error("Missing 'failed' property in value.");
    }
    if (typeof failed !== "boolean") {
        throw new Error("'failed' property is not a boolean.");
    }
    if (id && typeof id !== "string") {
        throw new Error("'id' property is not a string.");
    }
}
//# sourceMappingURL=ticketCheck.js.map