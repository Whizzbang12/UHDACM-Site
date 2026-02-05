import { cmsCollectionPlural, cmsCollectionSingular, cmsCollectionSingulars, fetchableCMSCollection, StrapiPicture } from "./CMSTypes";
/**
 *
 * @param cmsURL
 * @param path
 * @param params
 * @param additionalTags
 * @returns
 */
export declare function buildCMSFetchURL(cmsURL: string, path: fetchableCMSCollection, params?: Record<string, any>, additionalTags?: fetchableCMSCollection[] | "any"): {
    url?: never;
    dependencyTags?: never;
} | {
    url: string;
    dependencyTags: cmsCollectionSingulars[];
};
export declare const cmsPageFetchParams: {
    readonly "populate[0]": "sections";
    readonly "populate[1]": "sections.type";
    readonly "populate[2]": "sections.leftComponent";
    readonly "populate[3]": "sections.rightComponent";
    readonly "populate[4]": "sections.leftComponent.form";
    readonly "populate[5]": "sections.rightComponent.form";
    readonly "populate[6]": "sections.leftComponent.textBlock";
    readonly "populate[7]": "sections.rightComponent.textBlock";
    readonly "populate[8]": "sections.leftComponent.textBlock.buttons";
    readonly "populate[9]": "sections.rightComponent.textBlock.buttons";
    readonly "populate[10]": "sections.leftComponent.imageCollection";
    readonly "populate[11]": "sections.rightComponent.imageCollection";
    readonly "populate[12]": "sections.leftComponent.imageCollection.images";
    readonly "populate[13]": "sections.rightComponent.imageCollection.images";
    readonly "populate[14]": "sections.leftComponent.singleImage";
    readonly "populate[15]": "sections.rightComponent.singleImage";
    readonly "populate[16]": "sections.leftComponent.singleImage.image";
    readonly "populate[17]": "sections.rightComponent.singleImage.image";
    readonly "populate[18]": "sections.leftComponent.floatingImages";
    readonly "populate[19]": "sections.rightComponent.floatingImages";
    readonly "populate[20]": "sections.leftComponent.floatingImages.images";
    readonly "populate[21]": "sections.rightComponent.floatingImages.images";
};
export declare function cmsCollectionSingularToPlural(singular: cmsCollectionSingular): cmsCollectionPlural | undefined;
export declare function cmsCollectionPluralToSingular(plural: cmsCollectionPlural): cmsCollectionSingular | undefined;
/**
 * Given strapi picture, try to get the URL for a specific format
 * auto formats the url using `ProduceCMSResourceURL`.
 * @param img
 * @param format
 * @returns
 */
export declare function TryGetImageFormatPath(img: StrapiPicture, format: keyof StrapiPicture["formats"], cmsUrl: string): string | undefined;
//# sourceMappingURL=CMSFuncs.d.ts.map