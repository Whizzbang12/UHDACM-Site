"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryCollection = queryCollection;
const chromadb_1 = require("chromadb");
const envVars_1 = require("../tools/env/envVars");
const vectorDBData_1 = require("../../../shared/src/types/vectorDB/vectorDBData");
const vectorDBFuncs_1 = require("../../../shared/src/types/vectorDB/vectorDBFuncs");
const log_1 = require("../log/log");
// Define the collection name
const collectionName = envVars_1.env_vars.CHROMA_DB_COLLECTION_NAME;
const nResults = 25; // Define the number of results globally
// Initialize Chroma client
const client = envVars_1.env_vars.CHROMA_IS_CLOUD
    ? new chromadb_1.CloudClient({
        apiKey: envVars_1.env_vars.CHROMA_API_KEY,
        tenant: envVars_1.env_vars.CHROMA_TENANT,
        database: envVars_1.env_vars.CHROMA_DATABASE_NAME,
    })
    : new chromadb_1.ChromaClient({
        host: envVars_1.env_vars.CHROMA_DB_HOST,
        port: envVars_1.env_vars.CHROMA_DB_PORT,
    });
// Function to query the collection and return related items as a string array
async function queryCollection(query) {
    try {
        // Get the collection
        const collection = await client.getCollection({ name: collectionName });
        // Query the collection
        const queryRes = await collection.query({
            queryTexts: [query],
            nResults,
        });
        // Extract and return the results as a string array
        const documentMetadataArray = [];
        for (let i = 0; i < queryRes.documents[0].length; i++) {
            const val = queryRes.documents[0][i];
            if (!val) {
                // idk how this would happen
                console.error("Ran out of values", JSON.stringify(queryRes, null, 2));
                break;
            }
            if (val == vectorDBData_1.vectorDBEmptyCollectionMarkerDocument) {
                // skip empty documents
                continue;
            }
            try {
                const metadata = queryRes.metadatas[0][i];
                if (!metadata) {
                    // idk how this is possible
                    console.error("Ran out of metadatas", JSON.stringify(queryRes, null, 2));
                    break;
                }
                const convMetadata = (0, vectorDBFuncs_1.convertSafeMetadataToVectorDBMetadata)(metadata);
                documentMetadataArray.push([val, convMetadata]);
            }
            catch (e) {
                (0, log_1.LogMessage)(`${e.message}`, {
                    function: "queryCollection",
                    hint: "convMetadata",
                });
                break;
            }
        }
        // console.log(documents);
        // console.log(metadatas);
        // console.log(documentMetadataArray)
        return documentMetadataArray;
    }
    catch (error) {
        console.error("Error querying the collection:", error);
        (0, log_1.LogMessage)(error.message, {
            function: "queryCollection",
        });
        return [];
    }
}
