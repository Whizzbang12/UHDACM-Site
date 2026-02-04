import { ChromaClient } from "chromadb";
import { env_vars } from "../tools/env/envVars";
import { vectorDBEmptyCollectionMarkerDocument } from "@shared/types/vectorDB/vectorDBData";
import { VectorDBBaseMetadata } from "@shared/types/vectorDB/vectorDBTypes";
import { convertSafeMetadataToVectorDBMetadata } from "@shared/types/vectorDB/vectorDBFuncs";
import { LogMessage } from "../log/log";

// Define the collection name
const collectionName = env_vars.CHROMA_DB_COLLECTION_NAME;
const nResults = 5; // Define the number of results globally

// Initialize Chroma client
const client = new ChromaClient({
  host: env_vars.CHROMA_DB_HOST,
  port: env_vars.CHROMA_DB_PORT,
});

// Function to query the collection and return related items as a string array
export async function queryCollection(
  query: string,
): Promise<[string, VectorDBBaseMetadata][]> {
  try {
    // Get the collection
    const collection = await client.getCollection({ name: collectionName });

    // Query the collection
    const queryRes = await collection.query({
      queryTexts: [query],
      nResults,
    });

    // Extract and return the results as a string array

    const documentMetadataArray: [string, VectorDBBaseMetadata][] = [];
    for (let i = 0; i < queryRes.documents[0].length; i++) {
      const val = queryRes.documents[0][i];

      if (!val) {
        // idk how this would happen
        console.error("Ran out of values", JSON.stringify(queryRes, null, 2));
        break;
      }
      if (val == vectorDBEmptyCollectionMarkerDocument) {
        // skip empty documents
        continue;
      }

      try {
        const metadata = queryRes.metadatas[0][i];
        if (!metadata) {
          // idk how this is possible
          console.error(
            "Ran out of metadatas",
            JSON.stringify(queryRes, null, 2),
          );
          break;
        }
        const convMetadata = convertSafeMetadataToVectorDBMetadata(metadata);
        documentMetadataArray.push([val, convMetadata]);
      } catch (e) {
        LogMessage(`${(e as Error).message}`, {
          function: "queryCollection",
          hint: 'convMetadata'
        });
        break;
      }
    }

    // console.log(documents);
    // console.log(metadatas);
    // console.log(documentMetadataArray)

    return documentMetadataArray;
  } catch (error) {
    console.error("Error querying the collection:", error);
    LogMessage((error as Error).message, {
      function: "queryCollection",
    });
    return [];
  }
}
