/**
 * Return today's date as a YYYY-MM-DD string (used as form default).
 */
export function todayISODate(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Format an ISO timestamp for display: "Mar 14, 2026"
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Returns true if the given day-of-week number matches today.
 * 0 = Sunday, 1 = Monday, … 6 = Saturday
 */
export function isTodayDayOfWeek(dayOfWeek: number): boolean {
  return new Date().getDay() === dayOfWeek
}

/**
 * Calculate a child's age in years from a birthdate string (YYYY-MM-DD).
 */
export function calculateAge(birthdate: string): number {
  const today = new Date()
  const birth = new Date(birthdate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}
