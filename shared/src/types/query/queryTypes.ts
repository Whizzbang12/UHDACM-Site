import { VectorDBPageMetadataAction } from "../vectorDB/vectorDBTypes";

export interface QueryResponse {
  response: string;
  relevant_actions: VectorDBPageMetadataAction[];
};