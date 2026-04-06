'use client'

import { useEffect, useTransition } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { saveRecurringAllowance, skipNextAllowance, undoSkipAllowance } from '@/actions/recurring-allowance'
import { useCurrency } from '@/components/providers/currency-provider'
import { formatPaymentDate, calcNextPaymentDate, addDaysToDate } from '@/lib/utils/payment-date'
import type { RecurringAllowance } from '@/lib/db/types'

const DAYS = [
  { value: 1, label: 'Monday'    },
  { value: 2, label: 'Tuesday'   },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday'  },
  { value: 5, label: 'Friday'    },
  { value: 6, label: 'Saturday'  },
  { value: 0, label: 'Sunday'    },
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-sprout-500 hover:bg-sprout-600 disabled:opacity-50 text-white font-bold px-5 py-2 text-sm transition-colors"
    >
      {pending ? 'Saving…' : 'Save'}
    </button>
  )
}

interface Props {
  childId:   string
  existing:  RecurringAllowance | null
  onSuccess?: () => void
}

export default function RecurringAllowanceForm({ childId, existing, onSuccess }: Props) {
  const currency = useCurrency()
  const [state, action] = useFormState(saveRecurringAllowance, null)
  const [skipPending, startSkip] = useTransition()

  useEffect(() => {
    if (state?.success && onSuccess) onSuccess()
  }, [state?.success, onSuccess])

  const isActive = existing?.is_active ?? false

  // Determine the next payment date to display
  const nextDate = existing?.next_payment_date
    ?? (existing ? calcNextPaymentDate(existing.day_of_week) : null)

  // A payment is "skipped" if next_payment_date is > 8 days from today
  const isSkipped = (() => {
    if (!nextDate) return false
    const daysUntil = (new Date(nextDate + 'T00:00:00Z').getTime() - Date.now()) / 86_400_000
    return daysUntil > 8
  })()

  // What skipping WOULD set it to
  const skippedDate = nextDate ? addDaysToDate(nextDate, 7) : null

  function handleSkip() {
    startSkip(async () => {
      await (isSkipped ? undoSkipAllowance(childId) : skipNextAllowance(childId))
    })
  }

  return (
    <form action={action} className="space-y-3 pt-1">
      <input type="hidden" name="childId" value={childId} />

      {/* On/Off toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-800">Recurring allowance</p>
          <p className="text-xs text-gray-400">Automatically adds allowance on the chosen day</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            value="true"
            defaultChecked={isActive}
            className="sr-only peer"
            onChange={(e) => {
              const hidden = e.currentTarget.form?.elements.namedItem('isActive') as HTMLInputElement | null
              if (hidden) hidden.value = e.currentTarget.checked ? 'true' : 'false'
            }}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sprout-500" />
        </label>
      </div>

      {/* Amount */}
      <div className="space-y-1">
        <label htmlFor={`amount-${childId}`} className="text-sm font-medium text-gray-700">
          Amount
        </label>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-400">{currency}</span>
          <input
            id={`amount-${childId}`}
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={existing?.amount ?? ''}
            placeholder="0.00"
            required
            className="w-28 rounded-xl border border-gray-200 px-3 py-2 text-sm text-right font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-sprout-400"
          />
        </div>
      </div>

      {/* Day of week */}
      <div className="space-y-1">
        <label htmlFor={`day-${childId}`} className="text-sm font-medium text-gray-700">
          Day
        </label>
        <select
          id={`day-${childId}`}
          name="dayOfWeek"
          defaultValue={existing?.day_of_week ?? 1}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sprout-300"
        >
          {DAYS.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>
      <input type="hidden" name="hourOfDay" value="9" />

      {/* Next payment date + skip control */}
      {isActive && nextDate && (
        <div className="flex items-center justify-between rounded-xl bg-sprout-50 px-3 py-2.5">
          <div>
            <p className="text-xs font-medium text-sprout-700">
              {isSkipped ? 'Skipped — next payment' : 'Next payment'}
            </p>
            <p className="text-sm font-bold text-sprout-800">{formatPaymentDate(nextDate)}</p>
            {isSkipped && skippedDate && (
              <p className="text-xs text-gray-400">Was: {formatPaymentDate(addDaysToDate(nextDate, -7))}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleSkip}
            disabled={skipPending}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-sprout-200 hover:bg-sprout-100 text-sprout-700 transition-colors disabled:opacity-50"
          >
            {skipPending ? '…' : isSkipped ? 'Undo skip' : 'Skip week'}
          </button>
        </div>
      )}

      {state && !state.success && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-sprout-600 font-medium">Saved!</p>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}
