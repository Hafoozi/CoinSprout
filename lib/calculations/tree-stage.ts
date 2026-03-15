import type { TreeStage } from '@/types/domain'

/**
 * Determine the tree's visual stage based on lifetime earnings.
 *
 * Thresholds (subject to tuning):
 *   $0   → sapling
 *   $25  → young
 *   $100 → growing
 *   $250 → mature
 */
export function calculateTreeStage(lifetimeEarnings: number): TreeStage {
  if (lifetimeEarnings >= 250) return 'mature'
  if (lifetimeEarnings >= 100) return 'growing'
  if (lifetimeEarnings >= 25)  return 'young'
  return 'sapling'
}
