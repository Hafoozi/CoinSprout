import type { MilestoneType } from '@/types/database'
import { MILESTONES } from '@/lib/constants/milestone-thresholds'

/**
 * Return all milestone types that should be unlocked for a given lifetime earnings amount.
 */
export function getEarnedMilestones(lifetimeEarnings: number): MilestoneType[] {
  return MILESTONES
    .filter((m) => lifetimeEarnings >= m.threshold)
    .map((m) => m.type)
}

/**
 * Return the next milestone the child hasn't unlocked yet, or null if all are unlocked.
 */
export function getNextMilestone(lifetimeEarnings: number): typeof MILESTONES[0] | null {
  return MILESTONES.find((m) => lifetimeEarnings < m.threshold) ?? null
}

/**
 * How much more the child needs to earn to reach the next milestone.
 */
export function amountToNextMilestone(lifetimeEarnings: number): number {
  const next = getNextMilestone(lifetimeEarnings)
  return next ? Math.max(0, next.threshold - lifetimeEarnings) : 0
}
