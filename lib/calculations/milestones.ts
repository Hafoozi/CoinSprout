import type { MilestoneType } from '@/types/database'
import type { MilestoneDefinition, ResolvedChildSettings } from '@/types/domain'
import { MILESTONES } from '@/lib/constants/milestone-thresholds'
import { DEFAULT_SETTINGS } from '@/lib/calculations/child-settings'

/**
 * Build the ordered milestone list with per-child thresholds applied.
 * Labels and icon paths come from the static MILESTONES constant;
 * only the threshold values are overridden.
 */
function resolveMilestones(
  thresholds: ResolvedChildSettings['milestoneThresholds']
): MilestoneDefinition[] {
  return MILESTONES.map((m) => ({
    ...m,
    threshold: thresholds[m.type as keyof typeof thresholds] ?? m.threshold,
  }))
}

/**
 * Return all milestone types that should be unlocked for a given lifetime earnings amount.
 */
export function getEarnedMilestones(
  lifetimeEarnings: number,
  thresholds: ResolvedChildSettings['milestoneThresholds'] = DEFAULT_SETTINGS.milestoneThresholds
): MilestoneType[] {
  return resolveMilestones(thresholds)
    .filter((m) => lifetimeEarnings >= m.threshold)
    .map((m) => m.type)
}

/**
 * Return the next milestone the child hasn't unlocked yet, or null if all are unlocked.
 */
export function getNextMilestone(
  lifetimeEarnings: number,
  thresholds: ResolvedChildSettings['milestoneThresholds'] = DEFAULT_SETTINGS.milestoneThresholds
): MilestoneDefinition | null {
  return resolveMilestones(thresholds).find((m) => lifetimeEarnings < m.threshold) ?? null
}

/**
 * How much more the child needs to earn to reach the next milestone.
 */
export function amountToNextMilestone(
  lifetimeEarnings: number,
  thresholds: ResolvedChildSettings['milestoneThresholds'] = DEFAULT_SETTINGS.milestoneThresholds
): number {
  const next = getNextMilestone(lifetimeEarnings, thresholds)
  return next ? Math.max(0, next.threshold - lifetimeEarnings) : 0
}
