import dotenv from "dotenv";
import { LogMessage } from "../../log/log";

dotenv.config();

const pe = process.env;

export const env_vars = {
  FRONTEND_ADDRESS: pe.FRONTEND_ADDRESS!,
  PORT: Number(pe.PORT!),

  CHROMA_IS_CLOUD: pe.CHROMA_IS_CLOUD == "true",

  // chroma local
  CHROMA_DB_HOST: pe.CHROMA_DB_HOST!,
  CHROMA_DB_PORT: Number(pe.CHROMA_DB_PORT!),

  // chroma cloud
  CHROMA_API_KEY: pe.CHROMA_API_KEY!,
  CHROMA_TENANT: pe.CHROMA_TENANT!,
  CHROMA_DATABASE_NAME: pe.CHROMA_DATABASE_NAME!,

  CHROMA_DB_COLLECTION_NAME: pe.CHROMA_DB_COLLECTION_NAME!,
  AI_MODEL: pe.AI_MODEL!,
  AI_APIKEYS: (() => {
    const RAW_KEYS: string = pe.GOOGLE_API_KEYS!;

    const API_KEYS: string[] = RAW_KEYS.split(",")
      .map((key) => key.trim())
      .filter((key): key is string => Boolean(key));

    if (API_KEYS.length === 0) {
      throw new Error(
        "No API keys found. Set GOOGLE_API_KEYS=key1,key2,... (or GOOGLE_API_KEY).",
      );
    }
    return API_KEYS;
  })(),
  // logging
  ENABLE_LOGGER: pe.ENABLE_LOGGER == "true",
  COLLECTOR_SOURCE_SECRET: pe.COLLECTOR_SOURCE_SECRET!,
  COLLECTOR_INGESTING_HOST: pe.COLLECTOR_INGESTING_HOST!,

  AUTH_COOKIE_REQUIRED: pe.AUTH_COOKIE_REQUIRED == "true",
  AUTH_COOKIE_JWT_SECRET: pe.AUTH_COOKIE_JWT_SECRET!,
  AUTH_COOKIE_TURNSTILE_SECRET: pe.AUTH_COOKIE_TURNSTILE_SECRET!
} as const;

for (const [key, val] of Object.entries(env_vars)) {
  const tKey = key as unknown as keyof typeof env_vars; // for typing
  if (val == undefined) {
    // these keys are optional if logger is disabled
    if (
      tKey == "COLLECTOR_SOURCE_SECRET" ||
      tKey == "COLLECTOR_INGESTING_HOST"
    ) {
      if (!env_vars.ENABLE_LOGGER) {
        console.warn(
          `WARNING, LOGGER IS DISABLED, SOME FUNCTIONS WILL FAIL SILENTLY`,
        );
        // okay for these two values to be undefined if logger is disabled
        continue;
      }
    }

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

    if (tKey == 'AUTH_COOKIE_JWT_SECRET' || tKey == 'AUTH_COOKIE_TURNSTILE_SECRET') {
      if (!env_vars.AUTH_COOKIE_REQUIRED) continue; // allowed if auth cookie is not required
    }

    const err = `Expected environment variable \"${key}\" to be defined`;
    LogMessage(err, {
      file: "envVars.ts",
    })
      .catch()
      .then(() => {
        throw new Error(
          `Expected environment variable \"${key}\" to be defined`,
        );
      });
  }
}

if (!env_vars.CHROMA_IS_CLOUD && isNaN(env_vars.CHROMA_DB_PORT)) {
  throw new Error(`env_vars CHROMA_DB_PORT is NaN`);
}
if (isNaN(env_vars.PORT)) {
  throw new Error(`env_vars PORT is NaN`);
}
