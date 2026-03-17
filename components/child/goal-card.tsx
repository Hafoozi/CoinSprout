'use client'

import { useState, useTransition } from 'react'
import Progress from '@/components/ui/progress'
import MoneyAmount from '@/components/shared/money-amount'
import { childAllocateToGoal, childDeallocateFromGoal } from '@/actions/goals'
import type { GoalWithProgress } from '@/types/domain'

interface Props {
  goal:      GoalWithProgress
  freeToUse: number
}

function fmt(n: number) {
  return '$' + n.toFixed(2)
}

type Mode = 'add' | 'remove' | null

export default function GoalCard({ goal, freeToUse }: Props) {
  const [mode,       setMode]       = useState<Mode>(null)
  const [selected,   setSelected]   = useState<number | null>(null)
  const [error,      setError]      = useState<string>()
  const [isPending,  startTransition] = useTransition()

  // Add: can't exceed free savings OR overfund the goal
  const remaining    = goal.targetPrice - goal.allocatedAmount
  const maxAdd       = Math.min(freeToUse, remaining)
  const addPicks     = [1, 5, 10, 20].filter((n) => n <= maxAdd)
  const addAllAmount = Math.floor(maxAdd * 100) / 100

  // Remove: can't exceed what's already allocated
  const maxRemove       = goal.allocatedAmount
  const removePicks     = [1, 5, 10, 20].filter((n) => n <= maxRemove)
  const removeAllAmount = Math.floor(maxRemove * 100) / 100

  function handleQuickPick(amount: number) {
    setSelected(amount)
    setError(undefined)
  }

  function handleAll() {
    setSelected(mode === 'add' ? addAllAmount : removeAllAmount)
    setError(undefined)
  }

  function handleCancel() {
    setMode(null)
    setSelected(null)
    setError(undefined)
  }

  function handleSave() {
    if (!selected || selected <= 0 || !mode) return
    setError(undefined)
    startTransition(async () => {
      const result = mode === 'add'
        ? await childAllocateToGoal(goal.id, selected)
        : await childDeallocateFromGoal(goal.id, selected)
      if (result.success) {
        setMode(null)
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

      {/* ── Action buttons (idle state) ── */}
      {!goal.isComplete && mode === null && (
        <div className="flex gap-2">
          {maxAdd > 0 && (
            <button
              onClick={() => setMode('add')}
              className="flex-1 rounded-xl bg-sprout-500 hover:bg-sprout-600 active:bg-sprout-700 text-white font-bold py-2.5 text-sm transition-colors"
            >
              + Add
            </button>
          )}
          {maxRemove > 0 && (
            <button
              onClick={() => setMode('remove')}
              className="flex-1 rounded-xl border-2 border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-500 hover:text-red-500 font-bold py-2.5 text-sm transition-colors"
            >
              − Take back
            </button>
          )}
          {maxAdd <= 0 && maxRemove <= 0 && freeToUse <= 0 && (
            <p className="w-full text-xs text-center text-gray-400 pt-1">
              No free savings yet — keep earning! 💪
            </p>
          )}
        </div>
      )}

      {/* ── Add / Remove panel ── */}
      {!goal.isComplete && mode !== null && (
        <div className="space-y-3 pt-1 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {mode === 'add' ? 'How much to add?' : 'How much to take back?'}
            </p>
            <p className="text-xs text-gray-400">
              {mode === 'add' ? `${fmt(freeToUse)} free` : `${fmt(maxRemove)} in goal`}
            </p>
          </div>

          {/* Quick-pick buttons */}
          <div className="flex flex-wrap gap-2">
            {(mode === 'add' ? addPicks : removePicks).map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickPick(amount)}
                className={[
                  'rounded-xl px-4 py-2 text-sm font-bold border-2 transition-all',
                  selected === amount
                    ? mode === 'add'
                      ? 'bg-sprout-500 border-sprout-500 text-white scale-105'
                      : 'bg-red-500 border-red-500 text-white scale-105'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-sprout-300',
                ].join(' ')}
              >
                {fmt(amount)}
              </button>
            ))}
            {/* "All" button */}
            {(mode === 'add' ? addAllAmount : removeAllAmount) > 0 &&
              !(mode === 'add' ? addPicks : removePicks).includes(
                mode === 'add' ? addAllAmount : removeAllAmount
              ) && (
              <button
                onClick={handleAll}
                className={[
                  'rounded-xl px-4 py-2 text-sm font-bold border-2 transition-all',
                  selected === (mode === 'add' ? addAllAmount : removeAllAmount)
                    ? mode === 'add'
                      ? 'bg-sprout-500 border-sprout-500 text-white scale-105'
                      : 'bg-red-500 border-red-500 text-white scale-105'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-sprout-300',
                ].join(' ')}
              >
                All ({fmt(mode === 'add' ? addAllAmount : removeAllAmount)})
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
              className={[
                'flex-1 rounded-xl font-bold py-2.5 text-sm transition-colors disabled:opacity-40 text-white',
                mode === 'add'
                  ? 'bg-sprout-500 hover:bg-sprout-600'
                  : 'bg-red-500 hover:bg-red-600',
              ].join(' ')}
            >
              {isPending ? 'Saving…' : `${mode === 'add' ? 'Add' : 'Take back'} ${selected ? fmt(selected) : ''}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
