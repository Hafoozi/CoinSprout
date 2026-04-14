'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect } from 'react'
import { recordSpend } from '@/actions/transactions'
import { useCurrency } from '@/components/providers/currency-provider'
import Button from '@/components/ui/button'
import CurrencyInput from '@/components/ui/currency-input'
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
  const currency = useCurrency()
  const [state, action] = useFormState(recordSpend, INITIAL)

  useEffect(() => {
    if (state.success) onSuccess()
  }, [state.success]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="childId" value={childId} />

      <CurrencyInput
        id="spend-amount"
        name="amount"
        label="Amount spent"
        prefix={currency}
        placeholder="0.00"
        required
        error={state.error}
      />
      <Input
        id="spend-note"
        name="note"
        label="What was bought? (optional)"
        placeholder="e.g. LEGO set, candy"
        maxLength={100}
      />

      <SubmitButton />
    </form>
  )
}
