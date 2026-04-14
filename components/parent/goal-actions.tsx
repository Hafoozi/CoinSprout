'use client'

import { useState, useTransition } from 'react'
import GoalCard from '@/components/child/goal-card'
import Dialog from '@/components/ui/dialog'
import { deleteGoal, completeGoal } from '@/actions/goals'
import type { GoalWithProgress } from '@/types/domain'

interface Props {
  goal:      GoalWithProgress
  freeToUse: number
}

export default function GoalActions({ goal, freeToUse }: Props) {
  const [confirmDelete,   setConfirmDelete]   = useState(false)
  const [confirmComplete, setConfirmComplete] = useState(false)
  const [error,           setError]           = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    setError(null)
    const fd = new FormData()
    fd.set('goalId', goal.id)
    startTransition(async () => {
      const result = await deleteGoal(null, fd)
      if (!result.success) setError(result.error ?? 'Delete failed')
      else setConfirmDelete(false)
    })
  }

  function handleComplete() {
    setError(null)
    const fd = new FormData()
    fd.set('goalId', goal.id)
    startTransition(async () => {
      const result = await completeGoal(null, fd)
      if (!result.success) setError(result.error ?? 'Failed to mark complete')
      else setConfirmComplete(false)
    })
  }

  return (
    <>
      <div className="space-y-2">
        <GoalCard goal={goal} freeToUse={freeToUse} />

        {/* Action row */}
        <div className="flex gap-2 px-1">
          {!goal.isComplete && (
            <button
              type="button"
              onClick={() => { setError(null); setConfirmComplete(true) }}
              className="text-xs font-medium text-sprout-600 hover:text-sprout-800 transition-colors"
            >
              ✓ Mark complete
            </button>
          )}
          <button
            type="button"
            onClick={() => { setError(null); setConfirmDelete(true) }}
            className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors ml-auto"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Complete confirmation */}
      <Dialog
        open={confirmComplete}
        onClose={() => setConfirmComplete(false)}
        title="Mark goal complete?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This will mark <strong>{goal.name}</strong> as fully funded. Use this when the
            child has achieved the goal outside the app.
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmComplete(false)}
              className="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleComplete}
              disabled={isPending}
              className="flex-1 rounded-xl bg-sprout-500 py-2 text-sm font-semibold text-white hover:bg-sprout-600 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Saving…' : 'Mark complete'}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete goal?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Permanently delete <strong>{goal.name}</strong>? This cannot be undone.
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
