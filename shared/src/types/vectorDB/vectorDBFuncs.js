"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSafeMetadataToVectorDBMetadata = exports.convertVectorDBMetadataToSafeMetadata = exports.convertSiteEventToPartialSiteEvent = void 0;
const CMSFuncs_1 = require("../cms/CMSFuncs");
const vectorDBCheck_1 = require("./vectorDBCheck");
const convertSiteEventToPartialSiteEvent = (event, cmsURL, siteURL) => {
    const partialSiteEvent = {
        name: event.name,
        dateStart: event.dateStart,
        dateEnd: event.dateEnd,
        descriptionShort: event.descriptionShort,
        hasGallery: event.gallery != undefined,
        location: event.location,
        organizationNames: (event.organizations || []).map((v) => v.name),
        url: siteURL + '/events/' + event.urlSlug,
    };
    const previewImageUrl = event.previewImage
        ? (0, CMSFuncs_1.TryGetImageFormatPath)(event.previewImage, "thumbnail", cmsURL)
        : undefined;
    if (previewImageUrl) {
        partialSiteEvent.previewImageUrl = previewImageUrl;
    }
    return partialSiteEvent;
};
exports.convertSiteEventToPartialSiteEvent = convertSiteEventToPartialSiteEvent;
const convertVectorDBMetadataToSafeMetadata = (obj) => {
    const newObject = {};
    for (const [key, val] of Object.entries(obj)) {
        if (typeof (val) != 'object') {
            // if value is not an object (or array) store as normal
            newObject[key] = val;
            continue;
        }
        newObject[key] = JSON.stringify(val);
    }
    return newObject;
};
exports.convertVectorDBMetadataToSafeMetadata = convertVectorDBMetadataToSafeMetadata;
/**
 * Converts safe metadata to vectorDB metadata obj.
 *
 * Note: takes in regular object, as ChromaDB metadata is not compatible with safe metadata
 *
 * @throws error if object is not a valid vectorDB metadata object. see `vectorDBTypes` for more
 *
 * @param obj
 * @returns
 */
const convertSafeMetadataToVectorDBMetadata = (obj) => {
    const newObject = {};
    for (const [key, val] of Object.entries(obj)) {
        try {
            // Attempt to parse the value as JSON
            const parsedValue = JSON.parse(val);
            newObject[key] = parsedValue;
        }
        catch {
            // If parsing fails, keep the value as is
            newObject[key] = val;
        }
    }
    (0, vectorDBCheck_1.checkVectorDBBaseMetadata)(newObject);
    return newObject;
};
exports.convertSafeMetadataToVectorDBMetadata = convertSafeMetadataToVectorDBMetadata;
//# sourceMappingURL=vectorDBFuncs.js.map