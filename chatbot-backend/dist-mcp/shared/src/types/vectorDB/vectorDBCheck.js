"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVectorDBBaseMetadata = checkVectorDBBaseMetadata;
exports.checkVectorDBPageMetadataAction = checkVectorDBPageMetadataAction;
exports.checkVectorDBPageMetadata = checkVectorDBPageMetadata;
exports.checkPartialSiteEvent = checkPartialSiteEvent;
exports.checkVectorDBEventMetadata = checkVectorDBEventMetadata;
exports.checkVectorDBOrganizationMetadata = checkVectorDBOrganizationMetadata;
exports.checkVectorDBPersonMetadata = checkVectorDBPersonMetadata;
exports.checkVectorDBQnAMetadata = checkVectorDBQnAMetadata;
exports.checkVectorDBFeaturedEventMetadata = checkVectorDBFeaturedEventMetadata;
exports.checkVectorDBLeadershipMetadata = checkVectorDBLeadershipMetadata;
exports.checkVectorDBSiteInfoMetadata = checkVectorDBSiteInfoMetadata;
// Helper for type checks
function isObject(val) {
    return typeof val === "object" && val !== null;
}
function checkVectorDBBaseMetadata(param) {
    if (!isObject(param))
        throw new Error("VectorDBBaseMetadata: param is not an object");
    const { collection } = param;
    if (typeof collection !== "string")
        throw new Error("VectorDBBaseMetadata: collection must be a string");
}
function checkVectorDBPageMetadataAction(param) {
    if (!isObject(param))
        throw new Error("VectorDBPageMetadataAction: param is not an object");
    const { label, href } = param;
    if (typeof label !== "string")
        throw new Error("VectorDBPageMetadataAction: label must be a string");
    if (typeof href !== "string")
        throw new Error("VectorDBPageMetadataAction: href must be a string");
}
function checkVectorDBPageMetadata(param) {
    if (!isObject(param))
        throw new Error("VectorDBPageMetadata: param is not an object");
    const { collection, url, actions } = param;
    if (typeof collection !== "string")
        throw new Error("VectorDBPageMetadata: collection must be a string");
    if (typeof url !== "string")
        throw new Error("VectorDBPageMetadata: url must be a string");
    if (actions !== undefined) {
        if (!Array.isArray(actions))
            throw new Error("VectorDBPageMetadata: actions must be an array");
        actions.forEach(checkVectorDBPageMetadataAction);
    }
}
function checkPartialSiteEvent(param) {
    if (!isObject(param))
        throw new Error("PartialSiteEvent: param is not an object");
    const { url, name, previewImageUrl, dateStart, dateEnd, descriptionShort, location, hasGallery, organizationNames, } = param;
    if (typeof url !== "string")
        throw new Error("PartialSiteEvent: url must be a string");
    if (typeof name !== "string")
        throw new Error("PartialSiteEvent: name must be a string");
    if (previewImageUrl !== undefined && typeof previewImageUrl !== "string")
        throw new Error("PartialSiteEvent: previewImageUrl must be a string if defined");
    if (typeof dateStart !== "string")
        throw new Error("PartialSiteEvent: dateStart must be a string");
    if (typeof dateEnd !== "string")
        throw new Error("PartialSiteEvent: dateEnd must be a string");
    if (typeof descriptionShort !== "string")
        throw new Error("PartialSiteEvent: descriptionShort must be a string");
    if (typeof location !== "string")
        throw new Error("PartialSiteEvent: location must be a string");
    if (typeof hasGallery !== "boolean")
        throw new Error("PartialSiteEvent: hasGallery must be a boolean");
    if (organizationNames !== undefined && !Array.isArray(organizationNames))
        throw new Error("PartialSiteEvent: organizationNames must be an array of strings if defined");
}
function checkVectorDBEventMetadata(param) {
    if (!isObject(param))
        throw new Error("VectorDBEventMetadata: param is not an object");
    const { collection, event } = param;
    if (collection !== "event")
        throw new Error('VectorDBEventMetadata: collection must be "event"');
    checkPartialSiteEvent(event);
}
function checkVectorDBOrganizationMetadata(param) {
    if (!isObject(param))
        throw new Error("VectorDBOrganizationMetadata: param is not an object");
    const { collection } = param;
    if (typeof collection !== "string")
        throw new Error("VectorDBOrganizationMetadata: collection must be a string");
}
function checkVectorDBPersonMetadata(param) {
    if (!isObject(param))
        throw new Error("VectorDBPersonMetadata: param is not an object");
    const { collection } = param;
    if (typeof collection !== "string")
        throw new Error("VectorDBPersonMetadata: collection must be a string");
}
function checkVectorDBQnAMetadata(param) {
    if (!isObject(param))
        throw new Error("VectorDBQnAMetadata: param is not an object");
    const { collection, QnA } = param;
    if (typeof collection !== "string")
        throw new Error("VectorDBQnAMetadata: collection must be a string");
    if (typeof QnA !== "object" || QnA === null)
        throw new Error("VectorDBQnAMetadata: QnA must be an object");
}
function checkVectorDBFeaturedEventMetadata(param) {
    if (!isObject(param))
        throw new Error("VectorDBFeaturedEventMetadata: param is not an object");
    const { collection, Event } = param;
    if (typeof collection !== "string")
        throw new Error("VectorDBFeaturedEventMetadata: collection must be a string");
    checkPartialSiteEvent(Event);
}
function checkVectorDBLeadershipMetadata(param) {
    if (!isObject(param))
        throw new Error("VectorDBLeadershipMetadata: param is not an object");
    const { collection, socialUrls } = param;
    if (typeof collection !== "string")
        throw new Error("VectorDBLeadershipMetadata: collection must be a string");
    if (socialUrls !== undefined && !Array.isArray(socialUrls))
        throw new Error("VectorDBLeadershipMetadata: socialUrls must be an array of strings if defined");
}
function checkVectorDBSiteInfoMetadata(param) {
    if (!isObject(param))
        throw new Error("VectorDBSiteInfoMetadata: param is not an object");
    const { collection, socialUrls } = param;
    if (typeof collection !== "string")
        throw new Error("VectorDBSiteInfoMetadata: collection must be a string");
    if (socialUrls !== undefined && !Array.isArray(socialUrls))
        throw new Error("VectorDBSiteInfoMetadata: socialUrls must be an array of strings if defined");
}
