/**
 * Calculate the next UTC date (YYYY-MM-DD) on which the given day_of_week
 * falls. Always returns a future date (minimum tomorrow if today matches).
 */
export function calcNextPaymentDate(dayOfWeek: number): string {
  const today = new Date()
  const todayDay = today.getUTCDay()
  let daysUntil = dayOfWeek - todayDay
  if (daysUntil <= 0) daysUntil += 7
  const next = new Date(today)
  next.setUTCDate(today.getUTCDate() + daysUntil)
  return next.toISOString().slice(0, 10)
}

/** Add n days to a YYYY-MM-DD string and return the result. */
export function addDaysToDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Today's date as YYYY-MM-DD (UTC). */
export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Format a YYYY-MM-DD string for display (e.g. "Mon, Apr 7"). */
export function formatPaymentDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z')
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
    timeZone: 'UTC',
  })
}
