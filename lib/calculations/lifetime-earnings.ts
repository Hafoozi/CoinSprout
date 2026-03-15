import type { Transaction } from '@/types/database'
import { roundMoney } from '@/lib/utils/math'

/**
 * Lifetime earnings = sum of all positive transaction amounts.
 * Never decreases — spending does not affect this value.
 * Used to determine tree stage and milestone unlocks.
 */
export function calculateLifetimeEarnings(transactions: Transaction[]): number {
  return roundMoney(
    transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  )
}
