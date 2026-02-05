"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidFeaturedEvent = isValidFeaturedEvent;
exports.isValidLeadership = isValidLeadership;
exports.isCMSCollectionSingular = isCMSCollectionSingular;
exports.isCMSCollectionPlural = isCMSCollectionPlural;
exports.cmsCollectionSingularToPlural = cmsCollectionSingularToPlural;
exports.cmsCollectionPluralToSingular = cmsCollectionPluralToSingular;
exports.isCMSSingleType = isCMSSingleType;
exports.isCMSSingleTypePage = isCMSSingleTypePage;
exports.isValidSiteSection = isValidSiteSection;
exports.isValidSiteSectionLeadership = isValidSiteSectionLeadership;
exports.isValidSiteSectionFeaturedEvent = isValidSiteSectionFeaturedEvent;
exports.isValidSiteSectionLatestQnA = isValidSiteSectionLatestQnA;
exports.isSearchSectionType = isSearchSectionType;
exports.isValidSiteSectionSearch = isValidSiteSectionSearch;
exports.isSplitHeroColumnType = isSplitHeroColumnType;
exports.isValidSplitHeroColumnNone = isValidSplitHeroColumnNone;
exports.isValidSplitHeroColumn = isValidSplitHeroColumn;
exports.isValidSplitHeroColumnTextBlock = isValidSplitHeroColumnTextBlock;
exports.isValidSplitHeroColumnForm = isValidSplitHeroColumnForm;
exports.isValidSplitHeroColumnImageCollection = isValidSplitHeroColumnImageCollection;
exports.isValidSplitHeroColumnSingleImage = isValidSplitHeroColumnSingleImage;
exports.isValidSplitHeroColumnFloatingImages = isValidSplitHeroColumnFloatingImages;
exports.isValidSiteSectionSplitHero = isValidSiteSectionSplitHero;
exports.isValidHeroTextBlock = isValidHeroTextBlock;
exports.isValidHeaderType = isValidHeaderType;
exports.isValidHeroTextBlockAlignment = isValidHeroTextBlockAlignment;
exports.isValidCMSButtonIcon = isValidCMSButtonIcon;
exports.isValidCMSButton = isValidCMSButton;
exports.isValidSiteInfo = isValidSiteInfo;
exports.isValidSiteEvent = isValidSiteEvent;
exports.isSocialSite = isSocialSite;
exports.isValidSocialObj = isValidSocialObj;
exports.isPerson = isPerson;
exports.isStrapiPictureFormat = isStrapiPictureFormat;
exports.isStrapiPicture = isStrapiPicture;
exports.isOrganization = isOrganization;
exports.isValidQnA = isValidQnA;
const CMSTypes_1 = require("./CMSTypes");
function isValidFeaturedEvent(obj) {
    if (!obj || typeof obj != "object") {
        return false;
    }
    const { previewImageHD, event } = obj;
    if (!event || !isValidSiteEvent(event)) {
        return false;
    }
    if (previewImageHD != undefined && !isStrapiPicture(previewImageHD)) {
        return false;
    }
    return true;
}
function isValidLeadership(obj) {
    if (!obj || typeof obj != "object") {
        return false;
    }
    const { people } = obj;
    if (!(people instanceof Array)) {
        return false;
    }
    for (let person of people) {
        if (!isPerson(person)) {
            return false;
        }
    }
    return true;
}
function isCMSCollectionSingular(value) {
    return ["event", "gallery", "organization", "person", "qna"].includes(value);
}
function isCMSCollectionPlural(value) {
    return ["events", "galleries", "organizations", "people", "qnas"].includes(value);
}
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
function isCMSSingleType(value) {
    return CMSTypes_1.cmsSingleTypes.includes(value);
}
function isCMSSingleTypePage(value) {
    return CMSTypes_1.cmsSingleTypePages.includes(value);
}
function isValidSiteSection(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { __component, sectionID } = obj;
    if (sectionID != undefined && typeof sectionID !== "string") {
        return false;
    }
    switch (__component) {
        case "site-sections.leadership-section":
            return isValidSiteSectionLeadership(obj);
        case "site-sections.featured-event":
            return isValidSiteSectionFeaturedEvent(obj);
        case "site-sections.latest-qna":
            return isValidSiteSectionLatestQnA(obj);
        case "site-sections.search-section":
            return isValidSiteSectionSearch(obj);
        case "site-sections.split-hero-section":
            return isValidSiteSectionSplitHero(obj);
        default:
            return false;
    }
}
function isValidSiteSectionLeadership(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { __component } = obj;
    if (__component !== "site-sections.leadership-section") {
        return false;
    }
    return true;
}
function isValidSiteSectionFeaturedEvent(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { __component, header } = obj;
    if (__component !== "site-sections.featured-event") {
        return false;
    }
    if (header != undefined && typeof header !== "string") {
        return false;
    }
    return true;
}
function isValidSiteSectionLatestQnA(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { __component, reverseOnDesktop } = obj;
    if (__component !== "site-sections.latest-qna") {
        return false;
    }
    if (typeof reverseOnDesktop !== "boolean") {
        return false;
    }
    return true;
}
function isSearchSectionType(value) {
    return ["events", "galleries", "qnas"].includes(value);
}
function isValidSiteSectionSearch(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { __component, type, header, listingMode, defaultSortingMode } = obj;
    if (__component !== "site-sections.search-section") {
        return false;
    }
    if (!isSearchSectionType(type)) {
        return false;
    }
    if (header != undefined && typeof header !== "string") {
        return false;
    }
    if (!listingMode || !CMSTypes_1.ListingModes.includes(listingMode)) {
        return false;
    }
    if (!defaultSortingMode || !CMSTypes_1.EntrySortModes.includes(defaultSortingMode)) {
        return false;
    }
    return true;
}
function isSplitHeroColumnType(value) {
    return CMSTypes_1.SplitHeroColumnTypes.includes(value);
}
// Validation function for SplitHeroColumn using conditional statements and destructuring
function isValidSplitHeroColumnNone(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { type } = obj;
    return type === "none";
}
function isValidSplitHeroColumn(obj) {
    if (!obj || typeof obj !== "object")
        return false;
    const { type } = obj;
    switch (type) {
        case "none":
            return isValidSplitHeroColumnNone(obj);
        case "textBlock":
            return isValidSplitHeroColumnTextBlock(obj);
        case "form":
            return isValidSplitHeroColumnForm(obj);
        case "imageCollection":
            return isValidSplitHeroColumnImageCollection(obj);
        case "singleImage":
            return isValidSplitHeroColumnSingleImage(obj);
        case "floatingImages":
            return isValidSplitHeroColumnFloatingImages(obj);
        default:
            return false;
    }
}
function isValidSplitHeroColumnTextBlock(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { type, textBlock } = obj;
    if (type !== "textBlock" || !textBlock) {
        return false;
    }
    return isValidHeroTextBlock(textBlock);
}
function isValidSplitHeroColumnForm(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { type, form } = obj;
    if (type !== "form" || !form || typeof form.iFrameFormUrl !== "string") {
        return false;
    }
    return true;
}
function isValidSplitHeroColumnImageCollection(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { type, imageCollection } = obj;
    if (type !== "imageCollection") {
        return false;
    }
    if (!imageCollection ||
        typeof imageCollection !== "object" ||
        !Array.isArray(imageCollection.images)) {
        return false;
    }
    for (const img of imageCollection.images) {
        if (!isStrapiPicture(img)) {
            return false;
        }
    }
    return true;
}
function isValidSplitHeroColumnSingleImage(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { type, singleImage } = obj;
    if (type !== "singleImage") {
        return false;
    }
    if (!singleImage || typeof singleImage !== "object") {
        return false;
    }
    if (!isStrapiPicture(singleImage.image)) {
        console.log("Invalid singleImage found:", JSON.stringify(singleImage, null, 2));
        return false;
    }
    return true;
}
function isValidSplitHeroColumnFloatingImages(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { type, floatingImages } = obj;
    if (type !== "floatingImages") {
        return false;
    }
    if (!floatingImages || typeof floatingImages !== "object") {
        return false;
    }
    if (!Array.isArray(floatingImages.images)) {
        return false;
    }
    for (const img of floatingImages.images) {
        if (!isStrapiPicture(img)) {
            return false;
        }
    }
    return true;
}
function isValidSiteSectionSplitHero(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { __component, leftComponent, rightComponent, centerIfPossible, reverseOnDesktop, reverseOnMobile, } = obj;
    if (__component !== "site-sections.split-hero-section") {
        return false;
    }
    if (leftComponent != undefined && !isValidSplitHeroColumn(leftComponent)) {
        return false;
    }
    if (rightComponent != undefined && !isValidSplitHeroColumn(rightComponent)) {
        return false;
    }
    if (typeof centerIfPossible !== "boolean") {
        return false;
    }
    if (typeof reverseOnDesktop !== "boolean") {
        return false;
    }
    if (typeof reverseOnMobile !== "boolean") {
        return false;
    }
    return true;
}
function isValidHeroTextBlock(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { preheader, header, headerType, subheader, buttonsVisible, buttons, alignment, } = obj;
    if (preheader != undefined && typeof preheader !== "string") {
        return false;
    }
    if (typeof header !== "string" || !isValidHeaderType(headerType)) {
        return false;
    }
    if (subheader != undefined && typeof subheader !== "string") {
        return false;
    }
    if (typeof buttonsVisible !== "boolean") {
        return false;
    }
    if (buttons != undefined) {
        if (!Array.isArray(buttons)) {
            return false;
        }
        for (const button of buttons) {
            if (!isValidCMSButton(button)) {
                return false;
            }
        }
    }
    if (!isValidHeroTextBlockAlignment(alignment)) {
        return false;
    }
    return true;
}
function isValidHeaderType(value) {
    const validHeaderTypes = ["Title", "H1", "H2", "H3", "H4", "H5", "H6"];
    return validHeaderTypes.includes(value);
}
function isValidHeroTextBlockAlignment(value) {
    const validAlignments = ["left", "center", "right"];
    return validAlignments.includes(value);
}
function isValidCMSButtonIcon(value) {
    const validIcons = [
        "chevron-left",
        "chevron-right",
        "share",
        "calendar",
        "search",
    ];
    return validIcons.includes(value);
}
function isValidCMSButton(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { text, icon, isIconOnRightSide, href, target } = obj;
    if (typeof text !== "string" || typeof href !== "string") {
        return false;
    }
    if (icon != undefined && !isValidCMSButtonIcon(icon)) {
        return false;
    }
    if (isIconOnRightSide != undefined &&
        typeof isIconOnRightSide !== "boolean") {
        return false;
    }
    if (!CMSTypes_1.CMSButtonTargets.includes(target)) {
        return false;
    }
    return true;
}
function isValidSiteInfo(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    const { logo, socials } = obj;
    if (!isStrapiPicture(logo)) {
        return false;
    }
    if (socials !== undefined) {
        if (!Array.isArray(socials)) {
            return false;
        }
        for (const social of socials) {
            if (!isValidSocialObj(social)) {
                return false;
            }
        }
    }
    return true;
}
function isValidSiteEvent(event) {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    const isValidISODate = (dateStr) => isoDateRegex.test(dateStr) && !isNaN(Date.parse(dateStr));
    const { id, urlSlug, name, previewImage, dateStart, dateEnd, descriptionShort, descriptionFull, location, organizations, gallery, } = event;
    if (typeof event !== "object")
        return false;
    if (typeof id != "number")
        return false;
    if (typeof urlSlug !== "string")
        return false;
    if (typeof name !== "string")
        return false;
    if (typeof previewImage !== "undefined" && !isStrapiPicture(previewImage))
        return false;
    if (typeof dateStart !== "string")
        return false;
    if (typeof dateEnd !== "string")
        return false;
    if (typeof descriptionShort !== "string")
        return false;
    if (!Array.isArray(descriptionFull))
        return false;
    if (typeof location !== "string")
        return false;
    if (typeof organizations !== "undefined" &&
        (!Array.isArray(organizations) || !organizations.every(isOrganization)))
        return false;
    if (gallery != undefined && typeof gallery != "object")
        return false;
    if (!isValidISODate(dateStart))
        return false;
    if (!isValidISODate(dateEnd))
        return false;
    return true;
}
function isSocialSite(value) {
    return CMSTypes_1.SocialSites.includes(value);
}
function isValidSocialObj(obj) {
    if (!obj || typeof obj !== "object")
        return false;
    if (!isSocialSite(obj.type))
        return false;
    if (typeof obj.url !== "string")
        return false;
    return true;
}
function isPerson(obj) {
    const { name, nameShort, picture, role, roleShort, description, socials } = obj;
    if (!obj || typeof obj !== "object")
        return false;
    if (typeof name !== "string")
        return false;
    if (typeof nameShort !== "string")
        return false;
    if (!isStrapiPicture(picture))
        return false;
    if (typeof role !== "string")
        return false;
    if (typeof roleShort !== "string")
        return false;
    if (typeof description !== "string")
        return false;
    if (!Array.isArray(socials))
        return false;
    if (!socials.every(isValidSocialObj))
        return false;
    return true;
}
function isStrapiPictureFormat(obj) {
    if (!obj || typeof obj !== "object")
        return false;
    if (typeof obj.ext !== "string")
        return false;
    if (typeof obj.url !== "string")
        return false;
    if (typeof obj.width !== "number")
        return false;
    if (typeof obj.height !== "number")
        return false;
    return true;
}
function isStrapiPicture(obj) {
    if (!obj || typeof obj !== "object")
        return false;
    if (typeof obj.id !== "number")
        return false;
    if (typeof obj.url !== "string")
        return false;
    // if (typeof obj.alternativeText !== "string") return false;
    // if (typeof obj.caption !== "string") return false;
    // if (typeof obj.width !== "number") return false;
    // if (typeof obj.height !== "number") return false;
    // if (typeof obj.name !== "string") return false;
    if (obj.formats) {
        if (typeof obj.formats !== "object") {
            return false;
        }
        if (obj.formats.thumbnail && !isStrapiPictureFormat(obj.formats.thumbnail))
            return false;
        if (obj.formats.small && !isStrapiPictureFormat(obj.formats.small))
            return false;
        if (obj.formats.medium && !isStrapiPictureFormat(obj.formats.medium))
            return false;
        if (obj.formats.large && !isStrapiPictureFormat(obj.formats.large))
            return false;
    }
    return true;
}
// Validation function for Organization
function isOrganization(obj) {
    if (!obj || typeof obj != "object") {
        return false;
    }
    const { name, description, logo } = obj;
    if (typeof name != "string") {
        return false;
    }
    else if (typeof description != "string") {
        return false;
    }
    if (logo != undefined && !isStrapiPicture(logo)) {
        return false;
    }
    return true;
}
function isValidQnA(obj) {
    const { videoName, featuredGuests, thumbnail, videoLink, uploadDate, descriptionShort, } = obj;
    if (typeof obj !== "object" || obj === null)
        return false;
    if (typeof videoName !== "string")
        return false;
    if (featuredGuests != undefined && typeof featuredGuests !== "string")
        return false;
    if (thumbnail !== undefined && typeof thumbnail !== "object")
        return false;
    if (typeof videoLink !== "string")
        return false;
    if (typeof uploadDate !== "string")
        return false;
    if (typeof descriptionShort !== "string")
        return false;
    const date = new Date(uploadDate);
    if (isNaN(date.getTime()))
        return false;
    return true;
}
//# sourceMappingURL=CMSCheck.js.map