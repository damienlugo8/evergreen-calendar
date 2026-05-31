// dates.js — shared date helpers.
// All date strings are 'YYYY-MM-DD', which compares correctly with < > ===.

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const DAYS_FULL = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

export const toDateStr = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Parse a 'YYYY-MM-DD' string into a local Date (noon-safe).
export const parseDateStr = (str) => new Date(str + 'T00:00:00');

// An event's effective start / end. Legacy events only have `date`.
export const eventStart = (e) => e.startDate || e.date;
export const eventEnd   = (e) => e.endDate || e.startDate || e.date;

// Does this event cover the given day?
export const occursOn = (e, dateStr) => {
  const s = eventStart(e);
  const end = eventEnd(e);
  return dateStr >= s && dateStr <= end;
};

// Is this day a continuation (any day after the first) of a multi-day event?
export const isContinuation = (e, dateStr) => dateStr > eventStart(e);

export const isMultiDay = (e) => eventEnd(e) > eventStart(e);

// All events that touch a given day, sorted so single/start days come first.
export const eventsForDay = (events, dateStr) =>
  events
    .filter((e) => occursOn(e, dateStr))
    .sort((a, b) => eventStart(a).localeCompare(eventStart(b)));

// Pretty range label, e.g. "May 27" or "May 27 – Jun 2".
export const formatRange = (startStr, endStr) => {
  const s = parseDateStr(startStr);
  if (!endStr || endStr === startStr) {
    return `${MONTHS_SHORT[s.getMonth()]} ${s.getDate()}`;
  }
  const e = parseDateStr(endStr);
  if (s.getMonth() === e.getMonth()) {
    return `${MONTHS_SHORT[s.getMonth()]} ${s.getDate()} – ${e.getDate()}`;
  }
  return `${MONTHS_SHORT[s.getMonth()]} ${s.getDate()} – ${MONTHS_SHORT[e.getMonth()]} ${e.getDate()}`;
};

// ISO week key for grouping agenda items: returns the Sunday that starts the week.
export const weekStartStr = (dateStr) => {
  const d = parseDateStr(dateStr);
  d.setDate(d.getDate() - d.getDay());
  return toDateStr(d);
};
