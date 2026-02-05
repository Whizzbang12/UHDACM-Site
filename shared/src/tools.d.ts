export declare function objectToUrlParams(obj: Record<string, any>): string;
export declare function sleep(ms: number): Promise<void>;
/**
 * runs == operation on two values.
 * if values are equal, returns immediately.
 *
 * if values are not, ensures entire operation takes `time` ms.
 *
 * Note: doesn't work where `time` < equal operation time
 */
export declare function EqualsTimed(val: any, val2: any, time: number): Promise<boolean>;
//# sourceMappingURL=tools.d.ts.map