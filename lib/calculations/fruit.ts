import type { FruitCluster, FruitColor, ResolvedChildSettings } from '@/types/domain'
import { MAX_FRUIT_PER_DENOM } from '@/lib/constants/fruit-values'
import { DEFAULT_SETTINGS } from '@/lib/calculations/child-settings'

/**
 * Build fruit clusters from the child's current savings balance.
 * Uses a greedy denomination system with per-child apple values.
 *
 * e.g. green=$5, red=$10, silver=$20, gold=$250, sparkling=$1000
 *      balance=$47 → 2×silver ($20) + 1×red ($10) + 1×green ($5) = $45 shown
 */
export function calculateFruitClusters(
  savingsBalance: number,
  fruitValues: ResolvedChildSettings['fruitValues'] = DEFAULT_SETTINGS.fruitValues
): FruitCluster[] {
  if (savingsBalance <= 0) return []

  const denominations: Array<{ value: number; color: FruitColor }> = [
    { value: fruitValues.sparkling, color: 'sparkling' },
    { value: fruitValues.gold,      color: 'gold'      },
    { value: fruitValues.silver,    color: 'silver'    },
    { value: fruitValues.red,       color: 'red'       },
    { value: fruitValues.green,     color: 'green'     },
  ]

  const clusters: FruitCluster[] = []
  let remaining = Math.max(0, savingsBalance)

  for (const { value, color } of denominations) {
    if (value <= 0) continue
    const count = Math.min(Math.floor(remaining / value), MAX_FRUIT_PER_DENOM)
    if (count > 0) {
      clusters.push({ color, denomination: value, count })
      remaining = Math.round((remaining - count * value) * 100) / 100
    }
  }

  return clusters
}
