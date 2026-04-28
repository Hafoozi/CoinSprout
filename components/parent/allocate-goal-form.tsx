'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useState } from 'react'
import { allocateToGoal } from '@/actions/goals'
import { useCurrency } from '@/components/providers/currency-provider'
import Button from '@/components/ui/button'
import CurrencyInput from '@/components/ui/currency-input'
import Select from '@/components/ui/select'
import MoneyAmount from '@/components/shared/money-amount'
import type { GoalWithProgress } from '@/types/domain'

const INITIAL = { success: false as const }

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" isLoading={pending} disabled={disabled}>
      Allocate
    </Button>
  )
}

interface Props {
  goals:     GoalWithProgress[]   // incomplete goals only
  freeToUse: number
  onSuccess: () => void
}

export default function AllocateGoalForm({ goals, freeToUse, onSuccess }: Props) {
  const currency        = useCurrency()
  const [state, action] = useFormState(allocateToGoal, INITIAL)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (state.success) onSuccess()
  }, [state.success]) // eslint-disable-line react-hooks/exhaustive-deps

  const amountNum = parseFloat(amount)
  const exceedsBalance = amount !== '' && !isNaN(amountNum) && amountNum > freeToUse
  const amountError = exceedsBalance
    ? `Cannot exceed ${currency}${freeToUse.toFixed(2)} available`
    : state.error

  const goalOptions = goals.map((g) => ({
    value: g.id,
    label: `${g.name} — ${currency}${(g.targetPrice - g.allocatedAmount).toFixed(2)} left`,
  }))

  return (
    <form action={action} className="space-y-4">
      {/* Available balance callout */}
      <div className="flex items-center justify-between rounded-xl bg-sprout-50 px-4 py-3">
        <span className="text-sm font-medium text-sprout-700">Available to allocate</span>
        <MoneyAmount amount={freeToUse} size="md" className="text-sprout-800 font-bold" />
      </div>

      <Select
        id="allocate-goal"
        name="goalId"
        label="Goal"
        options={goalOptions}
      />
      <CurrencyInput
        id="allocate-amount"
        name="amount"
        label="Amount"
        prefix={currency}
        placeholder="0.00"
        required
        error={amountError}
        value={amount}
        onChange={setAmount}
      />

      <SubmitButton disabled={exceedsBalance} />
    </form>
  )
}
