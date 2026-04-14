'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect } from 'react'
import { createGoal } from '@/actions/goals'
import { useCurrency } from '@/components/providers/currency-provider'
import Button from '@/components/ui/button'
import CurrencyInput from '@/components/ui/currency-input'
import Input from '@/components/ui/input'

const INITIAL = { success: false as const }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" isLoading={pending}>
      Create Goal
    </Button>
  )
}

interface Props {
  childId:   string
  onSuccess: () => void
}

export default function CreateGoalForm({ childId, onSuccess }: Props) {
  const currency = useCurrency()
  const [state, action] = useFormState(createGoal, INITIAL)

  useEffect(() => {
    if (state.success) onSuccess()
  }, [state.success]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="childId" value={childId} />

      <Input
        id="goal-name"
        name="name"
        label="Goal name"
        placeholder="e.g. New LEGO set"
        maxLength={50}
        required
      />
      <CurrencyInput
        id="goal-price"
        name="targetPrice"
        label="Target price"
        prefix={currency}
        placeholder="0.00"
        required
      />

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <SubmitButton />
    </form>
  )
}
