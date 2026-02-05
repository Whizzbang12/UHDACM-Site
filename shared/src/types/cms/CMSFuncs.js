"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmsPageFetchParams = void 0;
exports.buildCMSFetchURL = buildCMSFetchURL;
exports.cmsCollectionSingularToPlural = cmsCollectionSingularToPlural;
exports.cmsCollectionPluralToSingular = cmsCollectionPluralToSingular;
exports.TryGetImageFormatPath = TryGetImageFormatPath;
const tools_1 = require("../../tools");
const CMSCheck_1 = require("./CMSCheck");
const CMSTypes_1 = require("./CMSTypes");
/**
 *
 * @param cmsURL
 * @param path
 * @param params
 * @param additionalTags
 * @returns
 */
function buildCMSFetchURL(cmsURL, path, params, additionalTags) {
    let collectionTag = convertFetchableToSingular(path);
    if (!collectionTag) {
        console.log("failed to find collection tag", path);
        // this should never happen
        return {};
    }
    const dependencyTags = [collectionTag];
    if (additionalTags) {
        if (Array.isArray(additionalTags)) {
            for (const tag of additionalTags) {
                const singularTag = convertFetchableToSingular(tag);
                if (singularTag) {
                    dependencyTags.push(singularTag);
                }
            }
        }
        else if (additionalTags === "any") {
            // If additionalTags is "any", we can add all possible tags
            dependencyTags.push("any");
        }
    }
    const urlParams = params ? (0, tools_1.objectToUrlParams)(params) : undefined;
    const url = `${cmsURL}/api/${path}${urlParams ? `?${urlParams}` : ""}`;
    return { url, dependencyTags };
}
// a little hacky, but these are the params needed to populate the cms collection well enough for a page.
exports.cmsPageFetchParams = {
    "populate[0]": "sections",
    "populate[1]": "sections.type",
    "populate[2]": "sections.leftComponent",
    "populate[3]": "sections.rightComponent",
    "populate[4]": "sections.leftComponent.form",
    "populate[5]": "sections.rightComponent.form",
    "populate[6]": "sections.leftComponent.textBlock",
    "populate[7]": "sections.rightComponent.textBlock",
    "populate[8]": "sections.leftComponent.textBlock.buttons",
    "populate[9]": "sections.rightComponent.textBlock.buttons",
    "populate[10]": "sections.leftComponent.imageCollection",
    "populate[11]": "sections.rightComponent.imageCollection",
    "populate[12]": "sections.leftComponent.imageCollection.images",
    "populate[13]": "sections.rightComponent.imageCollection.images",
    "populate[14]": "sections.leftComponent.singleImage",
    "populate[15]": "sections.rightComponent.singleImage",
    "populate[16]": "sections.leftComponent.singleImage.image",
    "populate[17]": "sections.rightComponent.singleImage.image",
    "populate[18]": "sections.leftComponent.floatingImages",
    "populate[19]": "sections.rightComponent.floatingImages",
    "populate[20]": "sections.leftComponent.floatingImages.images",
    "populate[21]": "sections.rightComponent.floatingImages.images"
};
// export function buildCMSFetchPageParams() {
//   const populateList: string[] = [
//     "sections",
//     "sections.type",
//     "sections.leftComponent",
//     "sections.rightComponent",
//     "sections.leftComponent.form",
//     "sections.rightComponent.form",
//     "sections.leftComponent.textBlock",
//     "sections.rightComponent.textBlock",
//     "sections.leftComponent.textBlock.buttons",
//     "sections.rightComponent.textBlock.buttons",
//     "sections.leftComponent.imageCollection",
//     "sections.rightComponent.imageCollection",
//     "sections.leftComponent.imageCollection.images",
//     "sections.rightComponent.imageCollection.images",
//     "sections.leftComponent.singleImage",
//     "sections.rightComponent.singleImage",
//     "sections.leftComponent.singleImage.image",
//     "sections.rightComponent.singleImage.image",
//     "sections.leftComponent.floatingImages",
//     "sections.rightComponent.floatingImages",
//     "sections.leftComponent.floatingImages.images",
//     "sections.rightComponent.floatingImages.images",
//   ];
//   const params: { [key: string]: string } = {};
//   for (const i in populateList) {
//     params[`populate[${i}]`] = `${populateList[i]}`;
//   }
//   return params;
// }
const convertFetchableToSingular = (path) => {
    if ((0, CMSCheck_1.isCMSCollectionPlural)(path)) {
        return cmsCollectionPluralToSingular(path);
    }
    if ((0, CMSCheck_1.isCMSSingleType)(path)) {
        return path;
    }
    if ((0, CMSCheck_1.isCMSSingleTypePage)(path)) {
        return path;
    }
    return undefined;
};
function cmsCollectionSingularToPlural(singular) {
    const singulars = ["event", "gallery", "organization", "person", "qna"];
    const plurals = ["events", "galleries", "organizations", "people", "qnas"];
    const index = singulars.indexOf(singular);
    return index !== -1 ? plurals[index] : undefined;
}
function cmsCollectionPluralToSingular(plural) {
    const index = CMSTypes_1.cmsCollectionsPlural.indexOf(plural);
    return index !== -1
        ? CMSTypes_1.cmsCollectionsSingular[index]
        : undefined;
}
/**
 * Given strapi picture, try to get the URL for a specific format
 * auto formats the url using `ProduceCMSResourceURL`.
 * @param img
 * @param format
 * @returns
 */
function TryGetImageFormatPath(img, format, cmsUrl) {
    let url = '';
    if (!img)
        return undefined;
    if (img.formats && img.formats[format]) {
        url = img.formats[format].url;
    }
    else {
        url = img.url;
    }
    if (!url) {
        return undefined;
    }
    if (url.at(0) == "/") {
        return `${cmsUrl}${url}`;
    }
    return url;
}
//# sourceMappingURL=CMSFuncs.js.map