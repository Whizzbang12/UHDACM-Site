// TODO: This is a freaking mess, we'll have to clean this up soon.

export type fetchableCMSCollection =
  | cmsCollectionPlural
  | cmsSingleType
  | cmsSingleTypePage;
export type cmsCollectionSingulars =
  | cmsCollectionSingular
  | cmsSingleType
  | cmsSingleTypePage | 'any';


// BE SURE TO KEEP SINGULAR IN SYNC WITH PLURAL (e.g.: singular[0] = event, and plural[0] = events)
export const cmsCollectionsSingular = [
  "event",
  "gallery",
  "organization",
  "person",
  "qna",
] as const;
export const cmsCollectionsPlural = [
  "events",
  "galleries",
  "organizations",
  "people",
  "qnas",
] as const;

export type cmsCollectionSingular = (typeof cmsCollectionsSingular)[number];
export type cmsCollectionPlural = (typeof cmsCollectionsPlural)[number];


export const cmsSingleTypes = ["featured-event", "leadership", "site-info"] as const;
export type cmsSingleType = (typeof cmsSingleTypes)[number];

export const cmsSingleTypePages = [
  "page-about",
  "page-contact",
  "page-events",
  "page-home",
  "page-join",
  "page-media",
  "page-galleries",
  "page-qnas"
] as const;
export type cmsSingleTypePage = (typeof cmsSingleTypePages)[number];