'use client'

import { useState, useTransition, useRef } from 'react'
import Dialog from '@/components/ui/dialog'
import RecurringAllowanceForm from '@/components/parent/recurring-allowance-form'
import { skipNextAllowance, undoSkipAllowance, setAllowanceOverride } from '@/actions/recurring-allowance'
import { useCurrency } from '@/components/providers/currency-provider'
import { useRouter } from 'next/navigation'
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
  childId:   string
  allowance: RecurringAllowance | null
}

export default function AllowanceWidget({ childId, allowance }: Props) {
  const currency                        = useCurrency()
  const router                          = useRouter()
  const [editOpen, setEditOpen]         = useState(false)
  const [isPending, startTransition]    = useTransition()
  const [skipError, setSkipError]       = useState<string>()
  const [skipped, setSkipped]           = useState(false)

  // Inline override editing
  const [editingAmount, setEditingAmount] = useState(false)
  const [overrideInput, setOverrideInput] = useState('')
  const [overrideError, setOverrideError] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)

  if (!allowance?.is_active) return null

  const next    = nextOccurrence(allowance.day_of_week)
  const nextStr = next.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const h       = allowance.hour_of_day
  const ampm    = h < 12 ? 'AM' : 'PM'
  const h12     = h % 12 === 0 ? 12 : h % 12
  const timeStr = `${h12}:00 ${ampm}`

  const hasOverride    = allowance.next_amount_override != null
  const displayAmount  = allowance.next_amount_override ?? allowance.amount

  function startEditingAmount() {
    setOverrideInput(displayAmount.toFixed(2))
    setOverrideError(undefined)
    setEditingAmount(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function cancelEditingAmount() {
    setEditingAmount(false)
    setOverrideError(undefined)
  }

  function handleSaveOverride() {
    const val = parseFloat(overrideInput)
    if (isNaN(val) || val <= 0) {
      setOverrideError('Enter a valid amount')
      return
    }
    setOverrideError(undefined)
    startTransition(async () => {
      const result = await setAllowanceOverride(childId, val)
      if (result.success) {
        setEditingAmount(false)
        router.refresh()
      } else {
        setOverrideError(result.error ?? 'Failed to save')
      }
    })
  }

  function handleClearOverride() {
    startTransition(async () => {
      await setAllowanceOverride(childId, null)
      router.refresh()
    })
  }

  function handleSkip() {
    setSkipError(undefined)
    startTransition(async () => {
      const result = await skipNextAllowance(childId)
      if (result.success) setSkipped(true)
      else setSkipError(result.error ?? 'Failed to skip')
    })
  }

  function handleUndoSkip() {
    setSkipError(undefined)
    startTransition(async () => {
      const result = await undoSkipAllowance(childId)
      if (result.success) setSkipped(false)
      else setSkipError(result.error ?? 'Failed to undo')
    })
  }

  return (
    <>
      <div className="card-surface p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">💵 Upcoming Allowance</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={startEditingAmount}
              className="text-xs text-sprout-600 hover:text-sprout-800 font-medium transition-colors"
            >
              Edit amount
            </button>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="text-xs text-sprout-600 hover:text-sprout-800 font-medium transition-colors"
            >
              Edit schedule
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            {/* Editable one-time amount */}
            {editingAmount ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-sprout-700">{currency}</span>
                <input
                  ref={inputRef}
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={overrideInput}
                  onChange={(e) => setOverrideInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveOverride()
                    if (e.key === 'Escape') cancelEditingAmount()
                  }}
                  className="w-24 rounded-lg border border-sprout-300 px-2 py-0.5 text-xl font-bold text-sprout-700 focus:outline-none focus:ring-2 focus:ring-sprout-400"
                />
                <button
                  type="button"
                  onClick={handleSaveOverride}
                  disabled={isPending}
                  className="text-xs text-sprout-600 font-medium hover:text-sprout-800 disabled:opacity-50"
                >
                  {isPending ? '…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={cancelEditingAmount}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={startEditingAmount}
                  title="Click to set a one-time amount for this payout"
                  className="text-2xl font-bold text-sprout-700 hover:text-sprout-500 transition-colors"
                >
                  {currency}{displayAmount.toFixed(2)}
                </button>
                {hasOverride && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    this week only
                    <button
                      type="button"
                      onClick={handleClearOverride}
                      disabled={isPending}
                      className="ml-0.5 leading-none hover:text-amber-900 disabled:opacity-50"
                      title="Revert to recurring amount"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
            {overrideError && <p className="text-xs text-red-500">{overrideError}</p>}
            <p className="text-xs text-gray-400">
              every {DAY_NAMES[allowance.day_of_week]} at {timeStr} · next {nextStr}
            </p>
          </div>

          {skipped ? (
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-400 italic">Skipped</span>
              <button
                type="button"
                onClick={handleUndoSkip}
                disabled={isPending}
                className="text-xs text-sprout-600 hover:text-sprout-800 font-medium transition-colors disabled:opacity-50"
              >
                {isPending ? '…' : 'Undo'}
              </button>
            </div>
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

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} title="Edit Allowance Schedule">
        <RecurringAllowanceForm
          childId={childId}
          existing={allowance}
          onSuccess={() => setEditOpen(false)}
        />
      </Dialog>
    </>
  )
}
