"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env_vars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const log_1 = require("../../log/log");
dotenv_1.default.config();
const pe = process.env;
exports.env_vars = {
    FRONTEND_ADDRESS: pe.FRONTEND_ADDRESS,
    PORT: Number(pe.PORT),
    CHROMA_IS_CLOUD: pe.CHROMA_IS_CLOUD == "true",
    // chroma local
    CHROMA_DB_HOST: pe.CHROMA_DB_HOST,
    CHROMA_DB_PORT: Number(pe.CHROMA_DB_PORT),
    // chroma cloud
    CHROMA_API_KEY: pe.CHROMA_API_KEY,
    CHROMA_TENANT: pe.CHROMA_TENANT,
    CHROMA_DATABASE_NAME: pe.CHROMA_DATABASE_NAME,
    CHROMA_DB_COLLECTION_NAME: pe.CHROMA_DB_COLLECTION_NAME,
    AI_MODEL: pe.AI_MODEL,
    AI_APIKEYS: (() => {
        const RAW_KEYS = pe.GOOGLE_API_KEYS;
        const API_KEYS = RAW_KEYS.split(",")
            .map((key) => key.trim())
            .filter((key) => Boolean(key));
        if (API_KEYS.length === 0) {
            throw new Error("No API keys found. Set GOOGLE_API_KEYS=key1,key2,... (or GOOGLE_API_KEY).");
        }
        return API_KEYS;
    })(),
    // logging
    ENABLE_LOGGER: pe.ENABLE_LOGGER == "true",
    COLLECTOR_SOURCE_SECRET: pe.COLLECTOR_SOURCE_SECRET,
    COLLECTOR_INGESTING_HOST: pe.COLLECTOR_INGESTING_HOST,
};
for (const [key, val] of Object.entries(exports.env_vars)) {
    const tKey = key; // for typing
    if (val == undefined) {
        // these keys are optional if logger is disabled
        if (tKey == "COLLECTOR_SOURCE_SECRET" ||
            tKey == "COLLECTOR_INGESTING_HOST") {
            if (!exports.env_vars.ENABLE_LOGGER) {
                console.warn(`WARNING, LOGGER IS DISABLED, SOME FUNCTIONS WILL FAIL SILENTLY`);
                // okay for these two values to be undefined if logger is disabled
                continue;
            }
        }
        if (tKey == "CHROMA_DB_PORT" || tKey == "CHROMA_DB_HOST") {
            if (exports.env_vars.CHROMA_IS_CLOUD)
                continue; // allowed if using cloud client
        }
        if (tKey == "CHROMA_API_KEY" ||
            tKey == "CHROMA_TENANT" ||
            tKey == "CHROMA_DATABASE_NAME") {
            if (!exports.env_vars.CHROMA_IS_CLOUD)
                continue; // allowed if not using cloud client
        }
        const err = `Expected environment variable \"${key}\" to be defined`;
        (0, log_1.LogMessage)(err, {
            file: "envVars.ts",
        })
            .catch()
            .then(() => {
            throw new Error(`Expected environment variable \"${key}\" to be defined`);
        });
    }
}
if (!exports.env_vars.CHROMA_IS_CLOUD && isNaN(exports.env_vars.CHROMA_DB_PORT)) {
    throw new Error(`env_vars CHROMA_DB_PORT is NaN`);
}
if (isNaN(exports.env_vars.PORT)) {
    throw new Error(`env_vars PORT is NaN`);
}
