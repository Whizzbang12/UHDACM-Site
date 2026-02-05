import { checkVectorDBPageMetadataAction } from "../vectorDB/vectorDBCheck";
import { QueryMessage, QueryResponse } from "./queryTypes";

export function checkQueryResponse(obj: unknown): asserts obj is QueryResponse {
  if (!obj || typeof obj != "object") {
    throw new Error("Input is not an object");
  }

  const { response, relevant_actions, quick_replies } = obj as QueryResponse;
  if (typeof response != "string") {
    throw new Error("response is not a string");
  }

  if (!Array.isArray(relevant_actions)) {
    throw new Error("relevant_actions is not an array");
  }

  for (let i = 0; i < relevant_actions.length; i++) {
    const action = relevant_actions[i];
    try {
      checkVectorDBPageMetadataAction(action);
    } catch (e) {
      throw new Error(
        `Item ${i} is not a VectorDBPageMetadataAction: ${(e as Error).message}`,
      );
    }
  }

  if (!Array.isArray(quick_replies)) {
    throw new Error("quick_replies is not an array");
  }

  for (const [i, reply] of quick_replies.entries()) {
    if (typeof reply.label !== "string") {
      throw new Error(`quick_replies[${i}].label is not a string`);
    }
    if (typeof reply.value !== "string") {
      throw new Error(`quick_replies[${i}].value is not a string`);
    }
  }
}

export function checkQueryMessage(obj: unknown): asserts obj is QueryMessage {
  if (!obj || typeof obj !== "object") {
    throw new Error("Input is not an object");
  }

  checkQueryResponse(obj);

  const { sender, timestamp } = obj as QueryMessage;

  if (sender !== "user" && sender !== "bot") {
    throw new Error("sender is not 'user' or 'bot'");
  }

  if (isNaN(Date.parse(timestamp))) {
    throw new Error("timestamp is not a valid Date string");
  }
}
