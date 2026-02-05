import { SiteEvent } from "../cms/CMSTypes";
import { PartialSiteEvent, SafeMetadata, VectorDBBaseMetadata } from "./vectorDBTypes";
export declare const convertSiteEventToPartialSiteEvent: (event: SiteEvent, cmsURL: string, siteURL: string) => PartialSiteEvent;
export declare const convertVectorDBMetadataToSafeMetadata: (obj: VectorDBBaseMetadata) => SafeMetadata;
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
export declare const convertSafeMetadataToVectorDBMetadata: (obj: Object) => VectorDBBaseMetadata;
//# sourceMappingURL=vectorDBFuncs.d.ts.map