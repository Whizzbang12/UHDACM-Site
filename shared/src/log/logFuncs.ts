

export interface LogMessageToBetterStackConfig {
  /**
   * if false, logger does not log, and just returns true
   */
  enable: boolean;

  /**
   * url endpoint for log host
   */
  ingesting_host: string;

  /**
   * secret sent to log host
   */
  source_secret: string;
  
  /**
   * name of service sending log
   */
  service: string;
}
/**
 * Logs a message into better stack
 * @param config see `LogMessageToBetterStackConfig`
 * @param message string message
 * @param metadata metadata obj to go with log
 * @returns
 */
export async function LogMessageToBetterStack(
  config: LogMessageToBetterStackConfig,
  message: string,
  metadata?: Object,
) {
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
  } catch (e) {
    // nothing to do here unfortunately
    console.error("logger failed", (e as Error).message);
    return false;
  }
}
