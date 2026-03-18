'use client'

import { useState, useTransition } from 'react'
import { useFormState } from 'react-dom'
import Dialog from '@/components/ui/dialog'
import RecurringAllowanceForm from '@/components/parent/recurring-allowance-form'
import { skipNextAllowance } from '@/actions/recurring-allowance'
import { useCurrency } from '@/components/providers/currency-provider'
import type { RecurringAllowance } from '@/lib/db/types'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function nextOccurrence(dayOfWeek: number): Date {
  const today     = new Date()
  const todayDay  = today.getDay()
  let daysUntil   = (dayOfWeek - todayDay + 7) % 7
  if (daysUntil === 0) daysUntil = 7
  const next = new Date(today)
  next.setDate(today.getDate() + daysUntil)
  return next
}

interface Props {
  childId:  string
  allowance: RecurringAllowance | null
}

export default function AllowanceWidget({ childId, allowance }: Props) {
  const currency              = useCurrency()
  const [editOpen, setEditOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [skipError, setSkipError]    = useState<string>()
  const [skipped,   setSkipped]      = useState(false)

  if (!allowance?.is_active) return null

  const next    = nextOccurrence(allowance.day_of_week)
  const nextStr = next.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  function handleSkip() {
    setSkipError(undefined)
    startTransition(async () => {
      const result = await skipNextAllowance(childId)
      if (result.success) setSkipped(true)
      else setSkipError(result.error ?? 'Failed to skip')
    })
  }

  return (
    <>
      <div className="card-surface p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">💵 Upcoming Allowance</p>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="text-xs text-sprout-600 hover:text-sprout-800 font-medium transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-2xl font-bold text-sprout-700">
              {currency}{allowance.amount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">
              every {DAY_NAMES[allowance.day_of_week]} · next {nextStr}
            </p>
          </div>

          {skipped ? (
            <span className="text-xs text-gray-400 italic">Skipped</span>
          ) : (
            <button
              type="button"
              onClick={handleSkip}
              disabled={isPending}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {isPending ? '…' : 'Skip next'}
            </button>
          )}
        </div>

        {skipError && <p className="text-xs text-red-500">{skipError}</p>}
      </div>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} title="Edit Allowance">
        <RecurringAllowanceForm
          childId={childId}
          existing={allowance}
          onSuccess={() => setEditOpen(false)}
        />
      </Dialog>
    </>
  )
}
