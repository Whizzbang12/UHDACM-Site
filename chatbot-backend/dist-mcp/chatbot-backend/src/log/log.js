"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMessage = LogMessage;
const logFuncs_1 = require("../../../shared/src/log/logFuncs");
const envVars_1 = require("../tools/env/envVars");
async function LogMessage(message, metadata) {
    return await (0, logFuncs_1.LogMessageToBetterStack)({
        enable: envVars_1.env_vars.ENABLE_LOGGER,
        ingesting_host: envVars_1.env_vars.COLLECTOR_INGESTING_HOST,
        source_secret: envVars_1.env_vars.COLLECTOR_SOURCE_SECRET,
        service: 'chatbot-backend'
    }, message, metadata);
}
