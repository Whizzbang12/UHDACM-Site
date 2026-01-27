export function objectToUrlParams(obj: Record<string, any>): string {
  const params = Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => key + "=" + String(value))
    .join("&");
  return params;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * runs == operation on two values.
 * if values are equal, returns immediately.
 * 
 * if values are not, ensures entire operation takes `time` ms.
 * 
 * Note: doesn't work where `time` < equal operation time
 */
export async function EqualsTimed(val: any, val2: any, time: number) {
  let end = Date.now() + time;
  if (val != val2) {
    await sleep(Math.max(1, end - Date.now())); // Max.max to avoid waiting negative time
    return false;
  }
  return true;
}