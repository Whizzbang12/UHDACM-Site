
import { checkVectorDBPageMetadataAction } from "../vectorDB/vectorDBCheck";
import { VectorDBPageMetadataAction } from "../vectorDB/vectorDBTypes";

export interface QueryResponse {
  response: string;
  relevant_actions: VectorDBPageMetadataAction[];
};

export function checkQueryResponse(obj: unknown): asserts obj is QueryResponse {
  if (!obj || typeof(obj) != 'object') {
    throw new Error('Input is not an object');
  }

  const { response, relevant_actions } = obj as QueryResponse;
  if (typeof(response) != 'string') {
    throw new Error("response is not a string");
  }

  if (!Array.isArray(relevant_actions))  {
    throw new Error("relevant_actions is not an array");
  }

  for (let i = 0; i < relevant_actions.length; i++) {
    const action = relevant_actions[i];
    try {
      checkVectorDBPageMetadataAction(action);
    } catch (e) {
      throw new Error(`Item ${i} is not a VectorDBPageMetadataAction: ${(e as Error).message}`);
    }
  }
}