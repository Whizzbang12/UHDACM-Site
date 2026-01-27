import {
  FeaturedEvent,
  Leadership,
  cmsCollectionSingular,
  cmsCollectionPlural,
  cmsSingleType,
  SiteSection,
  SiteSectionFeaturedEvent,
  SiteSectionLatestQnA,
  SearchSectionType,
  SiteSectionSearch,
  SplitHeroColumnType,
  SplitHeroColumnTypes,
  SplitHeroColumn,
  SplitHeroColumnImageCollection,
  CMSButton,
  CMSButtonIcon,
  HeroTextBlock,
  HeaderType,
  HeroTextBlockAlignment,
  SiteSectionSplitHero,
  SplitHeroColumnTextBlock,
  SplitHeroColumnForm,
  SplitHeroColumnNone,
  cmsSingleTypes,
  cmsCollectionsPlural,
  cmsCollectionsSingular,
  cmsSingleTypePage,
  cmsSingleTypePages,
  CMSButtonTargets,
  SplitHeroColumnSingleImage,
  SplitHeroColumnFloatingImages,
  SiteSectionLeadership,
  SiteInfo,
  EntrySortModes,
  ListingModes,
  Organization,
  StrapiPicture,
  StrapiPictureFormat,
  Person,
  SocialObj,
  SocialSite,
  SocialSites,
  SiteEvent,
  QnA,
} from "./CMSTypes";

export function isValidFeaturedEvent(obj: unknown): obj is FeaturedEvent {
  if (!obj || typeof obj != "object") {
    return false;
  }

  const { previewImageHD, event } = obj as FeaturedEvent;
  if (!event || !isValidSiteEvent(event)) {
    return false;
  }

  if (previewImageHD != undefined && !isStrapiPicture(previewImageHD)) {
    return false;
  }

  return true;
}

export function isValidLeadership(obj: unknown): obj is Leadership {
  if (!obj || typeof obj != "object") {
    return false;
  }

  const { people } = obj as Leadership;
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

export function isCMSCollectionSingular(
  value: any,
): value is cmsCollectionSingular {
  return ["event", "gallery", "organization", "person", "qna"].includes(value);
}

export function isCMSCollectionPlural(
  value: any,
): value is cmsCollectionPlural {
  return ["events", "galleries", "organizations", "people", "qnas"].includes(
    value,
  );
}

export function cmsCollectionSingularToPlural(
  singular: cmsCollectionSingular,
): cmsCollectionPlural | undefined {
  const singulars = ["event", "gallery", "organization", "person", "qna"];
  const plurals = ["events", "galleries", "organizations", "people", "qnas"];
  const index = singulars.indexOf(singular);
  return index !== -1 ? (plurals[index] as cmsCollectionPlural) : undefined;
}

export function cmsCollectionPluralToSingular(
  plural: cmsCollectionPlural,
): cmsCollectionSingular | undefined {
  const index = cmsCollectionsPlural.indexOf(plural);
  return index !== -1
    ? (cmsCollectionsSingular[index] as cmsCollectionSingular)
    : undefined;
}

export function isCMSSingleType(value: any): value is cmsSingleType {
  return cmsSingleTypes.includes(value);
}

export function isCMSSingleTypePage(value: any): value is cmsSingleTypePage {
  return cmsSingleTypePages.includes(value);
}

export function isValidSiteSection(obj: unknown): obj is SiteSection {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component, sectionID } = obj as SiteSection;

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

export function isValidSiteSectionLeadership(
  obj: unknown,
): obj is SiteSectionLeadership {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component } = obj as SiteSectionLeadership;
  if (__component !== "site-sections.leadership-section") {
    return false;
  }

  return true;
}

export function isValidSiteSectionFeaturedEvent(
  obj: unknown,
): obj is SiteSectionFeaturedEvent {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component, header } = obj as SiteSectionFeaturedEvent;
  if (__component !== "site-sections.featured-event") {
    return false;
  }

  if (header != undefined && typeof header !== "string") {
    return false;
  }

  return true;
}

export function isValidSiteSectionLatestQnA(
  obj: unknown,
): obj is SiteSectionLatestQnA {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component, reverseOnDesktop } = obj as SiteSectionLatestQnA;
  if (__component !== "site-sections.latest-qna") {
    return false;
  }
  if (typeof reverseOnDesktop !== "boolean") {
    return false;
  }
  return true;
}

export function isSearchSectionType(value: any): value is SearchSectionType {
  return ["events", "galleries", "qnas"].includes(value);
}

export function isValidSiteSectionSearch(
  obj: unknown,
): obj is SiteSectionSearch {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component, type, header, listingMode, defaultSortingMode } =
    obj as SiteSectionSearch;
  if (__component !== "site-sections.search-section") {
    return false;
  }
  if (!isSearchSectionType(type)) {
    return false;
  }
  if (header != undefined && typeof header !== "string") {
    return false;
  }
  if (!listingMode || !ListingModes.includes(listingMode)) {
    return false;
  }
  if (!defaultSortingMode || !EntrySortModes.includes(defaultSortingMode)) {
    return false;
  }
  return true;
}

export function isSplitHeroColumnType(
  value: any,
): value is SplitHeroColumnType {
  return SplitHeroColumnTypes.includes(value);
}

// Validation function for SplitHeroColumn using conditional statements and destructuring
export function isValidSplitHeroColumnNone(
  obj: unknown,
): obj is SplitHeroColumnNone {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { type } = obj as SplitHeroColumnNone;

  return type === "none";
}

export function isValidSplitHeroColumn(obj: any): obj is SplitHeroColumn {
  if (!obj || typeof obj !== "object") return false;

  const { type } = obj as SplitHeroColumn;

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

export function isValidSplitHeroColumnTextBlock(
  obj: unknown,
): obj is SplitHeroColumnTextBlock {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { type, textBlock } = obj as SplitHeroColumnTextBlock;

  if (type !== "textBlock" || !textBlock) {
    return false;
  }

  return isValidHeroTextBlock(textBlock);
}

export function isValidSplitHeroColumnForm(
  obj: unknown,
): obj is SplitHeroColumnForm {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { type, form } = obj as SplitHeroColumnForm;

  if (type !== "form" || !form || typeof form.iFrameFormUrl !== "string") {
    return false;
  }

  return true;
}

export function isValidSplitHeroColumnImageCollection(
  obj: unknown,
): obj is SplitHeroColumnImageCollection {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { type, imageCollection } = obj as SplitHeroColumnImageCollection;

  if (type !== "imageCollection") {
    return false;
  }

  if (
    !imageCollection ||
    typeof imageCollection !== "object" ||
    !Array.isArray(imageCollection.images)
  ) {
    return false;
  }

  for (const img of imageCollection.images) {
    if (!isStrapiPicture(img)) {
      return false;
    }
  }

  return true;
}

export function isValidSplitHeroColumnSingleImage(
  obj: unknown,
): obj is SplitHeroColumnSingleImage {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { type, singleImage } = obj as SplitHeroColumnSingleImage;

  if (type !== "singleImage") {
    return false;
  }

  if (!singleImage || typeof singleImage !== "object") {
    return false;
  }

  if (!isStrapiPicture(singleImage.image)) {
    console.log(
      "Invalid singleImage found:",
      JSON.stringify(singleImage, null, 2),
    );
    return false;
  }

  return true;
}

export function isValidSplitHeroColumnFloatingImages(
  obj: unknown,
): obj is SplitHeroColumnFloatingImages {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { type, floatingImages } = obj as SplitHeroColumnFloatingImages;

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

export function isValidSiteSectionSplitHero(
  obj: unknown,
): obj is SiteSectionSplitHero {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const {
    __component,
    leftComponent,
    rightComponent,
    centerIfPossible,
    reverseOnDesktop,
    reverseOnMobile,
  } = obj as SiteSectionSplitHero;

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

export function isValidHeroTextBlock(obj: unknown): obj is HeroTextBlock {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const {
    preheader,
    header,
    headerType,
    subheader,
    buttonsVisible,
    buttons,
    alignment,
  } = obj as HeroTextBlock;

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

export function isValidHeaderType(value: any): value is HeaderType {
  const validHeaderTypes = ["Title", "H1", "H2", "H3", "H4", "H5", "H6"];
  return validHeaderTypes.includes(value);
}

export function isValidHeroTextBlockAlignment(
  value: any,
): value is HeroTextBlockAlignment {
  const validAlignments = ["left", "center", "right"];
  return validAlignments.includes(value);
}

export function isValidCMSButtonIcon(value: any): value is CMSButtonIcon {
  const validIcons = [
    "chevron-left",
    "chevron-right",
    "share",
    "calendar",
    "search",
  ];
  return validIcons.includes(value);
}

export function isValidCMSButton(obj: unknown): obj is CMSButton {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { text, icon, isIconOnRightSide, href, target } = obj as CMSButton;

  if (typeof text !== "string" || typeof href !== "string") {
    return false;
  }

  if (icon != undefined && !isValidCMSButtonIcon(icon)) {
    return false;
  }

  if (
    isIconOnRightSide != undefined &&
    typeof isIconOnRightSide !== "boolean"
  ) {
    return false;
  }

  if (!CMSButtonTargets.includes(target)) {
    return false;
  }

  return true;
}

export function isValidSiteInfo(obj: unknown): obj is SiteInfo {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { logo, socials } = obj as SiteInfo;

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

export function isValidSiteEvent(event: any): event is SiteEvent {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  const isValidISODate = (dateStr: string) =>
    isoDateRegex.test(dateStr) && !isNaN(Date.parse(dateStr));

  const {
    id,
    urlSlug,
    name,
    previewImage,
    dateStart,
    dateEnd,
    descriptionShort,
    descriptionFull,
    location,
    organizations,
    gallery,
  } = event as SiteEvent;

  if (typeof event !== "object") return false;
  if (typeof id != "number") return false;
  if (typeof urlSlug !== "string") return false;
  if (typeof name !== "string") return false;
  if (typeof previewImage !== "undefined" && !isStrapiPicture(previewImage))
    return false;
  if (typeof dateStart !== "string") return false;
  if (typeof dateEnd !== "string") return false;
  if (typeof descriptionShort !== "string") return false;
  if (!Array.isArray(descriptionFull)) return false;
  if (typeof location !== "string") return false;
  if (
    typeof organizations !== "undefined" &&
    (!Array.isArray(organizations) || !organizations.every(isOrganization))
  )
    return false;
  if (gallery != undefined && typeof gallery != "object") return false;
  if (!isValidISODate(dateStart)) return false;
  if (!isValidISODate(dateEnd)) return false;
  return true;
}

export function isSocialSite(value: any): value is SocialSite {
  return SocialSites.includes(value);
}

export function isValidSocialObj(obj: any): obj is SocialObj {
  if (!obj || typeof obj !== "object") return false;
  if (!isSocialSite(obj.type)) return false;
  if (typeof obj.url !== "string") return false;
  return true;
}

export function isPerson(obj: any): obj is Person {
  const { name, nameShort, picture, role, roleShort, description, socials } =
    obj as Person;
  if (!obj || typeof obj !== "object") return false;
  if (typeof name !== "string") return false;
  if (typeof nameShort !== "string") return false;
  if (!isStrapiPicture(picture)) return false;
  if (typeof role !== "string") return false;
  if (typeof roleShort !== "string") return false;
  if (typeof description !== "string") return false;
  if (!Array.isArray(socials)) return false;
  if (!socials.every(isValidSocialObj)) return false;
  return true;
}

export function isStrapiPictureFormat(obj: any): obj is StrapiPictureFormat {
  if (!obj || typeof obj !== "object") return false;
  if (typeof obj.ext !== "string") return false;
  if (typeof obj.url !== "string") return false;
  if (typeof obj.width !== "number") return false;
  if (typeof obj.height !== "number") return false;
  return true;
}

export function isStrapiPicture(obj: any): obj is StrapiPicture {
  if (!obj || typeof obj !== "object") return false;
  if (typeof obj.id !== "number") return false;
  if (typeof obj.url !== "string") return false;
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
export function isOrganization(obj: any): obj is Organization {
  if (!obj || typeof obj != "object") {
    return false;
  }

  const { name, description, logo } = obj as Organization;

  if (typeof name != "string") {
    return false;
  } else if (typeof description != "string") {
    return false;
  }
  if (logo != undefined && !isStrapiPicture(logo)) {
    return false;
  }
  return true;
}

export function isValidQnA(obj: any): obj is QnA {
  const {
    videoName,
    featuredGuests,
    thumbnail,
    videoLink,
    uploadDate,
    descriptionShort,
  } = obj as QnA;
  if (typeof obj !== "object" || obj === null) return false;
  if (typeof videoName !== "string") return false;
  if (featuredGuests != undefined && typeof featuredGuests !== "string")
    return false;
  if (thumbnail !== undefined && typeof thumbnail !== "object") return false;
  if (typeof videoLink !== "string") return false;
  if (typeof uploadDate !== "string") return false;
  if (typeof descriptionShort !== "string") return false;
  const date = new Date(uploadDate);
  if (isNaN(date.getTime())) return false;
  return true;
}
