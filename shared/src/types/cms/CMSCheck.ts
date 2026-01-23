import { cmsCollectionPlural, cmsCollectionSingular, cmsSingleType, cmsSingleTypePage, cmsSingleTypePages, cmsSingleTypes } from "./CMSTypes";

export function isCMSCollectionSingular(
  value: any
): value is cmsCollectionSingular {
  return [
    "event",
    "gallery",
    "organization",
    "person",
    "qna",
  ].includes(value);
}

export function isCMSCollectionPlural(
  value: any
): value is cmsCollectionPlural {
  return [
    "events",
    "galleries",
    "organizations",
    "people",
    "qnas",
  ].includes(value);
}

export function isCMSSingleType(value: any): value is cmsSingleType {
  return cmsSingleTypes.includes(value);
};


export function isCMSSingleTypePage(value: any): value is cmsSingleTypePage {
  return cmsSingleTypePages.includes(value);
};