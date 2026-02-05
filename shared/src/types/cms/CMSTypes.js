"use strict";
// TODO: This is a freaking mess, we'll have to clean this up soon.
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrySortModes = exports.ListingModes = exports.SocialSites = exports.HeroTextBlockAlignments = exports.HeaderTypes = exports.CMSButtonTargets = exports.CMSButtonIcons = exports.SplitHeroColumnTypes = exports.cmsSingleTypePages = exports.cmsSingleTypes = exports.cmsCollectionsPlural = exports.cmsCollectionsSingular = void 0;
// BE SURE TO KEEP SINGULAR IN SYNC WITH PLURAL (e.g.: singular[0] = event, and plural[0] = events)
exports.cmsCollectionsSingular = [
    "event",
    "gallery",
    "organization",
    "person",
    "qna",
];
exports.cmsCollectionsPlural = [
    "events",
    "galleries",
    "organizations",
    "people",
    "qnas",
];
exports.cmsSingleTypes = ["featured-event", "leadership", "site-info"];
exports.cmsSingleTypePages = [
    "page-about",
    "page-contact",
    "page-events",
    "page-home",
    "page-join",
    "page-media",
    "page-galleries",
    "page-qnas"
];
const sectionCMSNames = [
    "site-sections.leadership-section",
    "site-sections.split-hero-section",
    "site-sections.search-section",
    "site-sections.featured-event",
    "site-sections.latest-qna",
];
const SearchSectionTypes = ["events", "galleries", "qnas"];
exports.SplitHeroColumnTypes = [
    "textBlock",
    "form",
    "imageCollection",
    "singleImage",
    "floatingImages",
    "none",
];
exports.CMSButtonIcons = [
    "chevron-left",
    "chevron-right",
    "share",
    "calendar",
    "search",
];
exports.CMSButtonTargets = ['_blank', '_self', '_parent', '_top'];
exports.HeaderTypes = [
    "Title",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
];
exports.HeroTextBlockAlignments = ["left", "center", "right"];
exports.SocialSites = [
    "linkedin",
    "x",
    "facebook",
    "instagram",
    "personal_site",
    "github",
    "youtube",
    "discord"
];
exports.ListingModes = ["on", "after", "before"];
exports.EntrySortModes = ["ascending", "descending"];
//# sourceMappingURL=CMSTypes.js.map