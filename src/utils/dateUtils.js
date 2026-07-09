const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Returns a stable "YYYY-MM-DD" key for a Date, in local time. */
export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Parses a "YYYY-MM-DD" key back into a local-time Date.
 *
 * Deliberately NOT `new Date(dateKey)` — that form parses as UTC midnight,
 * which silently shifts to the previous day for anyone west of UTC. Building
 * the Date from numeric parts keeps it in the browser's local timezone.
 */
export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function isSameDay(a, b) {
  return toDateKey(a) === toDateKey(b)
}

export function monthLabel(year, month) {
  return `${MONTH_LABELS[month]} ${year}`
}

export const weekdayLabels = WEEKDAY_LABELS
export const monthLabels = MONTH_LABELS
export const monthAbbrLabels = MONTH_LABELS.map((m) => m.slice(0, 3))

/**
 * Builds a 6x7 grid of Date objects for the given month, including the
 * trailing/leading days from adjacent months so every week is full.
 */
export function buildMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = firstOfMonth.getDay() // 0 = Sunday
  const gridStart = new Date(year, month, 1 - startOffset)

  const days = []
  for (let i = 0; i < 42; i++) {
    const day = new Date(gridStart)
    day.setDate(gridStart.getDate() + i)
    days.push(day)
  }
  return days
}
