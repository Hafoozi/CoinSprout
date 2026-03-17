import type { FruitCluster } from '@/types/domain'
import { FRUIT_DENOMINATIONS, MAX_FRUIT_PER_DENOM } from '@/lib/constants/fruit-values'

/**
 * Build fruit clusters from the child's current savings balance.
 *
 * Uses a greedy denomination system:
 *   gold  = $20 each
 *   red   = $10 each
 *   green = $5  each
 *
 * e.g. $47 → 2 gold ($40) + 0 red + 1 green ($5) = $45 shown, $2 remainder (no partial fruit)
 */
export function calculateFruitClusters(savingsBalance: number): FruitCluster[] {
  if (savingsBalance <= 0) return []

  const clusters: FruitCluster[] = []
  let remaining = Math.max(0, savingsBalance)

  for (const { value, color } of FRUIT_DENOMINATIONS) {
    const count = Math.min(Math.floor(remaining / value), MAX_FRUIT_PER_DENOM)
    if (count > 0) {
      clusters.push({ color, denomination: value, count })
      remaining = Math.round((remaining - count * value) * 100) / 100
    }
  }

  return clusters
}
