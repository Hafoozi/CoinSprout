'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect } from 'react'
import { allocateToGoal } from '@/actions/goals'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import MoneyAmount from '@/components/shared/money-amount'
import type { GoalWithProgress } from '@/types/domain'

const INITIAL = { success: false as const }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" isLoading={pending}>
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
  const [state, action] = useFormState(allocateToGoal, INITIAL)

  useEffect(() => {
    if (state.success) onSuccess()
  }, [state.success]) // eslint-disable-line react-hooks/exhaustive-deps

  const goalOptions = goals.map((g) => ({
    value: g.id,
    label: `${g.name} — $${(g.targetPrice - g.allocatedAmount).toFixed(2)} left`,
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
      <Input
        id="allocate-amount"
        name="amount"
        type="number"
        label="Amount ($)"
        placeholder="0.00"
        min="0.01"
        max={freeToUse}
        step="0.01"
        required
      />

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <SubmitButton />
    </form>
  )
}
