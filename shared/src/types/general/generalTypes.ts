export type FunctionUnknown = (...args: unknown[]) => unknown;
export type CardinalDirection = 'down' | 'left' | 'up' | 'right';

export type ObjectAny = { [key: string]: any };

export type Month = 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december';

export const Months: Month[] = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];