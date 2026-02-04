import dotenv from "dotenv";
import { LogMessage } from "../../log/log";

dotenv.config();

const pe = process.env;

export const env_vars = {
  PORT: Number(pe.PORT!),
  CHROMA_DB_HOST: pe.CHROMA_DB_HOST!,
  CHROMA_DB_PORT: Number(pe.CHROMA_DB_PORT!),
  CHROMA_DB_COLLECTION_NAME: pe.CHROMA_DB_COLLECTION_NAME!,

  // logging
  ENABLE_LOGGER: pe.ENABLE_LOGGER == "true",
  COLLECTOR_SOURCE_SECRET: pe.COLLECTOR_SOURCE_SECRET!,
  COLLECTOR_INGESTING_HOST: pe.COLLECTOR_INGESTING_HOST!,
} as const;

for (const [key, val] of Object.entries(env_vars)) {
  if (val == undefined) {

    // these keys are optional if logger is disabled
    if (key == 'COLLECTOR_SOURCE_SECRET' || key == 'COLLECTOR_INGESTING_HOST') {
      if (!env_vars.ENABLE_LOGGER) {
        console.warn(`WARNING, LOGGER IS DISABLED, SOME FUNCTIONS WILL FAIL SILENTLY`);
        // okay for these two values to be undefined if logger is disabled
        continue;
      }
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

if (isNaN(env_vars.PORT)) {
  throw new Error(`env_vars PORT is NaN`);
} else if (isNaN(env_vars.CHROMA_DB_PORT)) {
  throw new Error(`env_vars PORT is NaN`);
}
