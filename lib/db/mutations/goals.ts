import { createClient } from '@/lib/supabase/server'
import { roundMoney } from '@/lib/utils/math'
import type { Goal } from '@/lib/db/types'

export async function createGoal(data: {
  childId: string
  name: string
  targetPrice: number
}): Promise<Goal | null> {
  const supabase = await createClient()
  const { data: goal } = await supabase
    .from('goals')
    .insert({
      child_id:    data.childId,
      name:        data.name,
      target_price: data.targetPrice,
    })
    .select()
    .single()
  return goal ?? null
}

/**
 * Allocate money toward a goal.
 *
 * The caller must pass the current savings balance and total already allocated
 * (computed from all transactions and goals for the child). This lets the
 * mutation enforce the invariant without re-fetching those values itself.
 *
 * Invariant: currentTotalAllocated + amount ≤ currentSavingsBalance
 *
 * Returns the updated goal, or null if the allocation would exceed free savings.
 * Two writes are made (goal_allocations insert + goals update). They are not
 * wrapped in a DB transaction — for this app's scale that is acceptable. If one
 * fails, the discrepancy will be visible in the audit trail.
 */
export async function allocateToGoal(data: {
  goalId: string
  amount: number
  currentSavingsBalance: number
  currentTotalAllocated: number
}): Promise<Goal | null> {
  const { goalId, amount, currentSavingsBalance, currentTotalAllocated } = data

  // Server-side guard — never skip this check.
  const freeToUse = roundMoney(currentSavingsBalance - currentTotalAllocated)
  if (amount > freeToUse) return null

  const supabase = await createClient()

  // Fetch goal to get current allocated_amount.
  const { data: goal } = await supabase
    .from('goals')
    .select('*')
    .eq('id', goalId)
    .single()
  if (!goal) return null

  const newAllocated = roundMoney(goal.allocated_amount + amount)

  // 1. Append to the allocation audit trail.
  await supabase
    .from('goal_allocations')
    .insert({ goal_id: goalId, amount })

  // 2. Update the cached total on the goal row.
  const { data: updated } = await supabase
    .from('goals')
    .update({ allocated_amount: newAllocated })
    .eq('id', goalId)
    .select()
    .single()

  return updated ?? null
}
