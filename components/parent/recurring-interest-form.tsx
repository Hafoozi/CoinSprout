'use client'

import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { saveRecurringInterest } from '@/actions/recurring-interest'
import { useCurrency } from '@/components/providers/currency-provider'
import type { RecurringInterest } from '@/lib/db/types'

const DAYS = [
  { value: 1, label: 'Monday'    },
  { value: 2, label: 'Tuesday'   },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday'  },
  { value: 5, label: 'Friday'    },
  { value: 6, label: 'Saturday'  },
  { value: 0, label: 'Sunday'    },
]

const MIN_PAYOUT = 0.05

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
  childId:        string
  existing:       RecurringInterest | null
  savingsBalance: number
  onSuccess?:     () => void
}

export default function RecurringInterestForm({ childId, existing, savingsBalance, onSuccess }: Props) {
  const currency = useCurrency()
  const [state, action] = useFormState(saveRecurringInterest, null)
  const [rate, setRate] = useState<string>(existing?.rate?.toString() ?? '')

  useEffect(() => {
    if (state?.success && onSuccess) onSuccess()
  }, [state?.success, onSuccess])

  const isActive = existing?.is_active ?? false

  // Live preview of next interest payout
  const rateNum     = parseFloat(rate)
  const rawInterest = savingsBalance > 0 && !isNaN(rateNum) && rateNum >= 0.01
    ? savingsBalance * (rateNum / 100)
    : 0
  const willPay     = rawInterest >= MIN_PAYOUT
  const previewAmt  = Math.round(rawInterest * 100) / 100

  return (
    <form action={action} className="space-y-3 pt-1">
      <input type="hidden" name="childId" value={childId} />

      {/* On/Off toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-800">Recurring interest</p>
          <p className="text-xs text-gray-400">Automatically adds interest on the chosen day</p>
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

      {/* Rate */}
      <div className="space-y-1">
        <label htmlFor={`rate-${childId}`} className="text-sm font-medium text-gray-700">
          Interest rate
        </label>
        <div className="flex items-center gap-1">
          <input
            id={`rate-${childId}`}
            name="rate"
            type="number"
            min="0.01"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="0.00"
            required
            className="w-28 rounded-xl border border-gray-200 px-3 py-2 text-sm text-right font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-sprout-400"
          />
          <span className="text-sm text-gray-400">% of savings</span>
        </div>
      </div>

      {/* Day of week */}
      <div className="space-y-1">
        <label htmlFor={`interest-day-${childId}`} className="text-sm font-medium text-gray-700">
          Day
        </label>
        <select
          id={`interest-day-${childId}`}
          name="dayOfWeek"
          defaultValue={existing?.day_of_week ?? 1}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sprout-300"
        >
          {DAYS.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      {/* Next payout preview */}
      {savingsBalance > 0 && !isNaN(rateNum) && rateNum >= 0.01 && (
        <div className={`rounded-xl px-3 py-2.5 text-sm ${willPay ? 'bg-sprout-50 text-sprout-700' : 'bg-gray-50 text-gray-500'}`}>
          {willPay ? (
            <>Next interest: <span className="font-bold">{currency}{previewAmt.toFixed(2)}</span> ({rateNum}% of {currency}{savingsBalance.toFixed(2)} savings)</>
          ) : (
            <>Balance too low — minimum payout is {currency}{MIN_PAYOUT.toFixed(2)}. Need at least {currency}{(MIN_PAYOUT / (rateNum / 100)).toFixed(2)} savings at this rate.</>
          )}
        </div>
      )}

      {savingsBalance === 0 && (
        <p className="text-xs text-gray-400">Interest will calculate once the child has a savings balance.</p>
      )}

      {state && !state.success && (
        <p className="text-sm text-red-500 break-words">{state.error}</p>
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
