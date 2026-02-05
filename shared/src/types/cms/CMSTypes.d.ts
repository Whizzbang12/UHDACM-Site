export type fetchableCMSCollection = cmsCollectionPlural | cmsSingleType | cmsSingleTypePage;
export type cmsCollectionSingulars = cmsCollectionSingular | cmsSingleType | cmsSingleTypePage | 'any';
export declare const cmsCollectionsSingular: readonly ["event", "gallery", "organization", "person", "qna"];
export declare const cmsCollectionsPlural: readonly ["events", "galleries", "organizations", "people", "qnas"];
export type cmsCollectionSingular = (typeof cmsCollectionsSingular)[number];
export type cmsCollectionPlural = (typeof cmsCollectionsPlural)[number];
export declare const cmsSingleTypes: readonly ["featured-event", "leadership", "site-info"];
export type cmsSingleType = (typeof cmsSingleTypes)[number];
export declare const cmsSingleTypePages: readonly ["page-about", "page-contact", "page-events", "page-home", "page-join", "page-media", "page-galleries", "page-qnas"];
export type cmsSingleTypePage = (typeof cmsSingleTypePages)[number];
export interface FeaturedEvent {
    previewImageHD?: string;
    event: SiteEvent;
}
export interface Leadership {
    people: Person[];
}
declare const sectionCMSNames: readonly ["site-sections.leadership-section", "site-sections.split-hero-section", "site-sections.search-section", "site-sections.featured-event", "site-sections.latest-qna"];
export type cmsSectionName = (typeof sectionCMSNames)[number];
export interface SiteSection {
    __component: cmsSectionName;
    id: number;
    sectionID?: string;
}
export interface SiteSectionLeadership extends SiteSection {
    __component: "site-sections.leadership-section";
}
export interface SiteSectionFeaturedEvent extends SiteSection {
    __component: "site-sections.featured-event";
    header?: string;
}
export interface SiteSectionLatestQnA extends SiteSection {
    __component: "site-sections.latest-qna";
    reverseOnDesktop: boolean;
}
declare const SearchSectionTypes: readonly ["events", "galleries", "qnas"];
export type SearchSectionType = (typeof SearchSectionTypes)[number];
export interface SiteSectionSearch extends SiteSection {
    __component: "site-sections.search-section";
    type: SearchSectionType;
    header?: string;
    listingMode: ListingMode;
    defaultSortingMode: EntrySortMode;
}
export declare const SplitHeroColumnTypes: readonly ["textBlock", "form", "imageCollection", "singleImage", "floatingImages", "none"];
export type SplitHeroColumnType = (typeof SplitHeroColumnTypes)[number];
export interface SplitHeroColumn {
    type: SplitHeroColumnType;
}
export interface SplitHeroColumnImageCollection extends SplitHeroColumn {
    type: "imageCollection";
    imageCollection: {
        images: StrapiPicture[];
    };
}
export interface SplitHeroColumnSingleImage extends SplitHeroColumn {
    type: "singleImage";
    singleImage: {
        image: StrapiPicture;
    };
}
export interface SplitHeroColumnFloatingImages extends SplitHeroColumn {
    type: "floatingImages";
    floatingImages: {
        images: StrapiPicture[];
    };
}
export declare const CMSButtonIcons: readonly ["chevron-left", "chevron-right", "share", "calendar", "search"];
export type CMSButtonIcon = (typeof CMSButtonIcons)[number];
export declare const CMSButtonTargets: readonly ["_blank", "_self", "_parent", "_top"];
export type CMSButtonTarget = (typeof CMSButtonTargets[number]);
export interface CMSButton {
    text: string;
    icon?: CMSButtonIcon;
    isIconOnRightSide?: boolean;
    href: string;
    target: CMSButtonTarget;
}
export declare const HeaderTypes: readonly ["Title", "H1", "H2", "H3", "H4", "H5", "H6"];
export type HeaderType = (typeof HeaderTypes)[number];
export declare const HeroTextBlockAlignments: readonly ["left", "center", "right"];
export type HeroTextBlockAlignment = (typeof HeroTextBlockAlignments)[number];
export interface HeroTextBlock {
    preheader?: string;
    header: string;
    headerType: HeaderType;
    subheader?: string;
    buttonsVisible: boolean;
    buttons?: CMSButton[];
    alignment: HeroTextBlockAlignment;
}
export interface SplitHeroColumnTextBlock extends SplitHeroColumn {
    type: "textBlock";
    textBlock: HeroTextBlock;
}
export interface SplitHeroColumnForm extends SplitHeroColumn {
    type: "form";
    form: {
        iFrameFormUrl: string;
    };
}
export interface SplitHeroColumnNone extends SplitHeroColumn {
    type: "none";
}
export interface SiteSectionSplitHero extends SiteSection {
    __component: "site-sections.split-hero-section";
    leftComponent?: SplitHeroColumn;
    rightComponent?: SplitHeroColumn;
    centerIfPossible: boolean;
    reverseOnDesktop: boolean;
    reverseOnMobile: boolean;
}
export interface SitePage {
    sections: SiteSection[];
}
export interface SiteInfo {
    logo: StrapiPicture;
    socials?: SocialObj[];
}
import { BlocksContent } from '@strapi/blocks-react-renderer';
import { ObjectUnknown } from "../general/generalTypes";
export type SiteEvent = {
    id: number;
    urlSlug: string;
    name: string;
    previewImage: StrapiPicture | undefined;
    dateStart: string;
    dateEnd: string;
    descriptionShort: string;
    descriptionFull: BlocksContent;
    location: string;
    gallery?: ObjectUnknown;
    organizations?: Organization[];
};
export type SocialSite = "linkedin" | "x" | "facebook" | "instagram" | "personal_site" | "github" | "youtube" | "discord";
export declare const SocialSites: SocialSite[];
export type SocialObj = {
    type: SocialSite;
    url: string;
};
export type Person = {
    name: string;
    nameShort: string;
    picture: StrapiPicture | undefined;
    role: string;
    roleShort: string;
    description: string;
    socials: SocialObj[];
};
export type StrapiPictureFormat = {
    ext: string;
    url: string;
    width: number;
    height: number;
};
export type StrapiPicture = {
    id: number;
    url: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    name: string;
    formats: {
        thumbnail?: StrapiPictureFormat;
        small?: StrapiPictureFormat;
        medium?: StrapiPictureFormat;
        large?: StrapiPictureFormat;
    };
};
export type Organization = {
    name: string;
    description: string;
    logo: StrapiPicture | undefined;
};
export declare const ListingModes: readonly ["on", "after", "before"];
export type ListingMode = typeof ListingModes[number];
export declare const EntrySortModes: readonly ["ascending", "descending"];
export type EntrySortMode = typeof EntrySortModes[number];
export type QnA = {
    videoName: string;
    featuredGuests?: string;
    thumbnail?: StrapiPicture;
    videoLink: string;
    uploadDate: string;
    descriptionShort: string;
};
export {};
//# sourceMappingURL=CMSTypes.d.ts.map