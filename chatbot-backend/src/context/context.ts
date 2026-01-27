import { ChromaClient } from "chromadb";
import { env_vars } from "../tools/env/envVars";

// Define the collection name
const collectionName = env_vars.CHROMA_DB_COLLECTION_NAME;
const nResults = 30; // Define the number of results globally

// Initialize Chroma client
const client = new ChromaClient({
  host: env_vars.CHROMA_DB_HOST,
  port: env_vars.CHROMA_DB_PORT
});

// Function to query the collection and return related items as a string array
export async function queryCollection(query: string): Promise<(string | null)[]> {
  try {
    // Get the collection
    const collection = await client.getCollection({ name: collectionName });

    // Query the collection
    const queryRes = await collection.query({
      queryTexts: [query],
      nResults,
    });

    // Extract and return the results as a string array
    console.log(queryRes.documents[0]);
    return queryRes.documents[0];
  } catch (error) {
    console.error("Error querying the collection:", error);
    return [];
  }
}
