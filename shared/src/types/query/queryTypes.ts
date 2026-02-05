import { VectorDBPageMetadataAction } from "../vectorDB/vectorDBTypes";

interface AIQuickReply {
  label: string,
  value: string
};

export interface QueryResponse {
  response: string;
  relevant_actions: VectorDBPageMetadataAction[];
  quick_replies: AIQuickReply[]
};

export interface QueryMessage extends QueryResponse {
  sender: "user" | "bot";
  timestamp: string;
}