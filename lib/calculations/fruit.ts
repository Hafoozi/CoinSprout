import type { FruitCluster, FruitColor } from '@/types/domain'
import { MAX_FRUIT_PER_DENOM } from '@/lib/constants/fruit-values'
import { DEFAULT_SETTINGS } from '@/lib/calculations/child-settings'

/**
 * Build the fruit denomination ladder from a base value.
 * Multipliers: ×1, ×2, ×4, ×50, ×200 — matching the default $5/$10/$20/$250/$1000 ladder.
 */
function buildDenominations(base: number): Array<{ value: number; color: FruitColor }> {
  return [
    { value: base * 200, color: 'sparkling' },
    { value: base * 50,  color: 'gold'      },
    { value: base * 4,   color: 'silver'    },
    { value: base * 2,   color: 'red'       },
    { value: base,       color: 'green'     },
  ]
}

/**
 * Build fruit clusters from the child's current savings balance.
 * Uses a greedy denomination system scaled from the per-child base value.
 *
 * e.g. base=$5, balance=$47 → 2 silver ($20ea) + 1 red ($10ea) + 1 green ($5ea) = $45 shown
 */
export function calculateFruitClusters(
  savingsBalance: number,
  fruitBaseValue: number = DEFAULT_SETTINGS.fruitBaseValue
): FruitCluster[] {
  if (savingsBalance <= 0) return []

  const denominations = buildDenominations(fruitBaseValue)
  const clusters: FruitCluster[] = []
  let remaining = Math.max(0, savingsBalance)

  for (const { value, color } of denominations) {
    const count = Math.min(Math.floor(remaining / value), MAX_FRUIT_PER_DENOM)
    if (count > 0) {
      clusters.push({ color, denomination: value, count })
      remaining = Math.round((remaining - count * value) * 100) / 100
    }
  }

  return clusters
}
