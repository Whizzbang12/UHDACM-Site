"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMessageToBetterStack = LogMessageToBetterStack;
/**
 * Logs a message into better stack
 * @param config see `LogMessageToBetterStackConfig`
 * @param message string message
 * @param metadata metadata obj to go with log
 * @returns
 */
async function LogMessageToBetterStack(config, message, metadata) {
    if (!config.enable) {
        return true;
    }
    try {
        await fetch(`${config.ingesting_host}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: config.source_secret,
            },
            body: JSON.stringify({
                message,
                service: config.service,
                metadata: metadata,
            }),
        });
        return true;
    }
    catch (e) {
        // nothing to do here unfortunately
        console.error("logger failed", e.message);
        return false;
    }
}
