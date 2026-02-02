import {
  VectorDBBaseMetadata,
  VectorDBPageMetadata,
  VectorDBPageMetadataAction,
  VectorDBEventMetadata,
  PartialSiteEvent,
  VectorDBOrganizationMetadata,
  VectorDBPersonMetadata,
  VectorDBQnAMetadata,
  VectorDBLeadershipMetadata,
  VectorDBSiteInfoMetadata,
  VectorDBFeaturedEventMetadata,
} from "./vectorDBTypes"; // adjust import as needed

// Helper for type checks
function isObject(val: unknown): val is Object {
  return typeof val === "object" && val !== null;
}

export function checkVectorDBBaseMetadata(
  param: unknown,
): asserts param is VectorDBBaseMetadata {
  if (!isObject(param))
    throw new Error("VectorDBBaseMetadata: param is not an object");
  const { collection } = param as VectorDBBaseMetadata;
  if (typeof collection !== "string")
    throw new Error("VectorDBBaseMetadata: collection must be a string");
}

export function checkVectorDBPageMetadataAction(
  param: unknown,
): asserts param is VectorDBPageMetadataAction {
  if (!isObject(param))
    throw new Error("VectorDBPageMetadataAction: param is not an object");
  const { label, href } = param as VectorDBPageMetadataAction;
  if (typeof label !== "string")
    throw new Error("VectorDBPageMetadataAction: label must be a string");
  if (typeof href !== "string")
    throw new Error("VectorDBPageMetadataAction: href must be a string");
}

export function checkVectorDBPageMetadata(
  param: unknown,
): asserts param is VectorDBPageMetadata {
  if (!isObject(param))
    throw new Error("VectorDBPageMetadata: param is not an object");
  const { collection, url, actions } = param as VectorDBPageMetadata;
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

export function checkPartialSiteEvent(
  param: unknown,
): asserts param is PartialSiteEvent {
  if (!isObject(param))
    throw new Error("PartialSiteEvent: param is not an object");
  const {
    url,
    name,
    previewImageUrl,
    dateStart,
    dateEnd,
    descriptionShort,
    location,
    hasGallery,
    organizationNames,
  } = param as PartialSiteEvent;
  if (typeof url !== "string")
    throw new Error("PartialSiteEvent: url must be a string");
  if (typeof name !== "string")
    throw new Error("PartialSiteEvent: name must be a string");
  if (previewImageUrl !== undefined && typeof previewImageUrl !== "string")
    throw new Error(
      "PartialSiteEvent: previewImageUrl must be a string if defined",
    );
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
    throw new Error(
      "PartialSiteEvent: organizationNames must be an array of strings if defined",
    );
}

export function checkVectorDBEventMetadata(
  param: unknown,
): asserts param is VectorDBEventMetadata {
  if (!isObject(param))
    throw new Error("VectorDBEventMetadata: param is not an object");
  const { collection, event } = param as VectorDBEventMetadata;
  if (collection !== "event")
    throw new Error('VectorDBEventMetadata: collection must be "event"');
  checkPartialSiteEvent(event);
}

export function checkVectorDBOrganizationMetadata(
  param: unknown,
): asserts param is VectorDBOrganizationMetadata {
  if (!isObject(param))
    throw new Error("VectorDBOrganizationMetadata: param is not an object");
  const { collection } = param as VectorDBOrganizationMetadata;
  if (typeof collection !== "string")
    throw new Error(
      "VectorDBOrganizationMetadata: collection must be a string",
    );
}

export function checkVectorDBPersonMetadata(
  param: unknown,
): asserts param is VectorDBPersonMetadata {
  if (!isObject(param))
    throw new Error("VectorDBPersonMetadata: param is not an object");
  const { collection } = param as VectorDBPersonMetadata;
  if (typeof collection !== "string")
    throw new Error("VectorDBPersonMetadata: collection must be a string");
}

export function checkVectorDBQnAMetadata(
  param: unknown,
): asserts param is VectorDBQnAMetadata {
  if (!isObject(param))
    throw new Error("VectorDBQnAMetadata: param is not an object");
  const { collection, QnA } = param as VectorDBQnAMetadata;
  if (typeof collection !== "string")
    throw new Error("VectorDBQnAMetadata: collection must be a string");
  if (typeof QnA !== "object" || QnA === null)
    throw new Error("VectorDBQnAMetadata: QnA must be an object");
}

export function checkVectorDBFeaturedEventMetadata(
  param: unknown,
): asserts param is VectorDBFeaturedEventMetadata {
  if (!isObject(param))
    throw new Error("VectorDBFeaturedEventMetadata: param is not an object");
  const { collection, Event } = param as any;
  if (typeof collection !== "string")
    throw new Error(
      "VectorDBFeaturedEventMetadata: collection must be a string",
    );
  checkPartialSiteEvent(Event);
}

export function checkVectorDBLeadershipMetadata(
  param: unknown,
): asserts param is VectorDBLeadershipMetadata {
  if (!isObject(param))
    throw new Error("VectorDBLeadershipMetadata: param is not an object");
  const { collection, socialUrls } = param as VectorDBLeadershipMetadata;
  if (typeof collection !== "string")
    throw new Error("VectorDBLeadershipMetadata: collection must be a string");
  if (socialUrls !== undefined && !Array.isArray(socialUrls))
    throw new Error(
      "VectorDBLeadershipMetadata: socialUrls must be an array of strings if defined",
    );
}

export function checkVectorDBSiteInfoMetadata(
  param: unknown,
): asserts param is VectorDBSiteInfoMetadata {
  if (!isObject(param))
    throw new Error("VectorDBSiteInfoMetadata: param is not an object");
  const { collection, socialUrls } = param as VectorDBSiteInfoMetadata;
  if (typeof collection !== "string")
    throw new Error("VectorDBSiteInfoMetadata: collection must be a string");
  if (socialUrls !== undefined && !Array.isArray(socialUrls))
    throw new Error(
      "VectorDBSiteInfoMetadata: socialUrls must be an array of strings if defined",
    );
}
