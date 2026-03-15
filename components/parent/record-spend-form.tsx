'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect } from 'react'
import { recordSpend } from '@/actions/transactions'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'

const INITIAL = { success: false as const }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" variant="danger" className="w-full" isLoading={pending}>
      Record Spending
    </Button>
  )
}

interface Props {
  childId:   string
  onSuccess: () => void
}

export default function RecordSpendForm({ childId, onSuccess }: Props) {
  const [state, action] = useFormState(recordSpend, INITIAL)

  useEffect(() => {
    if (state.success) onSuccess()
  }, [state.success]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="childId" value={childId} />

      <Input
        id="spend-amount"
        name="amount"
        type="number"
        label="Amount spent ($)"
        placeholder="0.00"
        min="0.01"
        step="0.01"
        required
      />
      <Input
        id="spend-note"
        name="note"
        label="What was bought? (optional)"
        placeholder="e.g. LEGO set, candy"
        maxLength={100}
      />

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <SubmitButton />
    </form>
  )
}
