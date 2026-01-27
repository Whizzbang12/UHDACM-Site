# Vector Context Manager

This project manages the synchronization of CMS content into a vector database (ChromaDB) for search and retrieval. **Note: This system is incredibly fragile; I have no idea how it's working right now. Use with caution!**

## Overview

Most of the core logic is in `writer.ts`. The system is composed of four main parts:

1. **Startup**: Initializes the system, triggers a health check, and starts the writer.
2. **Health Check**: Checks if the vector database is missing any collections (based on metadata, not literal collections). For any missing collections, it creates "tickets" for the writer.
3. **Writer**: Processes tickets by fetching the latest data from the CMS, updating the vector database, and deleting the ticket. Each ticket is retried up to 3 times (hardcoded).
4. **Webhook**: (Not implemented yet) Will listen for CMS updates and create update tickets as needed.

## Requirements

- **ChromaDB**: Requires a running ChromaDB instance. For local testing, use the provided `chroma-server` script. In production, connect to ChromaDB Cloud.
- **CMS**: The CMS must be running and accessible to retrieve up-to-date content. See the CMS readme for setup and API key instructions.
- **Firestore**: Used for ticket management.

## Environment Variables

Set the following environment variables in your `.env` file:

```env
CHROMA_DB_HOST=localhost                # Host for ChromaDB (local or cloud)
CHROMA_DB_PORT=5477                     # Port for ChromaDB (default for local server)
CHROMA_DB_COLLECTION_NAME=primary       # Name of the ChromaDB collection to use
PORT=5500                               # Port for the context manager server
FB_ADMIN_JSON=<get firebase service account>   # Path or JSON for Firebase service account
CMS_URL=http://localhost:1337           # URL for the CMS instance
CMS_API_TOKEN=<get-from-cms>            # API token for CMS (see CMS readme)
FRONTEND_URL=http://localhost:3000      # URL for the frontend (used in data formatting)
CMS_AUTH_TOKEN=random-stuff             # secret key used by cms. tells this server requests are authentic
```
- See [Here](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments) to obtain firebase service account json
- Read CMS readme to obtain API key

## Running
To run the project locally:

**Start ChromaDB** (must be running before the context manager):
```bash
npm run chroma-server
```
> NOTE: for local testing, only one instance of the chroma-server is necessary
> 
> If `chatbot-backend`'s chromaDB server is running already, you don't need to run this one.
>
> Ensure the port for chromaDB is the same as `vector-context-manager`'s port.
> 
> Unexpected behavior will occur otherwise.
> 
> If you're connecting to a cloud instance, ensure the env is set properly.


<br/>



**Start the context manager server**:
```bash
npm run dev
```

Make sure your `.env` file is configured as described above before starting.


## Notes

- The system is **fragile** and may break unexpectedly.
- Most logic is in `writer.ts`.
- Webhook support is planned but not implemented.
- Ensure all dependencies (ChromaDB, CMS, Firestore) are running before starting.
