'use client'

import { useState, useTransition } from 'react'
import Progress from '@/components/ui/progress'
import MoneyAmount from '@/components/shared/money-amount'
import { childAllocateToGoal } from '@/actions/goals'
import type { GoalWithProgress } from '@/types/domain'

interface Props {
  goal:      GoalWithProgress
  freeToUse: number
}

function fmt(n: number) {
  return '$' + n.toFixed(2)
}

export default function GoalCard({ goal, freeToUse }: Props) {
  const [adding,     setAdding]     = useState(false)
  const [selected,   setSelected]   = useState<number | null>(null)
  const [error,      setError]      = useState<string>()
  const [isPending,  startTransition] = useTransition()

  // Max the child can add: can't exceed free savings OR overfund the goal
  const remaining = goal.targetPrice - goal.allocatedAmount
  const maxAmount = Math.min(freeToUse, remaining)

  // Quick-pick denominations — only show ones that fit
  const QUICK_PICKS = [1, 5, 10, 20].filter((n) => n <= maxAmount)
  const allAmount   = Math.floor(maxAmount * 100) / 100  // round down to cents

  function handleQuickPick(amount: number) {
    setSelected(amount)
    setError(undefined)
  }

  function handleAll() {
    setSelected(allAmount)
    setError(undefined)
  }

  function handleCancel() {
    setAdding(false)
    setSelected(null)
    setError(undefined)
  }

  function handleSave() {
    if (!selected || selected <= 0) return
    setError(undefined)
    startTransition(async () => {
      const result = await childAllocateToGoal(goal.id, selected)
      if (result.success) {
        setAdding(false)
        setSelected(null)
      } else {
        setError(result.error ?? 'Something went wrong')
      }
    })
  }

  return (
    <div className="card-surface p-4 space-y-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 truncate">{goal.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Goal: <MoneyAmount amount={goal.targetPrice} size="sm" className="text-gray-500" />
          </p>
        </div>

        {goal.isComplete ? (
          <span className="shrink-0 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-700">
            Complete 🎉
          </span>
        ) : (
          <div className="shrink-0 text-right">
            <MoneyAmount amount={goal.allocatedAmount} size="sm" className="text-sprout-700 font-semibold" />
            <p className="text-xs text-gray-400">saved</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <Progress
          value={goal.progressPercent}
          color={goal.isComplete ? 'gold' : 'green'}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{goal.progressPercent.toFixed(0)}% funded</span>
          {!goal.isComplete && (
            <span>
              <MoneyAmount
                amount={goal.targetPrice - goal.allocatedAmount}
                size="sm"
                className="text-gray-400"
              />
              {' '}to go
            </span>
          )}
        </div>
      </div>

      {/* ── Allocation UI (incomplete goals with available funds) ── */}
      {!goal.isComplete && maxAmount > 0 && (
        <>
          {!adding ? (
            <button
              onClick={() => setAdding(true)}
              className="w-full rounded-xl bg-sprout-500 hover:bg-sprout-600 active:bg-sprout-700 text-white font-bold py-2.5 text-sm transition-colors"
            >
              + Add to this goal
            </button>
          ) : (
            <div className="space-y-3 pt-1 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">How much to add?</p>
                <p className="text-xs text-gray-400">You have {fmt(freeToUse)} free</p>
              </div>

              {/* Quick-pick buttons */}
              <div className="flex flex-wrap gap-2">
                {QUICK_PICKS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickPick(amount)}
                    className={[
                      'rounded-xl px-4 py-2 text-sm font-bold border-2 transition-all',
                      selected === amount
                        ? 'bg-sprout-500 border-sprout-500 text-white scale-105'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-sprout-300',
                    ].join(' ')}
                  >
                    {fmt(amount)}
                  </button>
                ))}
                {/* "All in" button */}
                {allAmount > 0 && !QUICK_PICKS.includes(allAmount) && (
                  <button
                    onClick={handleAll}
                    className={[
                      'rounded-xl px-4 py-2 text-sm font-bold border-2 transition-all',
                      selected === allAmount
                        ? 'bg-sprout-500 border-sprout-500 text-white scale-105'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-sprout-300',
                    ].join(' ')}
                  >
                    All ({fmt(allAmount)})
                  </button>
                )}
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              {/* Confirm / cancel */}
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isPending}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!selected || isPending}
                  className="flex-1 rounded-xl bg-sprout-500 hover:bg-sprout-600 disabled:opacity-40 text-white font-bold py-2.5 text-sm transition-colors"
                >
                  {isPending ? 'Saving…' : `Save ${selected ? fmt(selected) : ''}`}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* No funds available message */}
      {!goal.isComplete && maxAmount <= 0 && freeToUse <= 0 && (
        <p className="text-xs text-center text-gray-400 pt-1">
          No free savings yet — keep earning! 💪
        </p>
      )}
    </div>
  )
}
