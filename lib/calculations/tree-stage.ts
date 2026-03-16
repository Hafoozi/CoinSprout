import type { TreeStage } from '@/types/domain'

/**
 * Determine the tree's visual stage based on lifetime earnings.
 *
 * Thresholds:
 *   $0    → sapling
 *   $50   → young
 *   $200  → growing
 *   $500  → mature
 *   $1000 → ancient
 */
export function calculateTreeStage(lifetimeEarnings: number): TreeStage {
  if (lifetimeEarnings >= 1000) return 'ancient'
  if (lifetimeEarnings >= 500)  return 'mature'
  if (lifetimeEarnings >= 200)  return 'growing'
  if (lifetimeEarnings >= 50)   return 'young'
  return 'sapling'
}
