import type { Transaction } from '@/types/database'
import { roundMoney } from '@/lib/utils/math'
import type { SourceBreakdown } from '@/types/domain'

/**
 * Current savings balance = sum of all transaction amounts.
 * Positive amounts add money; negative amounts (spend) reduce it.
 */
export function calculateSavingsBalance(transactions: Transaction[]): number {
  return roundMoney(transactions.reduce((sum, t) => sum + t.amount, 0))
}

/**
 * Total amount spent = sum of all negative transaction amounts (returned as positive).
 */
export function calculateTotalSpent(transactions: Transaction[]): number {
  return roundMoney(
    transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  )
}

/**
 * Break down current savings by income source.
 * Only income transactions are counted (spending is not attributed to a source).
 * Values can be negative if spending exceeds a particular source's total — the
 * breakdown is informational and should be displayed alongside the balance.
 */
export function calculateSourceBreakdown(transactions: Transaction[]): SourceBreakdown {
  return {
    allowance: roundMoney(
      transactions.filter((t) => t.source === 'allowance').reduce((s, t) => s + t.amount, 0)
    ),
    gift: roundMoney(
      transactions.filter((t) => t.source === 'gift').reduce((s, t) => s + t.amount, 0)
    ),
    interest: roundMoney(
      transactions.filter((t) => t.source === 'interest').reduce((s, t) => s + t.amount, 0)
    ),
    jobs: roundMoney(
      transactions.filter((t) => t.source === 'jobs').reduce((s, t) => s + t.amount, 0)
    ),
  }
}
