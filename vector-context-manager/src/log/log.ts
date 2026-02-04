import { LogMessageToBetterStack } from "@shared/log/logFuncs";
import { env_vars } from "../env/envVars";

export async function LogMessage(message: string, metadata?: Object) {
  return await LogMessageToBetterStack({
    enable: env_vars.ENABLE_LOGGER,
    ingesting_host: env_vars.COLLECTOR_INGESTING_HOST,
    source_secret: env_vars.COLLECTOR_SOURCE_SECRET,
    service: 'vector-context-manager'
  }, message, metadata);
}
