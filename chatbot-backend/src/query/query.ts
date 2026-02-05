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
import { QueryMessage, QueryResponse } from "@shared/types/query/queryTypes";
import { contextMsgLimit } from "@shared/types/query/queryData";

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

export const processQuery = async (query: string, context?: QueryMessage[]) => {
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

  let prevMsg = "";
  if (context) {
    prevMsg += "\n\n Previous messages: ";
    let msgCount = 0;
    for (const msg of context) {
      msgCount += 1;
      if (msgCount > contextMsgLimit) break;
      prevMsg += `${JSON.stringify({ sender: msg.sender, msg: msg.response })}.`;
    }
  }

  const prompt = `
  You are a user-facing assistant.

  Answer the user's query using ONLY the information provided below.
  Do NOT use prior knowledge.
  If the query cannot be answered using the provided information, you MUST say so.

  Today’s date is: ${new Date().toLocaleDateString()}.

  ---
  CONTEXT:
  ${contextStr}

  ---
  CONVERSATION HISTORY:
  ${prevMsg}

  ---
  USER QUERY:
  ${query}

  ---
  RESPONSE RULES:
  - Output MUST be valid JSON only. No markdown, no extra text.
  - All top-level properties MUST be present.
  - Arrays may be empty if no items are appropriate.
  - Do NOT invent links, or facts.
  - You may invent actions (not links) if it is convenient for the user.
  - Use plain text only (no HTML).
  - If they ask about an event, gallery, etc., provide a link action.

  JSON SCHEMA:
  {
    "response": "string",
    "relevant_actions": [
      { "label": "string", "href": "string" }
    ],
    "quick_replies": [
      { "label": "2–3 word label", "value": "descriptive follow-up query" }
    ]
  }

  GUIDANCE:
  - "relevant_actions" should only include actions directly useful to the response. Leave empty if none apply.
  - "quick_replies" should reflect likely next questions the user would ask. Maximum of 3. Leave empty if none apply.
  - If the query cannot be answered from the provided context, set:
    - "response" to a brief explanation that the information is unavailable
    - "relevant_actions" to []
    - "quick_replies" to []
  `;
  const response = await handleQuestion(prompt);

  // if incorrect format, smaller model tries to fix issues
  // returns parsed obj if successful, default error otherwise
  let tries = 0;
  let currentResponse = response;
  // console.log('first res', currentResponse);
  while (true) {
    try {
      let cleanedResponse = currentResponse.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.slice(7, -3).trim();
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.slice(3, -3).trim();
      }
      const obj: unknown = JSON.parse(cleanedResponse);
      checkQueryResponse(obj);
      return obj;
    } catch (e) {
      console.warn(e);
      await LogMessage(`Failed to generate response`, {
        function: "processQuery",
        lastResponse: currentResponse,
        error: (e as Error).message,
        try: tries,
      });
      if (tries >= 3) {
        break;
      }
      tries++;
      // console.log(tries, 'trying to fix issue', (e as Error).message);
      currentResponse = await handleQuestion(
        `${currentResponse}\nFix Error, output only JSON: ${(e as Error).message}\n\nOutput like so: {"response": plain_string, "relevant_actions": [{label: string, href: string}, ...], "quick_replies": [{"label": "short-text", "value": "longer-text"}, (max 3)]}, include only relevant actions, keep hrefs as provided. If the most relevant action is to visit a url, create an action for that. Quick replies should be what the user is likely to ask next, label being 2-3 words, and value being descriptive enough for an answer to answer accurately. All properties must be present, none are optional.`,
        // "gemma-3-1b-it",
      );
    }
  }

  await LogMessage(`Failed to generate response`, {
    function: "processQuery",
    query: query,
    lastResponse: currentResponse,
  });

  const res: QueryResponse = {
    response: "Failed to generate response",
    relevant_actions: [],
    quick_replies: [],
  };
  return res;
};
