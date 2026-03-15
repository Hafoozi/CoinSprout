import type { Goal } from '@/types/database'
import type { GoalWithProgress } from '@/types/domain'
import { roundMoney, clamp } from '@/lib/utils/math'

/**
 * Total amount currently allocated across all goals for a child.
 */
export function calculateTotalAllocated(goals: Goal[]): number {
  return roundMoney(goals.reduce((sum, g) => sum + g.allocated_amount, 0))
}

/**
 * Unallocated savings = current savings balance minus total goal allocations.
 */
export function calculateUnallocatedSavings(savingsBalance: number, goals: Goal[]): number {
  return roundMoney(savingsBalance - calculateTotalAllocated(goals))
}

/**
 * Enrich a Goal with its computed progress percentage.
 */
export function toGoalWithProgress(goal: Goal): GoalWithProgress {
  const progress = goal.target_price > 0
    ? (goal.allocated_amount / goal.target_price) * 100
    : 0

  return {
    id:              goal.id,
    name:            goal.name,
    targetPrice:     goal.target_price,
    allocatedAmount: goal.allocated_amount,
    progressPercent: clamp(progress, 0, 100),
    isComplete:      goal.allocated_amount >= goal.target_price,
  }
}
