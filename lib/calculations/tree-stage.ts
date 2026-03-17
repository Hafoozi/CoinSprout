import type { TreeStage, ResolvedChildSettings } from '@/types/domain'
import { DEFAULT_SETTINGS } from '@/lib/calculations/child-settings'

/**
 * Determine the tree's visual stage based on lifetime earnings.
 * Thresholds come from per-child settings, falling back to app defaults.
 */
export function calculateTreeStage(
  lifetimeEarnings: number,
  thresholds: ResolvedChildSettings['treeThresholds'] = DEFAULT_SETTINGS.treeThresholds
): TreeStage {
  if (lifetimeEarnings >= thresholds.ancient) return 'ancient'
  if (lifetimeEarnings >= thresholds.mature)  return 'mature'
  if (lifetimeEarnings >= thresholds.growing) return 'growing'
  if (lifetimeEarnings >= thresholds.young)   return 'young'
  return 'sapling'
}
