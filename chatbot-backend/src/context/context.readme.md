# Context.ts
Massive rework. Now array of documents + metadata is returned.

```ts
type documents = string;
type metadata = VectorDBMetadataBase
```

For metadata, see `@shared/vectorDB/vectorDBTypes.ts`.

This formatting allows us to expect metadata to be a specific format.

## Motivation
**Documents** is purely string. When running the bi-encoder query, we can find documents that match our query.


**Metadata** is purely functional. Metadata can contain urls, actions, etc. <br/> <br/>
You can provide metadata to the chatbot to let it output urls, button actions, and more.
<br/> <br/>

**Result:**<br/>
This separation of concerns allows the vector search to be relevant (documents), while also providing utility to the chatbot if necessary (via metadata).