import { cmsSingleTypePage, QnA, SiteEvent } from "../cms/CMSTypes";
import { DBTicket } from "../ticket/ticketTypes";


export interface VectorDBBaseMetadata {
  collection: DBTicket['collection'],
};

export interface VectorDBPageMetadataAction {
  label: string,
  href: string
};



// done
// "page-about"
// "page-contact"
// "page-events"
// "page-home"
// "page-join"
// "page-media"
// "page-galleries"
// "page-qnas"
// chunked per section on a page
export interface VectorDBPageMetadata extends VectorDBBaseMetadata {
  collection: cmsSingleTypePage,
  url: string,
  actions?: VectorDBPageMetadataAction[]
};


// "event" done
// "gallery" skipped, handled by event
export interface VectorDBEventMetadata extends VectorDBBaseMetadata {
  collection: 'event',
  event: PartialSiteEvent
};

// partial site event is lighter weight than SiteEvent, and can be used in LLM
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
};


// "organization" (empty for now)
export interface VectorDBOrganizationMetadata extends VectorDBBaseMetadata {}

// "person" (skipped, person is not publically accessible, but "leadership" is.)
export interface VectorDBPersonMetadata extends VectorDBBaseMetadata {};

// "qna"
export interface VectorDBQnAMetadata extends VectorDBBaseMetadata {
  QnA: QnA
};


// "featured-event"
export interface VectorDBFeaturedEventMetadata extends VectorDBBaseMetadata {
  event: PartialSiteEvent
};

// "leadership" (chunked per user)
export interface VectorDBLeadershipMetadata extends VectorDBBaseMetadata {
  socialUrls?: string[],
};

// "site-info"
export interface VectorDBSiteInfoMetadata extends VectorDBBaseMetadata {
  socialUrls?: string[],
};

export interface SafeMetadata {
  [key: string]: string | boolean | number;
}
