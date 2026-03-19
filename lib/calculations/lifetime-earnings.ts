import type { Transaction } from '@/types/database'
import { roundMoney } from '@/lib/utils/math'

/**
 * Lifetime earnings = sum of all positive transaction amounts since the reset date (if set).
 * Never decreases — spending does not affect this value.
 * Used to determine tree stage and milestone unlocks.
 */
export function calculateLifetimeEarnings(transactions: Transaction[], resetAt?: string | null): number {
  const resetDate = resetAt ? new Date(resetAt) : null
  const relevant  = resetDate
    ? transactions.filter((t) => new Date(t.created_at) > resetDate)
    : transactions
  return roundMoney(
    relevant.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  )
}
