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
export declare function LogMessageToBetterStack(config: LogMessageToBetterStackConfig, message: string, metadata?: Object): Promise<boolean>;
//# sourceMappingURL=logFuncs.d.ts.map