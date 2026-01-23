import { objectToUrlParams } from "../../tools";
import {
  isCMSCollectionPlural,
  isCMSSingleType,
  isCMSSingleTypePage,
} from "./CMSCheck";
import {
  cmsCollectionPlural,
  cmsCollectionSingular,
  cmsCollectionSingulars,
  cmsCollectionsPlural,
  cmsCollectionsSingular,
  cmsSingleTypePage,
  fetchableCMSCollection,
} from "./CMSTypes";

/**
 *
 * @param cmsURL
 * @param path
 * @param params
 * @param additionalTags
 * @returns
 */
export function buildCMSFetchURL(
  cmsURL: string,
  path: fetchableCMSCollection,
  params?: Record<string, any>,
  additionalTags?: fetchableCMSCollection[] | "any",
) {
  let collectionTag: cmsCollectionSingulars | undefined =
    convertFetchableToSingular(path);

  if (!collectionTag) {
    console.log("failed to find collection tag", path);
    // this should never happen
    return {};
  }

  const dependencyTags: cmsCollectionSingulars[] = [collectionTag];
  if (additionalTags) {
    if (Array.isArray(additionalTags)) {
      for (const tag of additionalTags) {
        const singularTag = convertFetchableToSingular(tag);
        if (singularTag) {
          dependencyTags.push(singularTag);
        }
      }
    } else if (additionalTags === "any") {
      // If additionalTags is "any", we can add all possible tags
      dependencyTags.push("any");
    }
  }

  const urlParams = params ? objectToUrlParams(params) : undefined;
  const url = `${cmsURL}/api/${path}${urlParams ? `?${urlParams}` : ""}`;
  return { url, dependencyTags };
}

export function buildCMSFetchPageURL(cmsURL: string, page: cmsSingleTypePage) {
  const populateList: string[] = [
    "sections",
    "sections.type",
    "sections.leftComponent",
    "sections.rightComponent",
    "sections.leftComponent.form",
    "sections.rightComponent.form",
    "sections.leftComponent.textBlock",
    "sections.rightComponent.textBlock",
    "sections.leftComponent.textBlock.buttons",
    "sections.rightComponent.textBlock.buttons",

    "sections.leftComponent.imageCollection",
    "sections.rightComponent.imageCollection",
    "sections.leftComponent.imageCollection.images",
    "sections.rightComponent.imageCollection.images",

    "sections.leftComponent.singleImage",
    "sections.rightComponent.singleImage",
    "sections.leftComponent.singleImage.image",
    "sections.rightComponent.singleImage.image",

    "sections.leftComponent.floatingImages",
    "sections.rightComponent.floatingImages",
    "sections.leftComponent.floatingImages.images",
    "sections.rightComponent.floatingImages.images",
  ];

  const params: { [key: string]: string } = {};
  for (const i in populateList) {
    params[`populate[${i}]`] = `${populateList[i]}`;
  }

  return buildCMSFetchURL(cmsURL, page, params);
}

const convertFetchableToSingular = (
  path: fetchableCMSCollection,
): cmsCollectionSingulars | undefined => {
  if (isCMSCollectionPlural(path)) {
    return cmsCollectionPluralToSingular(path);
  }
  if (isCMSSingleType(path)) {
    return path;
  }
  if (isCMSSingleTypePage(path)) {
    return path;
  }
  return undefined;
};

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
