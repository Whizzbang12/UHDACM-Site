export function objectToUrlParams(obj: Record<string, any>): string {
  const params = Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => key + "=" + String(value))
    .join("&");
  return params;
}