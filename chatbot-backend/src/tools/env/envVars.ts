import dotenv from "dotenv";

dotenv.config();

const pe = process.env;

const env_vars = {
  PORT: Number(pe.PORT!),
  CHROMA_DB_HOST: pe.CHROMA_DB_HOST!,
  CHROMA_DB_PORT: Number(pe.CHROMA_DB_PORT!),
  CHROMA_DB_COLLECTION_NAME: pe.CHROMA_DB_COLLECTION_NAME!,
} as const;


for (const [key, val] of Object.entries(env_vars)) {
  if (val == undefined) {
    throw new Error(`Expected environment variable \"${key}\" to be defined`);
  }
}

if (isNaN(env_vars.PORT)) {
  throw new Error(`env_vars PORT is NaN`);
} else if (isNaN(env_vars.CHROMA_DB_PORT)) {
  throw new Error(`env_vars PORT is NaN`);
}


export { env_vars };