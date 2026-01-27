import { ChromaClient, Collection } from "chromadb";
import fs from "fs";
import path from "path";
import { env_vars } from "../env/envVars";

const client = new ChromaClient({
  host: env_vars.CHROMA_DB_HOST,
  port: env_vars.CHROMA_DB_PORT,
});

console.log(
  `Chroma Client connected | ${env_vars.CHROMA_DB_HOST}:${env_vars.CHROMA_DB_PORT}`,
);

// Define the collection name
const collectionName = env_vars.CHROMA_DB_COLLECTION_NAME;
async function main() {
  // Initialize Chroma client

  let collection: Collection | undefined = undefined;
  // const collections = await client.listCollections();
  // b[0].name

  console.log("creating colleciton");
  try {
    collection = await client.createCollection({
      name: collectionName,
    });
  } catch {
    // Fails if already exists.
    // deletes collection
    console.log("deleted existing one");
    await client.deleteCollection({ name: collectionName });

    // then creates it again
    collection = await client.createCollection({ name: collectionName });
  }

  // Read the input file
  const filePath = path.join(__dirname, "input.txt");
  const fileContent = fs.readFileSync(filePath, "utf-8");

  console.log("adding");
  // Split the content into lines or process as needed
  const data = fileContent.split("\n").filter((v) => Boolean(v)).map((line, index) => ({
    id: `item-${index}`,
    content: line,
  }));

  await collection.add({
    ids: data.map((dat) => dat.id),
    documents: data.map((dat) => dat.content),
    metadatas: data.map((dat) => {
      return { id: dat.id, collection: "testerbester5" };
    }),
  });

  // // Add data to the collection
  // for (const item of data) {
  //   console.log('adding item: ', item.id);
  // }

  console.log(`Data has been added to the collection: ${collectionName}`);

  const queryRes = await collection.query({
    queryTexts: ["Who is the president?"],
    nResults: 10,
  });

  console.log("res", queryRes);
}

import './writer';
// main().catch((error) => {
//   console.error("Error:", error);
// });
