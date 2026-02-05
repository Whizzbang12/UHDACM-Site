import { cmsCollectionSingulars } from "../cms/CMSTypes";
export interface DBTicket {
    collection: Exclude<cmsCollectionSingulars, 'any'>;
    tries: number;
    failed: boolean;
    id?: string;
}
export declare const MaxTicketRetries = 5;
//# sourceMappingURL=ticketTypes.d.ts.map