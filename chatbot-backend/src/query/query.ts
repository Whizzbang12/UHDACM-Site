import { ObjectUnknown } from "@shared/types/general/generalTypes";
import { queryCollection } from "../context/context";
import { handleQuestion } from "../langchain/langchain";
import {
  checkVectorDBEventMetadata,
  checkVectorDBFeaturedEventMetadata,
  checkVectorDBLeadershipMetadata,
  checkVectorDBOrganizationMetadata,
  checkVectorDBPageMetadata,
  checkVectorDBPersonMetadata,
  checkVectorDBQnAMetadata,
  checkVectorDBSiteInfoMetadata,
} from "@shared/types/vectorDB/vectorDBCheck";
import {
  VectorDBBaseMetadata,
  VectorDBPageMetadataAction,
} from "@shared/types/vectorDB/vectorDBTypes";
import { LogMessage } from "../log/log";
import { QueryResponse } from "@shared/types/query/queryTypes";

const produceDocumentObject = (
  document: string,
  metadata: VectorDBBaseMetadata,
) => {
  const documentObject: ObjectUnknown = {};
  documentObject.content = document;

  try {
    checkVectorDBPageMetadata(metadata);
    documentObject.url = metadata.url;
    documentObject.actions = metadata.actions;
    return documentObject;
  } catch {}

  try {
    checkVectorDBEventMetadata(metadata);
    documentObject.event = metadata.event;
    return documentObject;
  } catch {}

  try {
    checkVectorDBOrganizationMetadata(metadata);
    return documentObject;
  } catch {}

  try {
    checkVectorDBPersonMetadata(metadata);
    return documentObject;
  } catch {}

  try {
    checkVectorDBQnAMetadata(metadata);
    documentObject.QnA = metadata.QnA;
    return documentObject;
  } catch {}

  try {
    checkVectorDBFeaturedEventMetadata(metadata);
    documentObject.event = metadata.event;
    return documentObject;
  } catch {}

  try {
    checkVectorDBLeadershipMetadata(metadata);
    documentObject.socials = metadata.socialUrls;
    return documentObject;
  } catch {}

  try {
    checkVectorDBSiteInfoMetadata(metadata);
    documentObject.socials = metadata.socialUrls;
    return documentObject;
  } catch {}

  return documentObject;
};



function checkQueryResponse(obj: unknown): asserts obj is QueryResponse {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("Invalid input: must be a non-null object");
  }
  const { response, relevant_actions } = obj as QueryResponse;
  if (typeof response !== "string") {
    throw new Error("Invalid response: must be a string");
  }
  if (!Array.isArray(relevant_actions)) {
    throw new Error("Invalid relevant_actions: must be an array");
  }
  for (const action of relevant_actions) {
    if (typeof action.label !== "string" || typeof action.href !== "string") {
      throw new Error(
        "Invalid relevant_actions: each action must have a string label and href",
      );
    }
  }
}

export const processQuery = async (query: string) => {
  // TODO: rework
  const QueryResponse = await queryCollection(query);

  let contextStr = "";

  for (const [document, metadata] of QueryResponse) {
    const documentObject = produceDocumentObject(document, metadata);
    contextStr += `${metadata.collection}:${JSON.stringify(documentObject)}\n`;
    /**
     * page-home:{
     *  content here
     * }
     */
  }

  const prompt =
    "(Today's Date: " +
    new Date().toLocaleDateString() +
    ")\n\n You are user facing. In plain text, try to answer the user's query using the following information. If query cannot be answered with provided info, please let user know.\n\n" +
    contextStr +
    "\n\n Query: " +
    query +
    '\n\n Output like so: {"response": string, "relevant_actions": [{label: string, href: string}, ...]}, include only relevant actions, keep hrefs as provided. If the most relevant action is to visit a url, create an action for that.';

  // console.log("\nprompt", prompt, "\n");
  const response = await handleQuestion(prompt);

  // if incorrect format, smaller model tries to fix issues
  // returns parsed obj if successful, default error otherwise
  let tries = 0;
  let currentResponse = response;
  // console.log('first res', currentResponse);
  while (true) {
    try {
      const obj: unknown = JSON.parse(currentResponse);
      checkQueryResponse(obj);
      return obj;
    } catch (e) {
      await LogMessage(`Failed to generate response`, {
        function: "processQuery",
        lastResponse: currentResponse,
        error: (e as Error).message,
        try: tries
      });
      if (tries >= 3) {
        break;
      }
      tries++;
      // console.log(tries, 'trying to fix issue', (e as Error).message);
      currentResponse = await handleQuestion(
        `${currentResponse}\nFix Error: ${(e as Error).message}`,
        // "gemma-3-1b-it",
      );
    }
  }

  await LogMessage(`Failed to generate response`, {
    function: "processQuery",
    lastResponse: currentResponse
  });
  
  const res: QueryResponse = {
    response: "Failed to generate response",
    relevant_actions: [],
  };
  return res;
};
