'use client'

import { useState, useTransition } from 'react'
import { removeChild } from '@/actions/children'

interface Props {
  childId: string
  childName: string
}

export default function DeleteChildButton({ childId, childName }: Props) {
  const [confirming, setConfirming]   = useState(false)
  const [error, setError]             = useState<string>()
  const [isPending, startTransition]  = useTransition()

  function handleDelete() {
    setError(undefined)
    startTransition(async () => {
      const result = await removeChild(childId)
      if (!result?.success) setError(result?.error ?? 'Failed to delete')
    })
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="w-full rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
      >
        Delete profile
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
      <p className="text-sm font-medium text-red-700">
        Delete {childName}'s profile?
      </p>
      <p className="text-xs text-red-500">
        This permanently deletes all transactions, goals, and history. This cannot be undone.
      </p>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-white transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors disabled:opacity-50"
        >
          {isPending ? 'Deleting…' : 'Yes, delete'}
        </button>
      </div>
    </div>
  )
}
