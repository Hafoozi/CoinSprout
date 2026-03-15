'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect } from 'react'
import { createGoal } from '@/actions/goals'
import Button from '@/components/ui/button'
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
      <Input
        id="goal-price"
        name="targetPrice"
        type="number"
        label="Target price ($)"
        placeholder="0.00"
        min="0.01"
        max="99999"
        step="0.01"
        required
      />

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <SubmitButton />
    </form>
  )
}
