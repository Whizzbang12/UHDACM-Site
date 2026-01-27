import { Month, Months } from "@shared/types/general/generalTypes";
/**
 * Converts a 0-based integer (0 = January) to a Month string.
 */
export function intToMonth(index: number): Month | undefined {
  return Months[index];
}

/**
 * Converts a Month string to a 0-based integer (0 = January).
 */
export function monthToInt(month: Month): number {
  return Months.indexOf(month.toLowerCase() as Month);
}

export function objectToUrlParams(obj: Record<string, any>): string {
  const params = Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => key + "=" + String(value))
    .join("&");
  return params;
}

export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  );
}

function formatDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function buildICS({
  title,
  details,
  location,
  start,
  end,
}: CalendarPayload) {
  return `BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//Your Company//Your Product//EN
    BEGIN:VEVENT
    UID:${Date.now()}@example.com
    DTSTAMP:${formatDate(new Date())}
    DTSTART:${formatDate(new Date(start))}
    DTEND:${formatDate(new Date(end))}
    SUMMARY:${title}
    DESCRIPTION:${details}
    LOCATION:${location}
    END:VEVENT
    END:VCALENDAR`
    .split("\n")
    .map((line) => line.replace(/(.{75})(?=.)/g, "$1\r\n "))
    .join("\r\n");
}

export function downloadICS(icsContent: string, filename = "event.ics") {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a); // ensure it's in DOM for Firefox
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

export type CalendarPayload = {
  title: string;
  details: string;
  location: string;
  start: string;
  end: string;
};

export function CalendarLinkGoogle({
  title,
  details,
  location,
  start,
  end,
}: CalendarPayload) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (!startDate || !endDate) {
    return undefined;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title,
  )}&dates=${formatDate(startDate)}/${formatDate(
    endDate,
  )}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
    location,
  )}`;
}

export function CalendarLinkOutlook({
  title,
  details,
  location,
  start,
  end,
}: CalendarPayload) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (!startDate || !endDate) {
    return undefined;
  }

  const startStr = formatDate(startDate);
  const endStr = formatDate(endDate);
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
    title,
  )}&body=${encodeURIComponent(details)}&startdt=${encodeURIComponent(
    startStr,
  )}&enddt=${encodeURIComponent(endStr)}&location=${encodeURIComponent(
    location,
  )}`;
  return outlookUrl;
}

/**
 * When fetching from the local CMS, the url is relative, so the CMS URL must be attached.
 * When fetching from the remote CMS, the url is absolute, so it can be used as is.
 * @param path
 * @returns
 */
export function ProduceCMSResourceURL(path?: string) {
  if (!path) {
    return undefined;
  }
  if (path.at(0) == "/") {
    return `${process.env.NEXT_PUBLIC_CMS_URL}${path}`;
  }
  return path;
}