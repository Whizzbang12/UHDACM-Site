import { ChromaClient } from "chromadb";

// Define the collection name
const collectionName = "test_collection";
const nResults = 10; // Define the number of results globally

// Initialize Chroma client
const client = new ChromaClient();

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
    return queryRes.documents[0];
  } catch (error) {
    console.error("Error querying the collection:", error);
    return [];
  }
}
