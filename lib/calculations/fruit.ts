import type { Transaction } from '@/types/database'
import type { FruitCluster } from '@/types/domain'
import type { IncomeSource } from '@/lib/constants/sources'
import { FRUIT_UNIT_VALUE, SOURCE_FRUIT_COLOR, MAX_FRUIT_PER_SOURCE } from '@/lib/constants/fruit-values'
import { roundMoney } from '@/lib/utils/math'

/**
 * Build fruit clusters from the current transaction set.
 *
 * Only income transactions (allowance, gift, interest) contribute fruit.
 * Spending reduces the total savings, which reduces fruit counts proportionally.
 *
 * Strategy:
 * 1. Calculate total savings balance.
 * 2. Calculate each income source's proportion of positive transactions.
 * 3. Distribute the savings balance across sources by proportion.
 * 4. Convert each source's share into a fruit count (floor(amount / FRUIT_UNIT_VALUE)).
 */
export function calculateFruitClusters(transactions: Transaction[]): FruitCluster[] {
  const savingsBalance = roundMoney(transactions.reduce((s, t) => s + t.amount, 0))
  if (savingsBalance <= 0) return []

  const incomeSources: IncomeSource[] = ['allowance', 'gift', 'interest', 'jobs']

  // Total per source (positive transactions only)
  const sourceTotal: Record<IncomeSource, number> = {
    allowance: 0, gift: 0, interest: 0, jobs: 0,
  }
  let totalIncome = 0
  for (const t of transactions) {
    if (t.amount > 0 && incomeSources.includes(t.source as IncomeSource)) {
      sourceTotal[t.source as IncomeSource] += t.amount
      totalIncome += t.amount
    }
  }

  if (totalIncome === 0) return []

  const clusters: FruitCluster[] = []
  for (const source of incomeSources) {
    const proportion = sourceTotal[source] / totalIncome
    const sourceBalance = roundMoney(savingsBalance * proportion)
    const count = Math.min(
      Math.floor(sourceBalance / FRUIT_UNIT_VALUE),
      MAX_FRUIT_PER_SOURCE
    )
    if (count > 0) {
      clusters.push({
        source,
        color: SOURCE_FRUIT_COLOR[source],
        count,
        totalValue: roundMoney(count * FRUIT_UNIT_VALUE),
      })
    }
  }
  return clusters
}
