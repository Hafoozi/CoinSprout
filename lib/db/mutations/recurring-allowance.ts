import type { RecurringAllowance } from '@/lib/db/types'

export async function upsertRecurringAllowance(data: {
  childId: string
  amount: number
  dayOfWeek: number
  isActive: boolean
}): Promise<RecurringAllowance | null> {
  // TODO: Implement (insert or update if record already exists for this child)
  return null
}

/**
 * Update last_prompted_at to now, so the app doesn't prompt again this week.
 */
export async function markAllowancePrompted(childId: string): Promise<void> {
  // TODO: Implement
}
