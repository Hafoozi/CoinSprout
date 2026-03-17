import { createClient } from '@/lib/supabase/server'
import { getEarnedMilestones } from '@/lib/calculations/milestones'
import { getChildSettings } from '@/lib/db/queries/child-settings'
import { resolveChildSettings } from '@/lib/calculations/child-settings'
import { roundMoney } from '@/lib/utils/math'
import type { MilestoneType } from '@/lib/db/types'

/**
 * After a positive transaction is recorded, recompute lifetime earnings for
 * the child and insert rows for any milestones whose threshold was just crossed.
 *
 * Respects per-child milestone thresholds if configured.
 * Safe to call repeatedly — the unique constraint on (child_id, milestone_type)
 * prevents duplicates. Returns the list of newly unlocked milestone types.
 */
export async function syncMilestones(childId: string): Promise<MilestoneType[]> {
  const supabase = await createClient()

  // 1. Compute current lifetime earnings (positive transactions only).
  const { data: positiveRows } = await supabase
    .from('transactions')
    .select('amount')
    .eq('child_id', childId)
    .gt('amount', 0)

  const lifetimeEarnings = roundMoney(
    (positiveRows ?? []).reduce((sum, r) => sum + r.amount, 0)
  )

  // 2. Resolve per-child milestone thresholds.
  const settingsRow = await getChildSettings(childId)
  const { milestoneThresholds } = resolveChildSettings(settingsRow)

  // 3. Which milestones should be earned by now?
  const shouldBeEarned = getEarnedMilestones(lifetimeEarnings, milestoneThresholds)
  if (shouldBeEarned.length === 0) return []

  // 4. Which milestones are already recorded in the DB?
  const { data: existing } = await supabase
    .from('milestones')
    .select('milestone_type')
    .eq('child_id', childId)

  const existingSet = new Set((existing ?? []).map((m) => m.milestone_type))

  // 5. Insert only the newly crossed ones.
  const newlyEarned = shouldBeEarned.filter((t) => !existingSet.has(t))
  if (newlyEarned.length > 0) {
    await supabase
      .from('milestones')
      .insert(newlyEarned.map((milestone_type) => ({ child_id: childId, milestone_type })))
  }

  return newlyEarned
}
