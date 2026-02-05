import { cmsSingleTypePage, QnA, SiteEvent } from "../cms/CMSTypes";
import { DBTicket } from "../ticket/ticketTypes";
export interface VectorDBBaseMetadata {
    collection: DBTicket['collection'];
}
export interface VectorDBPageMetadataAction {
    label: string;
    href: string;
}
export interface VectorDBPageMetadata extends VectorDBBaseMetadata {
    collection: cmsSingleTypePage;
    url: string;
    actions?: VectorDBPageMetadataAction[];
}
export interface VectorDBEventMetadata extends VectorDBBaseMetadata {
    collection: 'event';
    event: PartialSiteEvent;
}
export interface PartialSiteEvent {
    url: SiteEvent['urlSlug'];
    name: SiteEvent['name'];
    previewImageUrl?: string;
    dateStart: SiteEvent['dateStart'];
    dateEnd: SiteEvent['dateEnd'];
    descriptionShort: SiteEvent['descriptionShort'];
    location: SiteEvent['location'];
    hasGallery: boolean;
    organizationNames?: string[];
}
export interface VectorDBOrganizationMetadata extends VectorDBBaseMetadata {
}
export interface VectorDBPersonMetadata extends VectorDBBaseMetadata {
}
export interface VectorDBQnAMetadata extends VectorDBBaseMetadata {
    QnA: QnA;
}
export interface VectorDBFeaturedEventMetadata extends VectorDBBaseMetadata {
    event: PartialSiteEvent;
}
export interface VectorDBLeadershipMetadata extends VectorDBBaseMetadata {
    socialUrls?: string[];
}
export interface VectorDBSiteInfoMetadata extends VectorDBBaseMetadata {
    socialUrls?: string[];
}
export interface SafeMetadata {
    [key: string]: string | boolean | number;
}
//# sourceMappingURL=vectorDBTypes.d.ts.map