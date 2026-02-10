import dotenv from "dotenv";
dotenv.config();

const pe = process.env;

const env_vars = {
  TESTING: pe.TESTING == "true",
  PORT: Number(pe.PORT!),

  // vectorDB
  CHROMA_IS_CLOUD: pe.CHROMA_IS_CLOUD == "true",
  CHROMA_DB_COLLECTION_NAME: pe.CHROMA_DB_COLLECTION_NAME!,
  // vector local
  CHROMA_DB_HOST: pe.CHROMA_DB_HOST!,
  CHROMA_DB_PORT: Number(pe.CHROMA_DB_PORT!),
  // vector cloud
  CHROMA_API_KEY: pe.CHROMA_API_KEY!,
  CHROMA_TENANT: pe.CHROMA_TENANT!,
  CHROMA_DATABASE_NAME: pe.CHROMA_DATABASE_NAME!,

  // database
  FB_ADMIN_JSON: JSON.parse(pe.FB_ADMIN_JSON!),

  // cms
  CMS_URL: pe.CMS_URL!,
  CMS_API_TOKEN: pe.CMS_API_TOKEN!,
  CMS_AUTH_TOKEN: pe.CMS_AUTH_TOKEN!,

  // frontend
  FRONTEND_URL: pe.FRONTEND_URL!,

  // logger
  ENABLE_LOGGER: pe.ENABLE_LOGGER == "true",
  COLLECTOR_INGESTING_HOST: pe.COLLECTOR_INGESTING_HOST!,
  COLLECTOR_SOURCE_SECRET: pe.COLLECTOR_SOURCE_SECRET!,
} as const;

for (const [key, val] of Object.entries(env_vars)) {
  const tKey = key as unknown as keyof typeof env_vars; // for typing
  if (val == undefined) {

    // =========== CHROMA ============
    if (tKey == "CHROMA_DB_PORT" || tKey == "CHROMA_DB_HOST") {
      if (env_vars.CHROMA_IS_CLOUD) continue; // allowed if using cloud client
    }

    if (
      tKey == "CHROMA_API_KEY" ||
      tKey == "CHROMA_TENANT" ||
      tKey == "CHROMA_DATABASE_NAME"
    ) {
      if (!env_vars.CHROMA_IS_CLOUD) continue; // allowed if not using cloud client
    }

    // ========================

    throw new Error(`Expected environment variable \"${key}\" to be defined`);
  }
}

if (isNaN(env_vars.PORT)) {
  throw new Error(`env_vars PORT is NaN`);
}

if (!env_vars.CHROMA_IS_CLOUD && isNaN(env_vars.CHROMA_DB_PORT)) {
  throw new Error(`env_vars CHROMA_DB_PORT is NaN`);
}

export { env_vars };
