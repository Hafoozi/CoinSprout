'use client'

import { useState, useTransition } from 'react'
import Dialog from '@/components/ui/dialog'
import RecurringAllowanceForm from '@/components/parent/recurring-allowance-form'
import { skipNextAllowance, undoSkipAllowance, setAllowanceOverride } from '@/actions/recurring-allowance'
import { useCurrency } from '@/components/providers/currency-provider'
import { formatPaymentDate, calcNextPaymentDate } from '@/lib/utils/payment-date'
import { useRouter } from 'next/navigation'
import type { RecurringAllowance } from '@/lib/db/types'

const KEYS = ['1','2','3','4','5','6','7','8','9','.','0','⌫']

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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

  // Keypad override editing
  const [keypadOpen, setKeypadOpen]     = useState(false)
  const [overrideInput, setOverrideInput] = useState('')
  const [overrideError, setOverrideError] = useState<string>()

  if (!allowance?.is_active) return null

  // Use the DB's next_payment_date as the authoritative source for the display date.
  // Fall back to calculating from day_of_week for legacy records without a date.
  const nextDate = allowance.next_payment_date ?? calcNextPaymentDate(allowance.day_of_week)
  const nextStr  = formatPaymentDate(nextDate)

  // A payment is "skipped" when next_payment_date is more than 8 days away
  // (i.e. it was pushed forward by one extra week).
  const isSkipped = (() => {
    const daysUntil = (new Date(nextDate + 'T00:00:00Z').getTime() - Date.now()) / 86_400_000
    return daysUntil > 8
  })()

  const hasOverride    = allowance.next_amount_override != null
  const displayAmount  = allowance.next_amount_override ?? allowance.amount

  function openKeypad() {
    setOverrideInput(displayAmount.toFixed(2))
    setOverrideError(undefined)
    setKeypadOpen(true)
  }

  function closeKeypad() {
    setKeypadOpen(false)
    setOverrideError(undefined)
  }

  function handleKeypadKey(key: string) {
    if (key === '⌫') {
      setOverrideInput(v => v.slice(0, -1))
      return
    }
    if (key === '.') {
      setOverrideInput(v => v.includes('.') ? v : (v === '' ? '0.' : v + '.'))
      return
    }
    setOverrideInput(v => {
      const next = v + key
      const dotIdx = next.indexOf('.')
      if (dotIdx !== -1 && next.length - dotIdx - 1 > 2) return v
      const intPart = dotIdx !== -1 ? next.slice(0, dotIdx) : next
      if (intPart.length > 6) return v
      if (next.length > 1 && next[0] === '0' && next[1] !== '.') return v
      return next
    })
  }

  function handleKeypadDone() {
    const cleaned = overrideInput.endsWith('.') ? overrideInput.slice(0, -1) : overrideInput
    const val = parseFloat(cleaned)
    if (isNaN(val) || val <= 0) {
      setOverrideError('Enter a valid amount')
      return
    }
    setOverrideError(undefined)
    startTransition(async () => {
      const result = await setAllowanceOverride(childId, val)
      if (result.success) {
        setKeypadOpen(false)
        router.refresh()
      } else {
        setOverrideError(result.error ?? 'Failed to save')
      }
    })
  }

  function handleClearOverride() {
    startTransition(async () => {
      const result = await setAllowanceOverride(childId, null)
      if (result.success) router.refresh()
      else setOverrideError(result.error ?? 'Failed to clear')
    })
  }

  function handleSkip() {
    setSkipError(undefined)
    startTransition(async () => {
      const result = await skipNextAllowance(childId)
      if (result.success) router.refresh()
      else setSkipError(result.error ?? 'Failed to skip')
    })
  }

  function handleUndoSkip() {
    setSkipError(undefined)
    startTransition(async () => {
      const result = await undoSkipAllowance(childId)
      if (result.success) router.refresh()
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
              onClick={openKeypad}
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
            {/* Tappable amount — opens keypad */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openKeypad}
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
            <p className="text-xs text-gray-400">
              every {DAY_NAMES[allowance.day_of_week]} · next {nextStr}
            </p>
          </div>

          {isSkipped ? (
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

      {/* Amount keypad dialog */}
      <Dialog open={keypadOpen} onClose={closeKeypad} title="Edit Amount">
        <div className="flex flex-col items-center gap-4">
          {/* Value display */}
          <div className="w-full rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex items-center min-h-[56px]">
            <div className="flex-1 flex items-center justify-center gap-1">
              <span className="text-xl text-gray-400">{currency}</span>
              <span className={`text-3xl font-bold tracking-tight ${overrideInput === '' ? 'text-gray-300' : 'text-gray-800'}`}>
                {overrideInput === '' ? '0.00' : overrideInput}
              </span>
            </div>
            {overrideInput !== '' && (
              <button
                type="button"
                onClick={() => setOverrideInput('')}
                className="ml-2 text-xs font-semibold text-gray-400 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-gray-200"
              >
                C
              </button>
            )}
          </div>
          {overrideError && <p className="text-xs text-red-500 w-full text-center">{overrideError}</p>}

          {/* Number pad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[248px]">
            {KEYS.map((key, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleKeypadKey(key)}
                className={[
                  'h-14 rounded-2xl text-xl font-medium transition-all active:scale-95 select-none',
                  key === '⌫'
                    ? 'text-gray-400 hover:text-gray-600 text-2xl'
                    : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800',
                ].join(' ')}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleKeypadDone}
            disabled={isPending}
            className="w-full rounded-xl bg-sprout-500 hover:bg-sprout-600 disabled:opacity-50 text-white font-bold py-3 text-sm transition-colors"
          >
            {isPending ? 'Saving…' : 'Done'}
          </button>
        </div>
      </Dialog>
    </>
  )
}
