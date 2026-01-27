import { cmsCollectionSingulars } from "../cms/CMSTypes";

export interface DBTicket {
  collection: Exclude<cmsCollectionSingulars, 'any'>,
  tries: number,
  failed: boolean,
  id?: string
};

export const MaxTicketRetries = 5;