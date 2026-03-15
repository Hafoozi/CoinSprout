import { getTransactionsByChildId } from '@/lib/db/queries/transactions'
import { getGoalsByChildId } from '@/lib/db/queries/goals'
import { getMilestonesByChildId } from '@/lib/db/queries/milestones'
import { calculateSavingsBalance, calculateTotalSpent, calculateSourceBreakdown } from '@/lib/calculations/savings'
import { calculateLifetimeEarnings } from '@/lib/calculations/lifetime-earnings'
import { calculateTotalAllocated, calculateUnallocatedSavings, toGoalWithProgress } from '@/lib/calculations/goals'
import type { ChildFinancialSummary, GoalWithProgress } from '@/types/domain'
import type { Milestone, Transaction } from '@/lib/db/types'

export interface ChildDashboardData {
  summary:      ChildFinancialSummary
  transactions: Transaction[]
  goals:        GoalWithProgress[]
  milestones:   Milestone[]
}

/**
 * Fetch everything needed to render a child's view in a single call.
 * Three Supabase queries run in parallel; all calculations are done in memory.
 */
export async function getChildDashboardData(childId: string): Promise<ChildDashboardData | null> {
  const [transactions, goals, milestones] = await Promise.all([
    getTransactionsByChildId(childId),
    getGoalsByChildId(childId),
    getMilestonesByChildId(childId),
  ])

  const savingsBalance   = calculateSavingsBalance(transactions)
  const lifetimeEarnings = calculateLifetimeEarnings(transactions)
  const totalSpent       = calculateTotalSpent(transactions)
  const allocatedToGoals = calculateTotalAllocated(goals)
  const freeToUse        = calculateUnallocatedSavings(savingsBalance, goals)
  const sourceBreakdown  = calculateSourceBreakdown(transactions)

  const summary: ChildFinancialSummary = {
    savingsBalance,
    lifetimeEarnings,
    totalSpent,
    allocatedToGoals,
    freeToUse,
    sourceBreakdown,
  }

  return {
    summary,
    transactions,
    goals: goals.map(toGoalWithProgress),
    milestones,
  }
}
